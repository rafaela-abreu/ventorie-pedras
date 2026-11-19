import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  checkAdminPassword,
  clearAdminCookie,
  createAdminToken,
  isPasswordConfigured,
  readAdminCookie,
  requireAdmin,
  requireSameOrigin,
  saveAdminPassword,
  setAdminCookie,
  verifyAdminToken,
} from "./admin-auth";
import {
  createCatalogItem,
  deleteCatalogItem,
  deleteSetting,
  getCatalogItem,
  getSetting,
  listCatalogItems,
  listCategories,
  setSetting,
  updateCatalogItem,
} from "./db";
import type { AppDb, WorkerContext } from "./context";
import { users } from "./schema";
import { publicProcedure, router } from "./trpc";

const MAX_AUDIO_BYTES = 20 * 1024 * 1024;
const ALLOWED_AUDIO_TYPES: Record<string, string> = {
  "audio/mpeg": "mp3",
  "audio/mp3": "mp3",
  "audio/mp4": "m4a",
  "audio/x-m4a": "m4a",
  "audio/aac": "aac",
  "audio/wav": "wav",
  "audio/x-wav": "wav",
  "audio/ogg": "ogg",
  "audio/webm": "webm",
};
const MUSIC_URL_KEY = "music_url";
const MUSIC_KEY_KEY = "music_key";
const MUSIC_TITLE_KEY = "music_title";
const MUSIC_ENABLED_KEY = "music_enabled";

const loginAttempts = new Map<string, { count: number; resetAt: number }>();
const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const LOGIN_MAX_ATTEMPTS = 10;

function checkLoginThrottle(ip: string): void {
  const now = Date.now();
  const entry = loginAttempts.get(ip);
  if (!entry || entry.resetAt < now) {
    loginAttempts.set(ip, { count: 1, resetAt: now + LOGIN_WINDOW_MS });
    return;
  }
  if (entry.count >= LOGIN_MAX_ATTEMPTS) {
    throw new TRPCError({
      code: "TOO_MANY_REQUESTS",
      message: "Muitas tentativas de acesso. Aguarde alguns minutos e tente novamente.",
    });
  }
  entry.count += 1;
}

function decodeUpload(dataBase64: string, maxBytes: number, label: string): Uint8Array {
  const encoded = dataBase64.replace(/^data:[^,]*;base64,/i, "").replace(/\s+/g, "");
  if (encoded.length > Math.ceil(maxBytes / 3) * 4 + 8) {
    throw new TRPCError({ code: "BAD_REQUEST", message: `${label} é muito grande.` });
  }
  let binary: string;
  try {
    binary = atob(encoded);
  } catch {
    throw new TRPCError({ code: "BAD_REQUEST", message: `Não foi possível ler ${label.toLowerCase()}.` });
  }
  if (binary.length === 0) {
    throw new TRPCError({ code: "BAD_REQUEST", message: `${label} enviado está vazio.` });
  }
  if (binary.length > maxBytes) {
    throw new TRPCError({ code: "BAD_REQUEST", message: `${label} é muito grande.` });
  }
  return Uint8Array.from(binary, character => character.charCodeAt(0));
}

function safeFileName(fileName: string): string {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, "-").slice(-180) || "arquivo";
}

async function storagePut(
  ctx: WorkerContext,
  folder: "catalogo" | "musica",
  fileName: string,
  data: Uint8Array,
  contentType: string,
): Promise<{ key: string; url: string }> {
  const key = `${folder}/${Date.now()}-${crypto.randomUUID().slice(0, 8)}-${safeFileName(fileName)}`;
  await ctx.env.MEDIA.put(key, data, { metadata: { contentType } });
  return { key, url: `/media/${key}` };
}

async function readMusicSettings(db: AppDb) {
  const [url, title, enabled] = await Promise.all([
    getSetting(db, MUSIC_URL_KEY),
    getSetting(db, MUSIC_TITLE_KEY),
    getSetting(db, MUSIC_ENABLED_KEY),
  ]);
  return {
    url: url ?? null,
    title: title ?? "Trilha Ventorié Pedras",
    enabled: enabled !== "0",
  };
}

const imageKeyInput = z.string().min(1).max(240)
  .regex(/^catalogo\/[A-Za-z0-9._/-]+$/)
  .refine(key => !key.includes(".."), "Imagem inválida.");
const itemFields = {
  title: z.string().trim().min(2).max(180),
  description: z.string().trim().max(2000).optional().default(""),
  category: z.string().trim().min(2).max(80),
  featured: z.boolean().optional().default(false),
  sortOrder: z.number().int().min(0).max(9999).optional().default(0),
};

export const appRouter = router({
  system: router({
    health: publicProcedure
      .input(z.object({ timestamp: z.number().min(0) }))
      .query(() => ({ ok: true })),
  }),
  auth: router({
    me: publicProcedure.query((): typeof users.$inferSelect | null => null),
    logout: publicProcedure.mutation(() => ({ success: true } as const)),
  }),
  catalog: router({
    list: publicProcedure.query(({ ctx }) => listCatalogItems(ctx.db)),
    categories: publicProcedure.query(({ ctx }) => listCategories(ctx.db)),
  }),
  music: router({
    get: publicProcedure.query(({ ctx }) => readMusicSettings(ctx.db)),
  }),
  admin: router({
    status: publicProcedure.query(async ({ ctx }) => ({
      authenticated: await verifyAdminToken(ctx.env.SESSION_SECRET, readAdminCookie(ctx.req)),
      passwordConfigured: await isPasswordConfigured(ctx),
    })),
    login: publicProcedure
      .input(z.object({ password: z.string().min(1).max(200) }))
      .mutation(async ({ ctx, input }) => {
        requireSameOrigin(ctx.req);
        const ip = ctx.req.headers.get("cf-connecting-ip") ?? "desconhecido";
        checkLoginThrottle(ip);
        if (!(await checkAdminPassword(ctx, input.password))) {
          throw new TRPCError({ code: "UNAUTHORIZED", message: "Senha incorreta. Verifique e tente novamente." });
        }
        setAdminCookie(ctx, await createAdminToken(ctx.env.SESSION_SECRET));
        return { success: true } as const;
      }),
    logout: publicProcedure.mutation(({ ctx }) => {
      requireSameOrigin(ctx.req);
      clearAdminCookie(ctx);
      return { success: true } as const;
    }),
    changePassword: publicProcedure
      .input(z.object({ currentPassword: z.string().min(1).max(200), newPassword: z.string().min(12).max(200) }))
      .mutation(async ({ ctx, input }) => {
        await requireAdmin(ctx);
        if (!(await checkAdminPassword(ctx, input.currentPassword))) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "A senha atual está incorreta." });
        }
        await saveAdminPassword(ctx, input.newPassword);
        return { success: true } as const;
      }),
    listItems: publicProcedure.query(async ({ ctx }) => {
      await requireAdmin(ctx);
      return listCatalogItems(ctx.db);
    }),
    createItem: publicProcedure
      .input(z.object({ ...itemFields, imageKey: imageKeyInput }))
      .mutation(async ({ ctx, input }) => {
        await requireAdmin(ctx);
        const imageUrl = `/media/${input.imageKey}`;
        const id = await createCatalogItem(ctx.db, {
          title: input.title,
          description: input.description ?? "",
          category: input.category,
          imageKey: input.imageKey,
          imageUrl,
          featured: input.featured ? 1 : 0,
          sortOrder: input.sortOrder ?? 0,
        });
        return { id, imageUrl };
      }),
    updateItem: publicProcedure
      .input(z.object({
        id: z.number().int().positive(),
        title: itemFields.title.optional(),
        description: z.string().trim().max(2000).optional(),
        category: z.string().trim().min(2).max(80).optional(),
        featured: z.boolean().optional(),
        sortOrder: z.number().int().min(0).max(9999).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        await requireAdmin(ctx);
        if (!(await getCatalogItem(ctx.db, input.id))) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Foto não encontrada no catálogo." });
        }
        await updateCatalogItem(ctx.db, input.id, {
          title: input.title,
          description: input.description,
          category: input.category,
          featured: input.featured === undefined ? undefined : input.featured ? 1 : 0,
          sortOrder: input.sortOrder,
        });
        return { success: true } as const;
      }),
    deleteItem: publicProcedure
      .input(z.object({ id: z.number().int().positive() }))
      .mutation(async ({ ctx, input }) => {
        await requireAdmin(ctx);
        if (!(await getCatalogItem(ctx.db, input.id))) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Foto não encontrada no catálogo." });
        }
        await deleteCatalogItem(ctx.db, input.id);
        return { success: true } as const;
      }),
    musicSettings: publicProcedure.query(async ({ ctx }) => {
      await requireAdmin(ctx);
      return readMusicSettings(ctx.db);
    }),
    uploadMusic: publicProcedure
      .input(z.object({
        title: z.string().trim().max(160).optional(),
        fileName: z.string().min(1).max(200),
        mimeType: z.string().min(3).max(80),
        dataBase64: z.string().min(16),
      }))
      .mutation(async ({ ctx, input }) => {
        await requireAdmin(ctx);
        const mimeType = input.mimeType.toLowerCase();
        if (!ALLOWED_AUDIO_TYPES[mimeType]) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Formato de áudio não aceito. Envie MP3, M4A, WAV ou OGG." });
        }
        const bytes = decodeUpload(input.dataBase64, MAX_AUDIO_BYTES, "O áudio");
        const uploaded = await storagePut(ctx, "musica", input.fileName, bytes, mimeType);
        await setSetting(ctx.db, MUSIC_URL_KEY, uploaded.url);
        await setSetting(ctx.db, MUSIC_KEY_KEY, uploaded.key);
        await setSetting(
          ctx.db,
          MUSIC_TITLE_KEY,
          input.title && input.title.length > 0 ? input.title : input.fileName.replace(/\.[^.]+$/, ""),
        );
        await setSetting(ctx.db, MUSIC_ENABLED_KEY, "1");
        return { success: true, url: uploaded.url } as const;
      }),
    setMusicEnabled: publicProcedure
      .input(z.object({ enabled: z.boolean() }))
      .mutation(async ({ ctx, input }) => {
        await requireAdmin(ctx);
        await setSetting(ctx.db, MUSIC_ENABLED_KEY, input.enabled ? "1" : "0");
        return { success: true } as const;
      }),
    removeMusic: publicProcedure.mutation(async ({ ctx }) => {
      await requireAdmin(ctx);
      await Promise.all([
        deleteSetting(ctx.db, MUSIC_URL_KEY),
        deleteSetting(ctx.db, MUSIC_KEY_KEY),
        deleteSetting(ctx.db, MUSIC_TITLE_KEY),
      ]);
      await setSetting(ctx.db, MUSIC_ENABLED_KEY, "0");
      return { success: true } as const;
    }),
  }),
});

export type AppRouter = typeof appRouter;

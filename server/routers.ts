import { COOKIE_NAME } from "@shared/const";
import { parse as parseCookieHeader } from "cookie";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import {
  ADMIN_COOKIE_NAME,
  adminCookieOptions,
  checkAdminPassword,
  createAdminToken,
  isPasswordConfigured,
  saveAdminPassword,
  verifyAdminToken,
} from "./admin-auth";
import {
  createCatalogItem,
  deleteSetting,
  deleteCatalogItem,
  getCatalogItem,
  getSetting,
  listCatalogItems,
  listCategories,
  setSetting,
  updateCatalogItem,
} from "./db";
import { storagePut } from "./storage";

const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const MAX_AUDIO_BYTES = 20 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};
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

async function readMusicSettings() {
  const [url, title, enabled] = await Promise.all([
    getSetting(MUSIC_URL_KEY),
    getSetting(MUSIC_TITLE_KEY),
    getSetting(MUSIC_ENABLED_KEY),
  ]);
  return {
    url: url ?? null,
    title: title ?? "Trilha Ventorié Pedras",
    enabled: enabled !== "0",
  };
}

function readAdminCookie(req: { headers: { cookie?: string } }): string | undefined {
  const parsed = parseCookieHeader(req.headers.cookie ?? "");
  return parsed[ADMIN_COOKIE_NAME];
}

async function requireAdminSession(req: { headers: { cookie?: string } }) {
  const valid = await verifyAdminToken(readAdminCookie(req));
  if (!valid) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Acesso restrito. Faça login no painel.",
    });
  }
}

const loginAttempts = new Map<string, { count: number; resetAt: number }>();
const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const LOGIN_MAX_ATTEMPTS = 10;

function checkLoginThrottle(ip: string) {
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

const imageInput = z.object({
  fileName: z.string().min(1).max(200),
  mimeType: z.string().min(3).max(80),
  dataBase64: z.string().min(16),
});

const itemFields = {
  title: z.string().trim().min(2).max(180),
  description: z.string().trim().max(2000).optional().default(""),
  category: z.string().trim().min(2).max(80),
  featured: z.boolean().optional().default(false),
  sortOrder: z.number().int().min(0).max(9999).optional().default(0),
};

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  catalog: router({
    list: publicProcedure.query(async () => listCatalogItems()),
    categories: publicProcedure.query(async () => listCategories()),
  }),

  music: router({
    get: publicProcedure.query(async () => readMusicSettings()),
  }),

  admin: router({
    status: publicProcedure.query(async ({ ctx }) => ({
      authenticated: await verifyAdminToken(readAdminCookie(ctx.req)),
      passwordConfigured: await isPasswordConfigured(),
    })),

    login: publicProcedure
      .input(z.object({ password: z.string().min(1).max(200) }))
      .mutation(async ({ ctx, input }) => {
        const forwarded = ctx.req.headers["x-forwarded-for"];
        const ip =
          (Array.isArray(forwarded) ? forwarded[0] : forwarded)?.split(",")[0]?.trim() ||
          ctx.req.socket?.remoteAddress ||
          "desconhecido";
        checkLoginThrottle(ip);

        const ok = await checkAdminPassword(input.password);
        if (!ok) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Senha incorreta. Verifique e tente novamente.",
          });
        }
        const token = await createAdminToken();
        ctx.res.cookie(ADMIN_COOKIE_NAME, token, adminCookieOptions);
        return { success: true } as const;
      }),

    logout: publicProcedure.mutation(({ ctx }) => {
      ctx.res.clearCookie(ADMIN_COOKIE_NAME, { ...adminCookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),

    changePassword: publicProcedure
      .input(
        z.object({
          currentPassword: z.string().min(1).max(200),
          newPassword: z.string().min(6).max(200),
        })
      )
      .mutation(async ({ ctx, input }) => {
        await requireAdminSession(ctx.req);
        const ok = await checkAdminPassword(input.currentPassword);
        if (!ok) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "A senha atual está incorreta.",
          });
        }
        await saveAdminPassword(input.newPassword);
        return { success: true } as const;
      }),

    listItems: publicProcedure.query(async ({ ctx }) => {
      await requireAdminSession(ctx.req);
      return listCatalogItems();
    }),

    createItem: publicProcedure
      .input(z.object({ ...itemFields, image: imageInput }))
      .mutation(async ({ ctx, input }) => {
        await requireAdminSession(ctx.req);

        const extension = ALLOWED_IMAGE_TYPES[input.image.mimeType.toLowerCase()];
        if (!extension) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Formato não aceito. Envie uma foto JPG, PNG ou WEBP.",
          });
        }

        let buffer: Buffer;
        try {
          buffer = Buffer.from(input.image.dataBase64.replace(/^data:[^;]+;base64,/, ""), "base64");
        } catch {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Não foi possível ler a imagem." });
        }

        if (buffer.byteLength === 0) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "A imagem enviada está vazia." });
        }
        if (buffer.byteLength > MAX_IMAGE_BYTES) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "A imagem é muito grande. Envie um arquivo de até 8 MB.",
          });
        }

        const uploaded = await storagePut(
          `catalogo/${Date.now()}-${input.image.fileName.replace(/[^a-zA-Z0-9._-]/g, "-")}`,
          buffer,
          input.image.mimeType
        );

        const id = await createCatalogItem({
          title: input.title,
          description: input.description ?? "",
          category: input.category,
          imageKey: uploaded.key,
          imageUrl: uploaded.url,
          featured: input.featured ? 1 : 0,
          sortOrder: input.sortOrder ?? 0,
        });

        return { id, imageUrl: uploaded.url };
      }),

    updateItem: publicProcedure
      .input(
        z.object({
          id: z.number().int().positive(),
          title: itemFields.title.optional(),
          description: z.string().trim().max(2000).optional(),
          category: z.string().trim().min(2).max(80).optional(),
          featured: z.boolean().optional(),
          sortOrder: z.number().int().min(0).max(9999).optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        await requireAdminSession(ctx.req);
        const existing = await getCatalogItem(input.id);
        if (!existing) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Foto não encontrada no catálogo." });
        }
        await updateCatalogItem(input.id, {
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
        await requireAdminSession(ctx.req);
        const existing = await getCatalogItem(input.id);
        if (!existing) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Foto não encontrada no catálogo." });
        }
        await deleteCatalogItem(input.id);
        return { success: true } as const;
      }),

    musicSettings: publicProcedure.query(async ({ ctx }) => {
      await requireAdminSession(ctx.req);
      return readMusicSettings();
    }),

    uploadMusic: publicProcedure
      .input(
        z.object({
          title: z.string().trim().max(160).optional(),
          fileName: z.string().min(1).max(200),
          mimeType: z.string().min(3).max(80),
          dataBase64: z.string().min(16),
        })
      )
      .mutation(async ({ ctx, input }) => {
        await requireAdminSession(ctx.req);

        const extension = ALLOWED_AUDIO_TYPES[input.mimeType.toLowerCase()];
        if (!extension) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Formato de áudio não aceito. Envie MP3, M4A, WAV ou OGG.",
          });
        }

        const buffer = Buffer.from(input.dataBase64.replace(/^data:[^;]+;base64,/, ""), "base64");
        if (buffer.byteLength === 0) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "O arquivo de áudio está vazio." });
        }
        if (buffer.byteLength > MAX_AUDIO_BYTES) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "O áudio é muito grande. Envie um arquivo de até 20 MB.",
          });
        }

        const uploaded = await storagePut(
          `musica/${Date.now()}-${input.fileName.replace(/[^a-zA-Z0-9._-]/g, "-")}`,
          buffer,
          input.mimeType
        );

        await setSetting(MUSIC_URL_KEY, uploaded.url);
        await setSetting(MUSIC_KEY_KEY, uploaded.key);
        await setSetting(
          MUSIC_TITLE_KEY,
          input.title && input.title.length > 0 ? input.title : input.fileName.replace(/\.[^.]+$/, "")
        );
        await setSetting(MUSIC_ENABLED_KEY, "1");

        return { success: true, url: uploaded.url };
      }),

    setMusicEnabled: publicProcedure
      .input(z.object({ enabled: z.boolean() }))
      .mutation(async ({ ctx, input }) => {
        await requireAdminSession(ctx.req);
        await setSetting(MUSIC_ENABLED_KEY, input.enabled ? "1" : "0");
        return { success: true } as const;
      }),

    removeMusic: publicProcedure.mutation(async ({ ctx }) => {
      await requireAdminSession(ctx.req);
      await Promise.all([
        deleteSetting(MUSIC_URL_KEY),
        deleteSetting(MUSIC_KEY_KEY),
        deleteSetting(MUSIC_TITLE_KEY),
      ]);
      await setSetting(MUSIC_ENABLED_KEY, "0");
      return { success: true } as const;
    }),
  }),
});

export type AppRouter = typeof appRouter;

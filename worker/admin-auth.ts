import { SignJWT, jwtVerify } from "jose";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import type { WorkerContext } from "./context";
import { settings } from "./schema";

export const ADMIN_COOKIE_NAME = "ventorie_admin";
const PASSWORD_SETTING_KEY = "admin_password_hash";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;
const PBKDF2_ITERATIONS = 60_000;
type ByteArray = Uint8Array<ArrayBuffer>;

function toHex(bytes: Uint8Array): string {
  return Array.from(bytes, byte => byte.toString(16).padStart(2, "0")).join("");
}

function fromHex(value: string): ByteArray {
  if (!/^(?:[0-9a-f]{2})+$/i.test(value)) return new Uint8Array();
  const pairs = value.match(/.{2}/g) ?? [];
  const bytes = new Uint8Array(pairs.length);
  pairs.forEach((pair, index) => { bytes[index] = Number.parseInt(pair, 16); });
  return bytes;
}

async function derivePassword(password: string, salt: ByteArray, iterations: number): Promise<ByteArray> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt, iterations },
    key,
    256,
  );
  return new Uint8Array(bits);
}

function constantTimeEqual(a: ByteArray, b: ByteArray): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const derived = await derivePassword(password, salt, PBKDF2_ITERATIONS);
  return `pbkdf2$${PBKDF2_ITERATIONS}$${toHex(salt)}$${toHex(derived)}`;
}

export async function verifyHashedPassword(password: string, stored: string): Promise<boolean> {
  const [algorithm, iterationText, saltHex, hashHex, extra] = stored.split("$");
  const iterations = Number(iterationText);
  if (algorithm !== "pbkdf2" || extra !== undefined || !Number.isInteger(iterations) || iterations < 10_000 || iterations > 250_000) {
    return false;
  }
  const salt = fromHex(saltHex ?? "");
  const expected = fromHex(hashHex ?? "");
  if (salt.length !== 16 || expected.length !== 32) return false;
  const actual = await derivePassword(password, salt, iterations);
  return constantTimeEqual(actual, expected);
}

async function readStoredHash(ctx: WorkerContext): Promise<string | null> {
  const rows = await ctx.db
    .select({ value: settings.value })
    .from(settings)
    .where(eq(settings.key, PASSWORD_SETTING_KEY))
    .limit(1);
  return rows[0]?.value ?? null;
}

export async function isPasswordConfigured(ctx: WorkerContext): Promise<boolean> {
  return (await readStoredHash(ctx)) !== null;
}

export async function checkAdminPassword(ctx: WorkerContext, password: string): Promise<boolean> {
  const stored = await readStoredHash(ctx);
  return stored ? verifyHashedPassword(password, stored) : false;
}

export async function saveAdminPassword(ctx: WorkerContext, password: string): Promise<void> {
  if (password.length < 12) throw new Error("Use uma senha com pelo menos 12 caracteres.");
  const hash = await hashPassword(password);
  await ctx.db
    .insert(settings)
    .values({ key: PASSWORD_SETTING_KEY, value: hash, updatedAt: new Date().toISOString() })
    .onConflictDoUpdate({
      target: settings.key,
      set: { value: hash, updatedAt: new Date().toISOString() },
    });
}

export async function createAdminToken(secret: string): Promise<string> {
  return new SignJWT({ role: "admin", scope: "catalogo" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(new TextEncoder().encode(secret));
}

export async function verifyAdminToken(secret: string, token: string | undefined): Promise<boolean> {
  if (!token || !secret) return false;
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
    return payload.role === "admin" && payload.scope === "catalogo";
  } catch {
    return false;
  }
}

export function readAdminCookie(request: Request): string | undefined {
  const prefix = `${ADMIN_COOKIE_NAME}=`;
  for (const part of (request.headers.get("cookie") ?? "").split(";")) {
    const cookie = part.trim();
    if (!cookie.startsWith(prefix)) continue;
    try {
      return decodeURIComponent(cookie.slice(prefix.length));
    } catch {
      return undefined;
    }
  }
  return undefined;
}

const cookieOptions = {
  httpOnly: true,
  secure: true,
  path: "/",
  sameSite: "lax" as const,
  maxAge: SESSION_TTL_SECONDS,
};

export function setAdminCookie(ctx: WorkerContext, token: string): void {
  ctx.resHeaders.append("Set-Cookie", serializeAdminCookie(token, SESSION_TTL_SECONDS));
}

export function clearAdminCookie(ctx: WorkerContext): void {
  ctx.resHeaders.append("Set-Cookie", serializeAdminCookie("", 0));
}

function serializeAdminCookie(value: string, maxAge: number): string {
  return `${ADMIN_COOKIE_NAME}=${encodeURIComponent(value)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`;
}

export function requireSameOrigin(request: Request): void {
  const origin = request.headers.get("origin");
  const expected = new URL(request.url).origin;
  if (origin ? origin !== expected : request.headers.get("sec-fetch-site") !== "same-origin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "A solicitação não veio do site." });
  }
}

export async function requireAdmin(ctx: WorkerContext): Promise<void> {
  requireSameOrigin(ctx.req);
  const valid = await verifyAdminToken(ctx.env.SESSION_SECRET, readAdminCookie(ctx.req));
  if (!valid) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Acesso restrito. Faça login no painel.",
    });
  }
}

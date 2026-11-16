import { randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { SignJWT, jwtVerify } from "jose";
import { eq } from "drizzle-orm";
import { settings } from "../drizzle/schema";
import { getDb } from "./db";
import { ENV } from "./_core/env";

export const ADMIN_COOKIE_NAME = "ventorie_admin";
const PASSWORD_SETTING_KEY = "admin_password_hash";
const DEFAULT_PASSWORD = process.env.ADMIN_PASSWORD?.trim() || "ventorie2026";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

function getSecretKey(): Uint8Array {
  const secret =
    process.env.VENTORIE_SESSION_SECRET ||
    ENV.cookieSecret ||
    "ventorie-pedras-painel-secret-key";
  return new TextEncoder().encode(secret.padEnd(32, "0"));
}

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const derived = scryptSync(password, salt, 64).toString("hex");
  return `scrypt:${salt}:${derived}`;
}

function safeEqual(a: string, b: string): boolean {
  const bufferA = Buffer.from(a);
  const bufferB = Buffer.from(b);
  if (bufferA.length !== bufferB.length) return false;
  return timingSafeEqual(bufferA, bufferB);
}

export function verifyHashedPassword(password: string, stored: string): boolean {
  const parts = stored.split(":");
  if (parts.length !== 3 || parts[0] !== "scrypt") return false;
  const [, salt, expected] = parts;
  const derived = scryptSync(password, salt, 64).toString("hex");
  return safeEqual(derived, expected);
}

async function readStoredHash(): Promise<string | null> {
  const db = await getDb();
  if (!db) return null;
  const rows = await db
    .select()
    .from(settings)
    .where(eq(settings.key, PASSWORD_SETTING_KEY))
    .limit(1);
  return rows.length > 0 ? rows[0].value : null;
}

export async function isPasswordConfigured(): Promise<boolean> {
  return (await readStoredHash()) !== null;
}

/** Valida a senha do painel. Usa a senha salva no banco ou a senha padrão inicial. */
export async function checkAdminPassword(password: string): Promise<boolean> {
  const stored = await readStoredHash();
  if (stored) return verifyHashedPassword(password, stored);
  return safeEqual(password, DEFAULT_PASSWORD);
}

export async function saveAdminPassword(newPassword: string): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  const value = hashPassword(newPassword);
  await db
    .insert(settings)
    .values({ key: PASSWORD_SETTING_KEY, value })
    .onDuplicateKeyUpdate({ set: { value } });
}

export async function createAdminToken(): Promise<string> {
  return new SignJWT({ role: "admin", scope: "catalogo" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(getSecretKey());
}

export async function verifyAdminToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    return payload.role === "admin";
  } catch {
    return false;
  }
}

export const adminCookieOptions = {
  httpOnly: true,
  path: "/",
  sameSite: "none" as const,
  secure: true,
  maxAge: SESSION_TTL_SECONDS * 1000,
};

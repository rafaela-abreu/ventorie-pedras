import { drizzle } from "drizzle-orm/d1";
import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import * as schema from "./schema";

export interface KVNamespaceLike {
  getWithMetadata<T = ArrayBuffer>(
    key: string,
    type?: "text" | "json" | "arrayBuffer" | "stream",
  ): Promise<{ value: T | null; metadata: Record<string, unknown> | null }>;
  put(
    key: string,
    value: string | ArrayBuffer | ArrayBufferView | ReadableStream<Uint8Array>,
    options?: { metadata?: Record<string, unknown> },
  ): Promise<void>;
  delete(key: string): Promise<void>;
}

export interface AssetsBinding {
  fetch(request: Request): Promise<Response>;
}

export interface WorkerEnv {
  DB: unknown;
  MEDIA: KVNamespaceLike;
  ASSETS: AssetsBinding;
  SESSION_SECRET: string;
}

export const makeDrizzle = (database: unknown) =>
  drizzle(database as never, { schema });
export type AppDb = ReturnType<typeof makeDrizzle>;

export interface WorkerContext {
  req: Request;
  resHeaders: Headers;
  db: AppDb;
  env: WorkerEnv;
}

export function createContext(
  options: Pick<FetchCreateContextFnOptions, "req" | "resHeaders">,
  env: WorkerEnv,
): WorkerContext {
  return {
    req: options.req,
    resHeaders: options.resHeaders,
    db: makeDrizzle(env.DB),
    env,
  };
}

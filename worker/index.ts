import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { readAdminCookie, requireSameOrigin, verifyAdminToken } from "./admin-auth";
import { createContext, makeDrizzle, type WorkerEnv } from "./context";
import { setSetting } from "./db";
import { appRouter } from "./routers";

function jsonResponse(value: unknown, status = 200): Response {
  return new Response(JSON.stringify(value), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
  });
}

const IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};
const AUDIO_TYPES: Record<string, string> = {
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
const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const MAX_AUDIO_BYTES = 20 * 1024 * 1024;

function sanitizeFileName(value: string): string {
  let decoded = value;
  try { decoded = decodeURIComponent(value); } catch { /* keep the original name */ }
  return decoded.replace(/[^a-zA-Z0-9._-]/g, "-").slice(-180) || "arquivo";
}

async function uploadMedia(request: Request, env: WorkerEnv, folder: "catalogo" | "musica"): Promise<Response> {
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405, headers: { Allow: "POST" } });
  }
  try { requireSameOrigin(request); }
  catch { return jsonResponse({ error: "A solicitação não veio do site." }, 403); }
  if (!(await verifyAdminToken(env.SESSION_SECRET, readAdminCookie(request)))) {
    return jsonResponse({ error: "Acesso restrito. Faça login no painel." }, 401);
  }

  const contentType = (request.headers.get("content-type") ?? "").split(";")[0].trim().toLowerCase();
  const allowed = folder === "catalogo" ? IMAGE_TYPES : AUDIO_TYPES;
  if (!allowed[contentType]) {
    return jsonResponse({ error: folder === "catalogo" ? "Formato não aceito. Envie JPG, PNG ou WEBP." : "Formato de áudio não aceito." }, 400);
  }
  const maxBytes = folder === "catalogo" ? MAX_IMAGE_BYTES : MAX_AUDIO_BYTES;
  const declaredLength = Number(request.headers.get("content-length") ?? 0);
  if (declaredLength > maxBytes) {
    return jsonResponse({ error: `O arquivo deve ter no máximo ${folder === "catalogo" ? "8 MB" : "20 MB"}.` }, 413);
  }
  if (!request.body) return jsonResponse({ error: "O arquivo enviado está vazio." }, 400);

  const fileName = sanitizeFileName(request.headers.get("x-file-name") ?? "arquivo");
  const key = `${folder}/${Date.now()}-${crypto.randomUUID().slice(0, 8)}-${fileName}`;
  let received = 0;
  const limitedBody = request.body.pipeThrough(new TransformStream<Uint8Array, Uint8Array>({
    transform(chunk, controller) {
      received += chunk.byteLength;
      if (received > maxBytes) {
        controller.error(new Error("UPLOAD_TOO_LARGE"));
        return;
      }
      controller.enqueue(chunk);
    },
  }));
  try {
    await env.MEDIA.put(key, limitedBody, { metadata: { contentType } });
  } catch {
    await env.MEDIA.delete(key).catch(() => undefined);
    if (received > maxBytes) return jsonResponse({ error: "O arquivo enviado é muito grande." }, 413);
    return jsonResponse({ error: "Não foi possível salvar o arquivo. Tente novamente." }, 500);
  }
  if (received === 0) {
    await env.MEDIA.delete(key);
    return jsonResponse({ error: "O arquivo enviado está vazio." }, 400);
  }

  const url = `/media/${key}`;
  if (folder === "musica") {
    const db = makeDrizzle(env.DB);
    let title = request.headers.get("x-upload-title") ?? "";
    try { title = decodeURIComponent(title); } catch { /* keep the original title */ }
    if (!title.trim()) title = fileName.replace(/\.[^.]+$/, "");
    await Promise.all([
      setSetting(db, "music_url", url),
      setSetting(db, "music_key", key),
      setSetting(db, "music_title", title.slice(0, 160)),
      setSetting(db, "music_enabled", "1"),
    ]);
  }
  return jsonResponse({ success: true, key, url });
}

function contentTypeFromPath(path: string): string {
  const extension = path.split(".").pop()?.toLowerCase();
  const types: Record<string, string> = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    webp: "image/webp",
    mp3: "audio/mpeg",
    m4a: "audio/mp4",
    aac: "audio/aac",
    wav: "audio/wav",
    ogg: "audio/ogg",
    webm: "audio/webm",
  };
  return types[extension ?? ""] ?? "application/octet-stream";
}

async function serveMedia(request: Request, env: WorkerEnv): Promise<Response> {
  if (request.method !== "GET" && request.method !== "HEAD") {
    return new Response("Method Not Allowed", { status: 405, headers: { Allow: "GET, HEAD" } });
  }
  let key: string;
  try {
    key = decodeURIComponent(new URL(request.url).pathname.slice("/media/".length));
  } catch {
    return new Response("Not Found", { status: 404 });
  }
  if (!/^(catalogo|musica)\/[A-Za-z0-9._/-]+$/.test(key) || key.split("/").includes("..")) {
    return new Response("Not Found", { status: 404 });
  }
  const entry = await env.MEDIA.getWithMetadata<ArrayBuffer>(key, "arrayBuffer");
  if (!entry.value) return new Response("Not Found", { status: 404 });
  const bytes = new Uint8Array(entry.value);
  const metadataType = entry.metadata?.contentType;
  const contentType = typeof metadataType === "string" ? metadataType : contentTypeFromPath(key);
  const baseHeaders = new Headers({
    "Content-Type": contentType,
    "Cache-Control": "public, max-age=31536000, immutable",
    "Accept-Ranges": "bytes",
    "Content-Length": String(bytes.byteLength),
    "X-Content-Type-Options": "nosniff",
  });
  const range = request.headers.get("range");
  if (range) {
    const match = /^bytes=(\d*)-(\d*)$/.exec(range);
    if (!match) return new Response(null, { status: 416, headers: { "Content-Range": `bytes */${bytes.length}` } });
    let start = match[1] ? Number(match[1]) : 0;
    let end = match[2] ? Number(match[2]) : bytes.length - 1;
    if (!match[1] && match[2]) {
      start = Math.max(0, bytes.length - Number(match[2]));
      end = bytes.length - 1;
    }
    if (start >= bytes.length || end < start) {
      return new Response(null, { status: 416, headers: { "Content-Range": `bytes */${bytes.length}` } });
    }
    end = Math.min(end, bytes.length - 1);
    const chunk = bytes.slice(start, end + 1);
    baseHeaders.set("Content-Range", `bytes ${start}-${end}/${bytes.length}`);
    baseHeaders.set("Content-Length", String(chunk.byteLength));
    return new Response(request.method === "HEAD" ? null : chunk, { status: 206, headers: baseHeaders });
  }
  return new Response(request.method === "HEAD" ? null : bytes, { headers: baseHeaders });
}

export default {
  async fetch(request: Request, env: WorkerEnv): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname === "/api/health") return jsonResponse({ status: "ok" });
    if (url.pathname === "/api/platform/config.js") {
      return new Response(
        'window.__MANUS_CONFIG__={"projectId":"","oauthPortalUrl":"","apiUrl":"","apiBrowserKey":""};',
        { headers: { "Content-Type": "application/javascript; charset=utf-8", "Cache-Control": "no-store" } },
      );
    }
    if (url.pathname === "/api/uploads/catalog") return uploadMedia(request, env, "catalogo");
    if (url.pathname === "/api/uploads/music") return uploadMedia(request, env, "musica");
    if (url.pathname === "/api/trpc" || url.pathname.startsWith("/api/trpc/")) {
      return fetchRequestHandler({
        endpoint: "/api/trpc",
        req: request,
        router: appRouter,
        createContext: ({ req, resHeaders }) => createContext({ req, resHeaders }, env),
      });
    }
    if (url.pathname.startsWith("/media/")) return serveMedia(request, env);
    return env.ASSETS.fetch(request);
  },
};

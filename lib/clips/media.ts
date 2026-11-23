import "server-only";
import { eq } from "drizzle-orm";
import { getUserId, isAdmin } from "@/lib/auth";
import { getClipsBucket, getDb, schema } from "@/lib/db";
import { isClipId } from "./server";

/* ═══════════════════════════════════════════════════════════════════════════
 *  Streams a clip's video or poster from R2.
 *  - Published clips: public, cached for a year (keys never change; a deleted
 *    clip's id is never reused).
 *  - Hidden clips: owner and admins only, never cached; everyone else 404.
 *  - Single-range requests (bytes=a-b, a-, -n) → 206 with Content-Range, which
 *    browsers (Safari in particular) need for seeking. Multi-range → full body.
 * ═══════════════════════════════════════════════════════════════════════════ */

const PUBLIC_CACHE = "public, max-age=31536000, immutable";
const PRIVATE_CACHE = "private, no-store";

const notFound = () => new Response("Not found", { status: 404, headers: { "Cache-Control": "no-store" } });

type Range = { offset: number; length: number };

/** Parse a single `bytes=` range against a known size. null = ignore header,
 *  "invalid" = 416. */
function parseRange(header: string | null, size: number): Range | null | "invalid" {
  if (!header) return null;
  const m = /^bytes=(\d*)-(\d*)$/.exec(header.trim());
  if (!m) return null; // multi-range or junk: serve the whole thing
  const [, a, b] = m;
  if (a === "" && b === "") return "invalid";
  if (a === "") {
    const n = Math.min(Number(b), size);
    if (n === 0) return "invalid";
    return { offset: size - n, length: n };
  }
  const start = Number(a);
  if (start >= size) return "invalid";
  const end = b === "" ? size - 1 : Math.min(Number(b), size - 1);
  if (end < start) return "invalid";
  return { offset: start, length: end - start + 1 };
}

export async function serveClipMedia(req: Request, id: string, which: "video" | "thumb"): Promise<Response> {
  if (!isClipId(id)) return notFound();

  const db = await getDb();
  const clip = await db.query.clips.findFirst({
    where: eq(schema.clips.id, id),
    columns: { userId: true, status: true, videoKey: true, thumbKey: true },
  });
  if (!clip) return notFound();
  const key = which === "video" ? clip.videoKey : clip.thumbKey;
  if (!key) return notFound();

  let cache = PUBLIC_CACHE;
  if (clip.status !== "published") {
    const userId = await getUserId();
    if (!userId || (userId !== clip.userId && !(await isAdmin()))) return notFound();
    cache = PRIVATE_CACHE;
  }

  const bucket = await getClipsBucket();
  const head = await bucket.head(key);
  if (!head) return notFound();

  const headers = new Headers();
  head.writeHttpMetadata(headers);
  headers.set("Content-Type", head.httpMetadata?.contentType ?? "application/octet-stream");
  headers.set("ETag", head.httpEtag);
  headers.set("Cache-Control", cache);
  headers.set("Accept-Ranges", "bytes");
  headers.set("X-Content-Type-Options", "nosniff");
  // A video/image response must never be framed or treated as a document.
  headers.set("Content-Security-Policy", "default-src 'none'; sandbox");

  const inm = req.headers.get("if-none-match");
  if (inm && inm.split(",").some((t) => t.trim() === head.httpEtag || t.trim() === "*")) {
    return new Response(null, { status: 304, headers });
  }

  // If-Range: only honour the range if the client's copy is still current.
  const ifRange = req.headers.get("if-range");
  const rangeHeader = ifRange && ifRange !== head.httpEtag ? null : req.headers.get("range");
  const range = parseRange(rangeHeader, head.size);
  if (range === "invalid") {
    headers.set("Content-Range", `bytes */${head.size}`);
    return new Response(null, { status: 416, headers });
  }

  const isHead = req.method === "HEAD";
  if (range) {
    headers.set("Content-Range", `bytes ${range.offset}-${range.offset + range.length - 1}/${head.size}`);
    headers.set("Content-Length", String(range.length));
    if (isHead) return new Response(null, { status: 206, headers });
    const obj = await bucket.get(key, { range });
    if (!obj) return notFound();
    return new Response(obj.body, { status: 206, headers });
  }

  headers.set("Content-Length", String(head.size));
  if (isHead) return new Response(null, { status: 200, headers });
  const obj = await bucket.get(key);
  if (!obj) return notFound();
  return new Response(obj.body, { status: 200, headers });
}

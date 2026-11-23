import "server-only";
import { and, count, eq, gte } from "drizzle-orm";
import { AuthError } from "@/lib/auth";
import { getClipsBucket, getDb, schema } from "@/lib/db";
import {
  CLIP_ID_RE,
  UPLOADS_PER_DAY,
  type ClipErrorCode,
  type ThumbMime,
  type VideoMime,
} from "./constants";

/* ═══════════════════════════════════════════════════════════════════════════
 *  CLIPS — server helpers shared by the upload/media Route Handlers and the
 *  Server Actions. Nothing here trusts the client.
 * ═══════════════════════════════════════════════════════════════════════════ */

export const nowS = () => Math.floor(Date.now() / 1000);

/** 16 url-safe random chars (96 bits). */
export function newClipId(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(12));
  let s = "";
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_");
}

export const isClipId = (v: unknown): v is string => typeof v === "string" && CLIP_ID_RE.test(v);

export const videoKeyFor = (id: string, ext: string) => `clips/${id}/video.${ext}`;
export const thumbKeyFor = (id: string, ext: string) => `clips/${id}/thumb.${ext}`;
/** Pending-upload record, deleted when the upload completes or is aborted. */
const pendingKey = (id: string) => `uploads/${id}.json`;

/* ── Errors ───────────────────────────────────────────────────────────── */

export class ClipError extends Error {
  constructor(public code: ClipErrorCode) {
    super(code);
  }
}

const STATUS: Partial<Record<ClipErrorCode, number>> = {
  unauthenticated: 401,
  "auth-disabled": 401,
  forbidden: 403,
  "not-found": 404,
  "rate-limited": 429,
  "too-large": 413,
  server: 500,
};

/** Map anything thrown to a stable error code. */
export function toCode(err: unknown): ClipErrorCode {
  if (err instanceof ClipError) return err.code;
  if (err instanceof AuthError) return err.code;
  console.error("[clips]", err);
  return "server";
}

export function errorResponse(err: unknown): Response {
  const code = toCode(err);
  return Response.json({ ok: false, error: code }, { status: STATUS[code] ?? 400, headers: { "Cache-Control": "no-store" } });
}

/* ── Rate limit ───────────────────────────────────────────────────────── */

export async function assertUploadQuota(userId: string): Promise<void> {
  const db = await getDb();
  const [row] = await db
    .select({ n: count() })
    .from(schema.clips)
    .where(and(eq(schema.clips.userId, userId), gte(schema.clips.createdAt, nowS() - 86400)));
  if ((row?.n ?? 0) >= UPLOADS_PER_DAY) throw new ClipError("rate-limited");
}

/* ── Magic bytes ──────────────────────────────────────────────────────── */

const ascii = (b: Uint8Array, from: number, to: number) => String.fromCharCode(...b.subarray(from, to));

/** Does the start of the file look like the declared container? */
export function sniffVideo(head: Uint8Array, mime: VideoMime): boolean {
  if (head.length < 12) return false;
  if (mime === "video/webm") return head[0] === 0x1a && head[1] === 0x45 && head[2] === 0xdf && head[3] === 0xa3;
  const box = ascii(head, 4, 8);
  if (mime === "video/mp4") return box === "ftyp";
  // QuickTime: modern files start with ftyp; older ones with another atom.
  return ["ftyp", "moov", "mdat", "wide", "free", "skip", "pnot"].includes(box);
}

export function sniffThumb(head: Uint8Array, mime: ThumbMime): boolean {
  if (mime === "image/jpeg") return head[0] === 0xff && head[1] === 0xd8 && head[2] === 0xff;
  return head.length >= 12 && ascii(head, 0, 4) === "RIFF" && ascii(head, 8, 12) === "WEBP";
}

/* ── Request bodies ───────────────────────────────────────────────────── */

/**
 * Read a request body into memory, counting real bytes as they arrive and
 * cancelling the stream the moment it passes `max`. Content-Length is only a
 * hint: a lying or missing header cannot push more than `max` + one chunk
 * into memory.
 */
export async function readBodyCapped(req: Request, max: number): Promise<Uint8Array> {
  const declared = Number(req.headers.get("content-length"));
  if (Number.isFinite(declared) && declared > max) throw new ClipError("too-large");
  if (!req.body) return new Uint8Array(0);

  const reader = req.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > max) {
      await reader.cancel().catch(() => {});
      throw new ClipError("too-large");
    }
    chunks.push(value);
  }
  const out = new Uint8Array(total);
  let at = 0;
  for (const c of chunks) {
    out.set(c, at);
    at += c.byteLength;
  }
  return out;
}

/* ── Pending uploads (state between the chunk requests) ───────────────── */

export interface PendingUpload {
  id: string;
  userId: string;
  uploadId: string;
  key: string;
  mime: VideoMime;
  size: number;
  parts: number;
  title: string;
  game: string;
  durationS: number | null;
  createdAt: number;
}

export async function savePending(p: PendingUpload): Promise<void> {
  const bucket = await getClipsBucket();
  await bucket.put(pendingKey(p.id), JSON.stringify(p), {
    httpMetadata: { contentType: "application/json" },
  });
}

/** The caller's pending upload, or a not-found/forbidden error. Pending
 *  uploads older than a day are treated as gone. */
export async function loadPending(id: string, userId: string): Promise<PendingUpload> {
  if (!isClipId(id)) throw new ClipError("not-found");
  const bucket = await getClipsBucket();
  const obj = await bucket.get(pendingKey(id));
  if (!obj) throw new ClipError("not-found");
  const p = await obj.json<PendingUpload>();
  if (p.userId !== userId) throw new ClipError("forbidden");
  if (p.createdAt < nowS() - 86400) throw new ClipError("not-found");
  return p;
}

export async function dropPending(id: string): Promise<void> {
  const bucket = await getClipsBucket();
  await bucket.delete(pendingKey(id));
}

/** Abort a pending upload and remove everything it left behind. */
export async function abortPending(p: PendingUpload): Promise<void> {
  const bucket = await getClipsBucket();
  await bucket.resumeMultipartUpload(p.key, p.uploadId).abort().catch(() => {});
  await bucket.delete([p.key, thumbKeyFor(p.id, "webp"), thumbKeyFor(p.id, "jpg"), pendingKey(p.id)]);
}

/* ── Deleting a clip ──────────────────────────────────────────────────── */

/** Remove a clip's R2 objects, then its row (reactions/reports go with it). */
export async function deleteClipEverywhere(clip: { id: string; videoKey: string; thumbKey: string | null }) {
  const bucket = await getClipsBucket();
  await bucket.delete([clip.videoKey, ...(clip.thumbKey ? [clip.thumbKey] : [])]);
  const db = await getDb();
  await db.batch([
    db.delete(schema.clipReactions).where(eq(schema.clipReactions.clipId, clip.id)),
    db.delete(schema.clipReports).where(eq(schema.clipReports.clipId, clip.id)),
    db.delete(schema.clips).where(eq(schema.clips.id, clip.id)),
  ]);
}

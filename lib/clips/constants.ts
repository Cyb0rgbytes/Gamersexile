/* ═══════════════════════════════════════════════════════════════════════════
 *  CLIPS — shared limits and vocabularies
 *  Safe for client and server. The server re-validates every one of these;
 *  the client copies exist only to fail fast before bytes leave the browser.
 * ═══════════════════════════════════════════════════════════════════════════ */

import type { ReactionKind as SchemaReaction } from "@/lib/db/schema";

/* Mirrors schema.REACTIONS without pulling drizzle into client bundles. The
 * two type checks below fail to compile if the lists ever diverge. */
export const REACTIONS = ["respect", "gg", "hype", "clutch", "lol"] as const;
export type ReactionKind = (typeof REACTIONS)[number];
type Same<A, B> = [A] extends [B] ? ([B] extends [A] ? true : false) : false;
const reactionsMatchSchema: Same<ReactionKind, SchemaReaction> = true;
void reactionsMatchSchema;

/** Hard cap on a clip's size: 45 MiB. */
export const MAX_CLIP_BYTES = 45 * 1024 * 1024;

/** Upload chunk size. Every part except the last is exactly this long
 *  (R2 multipart rule: equal non-final parts, each >= 5 MiB). Keeps each
 *  request well under the 10 MB proxy body buffer and bounds Worker memory. */
export const PART_SIZE = 8 * 1024 * 1024;
export const MAX_PARTS = Math.ceil(MAX_CLIP_BYTES / PART_SIZE);

/** Poster frame: the client aims for ~200 KB; the server accepts up to 300 KB. */
export const MAX_THUMB_BYTES = 300 * 1024;
export const THUMB_TARGET_BYTES = 200 * 1024;
export const THUMB_WIDTH = 640;

export const TITLE_MIN = 3;
export const TITLE_MAX = 80;

export const MAX_DURATION_S = 60 * 60;

/** Uploads allowed per user per rolling 24 hours. */
export const UPLOADS_PER_DAY = 10;

export const PAGE_SIZE = 24;

/** Accepted video types → canonical file extension and allowed name suffixes. */
export const VIDEO_TYPES = {
  "video/mp4": { ext: "mp4", suffixes: ["mp4", "m4v"] },
  "video/webm": { ext: "webm", suffixes: ["webm"] },
  "video/quicktime": { ext: "mov", suffixes: ["mov", "qt"] },
} as const;
export type VideoMime = keyof typeof VIDEO_TYPES;
export const VIDEO_MIMES = Object.keys(VIDEO_TYPES) as VideoMime[];
export const VIDEO_ACCEPT = [...VIDEO_MIMES, ".mp4", ".m4v", ".webm", ".mov"].join(",");

export const THUMB_TYPES = { "image/webp": "webp", "image/jpeg": "jpg" } as const;
export type ThumbMime = keyof typeof THUMB_TYPES;

export const isVideoMime = (v: string): v is VideoMime => v in VIDEO_TYPES;
export const isThumbMime = (v: string): v is ThumbMime => v in THUMB_TYPES;
export const isReaction = (v: unknown): v is ReactionKind =>
  typeof v === "string" && (REACTIONS as readonly string[]).includes(v);

/** File extension (lower case, no dot) from a file name. */
export function extOf(name: string): string {
  const i = name.lastIndexOf(".");
  return i < 0 ? "" : name.slice(i + 1).toLowerCase();
}

/** Resolve the MIME type of a picked file, tolerating browsers that report
 *  an empty type for .mov. Returns null when type and extension disagree. */
export function resolveVideoMime(type: string, name: string): VideoMime | null {
  const ext = extOf(name);
  if (type) {
    if (!isVideoMime(type)) return null;
    return (VIDEO_TYPES[type].suffixes as readonly string[]).includes(ext) ? type : null;
  }
  for (const mime of VIDEO_MIMES) {
    if ((VIDEO_TYPES[mime].suffixes as readonly string[]).includes(ext)) return mime;
  }
  return null;
}

export function normaliseTitle(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const t = raw.replace(/\s+/g, " ").trim();
  // Count code points, not UTF-16 units, so emoji and CJK titles are fair.
  const len = [...t].length;
  return len >= TITLE_MIN && len <= TITLE_MAX ? t : null;
}

export const REPORT_REASONS = ["spam", "nsfw", "harassment", "cheating", "copyright", "other"] as const;
export type ReportReason = (typeof REPORT_REASONS)[number];
export const isReportReason = (v: unknown): v is ReportReason =>
  typeof v === "string" && (REPORT_REASONS as readonly string[]).includes(v);

export const SORTS = ["new", "top"] as const;
export type ClipSort = (typeof SORTS)[number];

/** Error codes returned by clip actions and upload endpoints. Each one has a
 *  translated message under clips.errors.<code>. */
export const ERROR_CODES = [
  "unauthenticated",
  "auth-disabled",
  "forbidden",
  "not-found",
  "rate-limited",
  "invalid-title",
  "invalid-game",
  "invalid-type",
  "too-large",
  "bad-signature",
  "size-mismatch",
  "invalid-thumb",
  "invalid-upload",
  "invalid-reaction",
  "invalid-reason",
  "own-clip",
  "already-reported",
  "network",
  "server",
] as const;
export type ClipErrorCode = (typeof ERROR_CODES)[number];

export type ActionResult<T = undefined> = { ok: true; data: T } | { ok: false; error: ClipErrorCode };

/** Media URLs (served by app/api/clips/[id]/…). */
export const videoUrl = (id: string) => `/api/clips/${id}/video`;
export const thumbUrl = (id: string) => `/api/clips/${id}/thumb`;

export type ReactionCounts = Record<ReactionKind, number>;

export function countsOf(row: {
  respectCount: number;
  ggCount: number;
  hypeCount: number;
  clutchCount: number;
  lolCount: number;
}): ReactionCounts {
  return {
    respect: row.respectCount,
    gg: row.ggCount,
    hype: row.hypeCount,
    clutch: row.clutchCount,
    lol: row.lolCount,
  };
}

export const totalReactions = (c: ReactionCounts) => REACTIONS.reduce((n, k) => n + c[k], 0);

/** Clip ids are 16 random url-safe chars; validate before touching storage. */
export const CLIP_ID_RE = /^[A-Za-z0-9_-]{16}$/;

/** Gallery URL (without locale) for a sort / game / page combination. */
export function clipsHref(sort: ClipSort, game: string | null, page = 1): string {
  const q = new URLSearchParams();
  if (sort !== "new") q.set("sort", sort);
  if (game) q.set("game", game);
  if (page > 1) q.set("page", String(page));
  const s = q.toString();
  return s ? `/clips?${s}` : "/clips";
}

import { requireUserId } from "@/lib/auth";
import { getClipsBucket } from "@/lib/db";
import { GAME_KEYS } from "@/lib/games";
import {
  MAX_CLIP_BYTES,
  MAX_DURATION_S,
  PART_SIZE,
  VIDEO_TYPES,
  isVideoMime,
  normaliseTitle,
  resolveVideoMime,
} from "@/lib/clips/constants";
import {
  ClipError,
  assertUploadQuota,
  errorResponse,
  newClipId,
  nowS,
  readBodyCapped,
  savePending,
  videoKeyFor,
} from "@/lib/clips/server";

/* ═══════════════════════════════════════════════════════════════════════════
 *  POST /api/clips/upload — step 1 of 4: open an upload.
 *
 *  Flow (all steps re-check the Clerk session and ownership):
 *    1. POST   /api/clips/upload                  JSON metadata → { id, partSize, parts }
 *    2. PUT    /api/clips/upload/:id/thumb        poster frame (optional, ≤ 300 KB)
 *    3. PUT    /api/clips/upload/:id/part/:n      raw video bytes, one 8 MiB chunk each
 *    4. POST   /api/clips/upload/:id/complete     { parts } → clip row inserted → { id }
 *    (DELETE   /api/clips/upload/:id              abort and clean up)
 *
 *  Why chunks: R2 `put` on Workers needs a stream of KNOWN length, and the
 *  Next proxy buffers request bodies only up to 10 MB. Sending 8 MiB parts to
 *  an R2 multipart upload keeps each request under both limits, holds at most
 *  one part in Worker memory, and lets the server verify each part's REAL byte
 *  count against the size declared here. The 45 MiB cap is enforced on the
 *  declared size (here), on every part's actual length (step 3), and on the
 *  assembled object's size (step 4) before any database row exists.
 * ═══════════════════════════════════════════════════════════════════════════ */

export async function POST(req: Request) {
  try {
    const userId = await requireUserId();
    await assertUploadQuota(userId);

    const raw = await readBodyCapped(req, 4096);
    let body: Record<string, unknown>;
    try {
      body = JSON.parse(new TextDecoder().decode(raw)) as Record<string, unknown>;
    } catch {
      throw new ClipError("invalid-upload");
    }

    const title = normaliseTitle(body.title);
    if (!title) throw new ClipError("invalid-title");

    const game = typeof body.game === "string" ? body.game : "";
    if (!GAME_KEYS.includes(game)) throw new ClipError("invalid-game");

    const name = typeof body.fileName === "string" ? body.fileName.slice(0, 255) : "";
    const type = typeof body.mime === "string" ? body.mime : "";
    const mime = resolveVideoMime(type, name);
    if (!mime || !isVideoMime(mime)) throw new ClipError("invalid-type");

    const size = Number(body.size);
    if (!Number.isInteger(size) || size <= 0) throw new ClipError("invalid-upload");
    if (size > MAX_CLIP_BYTES) throw new ClipError("too-large");

    const d = Number(body.durationS);
    const durationS = Number.isFinite(d) && d > 0 ? Math.min(Math.round(d), MAX_DURATION_S) : null;

    const id = newClipId();
    const key = videoKeyFor(id, VIDEO_TYPES[mime].ext);
    const bucket = await getClipsBucket();
    const upload = await bucket.createMultipartUpload(key, {
      httpMetadata: { contentType: mime },
      customMetadata: { userId, clipId: id },
    });

    const parts = Math.ceil(size / PART_SIZE);
    await savePending({
      id,
      userId,
      uploadId: upload.uploadId,
      key,
      mime,
      size,
      parts,
      title,
      game,
      durationS,
      createdAt: nowS(),
    });

    return Response.json({ ok: true, id, partSize: PART_SIZE, parts }, { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    return errorResponse(err);
  }
}

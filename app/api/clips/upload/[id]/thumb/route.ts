import { requireUserId } from "@/lib/auth";
import { getClipsBucket } from "@/lib/db";
import { MAX_THUMB_BYTES, THUMB_TYPES, isThumbMime } from "@/lib/clips/constants";
import {
  ClipError,
  errorResponse,
  loadPending,
  readBodyCapped,
  sniffThumb,
  thumbKeyFor,
} from "@/lib/clips/server";

/* PUT /api/clips/upload/:id/thumb — the poster frame the browser cut from the
 * video (step 2, optional). WebP or JPEG, at most 300 KB, magic bytes checked. */
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = await requireUserId();
    const { id } = await params;
    const pending = await loadPending(id, userId);

    const type = (req.headers.get("content-type") ?? "").split(";")[0].trim().toLowerCase();
    if (!isThumbMime(type)) throw new ClipError("invalid-thumb");

    const bytes = await readBodyCapped(req, MAX_THUMB_BYTES);
    if (bytes.byteLength === 0 || !sniffThumb(bytes, type)) throw new ClipError("invalid-thumb");

    const bucket = await getClipsBucket();
    const ext = THUMB_TYPES[type];
    // Only one poster per clip: drop the other format if a retry switched it.
    await bucket.delete(thumbKeyFor(pending.id, ext === "webp" ? "jpg" : "webp"));
    await bucket.put(thumbKeyFor(pending.id, ext), bytes, {
      httpMetadata: { contentType: type },
      customMetadata: { userId, clipId: pending.id },
    });

    return Response.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    return errorResponse(err);
  }
}

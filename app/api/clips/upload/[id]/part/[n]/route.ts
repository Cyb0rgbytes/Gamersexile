import { requireUserId } from "@/lib/auth";
import { getClipsBucket } from "@/lib/db";
import { PART_SIZE } from "@/lib/clips/constants";
import { ClipError, errorResponse, loadPending, readBodyCapped, sniffVideo } from "@/lib/clips/server";

/* PUT /api/clips/upload/:id/part/:n — one chunk of the video (step 3).
 *
 * The body is read with a hard byte cap of PART_SIZE (real bytes, not the
 * Content-Length header) and must be EXACTLY the length this part has to be
 * given the size declared at step 1: PART_SIZE for every part but the last,
 * the remainder for the last. So the parts can only ever add up to the
 * declared size, which step 1 already capped at 45 MiB. Part 1 also has its
 * magic bytes checked against the declared container. */
export async function PUT(req: Request, { params }: { params: Promise<{ id: string; n: string }> }) {
  try {
    const userId = await requireUserId();
    const { id, n } = await params;
    const pending = await loadPending(id, userId);

    const partNumber = Number(n);
    if (!Number.isInteger(partNumber) || partNumber < 1 || partNumber > pending.parts) {
      throw new ClipError("invalid-upload");
    }
    const expected = partNumber < pending.parts ? PART_SIZE : pending.size - PART_SIZE * (pending.parts - 1);

    const bytes = await readBodyCapped(req, expected);
    if (bytes.byteLength !== expected) throw new ClipError("size-mismatch");
    if (partNumber === 1 && !sniffVideo(bytes.subarray(0, 16), pending.mime)) throw new ClipError("bad-signature");

    const bucket = await getClipsBucket();
    const part = await bucket.resumeMultipartUpload(pending.key, pending.uploadId).uploadPart(partNumber, bytes);

    return Response.json(
      { ok: true, partNumber: part.partNumber, etag: part.etag },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (err) {
    return errorResponse(err);
  }
}

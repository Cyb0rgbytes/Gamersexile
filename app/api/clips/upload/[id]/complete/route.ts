import { revalidatePath } from "next/cache";
import { requireUserId, syncProfile } from "@/lib/auth";
import { getClipsBucket, getDb, schema } from "@/lib/db";
import { MAX_CLIP_BYTES } from "@/lib/clips/constants";
import {
  ClipError,
  abortPending,
  assertUploadQuota,
  dropPending,
  errorResponse,
  loadPending,
  readBodyCapped,
  thumbKeyFor,
} from "@/lib/clips/server";

/* POST /api/clips/upload/:id/complete — step 4. Assembles the parts, checks
 * the stored object's real size, then (and only then) inserts the clip row. */
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = await requireUserId();
    const { id } = await params;
    const pending = await loadPending(id, userId);
    await assertUploadQuota(userId);

    let parts: { partNumber: number; etag: string }[];
    try {
      const body = JSON.parse(new TextDecoder().decode(await readBodyCapped(req, 8192))) as { parts?: unknown };
      if (!Array.isArray(body.parts)) throw new Error();
      parts = body.parts.map((p: { partNumber?: unknown; etag?: unknown }) => {
        if (!Number.isInteger(p.partNumber) || typeof p.etag !== "string") throw new Error();
        return { partNumber: p.partNumber as number, etag: p.etag };
      });
    } catch {
      throw new ClipError("invalid-upload");
    }
    parts.sort((a, b) => a.partNumber - b.partNumber);
    if (parts.length !== pending.parts || parts.some((p, i) => p.partNumber !== i + 1)) {
      throw new ClipError("invalid-upload");
    }

    const bucket = await getClipsBucket();
    let video: R2Object;
    try {
      video = await bucket.resumeMultipartUpload(pending.key, pending.uploadId).complete(parts);
    } catch {
      throw new ClipError("invalid-upload");
    }

    // Belt and braces: the stored object must be exactly what was declared.
    if (video.size !== pending.size || video.size > MAX_CLIP_BYTES) {
      await abortPending(pending);
      throw new ClipError(video.size > MAX_CLIP_BYTES ? "too-large" : "size-mismatch");
    }

    const [webp, jpg] = await Promise.all([
      bucket.head(thumbKeyFor(id, "webp")),
      bucket.head(thumbKeyFor(id, "jpg")),
    ]);
    const thumbKey = webp?.key ?? jpg?.key ?? null;

    // Name and avatar for the clip card. Not fatal if Clerk is unreachable.
    await syncProfile().catch((e) => console.warn("[clips] profile sync failed", e));

    const db = await getDb();
    await db.insert(schema.clips).values({
      id,
      userId,
      title: pending.title,
      game: pending.game,
      videoKey: pending.key,
      thumbKey,
      mime: pending.mime,
      sizeBytes: video.size,
      durationS: pending.durationS,
    });
    await dropPending(id);

    revalidatePath("/[lang]/clips", "layout");
    return Response.json({ ok: true, id }, { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    return errorResponse(err);
  }
}

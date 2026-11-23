import { requireUserId } from "@/lib/auth";
import { abortPending, errorResponse, loadPending } from "@/lib/clips/server";

/* DELETE /api/clips/upload/:id — abandon an unfinished upload: aborts the R2
 * multipart upload and removes the poster and the pending record. */
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = await requireUserId();
    const { id } = await params;
    const pending = await loadPending(id, userId);
    await abortPending(pending);
    return Response.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    return errorResponse(err);
  }
}

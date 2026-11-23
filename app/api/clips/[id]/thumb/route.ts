import { serveClipMedia } from "@/lib/clips/media";

/* GET/HEAD /api/clips/:id/thumb — the clip's poster frame (lib/clips/media). */
type Ctx = { params: Promise<{ id: string }> };

export async function GET(req: Request, { params }: Ctx) {
  return serveClipMedia(req, (await params).id, "thumb");
}

export async function HEAD(req: Request, { params }: Ctx) {
  return serveClipMedia(req, (await params).id, "thumb");
}

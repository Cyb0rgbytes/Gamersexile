import "server-only";
import { and, desc, eq, gt, gte, inArray, or, sql, type SQL } from "drizzle-orm";
import { getDb, schema } from "@/lib/db";
import { PAGE_SIZE, countsOf, type ClipSort, type ReactionCounts, type ReactionKind } from "./constants";
import { isClipId, nowS } from "./server";

/* Read side of the clips feature: gallery pages, a single clip, the admin
 * queue. Everything returns plain serialisable objects. */

const { clips, profiles, clipReactions, clipReports } = schema;

export interface ClipSummary {
  id: string;
  userId: string;
  title: string;
  game: string;
  hasThumb: boolean;
  mime: string;
  sizeBytes: number;
  durationS: number | null;
  status: "published" | "hidden";
  reportCount: number;
  createdAt: number;
  counts: ReactionCounts;
  author: { name: string; avatarUrl: string | null };
}

const reactionSum = sql<number>`(${clips.respectCount} + ${clips.ggCount} + ${clips.hypeCount} + ${clips.clutchCount} + ${clips.lolCount})`;

const selection = {
  clip: clips,
  name: profiles.displayName,
  avatarUrl: profiles.avatarUrl,
};

type Row = { clip: typeof clips.$inferSelect; name: string | null; avatarUrl: string | null };

function toSummary({ clip, name, avatarUrl }: Row): ClipSummary {
  return {
    id: clip.id,
    userId: clip.userId,
    title: clip.title,
    game: clip.game,
    hasThumb: Boolean(clip.thumbKey),
    mime: clip.mime,
    sizeBytes: clip.sizeBytes,
    durationS: clip.durationS,
    status: clip.status,
    reportCount: clip.reportCount,
    createdAt: clip.createdAt,
    counts: countsOf(clip),
    author: { name: name ?? "Exile", avatarUrl },
  };
}

export async function listClips(opts: { sort: ClipSort; game: string | null; page: number }) {
  const db = await getDb();
  const where: SQL[] = [eq(clips.status, "published")];
  if (opts.game) where.push(eq(clips.game, opts.game));
  if (opts.sort === "top") where.push(gte(clips.createdAt, nowS() - 7 * 86400));

  const order = opts.sort === "top" ? [desc(reactionSum), desc(clips.createdAt)] : [desc(clips.createdAt)];

  const rows = await db
    .select(selection)
    .from(clips)
    .leftJoin(profiles, eq(profiles.userId, clips.userId))
    .where(and(...where))
    .orderBy(...order, desc(clips.id))
    .limit(PAGE_SIZE + 1)
    .offset((opts.page - 1) * PAGE_SIZE);

  return { items: rows.slice(0, PAGE_SIZE).map(toSummary), hasMore: rows.length > PAGE_SIZE };
}

export async function getClip(id: string): Promise<(ClipSummary & { videoKey: string }) | null> {
  if (!isClipId(id)) return null;
  const db = await getDb();
  const [row] = await db
    .select(selection)
    .from(clips)
    .leftJoin(profiles, eq(profiles.userId, clips.userId))
    .where(eq(clips.id, id))
    .limit(1);
  return row ? { ...toSummary(row), videoKey: row.clip.videoKey } : null;
}

/** The viewer's reaction and whether they have reported this clip. */
export async function viewerState(clipId: string, userId: string | null) {
  if (!userId) return { reaction: null as ReactionKind | null, reported: false };
  const db = await getDb();
  const [reaction, report] = await Promise.all([
    db.query.clipReactions.findFirst({
      where: and(eq(clipReactions.clipId, clipId), eq(clipReactions.userId, userId)),
      columns: { kind: true },
    }),
    db.query.clipReports.findFirst({
      where: and(eq(clipReports.clipId, clipId), eq(clipReports.userId, userId)),
      columns: { reason: true },
    }),
  ]);
  return { reaction: reaction?.kind ?? null, reported: Boolean(report) };
}

export interface ModerationItem extends ClipSummary {
  reasons: { reason: string; n: number }[];
}

/** Hidden clips and any clip with reports, most reported first. Capped at 50
 *  because D1 allows at most 100 bound parameters per statement (inArray). */
export async function moderationQueue(limit = 50): Promise<ModerationItem[]> {
  const db = await getDb();
  const rows = await db
    .select(selection)
    .from(clips)
    .leftJoin(profiles, eq(profiles.userId, clips.userId))
    .where(or(eq(clips.status, "hidden"), gt(clips.reportCount, 0)))
    .orderBy(desc(clips.reportCount), desc(clips.createdAt))
    .limit(limit);
  if (rows.length === 0) return [];

  const ids = rows.map((r) => r.clip.id);
  const reasons = await db
    .select({ clipId: clipReports.clipId, reason: clipReports.reason, n: sql<number>`count(*)` })
    .from(clipReports)
    .where(inArray(clipReports.clipId, ids))
    .groupBy(clipReports.clipId, clipReports.reason);

  return rows.map((r) => ({
    ...toSummary(r),
    reasons: reasons
      .filter((x) => x.clipId === r.clip.id)
      .map(({ reason, n }) => ({ reason, n: Number(n) }))
      .sort((a, b) => b.n - a.n),
  }));
}

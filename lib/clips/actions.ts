"use server";

import { revalidatePath } from "next/cache";
import { and, eq, sql } from "drizzle-orm";
import { isAdmin, requireAdmin, requireUserId } from "@/lib/auth";
import { REPORT_HIDE_THRESHOLD } from "@/lib/db/schema";
import { getDb, schema } from "@/lib/db";
import {
  countsOf,
  isReaction,
  isReportReason,
  type ActionResult,
  type ReactionCounts,
  type ReactionKind,
} from "./constants";
import { ClipError, deleteClipEverywhere, isClipId, toCode } from "./server";

/* ═══════════════════════════════════════════════════════════════════════════
 *  CLIP SERVER ACTIONS
 *  Each one re-reads the session and the clip row; nothing the client sends
 *  besides ids and enum values is used.
 *
 *  Counter consistency: the denormalised *_count / report_count columns are
 *  never incremented blindly. In the same D1 batch (one implicit transaction)
 *  that changes clip_reactions / clip_reports, they are RECOMPUTED from those
 *  tables (a PK-prefix count over one clip's rows). Double clicks, two tabs,
 *  or a retried request therefore cannot make them drift.
 * ═══════════════════════════════════════════════════════════════════════════ */

const { clips, clipReactions, clipReports } = schema;

const revalidate = () => revalidatePath("/[lang]/clips", "layout");

async function fail<T>(err: unknown): Promise<ActionResult<T>> {
  return { ok: false, error: toCode(err) };
}

/** Count of a clip's reactions of one kind, as a scalar subquery. */
const reactionCount = (clipId: string, kind: ReactionKind) =>
  sql<number>`(select count(*) from ${clipReactions} where ${clipReactions.clipId} = ${clipId} and ${clipReactions.kind} = ${kind})`;

const reportCountSql = (clipId: string) =>
  sql<number>`(select count(*) from ${clipReports} where ${clipReports.clipId} = ${clipId})`;

async function publishedClip(id: unknown) {
  if (!isClipId(id)) throw new ClipError("not-found");
  const db = await getDb();
  const clip = await db.query.clips.findFirst({ where: eq(clips.id, id) });
  if (!clip || clip.status !== "published") throw new ClipError("not-found");
  return clip;
}

/* ── Reactions ────────────────────────────────────────────────────────── */

export interface ReactionState {
  counts: ReactionCounts;
  mine: ReactionKind | null;
}

/**
 * Set the viewer's reaction to `kind`, or clear it with null. The client
 * sends the state it wants (not "toggle"), so repeated calls are idempotent.
 */
export async function setReaction(clipId: string, kind: ReactionKind | null): Promise<ActionResult<ReactionState>> {
  try {
    const userId = await requireUserId();
    if (kind !== null && !isReaction(kind)) throw new ClipError("invalid-reaction");
    const clip = await publishedClip(clipId);
    const db = await getDb();

    const change =
      kind === null
        ? db.delete(clipReactions).where(and(eq(clipReactions.clipId, clip.id), eq(clipReactions.userId, userId)))
        : db
            .insert(clipReactions)
            .values({ clipId: clip.id, userId, kind })
            .onConflictDoUpdate({
              target: [clipReactions.clipId, clipReactions.userId],
              set: { kind, createdAt: sql`(unixepoch())` },
            });

    const [, , row] = await db.batch([
      change,
      db
        .update(clips)
        .set({
          respectCount: reactionCount(clip.id, "respect"),
          ggCount: reactionCount(clip.id, "gg"),
          hypeCount: reactionCount(clip.id, "hype"),
          clutchCount: reactionCount(clip.id, "clutch"),
          lolCount: reactionCount(clip.id, "lol"),
        })
        .where(eq(clips.id, clip.id)),
      db.query.clips.findFirst({ where: eq(clips.id, clip.id) }),
    ]);
    if (!row) throw new ClipError("not-found");

    revalidate();
    return { ok: true, data: { counts: countsOf(row), mine: kind } };
  } catch (err) {
    return fail(err);
  }
}

/* ── Reports ──────────────────────────────────────────────────────────── */

export async function reportClip(clipId: string, reason: string): Promise<ActionResult<{ hidden: boolean }>> {
  try {
    const userId = await requireUserId();
    if (!isReportReason(reason)) throw new ClipError("invalid-reason");
    const clip = await publishedClip(clipId);
    if (clip.userId === userId) throw new ClipError("own-clip");

    const db = await getDb();
    const existing = await db.query.clipReports.findFirst({
      where: and(eq(clipReports.clipId, clip.id), eq(clipReports.userId, userId)),
      columns: { reason: true },
    });
    if (existing) throw new ClipError("already-reported");

    const [, , row] = await db.batch([
      db.insert(clipReports).values({ clipId: clip.id, userId, reason }).onConflictDoNothing(),
      db
        .update(clips)
        .set({
          reportCount: reportCountSql(clip.id),
          status: sql`case when ${reportCountSql(clip.id)} >= ${REPORT_HIDE_THRESHOLD} then 'hidden' else ${clips.status} end`,
        })
        .where(eq(clips.id, clip.id)),
      db.query.clips.findFirst({ where: eq(clips.id, clip.id), columns: { status: true } }),
    ]);

    revalidate();
    return { ok: true, data: { hidden: row?.status === "hidden" } };
  } catch (err) {
    return fail(err);
  }
}

/* ── Deleting ─────────────────────────────────────────────────────────── */

/** Owner (or admin) deletes a clip: R2 objects first, then the row. */
export async function deleteClip(clipId: string): Promise<ActionResult> {
  try {
    const userId = await requireUserId();
    if (!isClipId(clipId)) throw new ClipError("not-found");
    const db = await getDb();
    const clip = await db.query.clips.findFirst({ where: eq(clips.id, clipId) });
    if (!clip) throw new ClipError("not-found");
    if (clip.userId !== userId && !(await isAdmin())) throw new ClipError("forbidden");

    await deleteClipEverywhere(clip);
    revalidate();
    return { ok: true, data: undefined };
  } catch (err) {
    return fail(err);
  }
}

/* ── Moderation (admins) ──────────────────────────────────────────────── */

export async function moderateClip(
  clipId: string,
  action: "restore" | "restore-reset" | "hide" | "delete",
): Promise<ActionResult> {
  try {
    await requireAdmin();
    if (!isClipId(clipId)) throw new ClipError("not-found");
    const db = await getDb();
    const clip = await db.query.clips.findFirst({ where: eq(clips.id, clipId) });
    if (!clip) throw new ClipError("not-found");

    switch (action) {
      case "restore":
        await db.update(clips).set({ status: "published" }).where(eq(clips.id, clip.id));
        break;
      case "restore-reset":
        await db.batch([
          db.delete(clipReports).where(eq(clipReports.clipId, clip.id)),
          db.update(clips).set({ status: "published", reportCount: 0 }).where(eq(clips.id, clip.id)),
        ]);
        break;
      case "hide":
        await db.update(clips).set({ status: "hidden" }).where(eq(clips.id, clip.id));
        break;
      case "delete":
        await deleteClipEverywhere(clip);
        break;
      default:
        throw new ClipError("invalid-upload");
    }

    revalidate();
    revalidatePath("/[lang]/admin/clips", "page");
    return { ok: true, data: undefined };
  } catch (err) {
    return fail(err);
  }
}

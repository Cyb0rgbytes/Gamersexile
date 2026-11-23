import "server-only";
import { cache } from "react";
import { connection } from "next/server";
import { and, asc, count, desc, eq, gt, inArray, lt, sql, type SQL } from "drizzle-orm";
import { getDb, schema } from "@/lib/db";
import { CARD_AVATARS, TEAMS_PAGE_SIZE } from "./config";

/* ═══════════════════════════════════════════════════════════════════════════
 *  TEAMS — read queries (server only). Every reader awaits connection() so
 *  pages that show team data always render per request, never from a
 *  build-time snapshot of the database.
 * ═══════════════════════════════════════════════════════════════════════════ */

const { teams, teamMembers, teamInvites, profiles } = schema;

export type Team = typeof teams.$inferSelect;
export type Invite = typeof teamInvites.$inferSelect;

export const nowS = () => Math.floor(Date.now() / 1000);

export interface TeamFilters {
  game?: string;
  region?: string;
  recruiting?: boolean;
  q?: string;
  page?: number;
}

export interface TeamCardData {
  id: string;
  slug: string;
  name: string;
  tag: string | null;
  game: string;
  region: string;
  recruiting: boolean;
  openRoles: string[];
  memberCount: number;
  roster: { displayName: string; avatarUrl: string | null }[];
}

const escapeLike = (s: string) => s.replace(/[\\%_]/g, (c) => `\\${c}`);

/** One page of teams matching the filters, plus the total match count. */
export async function listTeams(f: TeamFilters): Promise<{ items: TeamCardData[]; total: number }> {
  await connection();
  const db = await getDb();

  const conds: SQL[] = [];
  if (f.game) conds.push(eq(teams.game, f.game));
  if (f.region) conds.push(eq(teams.region, f.region));
  if (f.recruiting) conds.push(eq(teams.recruiting, true));
  if (f.q) {
    const pat = `%${escapeLike(f.q)}%`;
    conds.push(sql`(${teams.name} LIKE ${pat} ESCAPE '\\' OR ${teams.tag} LIKE ${pat} ESCAPE '\\')`);
  }
  const where = conds.length ? and(...conds) : undefined;
  const page = Math.max(1, f.page ?? 1);

  const memberCount = sql<number>`(SELECT COUNT(*) FROM ${teamMembers} WHERE ${teamMembers.teamId} = ${teams.id})`;

  const [rows, [{ n }]] = await Promise.all([
    db
      .select({
        id: teams.id,
        slug: teams.slug,
        name: teams.name,
        tag: teams.tag,
        game: teams.game,
        region: teams.region,
        recruiting: teams.recruiting,
        openRoles: teams.openRoles,
        memberCount,
      })
      .from(teams)
      .where(where)
      .orderBy(desc(teams.recruiting), desc(teams.updatedAt))
      .limit(TEAMS_PAGE_SIZE)
      .offset((page - 1) * TEAMS_PAGE_SIZE),
    db.select({ n: count() }).from(teams).where(where),
  ]);

  const ids = rows.map((r) => r.id);
  const rosterRows = ids.length
    ? await db
        .select({ teamId: teamMembers.teamId, displayName: profiles.displayName, avatarUrl: profiles.avatarUrl })
        .from(teamMembers)
        .leftJoin(profiles, eq(profiles.userId, teamMembers.userId))
        .where(inArray(teamMembers.teamId, ids))
        .orderBy(asc(teamMembers.joinedAt))
    : [];

  const rosters = new Map<string, TeamCardData["roster"]>();
  for (const r of rosterRows) {
    const list = rosters.get(r.teamId) ?? [];
    if (list.length < CARD_AVATARS) list.push({ displayName: r.displayName ?? "Exile", avatarUrl: r.avatarUrl ?? null });
    rosters.set(r.teamId, list);
  }

  return {
    items: rows.map((r) => ({
      ...r,
      openRoles: Array.isArray(r.openRoles) ? r.openRoles : [],
      memberCount: Number(r.memberCount) || 0,
      roster: rosters.get(r.id) ?? [],
    })),
    total: n,
  };
}

/** Team by slug (deduplicated between generateMetadata and the page). */
export const getTeamBySlug = cache(async (slug: string): Promise<Team | null> => {
  await connection();
  const db = await getDb();
  return (await db.query.teams.findFirst({ where: eq(teams.slug, slug) })) ?? null;
});

export async function getTeamById(id: string): Promise<Team | null> {
  const db = await getDb();
  return (await db.query.teams.findFirst({ where: eq(teams.id, id) })) ?? null;
}

export interface RosterEntry {
  userId: string;
  role: string | null;
  joinedAt: number;
  displayName: string;
  avatarUrl: string | null;
  discordUsername: string | null;
}

/** Full roster with profiles, captain first then by join date. */
export async function getRoster(team: Pick<Team, "id" | "captainId">): Promise<RosterEntry[]> {
  const db = await getDb();
  const rows = await db
    .select({
      userId: teamMembers.userId,
      role: teamMembers.role,
      joinedAt: teamMembers.joinedAt,
      displayName: profiles.displayName,
      avatarUrl: profiles.avatarUrl,
      discordUsername: profiles.discordUsername,
    })
    .from(teamMembers)
    .leftJoin(profiles, eq(profiles.userId, teamMembers.userId))
    .where(eq(teamMembers.teamId, team.id))
    .orderBy(asc(teamMembers.joinedAt));

  return rows
    .map((r) => ({
      ...r,
      displayName: r.displayName ?? "Exile",
      avatarUrl: r.avatarUrl ?? null,
      discordUsername: r.discordUsername ?? null,
    }))
    .sort((a, b) => Number(b.userId === team.captainId) - Number(a.userId === team.captainId));
}

export async function getMembership(teamId: string, userId: string) {
  const db = await getDb();
  return (
    (await db.query.teamMembers.findFirst({
      where: and(eq(teamMembers.teamId, teamId), eq(teamMembers.userId, userId)),
    })) ?? null
  );
}

/** The team (if any) a user already plays for in a given game. */
export async function getUserTeamForGame(userId: string, game: string) {
  const db = await getDb();
  const row = await db
    .select({ id: teams.id, slug: teams.slug, name: teams.name })
    .from(teamMembers)
    .innerJoin(teams, eq(teams.id, teamMembers.teamId))
    .where(and(eq(teamMembers.userId, userId), eq(teamMembers.game, game)))
    .limit(1);
  return row[0] ?? null;
}

/** Invites that can still be used: not revoked, not expired, uses left. */
export async function getActiveInvites(teamId: string): Promise<Invite[]> {
  const db = await getDb();
  return db
    .select()
    .from(teamInvites)
    .where(
      and(
        eq(teamInvites.teamId, teamId),
        eq(teamInvites.revoked, false),
        gt(teamInvites.expiresAt, nowS()),
        lt(teamInvites.uses, teamInvites.maxUses),
      ),
    )
    .orderBy(desc(teamInvites.createdAt));
}

export type InviteLookup = { status: "invalid" } | { status: "ok"; invite: Invite; team: Team };

/** Resolve an invite token for the preview page. Never says *why* a token failed. */
export async function lookupInvite(token: string): Promise<InviteLookup> {
  await connection();
  if (!/^[A-Za-z0-9_-]{20,64}$/.test(token)) return { status: "invalid" };
  const db = await getDb();
  const row = await db
    .select({ invite: teamInvites, team: teams })
    .from(teamInvites)
    .innerJoin(teams, eq(teams.id, teamInvites.teamId))
    .where(eq(teamInvites.token, token))
    .limit(1);
  const hit = row[0];
  if (!hit) return { status: "invalid" };
  const { invite } = hit;
  if (invite.revoked || invite.expiresAt <= nowS() || invite.uses >= invite.maxUses) return { status: "invalid" };
  return { status: "ok", invite, team: hit.team };
}

export async function getMemberCount(teamId: string): Promise<number> {
  const db = await getDb();
  const [{ n }] = await db.select({ n: count() }).from(teamMembers).where(eq(teamMembers.teamId, teamId));
  return n;
}

/** Teams a user belongs to, for the account page. */
export async function getUserTeams(userId: string) {
  await connection();
  const db = await getDb();
  return db
    .select({
      slug: teams.slug,
      name: teams.name,
      tag: teams.tag,
      game: teams.game,
      region: teams.region,
      captainId: teams.captainId,
      role: teamMembers.role,
    })
    .from(teamMembers)
    .innerJoin(teams, eq(teams.id, teamMembers.teamId))
    .where(eq(teamMembers.userId, userId))
    .orderBy(asc(teams.name));
}

import "server-only";
import { AuthError, requireUserId } from "@/lib/auth";
import type { TeamErrorCode } from "./config";
import { getMembership, getTeamById, type Team } from "./queries";

/* ═══════════════════════════════════════════════════════════════════════════
 *  TEAMS — authorization. Every Server Action calls one of these first; the
 *  answer always comes from the database, never from form fields or from
 *  what the UI chose to render.
 * ═══════════════════════════════════════════════════════════════════════════ */

export class TeamError extends Error {
  constructor(public code: TeamErrorCode) {
    super(code);
  }
}

/** Signed-in user id, or TeamError("auth-disabled" | "unauthenticated"). */
export async function requireSignedIn(): Promise<string> {
  try {
    return await requireUserId();
  } catch (e) {
    if (e instanceof AuthError) throw new TeamError(e.code === "auth-disabled" ? "auth-disabled" : "unauthenticated");
    throw e;
  }
}

async function loadTeam(teamId: unknown): Promise<Team> {
  if (typeof teamId !== "string" || !teamId) throw new TeamError("not-found");
  const team = await getTeamById(teamId);
  if (!team) throw new TeamError("not-found");
  return team;
}

/** Caller must be a member of the team. */
export async function requireMember(teamId: unknown) {
  const userId = await requireSignedIn();
  const team = await loadTeam(teamId);
  const member = await getMembership(team.id, userId);
  if (!member) throw new TeamError("not-a-member");
  return { userId, team, member, isCaptain: team.captainId === userId };
}

/** Caller must be the team's current captain (teams.captain_id). */
export async function requireCaptain(teamId: unknown) {
  const userId = await requireSignedIn();
  const team = await loadTeam(teamId);
  if (team.captainId !== userId) throw new TeamError("forbidden");
  return { userId, team };
}

/** Walk an error and its causes looking for a SQLite UNIQUE violation. */
export function isUniqueViolation(e: unknown, needle?: string): boolean {
  let cur: unknown = e;
  for (let i = 0; i < 5 && cur; i++) {
    const msg = cur instanceof Error ? cur.message : String(cur);
    if (/UNIQUE constraint failed/i.test(msg) && (!needle || msg.includes(needle))) return true;
    cur = cur instanceof Error ? (cur as Error & { cause?: unknown }).cause : undefined;
  }
  return false;
}

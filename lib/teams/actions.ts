"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { AuthError, setDiscordUsername, syncProfile } from "@/lib/auth";
import { getDb, schema } from "@/lib/db";
import { GAME_KEYS, rolesFor } from "@/lib/games";
import { DEFAULT_LOCALE, isLocale, localePath, type Locale } from "@/lib/i18n/config";
import {
  DESCRIPTION_MAX,
  DISCORD_RE,
  INVITE_EXPIRY_DAYS,
  INVITE_MAX_USES,
  NAME_MAX,
  NAME_MIN,
  RESERVED_SLUGS,
  TAG_RE,
  cleanDiscord,
  isRegion,
  safeNextPath,
  slugify,
  type ActionState,
} from "./config";
import { TeamError, isUniqueViolation, requireCaptain, requireMember, requireSignedIn } from "./guard";
import { getMembership, getUserTeamForGame, lookupInvite, nowS } from "./queries";

/* ═══════════════════════════════════════════════════════════════════════════
 *  TEAMS — Server Actions. Shape: (prevState, formData) => ActionState, for
 *  useActionState. Each one authenticates, authorizes from the database
 *  (lib/teams/guard) and validates every field before writing. Errors come
 *  back as codes; the client maps them to translated text.
 *
 *  `locale` travels as a hidden field because next/root-params is not
 *  available inside Server Actions; it only shapes redirect URLs.
 * ═══════════════════════════════════════════════════════════════════════════ */

const { teams, teamMembers, teamInvites } = schema;

/* ── Helpers ─────────────────────────────────────────────────────────────── */

function fail(e: unknown): ActionState {
  if (e instanceof TeamError) return { ok: false, error: e.code };
  if (e instanceof AuthError) return { ok: false, error: e.code === "auth-disabled" ? "auth-disabled" : "unauthenticated" };
  if (e instanceof Error && e.message === "invalid-discord-username") return { ok: false, error: "invalid-discord", field: "discordUsername" };
  if (isUniqueViolation(e, "team_members")) return { ok: false, error: "one-team-per-game" };
  console.error("[teams] action failed", e);
  return { ok: false, error: "unknown" };
}

const str = (fd: FormData, key: string) => {
  const v = fd.get(key);
  return typeof v === "string" ? v : "";
};

function readLocale(fd: FormData): Locale {
  const l = str(fd, "locale");
  return isLocale(l) ? l : DEFAULT_LOCALE;
}

function revalidateTeams() {
  revalidatePath("/[lang]/teams", "layout");
  revalidatePath("/[lang]/account", "page");
}

class FieldError extends TeamError {
  constructor(
    code: ConstructorParameters<typeof TeamError>[0],
    public field: string,
  ) {
    super(code);
  }
}

interface TeamDetails {
  name: string;
  tag: string | null;
  region: string;
  description: string | null;
  recruiting: boolean;
  openRoles: string[];
}

/** Validate the editable team fields against the given game's roles. */
function parseDetails(fd: FormData, game: string): TeamDetails {
  const name = str(fd, "name").trim().replace(/\s+/g, " ");
  if (name.length < NAME_MIN || name.length > NAME_MAX) throw new FieldError("name-length", "name");

  const rawTag = str(fd, "tag").trim().toUpperCase();
  if (rawTag && !TAG_RE.test(rawTag)) throw new FieldError("tag-format", "tag");

  const region = str(fd, "region");
  if (!isRegion(region)) throw new FieldError("invalid-region", "region");

  const description = str(fd, "description").trim();
  if (description.length > DESCRIPTION_MAX) throw new FieldError("description-length", "description");

  const allowed = rolesFor(game);
  const openRoles = [...new Set(fd.getAll("openRoles").filter((v): v is string => typeof v === "string"))];
  if (openRoles.some((r) => !allowed.includes(r))) throw new FieldError("invalid-role", "openRoles");

  return {
    name,
    tag: rawTag || null,
    region,
    description: description || null,
    recruiting: fd.get("recruiting") === "on",
    openRoles,
  };
}

/**
 * The profile must carry a Discord username before joining or creating a
 * team. If it is missing, the form may supply one inline.
 */
async function ensureDiscord(fd: FormData): Promise<void> {
  const profile = await syncProfile();
  if (profile.discordUsername) return;
  const raw = cleanDiscord(str(fd, "discordUsername"));
  if (!raw) throw new FieldError("discord-required", "discordUsername");
  if (!DISCORD_RE.test(raw)) throw new FieldError("invalid-discord", "discordUsername");
  await setDiscordUsername(raw);
}

function failWithField(e: unknown): ActionState {
  const base = fail(e);
  if (base && !base.ok && e instanceof FieldError) return { ...base, field: e.field };
  return base;
}

function randomSuffix(len = 4): string {
  const bytes = crypto.getRandomValues(new Uint8Array(len));
  return Array.from(bytes, (b) => "abcdefghijklmnopqrstuvwxyz0123456789"[b % 36]).join("");
}

/** 32 random bytes, base64url without padding (43 chars). */
function inviteToken(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/* ── Create ──────────────────────────────────────────────────────────────── */

export async function createTeam(_prev: ActionState, fd: FormData): Promise<ActionState> {
  const locale = readLocale(fd);
  let slug = "";
  try {
    const userId = await requireSignedIn();

    const game = str(fd, "game");
    if (!GAME_KEYS.includes(game)) throw new FieldError("invalid-game", "game");
    const details = parseDetails(fd, game);

    await ensureDiscord(fd);
    if (await getUserTeamForGame(userId, game)) throw new FieldError("one-team-per-game", "game");

    const db = await getDb();
    const base = slugify(details.name);
    const id = crypto.randomUUID();
    const ts = nowS();

    for (let attempt = 0; attempt < 5 && !slug; attempt++) {
      const candidate = attempt === 0 && !RESERVED_SLUGS.includes(base) ? base : `${base}-${randomSuffix()}`;
      try {
        // Atomic: the team never exists without its captain as a member.
        await db.batch([
          db.insert(teams).values({ id, slug: candidate, game, captainId: userId, createdAt: ts, updatedAt: ts, ...details }),
          db.insert(teamMembers).values({ teamId: id, userId, game, role: null, joinedAt: ts }),
        ]);
        slug = candidate;
      } catch (e) {
        if (isUniqueViolation(e, "teams.slug")) continue;
        if (isUniqueViolation(e, "team_members")) throw new FieldError("one-team-per-game", "game");
        throw e;
      }
    }
    if (!slug) throw new TeamError("unknown");
  } catch (e) {
    return failWithField(e);
  }

  revalidateTeams();
  redirect(localePath(locale, `/teams/${slug}`));
}

/* ── Captain: edit ───────────────────────────────────────────────────────── */

export async function updateTeam(_prev: ActionState, fd: FormData): Promise<ActionState> {
  try {
    const { team } = await requireCaptain(str(fd, "teamId"));
    const details = parseDetails(fd, team.game);
    const db = await getDb();
    await db.update(teams).set({ ...details, updatedAt: nowS() }).where(eq(teams.id, team.id));
  } catch (e) {
    return failWithField(e);
  }
  revalidateTeams();
  return { ok: true, notice: "saved" };
}

/* ── Member: role / leave ────────────────────────────────────────────────── */

export async function setOwnRole(_prev: ActionState, fd: FormData): Promise<ActionState> {
  try {
    const { userId, team } = await requireMember(str(fd, "teamId"));
    const role = str(fd, "role");
    if (role && !rolesFor(team.game).includes(role)) throw new FieldError("invalid-role", "role");
    const db = await getDb();
    await db
      .update(teamMembers)
      .set({ role: role || null })
      .where(and(eq(teamMembers.teamId, team.id), eq(teamMembers.userId, userId)));
  } catch (e) {
    return failWithField(e);
  }
  revalidateTeams();
  return { ok: true, notice: "role-saved" };
}

export async function leaveTeam(_prev: ActionState, fd: FormData): Promise<ActionState> {
  try {
    const { userId, team, isCaptain } = await requireMember(str(fd, "teamId"));
    if (isCaptain) throw new TeamError("captain-cannot-leave");
    const db = await getDb();
    await db.delete(teamMembers).where(and(eq(teamMembers.teamId, team.id), eq(teamMembers.userId, userId)));
  } catch (e) {
    return fail(e);
  }
  revalidateTeams();
  return { ok: true };
}

/* ── Captain: roster ─────────────────────────────────────────────────────── */

export async function removeMember(_prev: ActionState, fd: FormData): Promise<ActionState> {
  try {
    const { userId, team } = await requireCaptain(str(fd, "teamId"));
    const target = str(fd, "userId");
    if (!target) throw new TeamError("invalid-input");
    if (target === userId) throw new TeamError("cannot-remove-self");
    const db = await getDb();
    const res = await db
      .delete(teamMembers)
      .where(and(eq(teamMembers.teamId, team.id), eq(teamMembers.userId, target)))
      .returning({ userId: teamMembers.userId });
    if (res.length === 0) throw new TeamError("not-a-member");
  } catch (e) {
    return fail(e);
  }
  revalidateTeams();
  return { ok: true };
}

export async function transferCaptaincy(_prev: ActionState, fd: FormData): Promise<ActionState> {
  try {
    const { userId, team } = await requireCaptain(str(fd, "teamId"));
    const target = str(fd, "userId");
    if (!target || target === userId) throw new FieldError("invalid-input", "userId");
    if (!(await getMembership(team.id, target))) throw new FieldError("not-a-member", "userId");
    const db = await getDb();
    // Conditional on the caller still being captain, so two racing transfers can't both win.
    const res = await db
      .update(teams)
      .set({ captainId: target, updatedAt: nowS() })
      .where(and(eq(teams.id, team.id), eq(teams.captainId, userId)))
      .returning({ id: teams.id });
    if (res.length === 0) throw new TeamError("forbidden");
  } catch (e) {
    return failWithField(e);
  }
  revalidateTeams();
  return { ok: true };
}

/* ── Captain: invites ────────────────────────────────────────────────────── */

export async function createInvite(_prev: ActionState, fd: FormData): Promise<ActionState> {
  try {
    const { userId, team } = await requireCaptain(str(fd, "teamId"));
    const days = Number(str(fd, "days"));
    const maxUses = Number(str(fd, "maxUses"));
    if (!(INVITE_EXPIRY_DAYS as readonly number[]).includes(days)) throw new FieldError("invalid-input", "days");
    if (!(INVITE_MAX_USES as readonly number[]).includes(maxUses)) throw new FieldError("invalid-input", "maxUses");

    const token = inviteToken();
    const ts = nowS();
    const db = await getDb();
    await db.insert(teamInvites).values({
      token,
      teamId: team.id,
      createdBy: userId,
      expiresAt: ts + days * 86_400,
      maxUses,
      uses: 0,
      revoked: false,
      createdAt: ts,
    });
    revalidateTeams();
    return { ok: true, notice: "invite-created", inviteToken: token };
  } catch (e) {
    return failWithField(e);
  }
}

export async function revokeInvite(_prev: ActionState, fd: FormData): Promise<ActionState> {
  try {
    const token = str(fd, "token");
    const db = await getDb();
    const invite = token ? await db.query.teamInvites.findFirst({ where: eq(teamInvites.token, token) }) : undefined;
    if (!invite) throw new TeamError("not-found");
    await requireCaptain(invite.teamId);
    await db.update(teamInvites).set({ revoked: true }).where(eq(teamInvites.token, token));
  } catch (e) {
    return fail(e);
  }
  revalidateTeams();
  return { ok: true };
}

/* ── Captain: disband ────────────────────────────────────────────────────── */

export async function disbandTeam(_prev: ActionState, fd: FormData): Promise<ActionState> {
  const locale = readLocale(fd);
  try {
    const { team } = await requireCaptain(str(fd, "teamId"));
    if (str(fd, "confirmName").trim() !== team.name) throw new FieldError("confirm-mismatch", "confirmName");
    const db = await getDb();
    await db.batch([
      db.delete(teamInvites).where(eq(teamInvites.teamId, team.id)),
      db.delete(teamMembers).where(eq(teamMembers.teamId, team.id)),
      db.delete(teams).where(eq(teams.id, team.id)),
    ]);
  } catch (e) {
    return failWithField(e);
  }
  revalidateTeams();
  redirect(localePath(locale, "/teams"));
}

/* ── Join via invite ─────────────────────────────────────────────────────── */

export async function joinTeam(_prev: ActionState, fd: FormData): Promise<ActionState> {
  const locale = readLocale(fd);
  let slug = "";
  try {
    const userId = await requireSignedIn();
    const token = str(fd, "token");

    const found = await lookupInvite(token);
    if (found.status !== "ok") throw new TeamError("invite-invalid");
    const { team } = found;

    if (await getMembership(team.id, userId)) throw new TeamError("already-member");
    if (await getUserTeamForGame(userId, team.game)) throw new TeamError("one-team-per-game");
    await ensureDiscord(fd);

    /* One D1 batch = one transaction. The INSERT only fires while the invite
     * is still valid, and the UPDATE claims a use under the same conditions
     * (uses < max_uses), so concurrent joins can never exceed max uses. A
     * UNIQUE(user, game) violation rolls both back. */
    const db = await getDb();
    const d1 = db.$client;
    const valid = "i.revoked = 0 AND i.expires_at > unixepoch() AND i.uses < i.max_uses";
    const [ins] = await d1.batch([
      d1
        .prepare(
          `INSERT INTO team_members (team_id, user_id, game, role, joined_at)
           SELECT t.id, ?1, t.game, NULL, unixepoch()
           FROM team_invites i JOIN teams t ON t.id = i.team_id
           WHERE i.token = ?2 AND ${valid}`,
        )
        .bind(userId, token),
      d1
        .prepare(`UPDATE team_invites AS i SET uses = uses + 1 WHERE i.token = ?1 AND ${valid}`)
        .bind(token),
    ]);
    if (!ins.meta.changes) throw new TeamError("invite-invalid");
    slug = team.slug;
  } catch (e) {
    if (isUniqueViolation(e, "team_members.team_id")) return { ok: false, error: "already-member" };
    return failWithField(e);
  }
  revalidateTeams();
  redirect(localePath(locale, `/teams/${slug}`));
}

/* ── Account: Discord username ───────────────────────────────────────────── */

export async function saveDiscordUsername(_prev: ActionState, fd: FormData): Promise<ActionState> {
  try {
    await requireSignedIn();
    const raw = cleanDiscord(str(fd, "discordUsername"));
    if (!raw) throw new FieldError("discord-required", "discordUsername");
    if (!DISCORD_RE.test(raw)) throw new FieldError("invalid-discord", "discordUsername");
    await setDiscordUsername(raw);
  } catch (e) {
    return failWithField(e);
  }
  revalidateTeams();
  const next = safeNextPath(str(fd, "next"));
  if (next) redirect(next);
  return { ok: true, notice: "saved" };
}

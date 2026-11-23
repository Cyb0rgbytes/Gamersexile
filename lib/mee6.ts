import "server-only";

/* ═══════════════════════════════════════════════════════════════════════════
 *  MEE6 LEADERBOARD
 *  Reads MEE6's public (unofficial) levels API for the community's server:
 *
 *    GET https://mee6.xyz/api/plugins/levels/leaderboard/{GUILD_ID}?page=0&limit=100
 *
 *  The guild id is the NUMERIC Discord server id, set as MEE6_GUILD_ID
 *  (wrangler.jsonc `vars` in production, .env.local in dev). MEE6 does not
 *  resolve the vanity slug ("gamersexile") on this endpoint — it 404s.
 *
 *  Cached with `fetch(..., { next: { revalidate: 600 } })`, so MEE6 is hit at
 *  most once every 10 minutes per deployment (the ISR / R2 incremental cache
 *  holds the response in between). The response is validated by hand: any
 *  unexpected shape, timeout, or HTTP error returns `{ ok: false }` and the
 *  page shows its fallback panel. This module never throws.
 * ═══════════════════════════════════════════════════════════════════════════ */

export const MEE6_PUBLIC_URL = "https://mee6.xyz/en/gamersexile";
export const MEE6_REVALIDATE_SECONDS = 600;

const API = "https://mee6.xyz/api/plugins/levels/leaderboard";
const LIMIT = 100;
const TIMEOUT_MS = 8000;

export interface Mee6Player {
  id: string;
  username: string;
  avatarUrl: string | null;
  level: number;
  /** Total XP. */
  xp: number;
  /** XP earned inside the current level. */
  xpIntoLevel: number;
  /** XP the current level needs in total to reach the next one. */
  xpForLevel: number;
  messageCount: number;
  rank: number;
}

export interface Mee6RoleReward {
  rank: number;
  roleName: string;
  /** Discord role colour as #rrggbb, or null when the role has no colour. */
  color: string | null;
}

export type Mee6Result =
  | {
      ok: true;
      guildName: string | null;
      players: Mee6Player[];
      roleRewards: Mee6RoleReward[];
      fetchedAt: string;
    }
  | { ok: false; reason: "not-configured" | "unavailable" };

/* ── Validation helpers ──────────────────────────────────────────────────── */

type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);
const num = (v: unknown): number | null =>
  typeof v === "number" && Number.isFinite(v) ? v : typeof v === "string" && /^\d+$/.test(v) ? Number(v) : null;
const str = (v: unknown): string | null => (typeof v === "string" && v.length > 0 ? v : null);

/** Discord ids are snowflakes; avatar hashes are hex (animated ones start "a_"). */
const SNOWFLAKE = /^\d{15,21}$/;
const AVATAR_HASH = /^(a_)?[a-f0-9]{16,64}$/i;

export function discordAvatarUrl(id: string, hash: string | null | undefined, size = 64): string | null {
  if (!hash || !SNOWFLAKE.test(id) || !AVATAR_HASH.test(hash)) return null;
  return `https://cdn.discordapp.com/avatars/${id}/${hash}.webp?size=${size}`;
}

function parsePlayer(raw: unknown, index: number): Mee6Player | null {
  if (!isObj(raw)) return null;
  const id = str(raw.id);
  const username = str(raw.username);
  const level = num(raw.level);
  const xp = num(raw.xp);
  if (!id || !username || level === null || xp === null) return null;

  let xpIntoLevel = 0;
  let xpForLevel = 0;
  if (Array.isArray(raw.detailed_xp) && raw.detailed_xp.length >= 2) {
    xpIntoLevel = num(raw.detailed_xp[0]) ?? 0;
    xpForLevel = num(raw.detailed_xp[1]) ?? 0;
  }

  return {
    id,
    username,
    avatarUrl: discordAvatarUrl(id, str(raw.avatar)),
    level,
    xp,
    xpIntoLevel,
    xpForLevel,
    messageCount: num(raw.message_count) ?? 0,
    rank: index + 1,
  };
}

function parseRoleReward(raw: unknown): Mee6RoleReward | null {
  if (!isObj(raw)) return null;
  const rank = num(raw.rank);
  const role = isObj(raw.role) ? raw.role : null;
  const roleName = role ? str(role.name) : null;
  if (rank === null || !roleName) return null;
  const c = role ? num(role.color) : null;
  return { rank, roleName, color: c ? `#${c.toString(16).padStart(6, "0")}` : null };
}

/* ── Fetcher ─────────────────────────────────────────────────────────────── */

export function getGuildId(): string | null {
  const id = process.env.MEE6_GUILD_ID?.trim();
  return id && SNOWFLAKE.test(id) ? id : null;
}

export async function getLeaderboard(): Promise<Mee6Result> {
  const guildId = getGuildId();
  if (!guildId) return { ok: false, reason: "not-configured" };

  try {
    const res = await fetch(`${API}/${guildId}?page=0&limit=${LIMIT}`, {
      headers: { accept: "application/json" },
      signal: AbortSignal.timeout(TIMEOUT_MS),
      next: { revalidate: MEE6_REVALIDATE_SECONDS, tags: ["mee6-leaderboard"] },
    });
    if (!res.ok) return { ok: false, reason: "unavailable" };

    const body: unknown = await res.json();
    if (!isObj(body) || !Array.isArray(body.players)) return { ok: false, reason: "unavailable" };

    const players = body.players
      .slice(0, LIMIT)
      .map(parsePlayer)
      .filter((p): p is Mee6Player => p !== null);

    const roleRewards = (Array.isArray(body.role_rewards) ? body.role_rewards : [])
      .map(parseRoleReward)
      .filter((r): r is Mee6RoleReward => r !== null)
      .sort((a, b) => a.rank - b.rank);

    const guildName = isObj(body.guild) ? str(body.guild.name) : null;

    return { ok: true, guildName, players, roleRewards, fetchedAt: new Date().toISOString() };
  } catch {
    return { ok: false, reason: "unavailable" };
  }
}

/* ═══════════════════════════════════════════════════════════════════════════
 *  TEAMS — shared constants, validation and result types.
 *  Client-safe (no server-only imports): forms use the same limits for their
 *  HTML attributes that the Server Actions enforce.
 * ═══════════════════════════════════════════════════════════════════════════ */

export const REGIONS = ["EU", "NA", "SA", "MENA", "ASIA", "OCE", "GLOBAL"] as const;
export type Region = (typeof REGIONS)[number];
export const isRegion = (v: string): v is Region => (REGIONS as readonly string[]).includes(v);

export const TEAMS_PAGE_SIZE = 24;
/** Roster avatars shown on a browse card. */
export const CARD_AVATARS = 5;

export const NAME_MIN = 3;
export const NAME_MAX = 32;
export const TAG_RE = /^[A-Z0-9]{2,5}$/;
export const TAG_MAX = 5;
export const DESCRIPTION_MAX = 280;
export const SEARCH_MAX = 40;

export const DISCORD_RE = /^[a-z0-9_.]{2,32}$/;
export const DISCORD_MAX = 32;

export const INVITE_EXPIRY_DAYS = [1, 7, 30] as const;
export const INVITE_MAX_USES = [1, 5, 10, 25] as const;

/** Slugs that collide with static routes under /teams. */
export const RESERVED_SLUGS = ["new", "invite"];

/* ── Action results ──────────────────────────────────────────────────────── */

export const TEAM_ERRORS = [
  "auth-disabled",
  "unauthenticated",
  "forbidden",
  "not-found",
  "invalid-input",
  "name-length",
  "tag-format",
  "description-length",
  "invalid-game",
  "invalid-region",
  "invalid-role",
  "one-team-per-game",
  "discord-required",
  "invalid-discord",
  "invite-invalid",
  "already-member",
  "captain-cannot-leave",
  "cannot-remove-self",
  "not-a-member",
  "confirm-mismatch",
  "unknown",
] as const;
export type TeamErrorCode = (typeof TEAM_ERRORS)[number];

export type ActionState =
  | null
  | { ok: true; notice?: "saved" | "invite-created" | "role-saved"; inviteToken?: string }
  | { ok: false; error: TeamErrorCode; field?: string };

/* ── Helpers ─────────────────────────────────────────────────────────────── */

/** Normalise a Discord username the way setDiscordUsername stores it. */
export const cleanDiscord = (v: string) => v.trim().replace(/^@/, "").toLowerCase();

/** Only same-site relative paths survive; anything else becomes null. */
export function safeNextPath(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const v = raw.trim();
  if (!v.startsWith("/") || v.startsWith("//") || v.startsWith("/\\") || v.length > 512) return null;
  if (/[\r\n\t]/.test(v)) return null;
  return v;
}

/** URL-safe slug from a team name. Non-latin names fall back to "team". */
export function slugify(name: string): string {
  const s = name
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40)
    .replace(/-+$/g, "");
  return s.length >= 2 ? s : "team";
}

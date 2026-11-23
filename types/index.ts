/* ═══════════════════════════════════════════════════════════════════════════
 *  SHARED TYPES
 *  Every lib/*.ts constant satisfies one of these. Content is static and
 *  typed, so a copy change is a one-file edit and the compiler catches a
 *  missing field before it reaches a page.
 * ═══════════════════════════════════════════════════════════════════════════ */

/**
 * A label that renders in both scripts. `en` is the translated label (the
 * name is historical: it carries whatever language the page is in). `jp` is
 * the accent layer — it sits above or beside the label in every language,
 * never replaces it. `romaji` is optional and used only where the
 * pronunciation adds something (section eyebrows).
 */
export interface BilingualLabel {
  en: string;
  jp: string;
  romaji?: string;
}

/** The Japanese accent layer on its own; the translated copy comes from the
 *  dictionary, keyed by the item's `key`. */
export interface JpAccent {
  jp: string;
  romaji?: string;
}

export type TournamentStatus = "upcoming" | "live" | "finished";

export interface Tournament {
  slug: string;
  title: string;
  jp: string;
  game: string;
  status: TournamentStatus;
  /** ISO 8601. Drives <Countdown>. Must parse in every browser — use Z. */
  startsAt: string;
  format: string;
  prizePool?: string;
  teamCount: number;
  region: string;
  /** 0–360. Seeds the procedural card gradient so no two cards match. */
  hue: number;
  featured?: boolean;
  /** Hours the event runs after `startsAt` before it counts as finished. Default 8. */
  durationHours?: number;
  /** Real art later is a data change, not a rewrite. */
  imageUrl?: string;
  /** Only for status: "finished". */
  result?: {
    champion: string;
    runnerUp: string;
    score: string;
  };
}

/** Authored data: `status` is derived from the schedule, not written by hand. */
export type TournamentSeed = Omit<Tournament, "status">;

export type CreatorRole = "streamer" | "content" | "player" | "founder";

export interface Creator {
  slug: string;
  handle: string;
  name: string;
  role: CreatorRole;
  games: string[];
  platforms: {
    twitch?: string;
    youtube?: string;
    tiktok?: string;
    x?: string;
  };
  blurb: string;
  isLive?: boolean;
  hue: number;
  avatarUrl?: string;
}

/** Genre keys. Labels live in dictionaries/<lang>/common.json under "genres". */
export type GenreKey =
  | "tacticalFps"
  | "battleRoyale"
  | "moba"
  | "sports"
  | "fighting"
  | "heroShooter"
  | "actionRpg"
  | "rpg"
  | "mmorpg"
  | "sandbox"
  | "coopShooter"
  | "everythingElse";

/** Platform keys. Labels live in common.json under "platforms". */
export type PlatformKey = "PC" | "Console" | "Mobile";

export interface Game {
  /** Stable id stored in the database. */
  key: string;
  /** In-game role keys used by teams. */
  roles: readonly string[];
  /** Proper noun: never translated. */
  name: string;
  jp: string;
  genre: GenreKey;
  platforms: PlatformKey[];
  hue: number;
}

export interface CommunityEvent {
  title: string;
  jp: string;
  day: string;
  time: string;
  blurb: string;
  /** Kanji stamped into the row's seal. */
  seal: string;
}

/** Copy: community.values.items[key]. */
export type ValueKey = "respect" | "noToxicity" | "mentors" | "celebrate";

export interface Value extends JpAccent {
  key: ValueKey;
  /** Single kanji for the hanko stamp. */
  seal: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

/** Copy: home.pillars.items[key]. */
export type PillarKey = "esports" | "streaming" | "games" | "community";

export interface Pillar extends JpAccent {
  key: PillarKey;
  seal: string;
  href: string;
}

/** A bracket match. `null` in a slot means "winner not yet decided". */
export interface BracketMatch {
  id: string;
  round: string;
  teamA: string | null;
  teamB: string | null;
  scoreA?: number;
  scoreB?: number;
  /** "a" | "b" — which side advanced. Undefined while unplayed. */
  winner?: "a" | "b";
}

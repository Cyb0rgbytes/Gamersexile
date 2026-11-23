/* ═══════════════════════════════════════════════════════════════════════════
 *  GIVEAWAYS
 *  Past giveaways and their winners, shown on /winners. Add one entry per
 *  giveaway to GIVEAWAYS below; order does not matter (the page sorts newest
 *  first and groups by month). Empty = the page shows its "Coming soon" panel.
 *
 *  `prize` is a proper noun and is NOT translated. Only list winners who have
 *  agreed to be shown publicly. Avatar: give `discordId` + `avatar` (the
 *  avatar hash from Discord) to show their Discord picture; otherwise the
 *  page draws a monogram from the name.
 * ═══════════════════════════════════════════════════════════════════════════ */

export interface GiveawayWinner {
  /** Display name as it should appear publicly. */
  name: string;
  /** Discord user id (numeric snowflake). */
  discordId?: string;
  /** Discord avatar hash, e.g. "a1b2c3…" (used with discordId). */
  avatar?: string;
}

export interface Giveaway {
  /** Unique slug, used as the React key and the JSON-LD @id. */
  id: string;
  /** When the giveaway was drawn. ISO 8601: "2026-12-05" or "2026-12-05T20:00:00Z". */
  date: string;
  /** What was given away, e.g. "Valorant Points 1000". Kept as-is in every language. */
  prize: string;
  winners: GiveawayWinner[];
  /** Who provided the prize, if not the server itself. */
  sponsor?: string;
  /** Link to the announcement message (Discord message link or post). */
  announcementUrl?: string;
  /** Approximate value in USD; drives the "total prize value" stat. */
  valueUsd?: number;
}

export const GIVEAWAYS: Giveaway[] = [
  /* None drawn yet. Example entry:
   *
   * {
   *   id: "valorant-points-2026-12",
   *   date: "2026-12-05",
   *   prize: "Valorant Points 1000",
   *   winners: [
   *     { name: "PlayerOne", discordId: "123456789012345678", avatar: "a1b2c3d4e5f60718293a4b5c6d7e8f90" },
   *     { name: "PlayerTwo" },
   *   ],
   *   sponsor: "Gamer's Exile",                          // optional
   *   announcementUrl: "https://discord.com/channels/…", // optional
   *   valueUsd: 10,                                      // optional
   * },
   */
];

const time = (g: Giveaway) => {
  const t = Date.parse(g.date);
  return Number.isNaN(t) ? 0 : t;
};

/** Newest first. */
export const SORTED_GIVEAWAYS: Giveaway[] = [...GIVEAWAYS].sort((a, b) => time(b) - time(a));

export const GIVEAWAY_STATS = {
  giveaways: GIVEAWAYS.length,
  winners: GIVEAWAYS.reduce((n, g) => n + g.winners.length, 0),
  /** null when no giveaway carries a value. */
  valueUsd: GIVEAWAYS.some((g) => typeof g.valueUsd === "number")
    ? GIVEAWAYS.reduce((n, g) => n + (g.valueUsd ?? 0), 0)
    : null,
};

/** Group by calendar month (UTC), newest month first. Key is "YYYY-MM". */
export function groupByMonth(list: Giveaway[]): { key: string; items: Giveaway[] }[] {
  const groups = new Map<string, Giveaway[]>();
  for (const g of list) {
    const d = new Date(time(g));
    const key = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
    const bucket = groups.get(key);
    if (bucket) bucket.push(g);
    else groups.set(key, [g]);
  }
  return [...groups.entries()].map(([key, items]) => ({ key, items }));
}

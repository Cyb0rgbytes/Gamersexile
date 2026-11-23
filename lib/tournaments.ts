import type { Tournament, TournamentSeed, TournamentStatus, BracketMatch } from "@/types";

/* ═══════════════════════════════════════════════════════════════════════════
 *  TOURNAMENTS
 *  Add real events to TOURNAMENT_SEEDS below. `status` is derived from `startsAt` (and
 *  `durationHours`, default 8) when the site is built, so a past date never
 *  shows as "upcoming". A tournament with a `result` is always finished.
 * ═══════════════════════════════════════════════════════════════════════════ */

const TOURNAMENT_SEEDS: TournamentSeed[] = [
  /* None announced yet. Every tournament section shows a "Coming Soon" state
   * until entries are added here. Example entry:
   *
   * {
   *   slug: "exile-open-season-1",            // unique, used as the React key
   *   title: "Exile Open · Season 1",
   *   jp: "第一回 追放杯",                     // last word is the brush banner
   *   game: "Valorant",
   *   startsAt: "2027-01-16T18:00:00Z",       // UTC; drives upcoming/live/finished
   *   durationHours: 8,                       // optional, default 8
   *   format: "5v5 Double Elimination",
   *   prizePool: "$500",                      // optional
   *   teamCount: 16,
   *   region: "EU / NA",
   *   hue: 348,                               // card colour, 0-360
   *   featured: true,                         // headline it on the home page
   *   // After it ends, add the result to list it under Previous Champions:
   *   // result: { champion: "Team A", runnerUp: "Team B", score: "3 — 1" },
   * },
   */
];


const DEFAULT_DURATION_HOURS = 8;

/** Derive upcoming / live / finished from the schedule rather than trusting data. */
export function getTournamentStatus(
  t: TournamentSeed,
  now: number = Date.now(),
): TournamentStatus {
  if (t.result) return "finished";
  const start = Date.parse(t.startsAt);
  if (Number.isNaN(start)) return "upcoming";
  const end = start + (t.durationHours ?? DEFAULT_DURATION_HOURS) * 3_600_000;
  if (now < start) return "upcoming";
  return now < end ? "live" : "finished";
}

export const TOURNAMENTS: Tournament[] = TOURNAMENT_SEEDS.map((t) => ({
  ...t,
  status: getTournamentStatus(t),
}));
/** The home-page headliner: a featured event that hasn't finished, else the
 *  soonest upcoming or live one. `null` when nothing is scheduled, and the
 *  home page then shows its "Coming Soon" panel. Never a finished event. */
export const FEATURED_TOURNAMENT: Tournament | null = (() => {
  const open = TOURNAMENTS.filter((t) => t.status !== "finished").sort(
    (a, b) => Date.parse(a.startsAt) - Date.parse(b.startsAt),
  );
  return open.find((t) => t.featured) ?? open[0] ?? null;
})();

export const UPCOMING_TOURNAMENTS = TOURNAMENTS.filter(
  (t) => t.status === "upcoming",
);

export const LIVE_TOURNAMENTS = TOURNAMENTS.filter((t) => t.status === "live");

export const FINISHED_TOURNAMENTS = TOURNAMENTS.filter(
  (t) => t.status === "finished",
);

/* ── Bracket ──────────────────────────────────────────────────────────────
 * Optional showcase of one event's top-8 bracket on the Tournaments page.
 * Empty = the section is hidden. Rounds render as columns; `winner` ("a" or
 * "b") drives the crimson highlight. Example round:
 *
 * { name: "Grand Final", jp: "決勝", matches: [
 *   { id: "gf", round: "gf", teamA: "Team A", teamB: "Team B", scoreA: 3, scoreB: 1, winner: "a" },
 * ] },
 */
export const BRACKET_ROUNDS: { name: string; jp: string; matches: BracketMatch[] }[] = [];

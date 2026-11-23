import type { Creator, CreatorRole } from "@/types";

/* ═══════════════════════════════════════════════════════════════════════════
 *  CREATORS
 *  Role labels and perk copy live in dictionaries/<lang>/creators.json.
 *  Add the real roster to CREATORS below. `hue` seeds each card's procedural gradient
 *  and monogram tile, so keep them spread across the wheel for variety.
 * ═══════════════════════════════════════════════════════════════════════════ */

export const CREATORS: Creator[] = [
  /* None added yet. The roster and the home-page spotlight show "Coming Soon"
   * cards until entries are added here. Example entry:
   *
   * {
   *   slug: "handle",                         // unique
   *   handle: "HANDLE",                       // shown on the card
   *   name: "Handle",                         // first two letters = monogram
   *   role: "streamer",                       // streamer | content | player | founder
   *   games: ["Valorant"],
   *   platforms: { twitch: "https://twitch.tv/handle" },  // twitch, youtube, x, tiktok
   *   blurb: "One or two sentences about what they make.",
   *   isLive: false,                          // true shows the Live badge
   *   hue: 348,                               // card colour, 0-360
   * },
   */
];

/** Shown in place of creator cards while the roster is empty. */
export const CREATOR_PLACEHOLDERS = [
  { hue: 348, kanji: "配" },
  { hue: 270, kanji: "映" },
  { hue: 205, kanji: "創" },
  { hue: 18, kanji: "闘" },
];

export const LIVE_CREATORS = CREATORS.filter((c) => c.isLive);

/** Ordered so the roster grid puts live creators first without a re-sort. */
export const CREATORS_LIVE_FIRST = [
  ...CREATORS.filter((c) => c.isLive),
  ...CREATORS.filter((c) => !c.isLive),
];

/** Roster filter chips. Labels: creators.filters[key]. */
export const ROLE_FILTERS: { key: CreatorRole | "all"; jp: string }[] = [
  { key: "all", jp: "全員" },
  { key: "streamer", jp: "配信者" },
  { key: "content", jp: "制作者" },
  { key: "player", jp: "選手" },
  { key: "founder", jp: "創設者" },
];

/** What the community actually gives creators — used on the Creators page.
 *  Copy: creators.perks.items[key]. */
export const CREATOR_PERKS = [
  { key: "collabs", jp: "合同配信" },
  { key: "chat", jp: "応援" },
  { key: "clips", jp: "紹介" },
  { key: "feedback", jp: "助言" },
] as const;

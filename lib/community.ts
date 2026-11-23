import type { CommunityEvent, Pillar, Value } from "@/types";

/* ═══════════════════════════════════════════════════════════════════════════
 *  COMMUNITY CONTENT
 *  Structure only: keys, seals, links and the Japanese accent layer. Every
 *  translated word lives in the dictionaries (home.json, community.json,
 *  join.json, tournaments.json), looked up by each item's `key`.
 * ═══════════════════════════════════════════════════════════════════════════ */

/** Hero stats row. Real Discord figures only. Update them as they change.
 *  `value: null` renders the translated "Soon" (home.hero.soon). Labels:
 *  home.hero.highlights[key]. */
export const HIGHLIGHTS = [
  { key: "members", value: "687", jp: "仲間" },
  { key: "tournaments", value: null, jp: "大会" },
  { key: "creators", value: "5+", jp: "配信者" },
] as const;

/** Copy: home.pillars.items[key]. */
export const PILLARS: Pillar[] = [
  { key: "esports", jp: "大会", romaji: "taikai", seal: "戦", href: "/tournaments" },
  { key: "streaming", jp: "配信", romaji: "haishin", seal: "映", href: "/creators" },
  { key: "games", jp: "遊戯", romaji: "yūgi", seal: "遊", href: "/community" },
  { key: "community", jp: "仲間", romaji: "nakama", seal: "絆", href: "/join" },
];

/** Copy: community.values.items[key]. */
export const VALUES: Value[] = [
  { key: "respect", jp: "敬意", romaji: "keii", seal: "礼" },
  { key: "noToxicity", jp: "無毒", romaji: "mudoku", seal: "禁" },
  { key: "mentors", jp: "師弟", romaji: "shitei", seal: "導" },
  { key: "celebrate", jp: "称賛", romaji: "shōsan", seal: "祝" },
];

export const EVENTS: CommunityEvent[] = [
  /* None announced yet. The Community page shows a "Coming Soon" row until
   * entries are added here. Event copy is content, not UI, and is shown as
   * written in every language. Example entry:
   *
   * {
   *   title: "Community Night",
   *   jp: "交流の夜",                          // small Japanese label
   *   day: "Saturday",
   *   time: "19:00 UTC",
   *   blurb: "One or two sentences about the activity.",
   *   seal: "集",                              // single kanji in the red seal
   * },
   */
];

/** Join page "who belongs" grid. Copy: join.belonging.items[key]. */
export const BELONGING = [
  { key: "skill", jp: "全階級" },
  { key: "platform", jp: "全機種" },
  { key: "genre", jp: "全種類" },
  { key: "timezone", jp: "全時間" },
] as const;

/** Join page steps. Copy: join.steps[key]. */
export const JOIN_STEPS = [
  { key: "discord", n: "01", jp: "参加" },
  { key: "roles", n: "02", jp: "選択" },
  { key: "intro", n: "03", jp: "挨拶" },
] as const;

/** Tournament entry steps. Copy: tournaments.enter.steps[key]. */
export const ENTRY_STEPS = [
  { key: "role", n: "01" },
  { key: "register", n: "02" },
  { key: "checkin", n: "03" },
  { key: "play", n: "04" },
] as const;

/** Marquee band: Japanese accents interleaved with home.band[i]. */
export const BAND_JP = ["全ゲーム歓迎", "無毒性", "仲間", "大会"] as const;

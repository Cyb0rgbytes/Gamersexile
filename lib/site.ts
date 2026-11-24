/* ═══════════════════════════════════════════════════════════════════════════
 *  SITE CONFIG
 *  Every outbound link on the site resolves from here. Swap the values in
 *  SITE.social + SITE.discord once and every CTA, footer link and social tile
 *  updates site-wide.
 * ═══════════════════════════════════════════════════════════════════════════ */

export const SITE = {
  name: "Gamer's Exile",
  nameJp: "ゲーマーズ・エグザイル",
  /** The kanji watermark behind the hero. 亡命 = exile. */
  kanji: "亡命",
  /** English only, for language-less contexts (web manifest). Pages read
   *  the localized copy from common.meta in the dictionary. */
  tagline: "Where Legends Are Made",
  taglineJp: "伝説が生まれる場所",
  description:
    "Gamer's Exile is a global community for gamers, streamers and esports players. Tournaments, creator collabs, and a no-toxicity home for every skill level and every genre.",
  /** Canonical domain. gamersexile.org 301s here (next.config.ts), so search
   *  engines see one site, not two duplicates. */
  url: "https://gamersexile.net",
  altDomains: ["gamersexile.org"],

  /**
   * The Discord invite is REAL. The other social handles are still
   * placeholders. Replace them, then set this false.
   * `linksArePlaceholder` drives an in-UI dev-only notice so these cannot ship
   * unnoticed — see components/ui/PlaceholderNotice.tsx.
   */
  linksArePlaceholder: true,

  discord: "https://discord.gg/2enCfJbrMR",

  social: {
    discord: "https://discord.gg/2enCfJbrMR",
    twitch: "https://twitch.tv/gamersexile",
    youtube: "https://youtube.com/@gamersexile",
    x: "https://x.com/gamersexile",
    tiktok: "https://tiktok.com/@gamersexile",
  },

  /** Must be a real mailbox on the .net domain before launch. */
  email: "hello@gamersexile.net",
} as const;

/** Primary navigation. Used by Header, MobileNav and Footer alike. Labels
 *  come from common.nav.<key>; `jp` is the accent layer and never
 *  translated. `bar: true` items sit in the desktop bar, the rest go under
 *  the "More" dropdown (mobile menu and footer list all of them). */
export const NAV = [
  { key: "home", href: "/", jp: "ホーム", bar: true },
  { key: "tournaments", href: "/tournaments", jp: "大会", bar: true },
  { key: "teams", href: "/teams", jp: "チーム", bar: true },
  { key: "clips", href: "/clips", jp: "名場面", bar: true },
  { key: "community", href: "/community", jp: "仲間", bar: true },
  { key: "leaderboard", href: "/leaderboard", jp: "番付", bar: false },
  { key: "creators", href: "/creators", jp: "配信者", bar: false },
  { key: "join", href: "/join", jp: "入隊", bar: false },
] as const;

export type NavItem = (typeof NAV)[number];
export type NavKey = NavItem["key"];

/** Active-state test shared by the header, dropdown and mobile menu.
 *  `pathname` must already have its locale stripped. */
export const isNavActive = (href: string, pathname: string) =>
  href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

/** Social tiles, in display order. `key` maps to the icon switch in SocialIcon. */
export const SOCIAL_LINKS = [
  { key: "discord", label: "Discord", handle: "discord.gg/2enCfJbrMR", href: SITE.social.discord },
  { key: "twitch", label: "Twitch", handle: "@gamersexile", href: SITE.social.twitch },
  { key: "youtube", label: "YouTube", handle: "@gamersexile", href: SITE.social.youtube },
  { key: "x", label: "X", handle: "@gamersexile", href: SITE.social.x },
  { key: "tiktok", label: "TikTok", handle: "@gamersexile", href: SITE.social.tiktok },
] as const;

export type SocialKey = (typeof SOCIAL_LINKS)[number]["key"];

import type { Game } from "@/types";

/* ═══════════════════════════════════════════════════════════════════════════
 *  GAMES
 *  The open-genre philosophy made concrete. Deliberately spans FPS, MOBA,
 *  fighting, RPG, racing and indie — the point of the section is breadth.
 *  `key` is stable and stored in the database (teams, clips): never rename
 *  a key once data exists. `roles` are role keys; their translated labels
 *  live in dictionaries/<lang>/teams.json under "roles". `genre` and
 *  `platforms` are keys too (labels: common.json "genres" / "platforms");
 *  `name` is a proper noun and stays as-is in every language.
 * ═══════════════════════════════════════════════════════════════════════════ */

export const GAMES: Game[] = [
  { key: "valorant", name: "Valorant", roles: ["duelist", "initiator", "controller", "sentinel", "igl"], jp: "ヴァロラント", genre: "tacticalFps", platforms: ["PC"], hue: 348 },
  { key: "apex", name: "Apex Legends", roles: ["assault", "skirmisher", "recon", "support", "controller", "igl"], jp: "エーペックス", genre: "battleRoyale", platforms: ["PC", "Console"], hue: 18 },
  { key: "cs2", name: "Counter-Strike 2", roles: ["entry", "awper", "support", "lurker", "igl"], jp: "カウンターストライク", genre: "tacticalFps", platforms: ["PC"], hue: 200 },
  { key: "lol", name: "League of Legends", roles: ["top", "jungle", "mid", "adc", "support"], jp: "リーグ・オブ・レジェンド", genre: "moba", platforms: ["PC"], hue: 212 },
  { key: "rocket-league", name: "Rocket League", roles: ["striker", "midfield", "defender"], jp: "ロケットリーグ", genre: "sports", platforms: ["PC", "Console"], hue: 158 },
  { key: "sf6", name: "Street Fighter 6", roles: ["player", "sub", "coach"], jp: "ストリートファイター6", genre: "fighting", platforms: ["PC", "Console"], hue: 8 },
  { key: "tekken8", name: "Tekken 8", roles: ["player", "sub", "coach"], jp: "鉄拳8", genre: "fighting", platforms: ["PC", "Console"], hue: 32 },
  { key: "fortnite", name: "Fortnite", roles: ["fragger", "builder", "support", "igl"], jp: "フォートナイト", genre: "battleRoyale", platforms: ["PC", "Console", "Mobile"], hue: 280 },
  { key: "overwatch2", name: "Overwatch 2", roles: ["tank", "dps", "support", "flex", "igl"], jp: "オーバーウォッチ2", genre: "heroShooter", platforms: ["PC", "Console"], hue: 28 },
  { key: "elden-ring", name: "Elden Ring", roles: ["player", "sub", "coach"], jp: "エルデンリング", genre: "actionRpg", platforms: ["PC", "Console"], hue: 42 },
  { key: "bg3", name: "Baldur's Gate 3", roles: ["player", "sub", "coach"], jp: "バルダーズ・ゲート3", genre: "rpg", platforms: ["PC", "Console"], hue: 262 },
  { key: "ffxiv", name: "Final Fantasy XIV", roles: ["tank", "healer", "dps", "raid-lead"], jp: "ファイナルファンタジー14", genre: "mmorpg", platforms: ["PC", "Console"], hue: 222 },
  { key: "minecraft", name: "Minecraft", roles: ["player", "sub", "coach"], jp: "マインクラフト", genre: "sandbox", platforms: ["PC", "Console", "Mobile"], hue: 118 },
  { key: "helldivers2", name: "Helldivers 2", roles: ["assault", "support", "anti-tank", "medic"], jp: "ヘルダイバー2", genre: "coopShooter", platforms: ["PC", "Console"], hue: 48 },
  { key: "marvel-rivals", name: "Marvel Rivals", roles: ["vanguard", "duelist", "strategist", "flex"], jp: "マーベル・ライバルズ", genre: "heroShooter", platforms: ["PC", "Console"], hue: 340 },
  { key: "indie", name: "Indie & Roguelikes", roles: ["player", "sub", "coach"], jp: "インディー", genre: "everythingElse", platforms: ["PC"], hue: 172 },
];

/** Look up a game by its stable key (the value stored in the database). */
export const gameByKey = (key: string) => GAMES.find((g) => g.key === key);

export const GAME_KEYS = GAMES.map((g) => g.key);

/** Generic roles for games without a specific list. Labels: teams.roles.<key>. */
export const FALLBACK_ROLES = ["player", "sub", "coach"] as const;

export const rolesFor = (key: string): readonly string[] => gameByKey(key)?.roles ?? FALLBACK_ROLES;

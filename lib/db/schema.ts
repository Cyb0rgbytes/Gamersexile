import { sql } from "drizzle-orm";
import { index, integer, primaryKey, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

/* ═══════════════════════════════════════════════════════════════════════════
 *  DATABASE SCHEMA (Cloudflare D1 / SQLite)
 *  User ids are Clerk user ids ("user_…"). Timestamps are unix seconds.
 *  After editing: `npm run db:generate` then `npm run db:migrate:local`.
 * ═══════════════════════════════════════════════════════════════════════════ */

const now = sql`(unixepoch())`;

/* ── Profiles ──────────────────────────────────────────────────────────────
 * A local copy of what other members may see, so team rosters and clip
 * cards render without a Clerk API call per user. Upserted on sign-in
 * activity (see lib/auth). `discordUsername` is required to join a team. */
export const profiles = sqliteTable("profiles", {
  userId: text("user_id").primaryKey(),
  displayName: text("display_name").notNull(),
  avatarUrl: text("avatar_url"),
  discordUsername: text("discord_username"),
  createdAt: integer("created_at").notNull().default(now),
  updatedAt: integer("updated_at").notNull().default(now),
});

/* ── Teams ─────────────────────────────────────────────────────────────── */
export const teams = sqliteTable(
  "teams",
  {
    id: text("id").primaryKey(),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    tag: text("tag"), // short team tag, e.g. "EXL"
    game: text("game").notNull(), // key from lib/games.ts
    region: text("region").notNull(), // "EU" | "NA" | ... (lib/teams/config)
    description: text("description"),
    recruiting: integer("recruiting", { mode: "boolean" }).notNull().default(true),
    /** JSON array of role keys the team is looking for. */
    openRoles: text("open_roles", { mode: "json" }).$type<string[]>().notNull().default(sql`'[]'`),
    captainId: text("captain_id").notNull(),
    createdAt: integer("created_at").notNull().default(now),
    updatedAt: integer("updated_at").notNull().default(now),
  },
  (t) => [
    uniqueIndex("teams_slug_uq").on(t.slug),
    index("teams_game_idx").on(t.game, t.recruiting),
  ],
);

export const teamMembers = sqliteTable(
  "team_members",
  {
    teamId: text("team_id")
      .notNull()
      .references(() => teams.id, { onDelete: "cascade" }),
    userId: text("user_id").notNull(),
    /** Denormalised from teams.game so the DB enforces one team per game. */
    game: text("game").notNull(),
    role: text("role"), // role key for the game, null = unassigned
    joinedAt: integer("joined_at").notNull().default(now),
  },
  (t) => [
    primaryKey({ columns: [t.teamId, t.userId] }),
    uniqueIndex("team_members_user_game_uq").on(t.userId, t.game),
    index("team_members_user_idx").on(t.userId),
  ],
);

export const teamInvites = sqliteTable(
  "team_invites",
  {
    token: text("token").primaryKey(), // 32+ random url-safe chars
    teamId: text("team_id")
      .notNull()
      .references(() => teams.id, { onDelete: "cascade" }),
    createdBy: text("created_by").notNull(),
    expiresAt: integer("expires_at").notNull(),
    maxUses: integer("max_uses").notNull().default(10),
    uses: integer("uses").notNull().default(0),
    revoked: integer("revoked", { mode: "boolean" }).notNull().default(false),
    createdAt: integer("created_at").notNull().default(now),
  },
  (t) => [index("team_invites_team_idx").on(t.teamId)],
);

/* ── Clips ─────────────────────────────────────────────────────────────── */
export const CLIP_STATUSES = ["published", "hidden"] as const;
export const REACTIONS = ["respect", "gg", "hype", "clutch", "lol"] as const;
export type ReactionKind = (typeof REACTIONS)[number];

export const clips = sqliteTable(
  "clips",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull(),
    title: text("title").notNull(),
    game: text("game").notNull(),
    videoKey: text("video_key").notNull(), // R2 key in CLIPS bucket
    thumbKey: text("thumb_key"), // R2 key of the poster frame (webp/jpeg)
    mime: text("mime").notNull(),
    sizeBytes: integer("size_bytes").notNull(),
    durationS: integer("duration_s"),
    status: text("status", { enum: CLIP_STATUSES }).notNull().default("published"),
    reportCount: integer("report_count").notNull().default(0),
    /** Denormalised reaction counts, kept in step by the reaction action. */
    respectCount: integer("respect_count").notNull().default(0),
    ggCount: integer("gg_count").notNull().default(0),
    hypeCount: integer("hype_count").notNull().default(0),
    clutchCount: integer("clutch_count").notNull().default(0),
    lolCount: integer("lol_count").notNull().default(0),
    createdAt: integer("created_at").notNull().default(now),
  },
  (t) => [
    index("clips_status_created_idx").on(t.status, t.createdAt),
    index("clips_game_idx").on(t.game, t.status),
    index("clips_user_idx").on(t.userId, t.createdAt),
  ],
);

/** One reaction per user per clip; changing it updates `kind`. */
export const clipReactions = sqliteTable(
  "clip_reactions",
  {
    clipId: text("clip_id")
      .notNull()
      .references(() => clips.id, { onDelete: "cascade" }),
    userId: text("user_id").notNull(),
    kind: text("kind", { enum: REACTIONS }).notNull(),
    createdAt: integer("created_at").notNull().default(now),
  },
  (t) => [primaryKey({ columns: [t.clipId, t.userId] })],
);

/** One report per user per clip. REPORT_HIDE_THRESHOLD reports auto-hide. */
export const clipReports = sqliteTable(
  "clip_reports",
  {
    clipId: text("clip_id")
      .notNull()
      .references(() => clips.id, { onDelete: "cascade" }),
    userId: text("user_id").notNull(),
    reason: text("reason").notNull(),
    createdAt: integer("created_at").notNull().default(now),
  },
  (t) => [primaryKey({ columns: [t.clipId, t.userId] })],
);

export const REPORT_HIDE_THRESHOLD = 3;

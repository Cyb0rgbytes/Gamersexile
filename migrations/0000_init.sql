CREATE TABLE `clip_reactions` (
	`clip_id` text NOT NULL,
	`user_id` text NOT NULL,
	`kind` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	PRIMARY KEY(`clip_id`, `user_id`),
	FOREIGN KEY (`clip_id`) REFERENCES `clips`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `clip_reports` (
	`clip_id` text NOT NULL,
	`user_id` text NOT NULL,
	`reason` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	PRIMARY KEY(`clip_id`, `user_id`),
	FOREIGN KEY (`clip_id`) REFERENCES `clips`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `clips` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`title` text NOT NULL,
	`game` text NOT NULL,
	`video_key` text NOT NULL,
	`thumb_key` text,
	`mime` text NOT NULL,
	`size_bytes` integer NOT NULL,
	`duration_s` integer,
	`status` text DEFAULT 'published' NOT NULL,
	`report_count` integer DEFAULT 0 NOT NULL,
	`respect_count` integer DEFAULT 0 NOT NULL,
	`gg_count` integer DEFAULT 0 NOT NULL,
	`hype_count` integer DEFAULT 0 NOT NULL,
	`clutch_count` integer DEFAULT 0 NOT NULL,
	`lol_count` integer DEFAULT 0 NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `clips_status_created_idx` ON `clips` (`status`,`created_at`);--> statement-breakpoint
CREATE INDEX `clips_game_idx` ON `clips` (`game`,`status`);--> statement-breakpoint
CREATE INDEX `clips_user_idx` ON `clips` (`user_id`,`created_at`);--> statement-breakpoint
CREATE TABLE `profiles` (
	`user_id` text PRIMARY KEY NOT NULL,
	`display_name` text NOT NULL,
	`avatar_url` text,
	`discord_username` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `team_invites` (
	`token` text PRIMARY KEY NOT NULL,
	`team_id` text NOT NULL,
	`created_by` text NOT NULL,
	`expires_at` integer NOT NULL,
	`max_uses` integer DEFAULT 10 NOT NULL,
	`uses` integer DEFAULT 0 NOT NULL,
	`revoked` integer DEFAULT false NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`team_id`) REFERENCES `teams`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `team_invites_team_idx` ON `team_invites` (`team_id`);--> statement-breakpoint
CREATE TABLE `team_members` (
	`team_id` text NOT NULL,
	`user_id` text NOT NULL,
	`game` text NOT NULL,
	`role` text,
	`joined_at` integer DEFAULT (unixepoch()) NOT NULL,
	PRIMARY KEY(`team_id`, `user_id`),
	FOREIGN KEY (`team_id`) REFERENCES `teams`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `team_members_user_game_uq` ON `team_members` (`user_id`,`game`);--> statement-breakpoint
CREATE INDEX `team_members_user_idx` ON `team_members` (`user_id`);--> statement-breakpoint
CREATE TABLE `teams` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`name` text NOT NULL,
	`tag` text,
	`game` text NOT NULL,
	`region` text NOT NULL,
	`description` text,
	`recruiting` integer DEFAULT true NOT NULL,
	`open_roles` text DEFAULT '[]' NOT NULL,
	`captain_id` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `teams_slug_uq` ON `teams` (`slug`);--> statement-breakpoint
CREATE INDEX `teams_game_idx` ON `teams` (`game`,`recruiting`);
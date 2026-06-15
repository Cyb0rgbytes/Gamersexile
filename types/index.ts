// Game data shape
export interface Game {
  id: string;
  name: string;
  genre: "Tactical FPS" | "Hero Shooter" | "Battle Royale";
  developer: string;
  players: string;
  description: string;
  accentColor: string;
  imagePath: string;
}

// Streamer data shape
export interface Streamer {
  id: number;
  name: string;
  handle: string;
  game: string;
  platform: "twitch" | "youtube" | "tiktok";
  viewers: number;
  isLive: boolean;
  avatar: string;
  followers?: string;
}

// Button variants
export type ButtonVariant = "primary" | "ghost" | "danger";

// Badge variants
export type BadgeVariant = "live" | "platform" | "game";

// Nav link shape
export interface NavLink {
  label: string;
  href: string;
}

// Community activity mock data
export interface CommunityActivity {
  id: number;
  message: string;
  timestamp: string;
  type: "live" | "follow" | "achievement" | "join";
}

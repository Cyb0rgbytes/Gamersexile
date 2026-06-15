import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Exile Streamers — Streamer Directory | Gamers Exile",
  description:
    "Discover streamers on Gamers Exile. Filter by game, platform, and live status. Watch, follow, support.",
};

export default function StreamersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

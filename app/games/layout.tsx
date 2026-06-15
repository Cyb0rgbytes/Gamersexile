import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Arena — Games | Gamers Exile",
  description:
    "Explore the games featured on Gamers Exile. VALORANT, Marvel Rivals, CS2, Overwatch 2 — find your arena.",
};

export default function GamesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

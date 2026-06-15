import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Exile Hub — Community | Gamers Exile",
  description:
    "Join the Gamers Exile community. Discord, tournaments, events, and more. Connect with gamers worldwide.",
};

export default function CommunityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

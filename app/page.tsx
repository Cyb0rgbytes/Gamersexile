import { Hero } from "@/components/sections/Hero";
import { GamesStrip } from "@/components/sections/GamesStrip";
import { StreamersSection } from "@/components/sections/StreamersSection";
import { CommunitySection } from "@/components/sections/CommunitySection";

export default function HomePage() {
  return (
    <>
      <Hero />
      <GamesStrip />
      <StreamersSection />
      <CommunitySection />
    </>
  );
}

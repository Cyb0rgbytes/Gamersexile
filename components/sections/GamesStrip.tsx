"use client";

import { games } from "@/data/games";
import { GameCard } from "@/components/ui/GameCard";
import { SectionHeader } from "@/components/ui/SectionHeader";

export function GamesStrip() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-12 xl:px-24">
      <SectionHeader
        title="Featured Games"
        subtitle="The arenas where legends are forged. Pick your battlefield."
      />

      {/* Desktop: 4-col grid | Mobile: horizontal scroll with snap */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {games.map((game, i) => (
          <GameCard key={game.id} game={game} index={i} />
        ))}
      </div>

      {/* Mobile: horizontal scrollable row */}
      <div className="flex md:hidden gap-4 overflow-x-auto snap-x snap-mandatory pb-4 -mx-4 px-4 scrollbar-hide">
        {games.map((game, i) => (
          <div key={game.id} className="snap-start shrink-0 w-[280px]">
            <GameCard game={game} index={i} />
          </div>
        ))}
      </div>
    </section>
  );
}

"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { games } from "@/data/games";
import { GameCard } from "@/components/ui/GameCard";
import { SectionHeader } from "@/components/ui/SectionHeader";

const genres = ["All", "Tactical FPS", "Hero Shooter"];

export default function GamesPage() {
  const [activeFilter, setActiveFilter] = useState("All");

  const filteredGames = useMemo(() => {
    if (activeFilter === "All") return games;
    return games.filter((g) => g.genre === activeFilter);
  }, [activeFilter]);

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-12 xl:px-24 min-h-screen">
      <SectionHeader
        title="The Arena"
        subtitle="Choose your battlefield. Every game, a different war."
      />

      {/* Filter bar */}
      <div className="flex flex-wrap gap-3 mb-10">
        {genres.map((genre) => (
          <button
            key={genre}
            onClick={() => setActiveFilter(genre)}
            className={`px-5 py-2 font-mono text-xs uppercase tracking-wider rounded-sm border transition-all duration-200 cursor-pointer ${
              activeFilter === genre
                ? "bg-exile-accent text-exile-bg border-exile-accent"
                : "bg-transparent text-exile-muted border-exile-border hover:border-exile-accent/50 hover:text-exile-text"
            }`}
          >
            {genre}
          </button>
        ))}
      </div>

      {/* Game grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        layout
      >
        {filteredGames.map((game, i) => (
          <GameCard key={game.id} game={game} expanded index={i} />
        ))}
      </motion.div>

      {filteredGames.length === 0 && (
        <p className="text-exile-muted text-center font-mono text-sm mt-20">
          No games match this filter. More coming soon.
        </p>
      )}
    </div>
  );
}

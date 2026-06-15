"use client";

import { Game } from "@/types";
import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "./Button";
import { Badge } from "./Badge";
import { Crosshair, Users } from "lucide-react";

interface GameCardProps {
  game: Game;
  expanded?: boolean;
  index?: number;
}

export function GameCard({ game, expanded = false, index = 0 }: GameCardProps) {
  return (
    <motion.div
      className="group relative overflow-hidden rounded-md glow-border bg-exile-surface"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: "easeOut" }}
      whileHover={{ scale: 1.03 }}
    >
      {/* Game image or gradient placeholder */}
      <div
        className={`relative w-full overflow-hidden ${
          expanded ? "h-56 sm:h-64" : "h-48 sm:h-56"
        }`}
      >
        {/* Attempt to show image, fall back to gradient */}
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at center, ${game.accentColor}33 0%, ${game.accentColor}11 40%, transparent 70%)`,
          }}
        />
        <Image
          src={game.imagePath}
          alt={game.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            // Hide the broken image, showing the gradient placeholder instead
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />

        {/* Dark gradient overlay - always present */}
        <div className="absolute inset-0 bg-gradient-to-t from-exile-bg via-exile-bg/60 to-transparent" />

        {/* Game name on the image (for placeholder case) */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="font-display font-bold text-4xl sm:text-5xl uppercase tracking-widest opacity-10"
            style={{ color: game.accentColor }}
          >
            {game.name}
          </span>
        </div>

        {/* Genre badge */}
        <div className="absolute top-3 left-3 z-10">
          <Badge variant="game">{game.genre}</Badge>
        </div>
      </div>

      {/* Card content */}
      <div className="relative z-10 p-5">
        <h3
          className="font-display font-bold text-xl sm:text-2xl uppercase tracking-wide"
          style={{ color: game.accentColor }}
        >
          {game.name}
        </h3>

        <p className="text-exile-muted text-sm mt-1 font-mono">
          {game.genre} — {game.developer}
        </p>

        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-exile-text/80 text-sm mt-3 leading-relaxed">
              {game.description}
            </p>

            <div className="flex items-center gap-4 mt-4 text-sm font-mono text-exile-muted">
              <span className="flex items-center gap-1.5">
                <Users size={14} />
                {game.players}
              </span>
            </div>

            <div className="flex gap-3 mt-5">
              <Button variant="ghost" icon={<Crosshair size={14} />}>
                View Clips
              </Button>
              <Button variant="ghost" icon={<Users size={14} />}>
                Find Players
              </Button>
            </div>
          </motion.div>
        )}

        {/* Hover-reveal explore button (compact mode only) */}
        {!expanded && (
          <div className="mt-4 overflow-hidden">
            <motion.div
              className="translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300"
            >
              <Button variant="primary" href={`/games#${game.id}`}>
                Explore
              </Button>
            </motion.div>
          </div>
        )}
      </div>

      {/* Accent border glow on hover */}
      <div
        className="absolute inset-0 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          boxShadow: `inset 0 0 0 1px ${game.accentColor}66, 0 0 20px ${game.accentColor}22`,
        }}
      />
    </motion.div>
  );
}

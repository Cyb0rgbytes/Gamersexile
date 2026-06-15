"use client";

import { Streamer } from "@/types";
import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "./Button";
import { Badge } from "./Badge";
import { Eye, Tv, Youtube, Smartphone } from "lucide-react";

interface StreamerCardProps {
  streamer: Streamer;
  showFollow?: boolean;
  index?: number;
}

const platformIcons: Record<string, React.ReactNode> = {
  twitch: <Tv size={12} />,
  youtube: <Youtube size={12} />,
  tiktok: <Smartphone size={12} />,
};

const platformColors: Record<string, string> = {
  twitch: "#9146FF",
  youtube: "#FF0000",
  tiktok: "#00F2EA",
};

export function StreamerCard({
  streamer,
  showFollow = false,
  index = 0,
}: StreamerCardProps) {
  // Generate initials for avatar fallback
  const initials = streamer.name
    .split(/(?=[A-Z])/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <motion.div
      className="group relative rounded-md glow-border bg-exile-surface p-5 flex flex-col items-center text-center"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: "easeOut" }}
      whileHover={{ scale: 1.02 }}
    >
      {/* Live indicator */}
      {streamer.isLive && (
        <div className="absolute top-3 right-3">
          <Badge variant="live">LIVE</Badge>
        </div>
      )}

      {/* Avatar */}
      <div className="relative w-20 h-20 rounded-full overflow-hidden mb-4 ring-2 ring-exile-border group-hover:ring-exile-accent/50 transition-all duration-300">
        <Image
          src={streamer.avatar}
          alt={streamer.name}
          fill
          className="object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
        {/* Initials fallback */}
        <div
          className="absolute inset-0 flex items-center justify-center font-display font-bold text-xl text-white"
          style={{
            background: `linear-gradient(135deg, ${
              platformColors[streamer.platform] || "#7B2FFF"
            }, ${platformColors[streamer.platform] || "#7B2FFF"}88)`,
          }}
        >
          {initials}
        </div>
      </div>

      {/* Name & handle */}
      <h3 className="font-display font-bold text-lg uppercase tracking-wide text-exile-text">
        {streamer.name}
      </h3>
      <p className="text-exile-muted text-sm font-mono">@{streamer.handle}</p>

      {/* Game & platform */}
      <div className="flex items-center gap-2 mt-3">
        <Badge variant="game">{streamer.game}</Badge>
        <Badge variant="platform">
          {platformIcons[streamer.platform]}
          {streamer.platform}
        </Badge>
      </div>

      {/* Viewer count (if live) */}
      {streamer.isLive && (
        <div className="flex items-center gap-1.5 mt-3 text-exile-red font-mono text-sm">
          <Eye size={14} />
          <span>{streamer.viewers.toLocaleString()} watching</span>
        </div>
      )}

      {/* Follower count (for directory mode) */}
      {showFollow && streamer.followers && (
        <p className="text-exile-muted text-xs font-mono mt-2">
          {streamer.followers} followers
        </p>
      )}

      {/* Action button */}
      <div className="mt-4 w-full">
        {showFollow ? (
          <Button variant="ghost" className="w-full justify-center text-xs">
            Follow
          </Button>
        ) : streamer.isLive ? (
          <Button variant="primary" className="w-full justify-center text-xs">
            Watch Now
          </Button>
        ) : (
          <Button variant="ghost" className="w-full justify-center text-xs opacity-50">
            Offline
          </Button>
        )}
      </div>

      {/* Dimming overlay for offline streamers */}
      {!streamer.isLive && !showFollow && (
        <div className="absolute inset-0 bg-exile-bg/40 rounded-md pointer-events-none" />
      )}
    </motion.div>
  );
}

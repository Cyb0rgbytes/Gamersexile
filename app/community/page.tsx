"use client";

import { motion } from "framer-motion";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { MessageCircle, Calendar, Trophy, Users, Sparkles } from "lucide-react";

const upcomingEvents = [
  {
    id: 1,
    title: "VALORANT Exile Cup — Season 1",
    date: "Coming Q3 2026",
    type: "Tournament",
  },
  {
    id: 2,
    title: "Community Game Night — CS2",
    date: "Every Friday 9PM GST",
    type: "Event",
  },
  {
    id: 3,
    title: "Streamer Spotlight Awards",
    date: "Coming Soon",
    type: "Community",
  },
];

export default function CommunityPage() {
  return (
    <div className="pt-24 pb-20 min-h-screen">
      {/* Hero banner */}
      <div className="relative px-4 sm:px-6 lg:px-12 xl:px-24 py-16 mb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-exile-accent-2/10 via-exile-bg to-exile-accent/5" />
        <div className="relative z-10">
          <SectionHeader
            title="The Exile Hub"
            subtitle="The community is the heartbeat of Gamers Exile. Connect, compete, and grow with players from around the world."
          />
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-12 xl:px-24 space-y-16">
        {/* Discord section */}
        <motion.div
          className="relative rounded-md overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, #7B2FFF 0%, #4A7DFF 50%, #7B2FFF 100%)",
          }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative z-10 p-8 sm:p-12 flex flex-col md:flex-row items-start md:items-center gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <MessageCircle size={36} className="text-white/90" />
                <h3 className="font-display font-bold text-2xl sm:text-3xl uppercase tracking-wider text-white">
                  Join the Discord
                </h3>
              </div>
              <p className="text-white/80 text-sm max-w-lg leading-relaxed">
                Our Discord is where the real community lives. LFG channels,
                tournament announcements, clip sharing, game discussion, and
                voice lobbies for every game we support.
              </p>
              <div className="flex items-center gap-6 mt-4 font-mono text-sm text-white/60">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-400" />
                  2,847 online
                </span>
                <span className="flex items-center gap-1.5">
                  <Users size={14} />
                  10,432 members
                </span>
              </div>
            </div>
            <Button
              variant="ghost"
              href="#"
              className="border-white/40 text-white hover:border-white hover:text-white hover:bg-white/10 shrink-0"
            >
              Join Now
            </Button>
          </div>
        </motion.div>

        {/* Upcoming events */}
        <div>
          <div className="flex items-center gap-3 mb-8">
            <Calendar size={24} className="text-exile-accent" />
            <h3 className="font-display font-bold text-2xl uppercase tracking-wider text-exile-text">
              Upcoming Events
            </h3>
            <Badge variant="game">Coming Soon</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {upcomingEvents.map((event, i) => (
              <motion.div
                key={event.id}
                className="rounded-md bg-exile-surface border border-exile-border p-6 glow-border"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="flex items-center gap-2 mb-3">
                  {event.type === "Tournament" ? (
                    <Trophy size={16} className="text-exile-accent" />
                  ) : event.type === "Event" ? (
                    <Calendar size={16} className="text-exile-accent-2" />
                  ) : (
                    <Sparkles size={16} className="text-exile-red" />
                  )}
                  <Badge variant="platform">{event.type}</Badge>
                </div>
                <h4 className="font-display font-bold text-lg uppercase tracking-wide text-exile-text">
                  {event.title}
                </h4>
                <p className="text-exile-muted text-sm font-mono mt-2">
                  {event.date}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Coming soon placeholder */}
        <motion.div
          className="text-center py-16 rounded-md border border-dashed border-exile-border bg-exile-surface/50"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <Sparkles size={32} className="text-exile-accent mx-auto mb-4" />
          <h3 className="font-display font-bold text-xl uppercase tracking-wider text-exile-text">
            More Features Coming
          </h3>
          <p className="text-exile-muted text-sm mt-2 max-w-md mx-auto">
            Community leaderboards, clip voting, streamer profiles, and an XP
            system are all in the pipeline. Stay tuned.
          </p>
        </motion.div>
      </div>
    </div>
  );
}

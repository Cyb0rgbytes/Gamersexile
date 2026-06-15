"use client";

import { motion } from "framer-motion";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { MessageCircle, Zap, Trophy, Users, Radio } from "lucide-react";
import { CommunityActivity } from "@/types";

const communityActivity: CommunityActivity[] = [
  { id: 1, message: "xProtoplays just went live on CS2", timestamp: "2m ago", type: "live" },
  { id: 2, message: "NovaMira hit 1,000 followers!", timestamp: "5m ago", type: "achievement" },
  { id: 3, message: "New tournament: VALORANT Exile Cup announced", timestamp: "12m ago", type: "achievement" },
  { id: 4, message: "IronDrift joined the community", timestamp: "18m ago", type: "join" },
  { id: 5, message: "ZeroPulse started streaming Overwatch 2", timestamp: "25m ago", type: "live" },
  { id: 6, message: "Community milestone: 10,000 members!", timestamp: "1h ago", type: "achievement" },
];

const activityIcons: Record<string, React.ReactNode> = {
  live: <Radio size={14} className="text-exile-red" />,
  follow: <Users size={14} className="text-exile-accent" />,
  achievement: <Trophy size={14} className="text-exile-accent-2" />,
  join: <Zap size={14} className="text-exile-accent" />,
};

export function CommunitySection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-12 xl:px-24 relative noise-overlay">
      <div className="relative z-10">
        <SectionHeader
          title="Join the Community"
          subtitle="Connect with gamers and streamers from around the world."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Discord card */}
          <motion.div
            className="relative rounded-md overflow-hidden p-8 flex flex-col justify-between min-h-[280px]"
            style={{
              background:
                "linear-gradient(135deg, #7B2FFF 0%, #4A7DFF 50%, #7B2FFF 100%)",
            }}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {/* Noise overlay on discord card */}
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")",
            }} />

            <div className="relative z-10">
              {/* Discord SVG logo */}
              <div className="mb-6">
                <MessageCircle size={48} className="text-white/90" />
              </div>
              <h3 className="font-display font-bold text-3xl uppercase tracking-wider text-white">
                Join Our Discord
              </h3>
              <p className="text-white/80 mt-3 text-sm max-w-sm">
                Find your squad. Share clips. Talk strategy. The Exile community
                is where gamers come together.
              </p>
              <div className="flex items-center gap-4 mt-4 font-mono text-sm text-white/60">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-400" />
                  2,847 online
                </span>
                <span>10,432 members</span>
              </div>
            </div>

            <div className="relative z-10 mt-6">
              <Button
                variant="ghost"
                href="#"
                className="border-white/40 text-white hover:border-white hover:text-white hover:bg-white/10"
              >
                Join Discord
              </Button>
            </div>
          </motion.div>

          {/* Activity ticker */}
          <motion.div
            className="rounded-md bg-exile-surface border border-exile-border p-6 overflow-hidden"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="font-display font-bold text-lg uppercase tracking-wider text-exile-text mb-5 flex items-center gap-2">
              <Zap size={18} className="text-exile-accent" />
              Recent Activity
            </h3>

            <div className="space-y-0 divide-y divide-exile-border/50">
              {communityActivity.map((activity, i) => (
                <motion.div
                  key={activity.id}
                  className="flex items-start gap-3 py-3.5 first:pt-0"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                >
                  <div className="mt-0.5 shrink-0">
                    {activityIcons[activity.type]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-exile-text text-sm truncate">
                      {activity.message}
                    </p>
                    <p className="text-exile-muted text-xs font-mono mt-0.5">
                      {activity.timestamp}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

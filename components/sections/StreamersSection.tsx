"use client";

import { streamers } from "@/data/streamers";
import { StreamerCard } from "@/components/ui/StreamerCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Badge } from "@/components/ui/Badge";

export function StreamersSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-12 xl:px-24">
      <div className="flex items-center gap-4 mb-10">
        <SectionHeader title="Live on Exile" className="mb-0" />
        <Badge variant="live">LIVE</Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {streamers.map((streamer, i) => (
          <StreamerCard key={streamer.id} streamer={streamer} index={i} />
        ))}
      </div>
    </section>
  );
}

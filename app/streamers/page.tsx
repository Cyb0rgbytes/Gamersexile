"use client";

import { useState, useMemo } from "react";
import { streamers } from "@/data/streamers";
import { StreamerCard } from "@/components/ui/StreamerCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Search } from "lucide-react";

const gameFilters = ["All", "CS2", "VALORANT", "Overwatch 2", "Marvel Rivals"];
const statusFilters = ["All", "Live", "Offline"];
const platformFilters = ["All", "twitch", "youtube", "tiktok"];

export default function StreamersPage() {
  const [search, setSearch] = useState("");
  const [gameFilter, setGameFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [platformFilter, setPlatformFilter] = useState("All");

  const filteredStreamers = useMemo(() => {
    return streamers.filter((s) => {
      const matchesSearch =
        search === "" ||
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.handle.toLowerCase().includes(search.toLowerCase());

      const matchesGame = gameFilter === "All" || s.game === gameFilter;

      const matchesStatus =
        statusFilter === "All" ||
        (statusFilter === "Live" && s.isLive) ||
        (statusFilter === "Offline" && !s.isLive);

      const matchesPlatform =
        platformFilter === "All" || s.platform === platformFilter;

      return matchesSearch && matchesGame && matchesStatus && matchesPlatform;
    });
  }, [search, gameFilter, statusFilter, platformFilter]);

  const FilterRow = ({
    label,
    options,
    value,
    onChange,
  }: {
    label: string;
    options: string[];
    value: string;
    onChange: (v: string) => void;
  }) => (
    <div className="flex items-center gap-3 flex-wrap">
      <span className="text-exile-muted text-xs font-mono uppercase tracking-wider shrink-0">
        {label}:
      </span>
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={`px-3 py-1.5 font-mono text-xs uppercase tracking-wider rounded-sm border transition-all duration-200 cursor-pointer ${
            value === opt
              ? "bg-exile-accent text-exile-bg border-exile-accent"
              : "bg-transparent text-exile-muted border-exile-border hover:border-exile-accent/50 hover:text-exile-text"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-12 xl:px-24 min-h-screen">
      <SectionHeader
        title="Exile Streamers"
        subtitle="Find your next favorite streamer. Watch, follow, support."
      />

      {/* Search bar */}
      <div className="relative mb-6">
        <Search
          size={16}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-exile-muted"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or handle..."
          className="w-full bg-exile-surface border border-exile-border rounded-sm py-3 pl-11 pr-4 text-sm text-exile-text placeholder:text-exile-muted/60 font-mono focus:outline-none focus:border-exile-accent transition-colors duration-200"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 mb-10 p-5 bg-exile-surface rounded-md border border-exile-border">
        <FilterRow
          label="Game"
          options={gameFilters}
          value={gameFilter}
          onChange={setGameFilter}
        />
        <FilterRow
          label="Status"
          options={statusFilters}
          value={statusFilter}
          onChange={setStatusFilter}
        />
        <FilterRow
          label="Platform"
          options={platformFilters}
          value={platformFilter}
          onChange={setPlatformFilter}
        />
      </div>

      {/* Streamer grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredStreamers.map((streamer, i) => (
          <StreamerCard
            key={streamer.id}
            streamer={streamer}
            showFollow
            index={i}
          />
        ))}
      </div>

      {filteredStreamers.length === 0 && (
        <div className="text-center py-20">
          <p className="text-exile-muted font-mono text-sm">
            No streamers match your filters.
          </p>
          <button
            onClick={() => {
              setSearch("");
              setGameFilter("All");
              setStatusFilter("All");
              setPlatformFilter("All");
            }}
            className="mt-3 text-exile-accent text-sm font-mono hover:underline cursor-pointer"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}

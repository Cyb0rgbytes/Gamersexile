"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CreatorCard, type CreatorCardLabels } from "@/components/cards/CreatorCard";
import { fill } from "@/lib/i18n/config";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { CREATORS_LIVE_FIRST, ROLE_FILTERS } from "@/lib/creators";
import type { CreatorRole } from "@/types";

/* Filterable roster.
 *
 * The filter is client-side over a static array — the roster is small, so
 * fetching or paginating would be pure overhead. `layout` on the card wrapper
 * lets motion animate the grid reflow when the set changes; under reduced
 * motion the cards simply swap.
 *
 * The count is announced in a live region so filtering is perceivable without
 * sight of the grid. */

export interface CreatorRosterLabels {
  /** creators.filters */
  filters: Record<CreatorRole | "all" | "groupLabel" | "showing" | "empty", string>;
  card: CreatorCardLabels;
}

export function CreatorRoster({ labels }: { labels: CreatorRosterLabels }) {
  const [filter, setFilter] = useState<CreatorRole | "all">("all");
  const reduce = usePrefersReducedMotion();

  const shown =
    filter === "all"
      ? CREATORS_LIVE_FIRST
      : CREATORS_LIVE_FIRST.filter((c) => c.role === filter);

  return (
    <div>
      <div
        role="group"
        aria-label={labels.filters.groupLabel}
        className="flex flex-wrap gap-2"
      >
        {ROLE_FILTERS.map((f) => {
          const active = filter === f.key;

          return (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              aria-pressed={active}
              className={`clip-notch-sm flex items-center gap-2 border px-4 py-2 font-display text-[0.7rem] tracking-[0.16em] uppercase transition-all duration-300 ${
                active
                  ? "border-crimson bg-crimson/12 text-crimson-hot"
                  : "border-steel-line text-bone-dim hover:border-steel-hi hover:text-bone"
              }`}
            >
              {labels.filters[f.key]}
              <span lang="ja" className="font-jp text-[0.6rem] opacity-70">{f.jp}</span>
            </button>
          );
        })}
      </div>

      <p aria-live="polite" className="mt-4 text-xs text-bone-faint">
        {fill(labels.filters.showing, { shown: shown.length, total: CREATORS_LIVE_FIRST.length })}
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <AnimatePresence mode="popLayout">
          {shown.map((creator) => (
            <motion.div
              key={creator.slug}
              layout={!reduce}
              initial={reduce ? false : { opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
              transition={{ duration: reduce ? 0.15 : 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <CreatorCard item={creator} labels={labels.card} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {shown.length === 0 && (
        <p className="mt-10 text-center text-sm text-bone-faint">
          {labels.filters.empty}
        </p>
      )}
    </div>
  );
}

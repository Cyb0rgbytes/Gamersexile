"use client";

import { useEffect, useState } from "react";
import { useHydrated } from "@/lib/usePrefersReducedMotion";

/* ═══════════════════════════════════════════════════════════════════════════
 *  COUNTDOWN
 *  Ticks down to a tournament start.
 *
 *  Hydration: the server renders at build time and the client at page load,
 *  so any "now"-derived value differs between the two. The first client render
 *  therefore returns the SAME placeholder the server produced (`--`), and the
 *  real figures appear from the first effect tick. Computing the diff during
 *  render instead would throw a hydration mismatch on every visit.
 *
 *  The interval is 1s but only commits when the second actually changes, so a
 *  page with four countdowns still re-renders four times a second, not more.
 * ═══════════════════════════════════════════════════════════════════════════ */

export interface CountdownLabels {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
  underway: string;
  ariaLabel: string;
}

interface CountdownProps {
  /** ISO 8601 with a timezone. */
  target: string;
  /** common.countdown from the dictionary, passed down by a server parent. */
  labels: CountdownLabels;
  compact?: boolean;
  className?: string;
}

interface Parts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function diff(target: string): Parts | null {
  const ms = new Date(target).getTime() - Date.now();
  if (Number.isNaN(ms) || ms <= 0) return null;

  return {
    days: Math.floor(ms / 86_400_000),
    hours: Math.floor(ms / 3_600_000) % 24,
    minutes: Math.floor(ms / 60_000) % 60,
    seconds: Math.floor(ms / 1000) % 60,
  };
}

const pad = (n: number) => String(n).padStart(2, "0");

export function Countdown({
  target,
  labels,
  compact = false,
  className = "",
}: CountdownProps) {
  const [parts, setParts] = useState<Parts | null>(null);
  const mounted = useHydrated();

  useEffect(() => {
    const tick = () => setParts(diff(target));
    // First tick on the next macrotask rather than synchronously in the
    // effect body; the interval keeps it current after that.
    const first = setTimeout(tick, 0);
    const id = setInterval(tick, 1000);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, [target]);

  // Started (or already over) — the caller shows a LIVE chip instead.
  if (mounted && !parts) {
    return (
      <span
        className={`font-display text-sm tracking-[0.2em] text-violet-hot uppercase ${className}`}
      >
        {labels.underway}
      </span>
    );
  }

  /* Unit labels in the page's language. The kanji units (日時分秒) looked
   * better but a countdown is functional, not decorative — a visitor should
   * not have to know which character means "minutes" to read it. */
  const units = [
    { key: "d", value: parts?.days, label: labels.days },
    { key: "h", value: parts?.hours, label: labels.hours },
    { key: "m", value: parts?.minutes, label: labels.minutes },
    { key: "s", value: parts?.seconds, label: labels.seconds },
  ];

  return (
    <div
      className={`flex ${compact ? "gap-3" : "gap-4 sm:gap-6"} ${className}`}
      // Announced once when it appears; a per-second live region would be
      // relentless for a screen-reader user.
      role="group"
      aria-label={labels.ariaLabel}
    >
      {units.map((u) => (
        <div key={u.key} className="flex flex-col items-center">
          <span
            className={`font-mono tabular-nums text-bone ${
              compact ? "text-lg" : "text-2xl sm:text-3xl"
            } leading-none font-bold`}
          >
            {u.value === undefined ? "--" : pad(u.value)}
          </span>
          <span className="mt-1.5 font-display text-[0.6rem] tracking-[0.2em] text-bone-faint uppercase">
            {u.label}
          </span>
        </div>
      ))}
    </div>
  );
}

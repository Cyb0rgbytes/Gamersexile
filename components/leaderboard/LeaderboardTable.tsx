"use client";

import { useDeferredValue, useId, useMemo, useState } from "react";
import { MemberAvatar } from "./MemberAvatar";
import { fill } from "@/lib/i18n/config";
import type { Mee6Player } from "@/lib/mee6";

/* Ranked table for places 4–100 with a client-side name filter. The list is
 * already on the page (server-fetched), so search never calls MEE6. The table
 * scrolls inside its own container on narrow screens. */

export interface LeaderboardTableLabels {
  caption: string;
  rank: string;
  member: string;
  level: string;
  xp: string;
  progress: string;
  messages: string;
  progressLabel: string;
  searchLabel: string;
  searchPlaceholder: string;
  noResults: string;
  showing: string;
}

interface Props {
  players: Mee6Player[];
  locale: string;
  labels: LeaderboardTableLabels;
}

export function LeaderboardTable({ players, locale, labels }: Props) {
  const [query, setQuery] = useState("");
  const deferred = useDeferredValue(query);
  const inputId = useId();
  const nf = useMemo(() => new Intl.NumberFormat(locale), [locale]);
  const pf = useMemo(() => new Intl.NumberFormat(locale, { style: "percent", maximumFractionDigits: 0 }), [locale]);

  const rows = useMemo(() => {
    const q = deferred.trim().toLocaleLowerCase(locale);
    return q ? players.filter((p) => p.username.toLocaleLowerCase(locale).includes(q)) : players;
  }, [players, deferred, locale]);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="w-full sm:w-80">
          <label
            htmlFor={inputId}
            className="font-display text-[0.6rem] tracking-[0.2em] text-bone-faint uppercase"
          >
            {labels.searchLabel}
          </label>
          <input
            id={inputId}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={labels.searchPlaceholder}
            autoComplete="off"
            spellCheck={false}
            className="clip-notch-sm mt-2 w-full border border-steel-line bg-steel px-4 py-2.5 text-sm text-bone placeholder:text-bone-faint focus:border-violet/70 focus:outline-none"
          />
        </div>
        <p className="font-mono text-xs text-bone-faint" aria-live="polite">
          {fill(labels.showing, { count: nf.format(rows.length), total: nf.format(players.length) })}
        </p>
      </div>

      {rows.length === 0 ? (
        <p className="mt-8 border-y border-steel-line py-10 text-center text-sm text-bone-dim">
          {fill(labels.noResults, { query: deferred })}
        </p>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[44rem] border-collapse text-start">
            <caption className="sr-only">{labels.caption}</caption>
            <thead>
              <tr className="border-b border-steel-line">
                {[labels.rank, labels.member, labels.level, labels.xp, labels.progress, labels.messages].map((h) => (
                  <th
                    key={h}
                    scope="col"
                    className="pe-4 pb-3 text-start font-display text-[0.6rem] tracking-[0.2em] text-bone-faint uppercase last:pe-0"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => {
                const ratio = p.xpForLevel > 0 ? Math.min(1, Math.max(0, p.xpIntoLevel / p.xpForLevel)) : 0;
                const progressText = fill(labels.progressLabel, {
                  current: nf.format(p.xpIntoLevel),
                  needed: nf.format(p.xpForLevel),
                  next: nf.format(p.level + 1),
                });
                return (
                  <tr key={p.id} className="border-b border-steel-line transition-colors hover:bg-steel/50">
                    <td className="py-3 pe-4 font-mono text-sm text-bone-faint">
                      <span className="text-bone-dim">#</span>
                      {nf.format(p.rank)}
                    </td>
                    <th scope="row" className="py-3 pe-4 text-start font-normal">
                      <span className="flex items-center gap-3">
                        <MemberAvatar name={p.username} src={p.avatarUrl} size={36} />
                        <span className="max-w-[14rem] truncate font-display text-sm font-semibold text-bone">
                          {p.username}
                        </span>
                      </span>
                    </th>
                    <td className="py-3 pe-4 font-display text-sm font-bold text-crimson-hot">{nf.format(p.level)}</td>
                    <td className="py-3 pe-4 font-mono text-sm text-bone-dim">{nf.format(p.xp)}</td>
                    <td className="py-3 pe-4">
                      <div
                        role="progressbar"
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={Math.round(ratio * 100)}
                        aria-valuetext={progressText}
                        aria-label={labels.progress}
                        title={progressText}
                        className="flex items-center gap-2.5"
                      >
                        <span className="block h-1.5 w-28 shrink-0 overflow-hidden bg-steel-hi">
                          <span className="block h-full bg-crimson" style={{ width: `${ratio * 100}%` }} />
                        </span>
                        <span className="font-mono text-[0.7rem] text-bone-faint">{pf.format(ratio)}</span>
                      </div>
                    </td>
                    <td className="py-3 font-mono text-sm text-bone-faint">{nf.format(p.messageCount)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

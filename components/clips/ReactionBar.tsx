"use client";

import { startTransition, useOptimistic, useState } from "react";
import { LocaleLink as Link } from "@/components/i18n/LocaleLink";
import { ReactionIcon } from "@/components/ui/ReactionIcon";
import { setReaction, type ReactionState } from "@/lib/clips/actions";
import { REACTIONS, type ClipErrorCode, type ReactionKind } from "@/lib/clips/constants";
import { compactNumber } from "@/lib/clips/format";
import { fill } from "@/lib/i18n/config";
import { useLocale } from "@/lib/i18n/client";

/* ═══════════════════════════════════════════════════════════════════════════
 *  REACTION BAR — one reaction per user, Facebook-style:
 *  tap a reaction to set it, tap it again to take it back, tap another to
 *  switch. Respect is the primary, widest button; the other four sit beside
 *  it as compact icon buttons. Counts update optimistically and settle on
 *  the server's recomputed totals.
 * ═══════════════════════════════════════════════════════════════════════════ */

interface ReactionBarProps {
  clipId: string;
  initial: ReactionState;
  /** Signed in AND auth configured. Otherwise a tap shows a sign-in prompt. */
  canReact: boolean;
  signInHref: string;
  labels: Record<ReactionKind, string> & { label: string; aria: string; signInPrompt: string; signIn: string };
  errors: Record<ClipErrorCode, string>;
}

function apply(state: ReactionState, next: ReactionKind | null): ReactionState {
  const counts = { ...state.counts };
  if (state.mine) counts[state.mine] = Math.max(0, counts[state.mine] - 1);
  if (next) counts[next] += 1;
  return { counts, mine: next };
}

/* The pop: overshoot easing on select. motion-reduce drops the scale. */
const POP =
  "transition-[transform,background-color,border-color,color] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] active:scale-90 motion-reduce:transition-colors motion-reduce:active:scale-100";

export function ReactionBar({ clipId, initial, canReact, signInHref, labels, errors }: ReactionBarProps) {
  const locale = useLocale();
  const [state, setState] = useState(initial);
  const [optimistic, setOptimistic] = useOptimistic(state, apply);
  const [prompt, setPrompt] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function react(kind: ReactionKind) {
    if (!canReact) {
      setPrompt(true);
      return;
    }
    setError(null);
    const next = optimistic.mine === kind ? null : kind;
    startTransition(async () => {
      setOptimistic(next);
      const res = await setReaction(clipId, next);
      startTransition(() => {
        if (res.ok) setState(res.data);
        else setError(errors[res.error] ?? errors.server);
      });
    });
  }

  const aria = (kind: ReactionKind) => fill(labels.aria, { label: labels[kind], count: optimistic.counts[kind] });

  return (
    <div>
      <div role="group" aria-label={labels.label} className="flex flex-wrap items-center gap-2">
        {/* Respect — primary */}
        <button
          type="button"
          onClick={() => react("respect")}
          aria-pressed={optimistic.mine === "respect"}
          aria-label={aria("respect")}
          className={`clip-notch-sm inline-flex items-center gap-2.5 border px-4 py-2.5 font-display text-sm font-semibold tracking-[0.14em] uppercase ${POP} ${
            optimistic.mine === "respect"
              ? "scale-105 border-crimson bg-crimson text-white shadow-crimson-soft motion-reduce:scale-100"
              : "border-crimson/60 bg-crimson/8 text-crimson-hot hover:border-crimson hover:bg-crimson/15"
          }`}
        >
          <ReactionIcon kind="respect" size={26} className={optimistic.mine === "respect" ? "text-white" : "text-crimson"} />
          <span>{labels.respect}</span>
          <span className="font-mono text-xs tracking-normal tabular-nums" aria-hidden="true">
            {compactNumber(optimistic.counts.respect, locale)}
          </span>
        </button>

        {REACTIONS.filter((k) => k !== "respect").map((kind) => {
          const active = optimistic.mine === kind;
          return (
            <button
              key={kind}
              type="button"
              onClick={() => react(kind)}
              aria-pressed={active}
              aria-label={aria(kind)}
              title={labels[kind]}
              className={`clip-notch-sm inline-flex items-center gap-1.5 border px-3 py-2.5 text-sm ${POP} ${
                active
                  ? "scale-105 border-violet bg-violet/15 text-violet-hot shadow-violet-soft motion-reduce:scale-100"
                  : "border-steel-line text-bone-dim hover:border-steel-hi hover:text-bone"
              }`}
            >
              <ReactionIcon kind={kind} size={20} />
              <span className="font-mono text-xs tabular-nums" aria-hidden="true">
                {compactNumber(optimistic.counts[kind], locale)}
              </span>
            </button>
          );
        })}
      </div>

      <div aria-live="polite" className="mt-2 min-h-5 text-sm">
        {prompt && (
          <p className="text-bone-dim">
            {labels.signInPrompt}{" "}
            <Link href={signInHref} className="text-crimson-hot underline underline-offset-4 hover:text-bone">
              {labels.signIn}
            </Link>
          </p>
        )}
        {error && <p className="text-rose">{error}</p>}
      </div>
    </div>
  );
}

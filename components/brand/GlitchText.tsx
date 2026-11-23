"use client";

import { useState } from "react";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

/* ═══════════════════════════════════════════════════════════════════════════
 *  GLITCH TEXT
 *  Chromatic-aberration hover: two coloured ghosts of the same string offset a
 *  pixel or two behind the real one. Used sparingly on interactive display
 *  type (nav links, card titles) — it is a hover treatment, not a page effect.
 *
 *  The ghosts are aria-hidden duplicates, so a screen reader hears the string
 *  once. Under reduced motion the ghosts never mount at all: this branch
 *  changes DOM STRUCTURE, but it is driven by hover state rather than by the
 *  first paint, so the live hook is safe here — the server and the client both
 *  render the un-hovered tree.
 * ═══════════════════════════════════════════════════════════════════════════ */

interface GlitchTextProps {
  children: string;
  className?: string;
  /** Renders as a block-level span; useful inside flex rows. */
  as?: "span" | "div";
}

export function GlitchText({
  children,
  className = "",
  as: Tag = "span",
}: GlitchTextProps) {
  const [hovered, setHovered] = useState(false);
  const reduce = usePrefersReducedMotion();
  const active = hovered && !reduce;

  return (
    <Tag
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span className="relative z-10">{children}</span>

      {active && (
        <>
          <span
            aria-hidden="true"
            className="absolute inset-0 z-0 text-crimson-hot opacity-80"
            style={{ transform: "translate(-2px, 1px)" }}
          >
            {children}
          </span>
          <span
            aria-hidden="true"
            className="absolute inset-0 z-0 text-violet-hot opacity-60"
            style={{ transform: "translate(2px, -1px)" }}
          >
            {children}
          </span>
        </>
      )}
    </Tag>
  );
}

"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

/* ═══════════════════════════════════════════════════════════════════════════
 *  BRUSH REVEAL — a brush-sweep wipe when the element scrolls into view.
 *
 *  A clip-path inset sweeping left→right (or top→bottom for vertical text)
 *  with a slight skew, so the edge reads as a brush stroke crossing the paper
 *  rather than a mechanical wipe. Plays once.
 *
 *  Server markup is fully visible; the hidden start state is applied in a
 *  layout effect before first paint, so there is no flash and no-JS / reduced
 *  motion visitors simply see the content.
 * ═══════════════════════════════════════════════════════════════════════════ */

interface BrushRevealProps {
  children: React.ReactNode;
  direction?: "x" | "y";
  delay?: number;
  className?: string;
}

export function BrushReveal({
  children,
  direction = "x",
  delay = 0,
  className = "",
}: BrushRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const from = direction === "x" ? "inset(0 100% 0 0)" : "inset(0 0 100% 0)";
        gsap.fromTo(
          ref.current,
          { clipPath: from, skewX: direction === "x" ? -6 : 0, opacity: 0.4 },
          {
            clipPath: "inset(0 0% 0 0)",
            skewX: 0,
            opacity: 1,
            duration: 1.1,
            delay,
            ease: "expo.out",
            scrollTrigger: { trigger: ref.current, start: "top 85%", once: true },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

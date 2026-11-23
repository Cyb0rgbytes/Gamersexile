"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

/* ═══════════════════════════════════════════════════════════════════════════
 *  PARALLAX LAYER — scrubs a layer's Y against its section's scroll.
 *
 *  `speed` is the travel as a fraction of the layer's own height across the
 *  section's full pass: positive moves down (feels further away), negative
 *  moves up (feels closer). Keep it small — 0.05 to 0.25 — or the layers
 *  visibly detach from the composition.
 * ═══════════════════════════════════════════════════════════════════════════ */

interface ParallaxLayerProps {
  children: React.ReactNode;
  speed?: number;
  className?: string;
}

export function ParallaxLayer({ children, speed = 0.12, className = "" }: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          el,
          { yPercent: -speed * 100 },
          {
            yPercent: speed * 100,
            ease: "none",
            scrollTrigger: {
              trigger: el.closest("section") ?? el,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={`will-change-transform ${className}`}>
      {children}
    </div>
  );
}

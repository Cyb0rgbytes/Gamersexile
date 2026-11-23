"use client";

import { ReactLenis, type LenisRef } from "lenis/react";
import "lenis/dist/lenis.css";
import { useEffect, useRef } from "react";
import { cancelFrame, frame } from "motion/react";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { ScrollTrigger } from "@/lib/gsap";

/**
 * Lenis smooth scroll, driven by Framer Motion's frame scheduler.
 *
 * `autoRaf: false` plus `frame.update` is load-bearing: it makes Lenis and
 * every useScroll()-linked transform tick in the SAME frame. With Lenis on its
 * own RAF loop, scroll-linked animations lag one frame behind the scroll
 * position and visibly jitter.
 *
 * Reduced motion bypasses Lenis entirely. Framer's useReducedMotion gates the
 * animations but has no idea Lenis exists, so smooth scrolling would otherwise
 * survive the preference — which is precisely the motion some users need off.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<LenisRef>(null);
  const reduce = usePrefersReducedMotion();

  useEffect(() => {
    if (reduce) return;

    const update = (data: { timestamp: number }) => {
      lenisRef.current?.lenis?.raf(data.timestamp);
    };

    frame.update(update, true); // true = keepAlive, run every frame

    /* GSAP ScrollTrigger reads native scroll by default. Lenis animates the
     * real scroll position, so forwarding its scroll event is enough to keep
     * pins and scrubs locked to the same frame — no scrollerProxy needed. */
    const lenis = lenisRef.current?.lenis;
    const onScroll = () => ScrollTrigger.update();
    lenis?.on("scroll", onScroll);

    return () => {
      cancelFrame(update);
      lenis?.off("scroll", onScroll);
    };
  }, [reduce]);

  if (reduce) return <>{children}</>;

  return (
    <ReactLenis
      root
      ref={lenisRef}
      options={{
        autoRaf: false,
        duration: 1.05,
        // A gentle exponential glide. Steeper than this feels like syrup.
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      }}
    >
      {children}
    </ReactLenis>
  );
}

"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

/* ═══════════════════════════════════════════════════════════════════════════
 *  DRAW ON SCROLL — wipes in every descendant matching `selector`, in DOM
 *  order, as the container scrolls through the viewport (scrubbed, so the
 *  lines draw as fast as the reader scrolls and un-draw on the way back).
 *
 *  Used for the bracket connectors: the tree "grows" from the quarter-finals
 *  to the champion. Static and fully visible under reduced motion.
 * ═══════════════════════════════════════════════════════════════════════════ */

interface DrawOnScrollProps {
  children: React.ReactNode;
  selector: string;
  className?: string;
}

export function DrawOnScroll({ children, selector, className = "" }: DrawOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          gsap.utils.toArray<HTMLElement>(selector, ref.current),
          { clipPath: "inset(0 100% 0 0)" },
          {
            clipPath: "inset(0 0% 0 0)",
            ease: "none",
            stagger: 0.25,
            scrollTrigger: {
              trigger: ref.current,
              // Finish as the container's bottom enters view, so the tree is
              // complete (champion included) whenever it is fully on screen.
              start: "top 85%",
              end: "bottom 90%",
              scrub: 0.5,
            },
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

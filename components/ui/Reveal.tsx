"use client";

import { motion } from "motion/react";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

/* ═══════════════════════════════════════════════════════════════════════════
 *  REVEAL
 *  The single scroll-entrance used site-wide. One component means one timing
 *  curve and one reduced-motion branch to audit, instead of forty inline
 *  whileInView props drifting apart.
 *
 *  Under reduced motion it returns the children in a plain wrapper: no motion
 *  element mounts, so nothing animates and nothing is left mid-transition.
 *  The wrapper keeps the same className so layout is unaffected either way —
 *  the markup SHAPE is stable, which is why the live hook is safe here.
 * ═══════════════════════════════════════════════════════════════════════════ */

interface RevealProps {
  children: React.ReactNode;
  /** Seconds. Stagger siblings by ~0.06 for a readable cascade. */
  delay?: number;
  /** Travel distance in px. Negative pulls down from above. */
  y?: number;
  once?: boolean;
  className?: string;
}

export function Reveal({
  children,
  delay = 0,
  y = 24,
  once = true,
  className = "",
}: RevealProps) {
  const reduce = usePrefersReducedMotion();

  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-80px" }}
      transition={{
        duration: 0.7,
        delay,
        ease: [0.16, 1, 0.3, 1], // --ease-out-expo
      }}
    >
      {children}
    </motion.div>
  );
}

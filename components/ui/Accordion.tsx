"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import type { FaqItem } from "@/types";

/* FAQ accordion.
 *
 * Real <button aria-expanded> per row inside an h3, so the list is navigable
 * by heading and the state is announced. The panel is not aria-hidden when
 * closed — it is unmounted, which is unambiguous for every assistive tech. */

export function Accordion({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(0);
  const reduce = usePrefersReducedMotion();

  return (
    <div className="divide-y divide-steel-line border-y border-steel-line">
      {items.map((item, i) => {
        const isOpen = open === i;

        return (
          <div key={item.q}>
            <h3>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="group flex w-full items-center justify-between gap-6 py-5 text-start transition-colors hover:text-bone"
              >
                <span
                  className={`font-display text-base font-semibold tracking-wide transition-colors ${
                    isOpen ? "text-crimson-hot" : "text-bone"
                  }`}
                >
                  {item.q}
                </span>

                {/* Plus that rotates into a minus. */}
                <span className="relative grid size-6 shrink-0 place-items-center">
                  <span
                    className={`absolute h-px w-3.5 transition-colors ${isOpen ? "bg-crimson" : "bg-bone-faint"}`}
                  />
                  <span
                    className={`absolute h-px w-3.5 transition-all duration-300 ${
                      isOpen ? "rotate-0 bg-crimson opacity-0" : "rotate-90 bg-bone-faint"
                    }`}
                  />
                </span>
              </button>
            </h3>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={reduce ? false : { height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                  transition={{ duration: reduce ? 0 : 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <p className="pe-10 pb-6 text-bone-dim">{item.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

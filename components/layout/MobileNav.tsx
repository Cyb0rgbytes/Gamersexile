"use client";

import { LocaleLink as Link } from "@/components/i18n/LocaleLink";
import { usePathname } from "next/navigation";
import { stripLocale } from "@/lib/i18n/config";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { NotchButton } from "@/components/ui/NotchButton";
import { KanjiWatermark } from "@/components/ui/Texture";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import { NAV, SITE, isNavActive } from "@/lib/site";
import type { HeaderLabels } from "./HeaderBar";

/* ═══════════════════════════════════════════════════════════════════════════
 *  MOBILE NAV
 *  Full-screen overlay panel.
 *
 *  Three things a hand-rolled dialog has to get right, all handled below:
 *    · Escape closes it, and focus returns to the trigger that opened it.
 *    · Tab cycles inside the panel — nothing behind it is reachable.
 *    · The body cannot scroll underneath while it is open.
 * ═══════════════════════════════════════════════════════════════════════════ */

export function MobileNav({ labels, auth }: { labels: HeaderLabels; auth?: ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = stripLocale(usePathname() ?? "/");
  const reduce = usePrefersReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Route change closes the panel — the Link itself does not unmount it.
  // Adjusted during render (React's documented pattern for resetting state
  // on a prop change) instead of in an effect, which would paint once open.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;

    const { body } = document;
    const previousOverflow = body.style.overflow;
    body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
        return;
      }

      if (e.key !== "Tab" || !panelRef.current) return;

      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])',
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      // Wrap in both directions so focus never escapes behind the overlay.
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    // Move focus into the panel so the first Tab lands inside it.
    panelRef.current?.querySelector<HTMLElement>("a[href]")?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-label={labels.nav.openMenu}
        className="flex items-center gap-2.5 px-2 py-2 text-bone lg:hidden"
      >
        <span className="font-display text-xs tracking-[0.18em] uppercase">
          {labels.nav.menu}
        </span>
        <span className="flex flex-col gap-1">
          <span className="block h-px w-5 bg-current" />
          <span className="block h-px w-3.5 self-end bg-current" />
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={labels.nav.siteMenu}
            initial={reduce ? { opacity: 0 } : { opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, clipPath: "inset(0 0 0% 0)" }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: reduce ? 0.15 : 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-60 flex flex-col bg-void lg:hidden"
          >
            <KanjiWatermark
              kanji={SITE.kanji}
              className="-end-8 bottom-8"
              size="16rem"
              opacity={0.05}
            />

            <div className="flex items-center justify-end gap-4 px-gutter py-5">
              <LanguageSwitcher label={labels.language} />
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  triggerRef.current?.focus();
                }}
                aria-label={labels.nav.closeMenu}
                className="relative grid size-10 place-items-center text-bone"
              >
                <span className="absolute h-px w-5 rotate-45 bg-current" />
                <span className="absolute h-px w-5 -rotate-45 bg-current" />
              </button>
            </div>

            <nav aria-label={labels.nav.primaryLabel} className="flex-1 overflow-y-auto px-gutter">
              <ul className="flex flex-col">
                {NAV.map((item, i) => {
                  const active = isNavActive(item.href, pathname);

                  return (
                    <motion.li
                      key={item.href}
                      initial={reduce ? false : { opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: reduce ? 0 : 0.12 + i * 0.06,
                        duration: 0.45,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="border-b border-steel-line"
                    >
                      <Link
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        className={`flex items-baseline justify-between py-4 ${
                          active ? "text-crimson-hot" : "text-bone"
                        }`}
                      >
                        <span className="font-display text-2xl font-bold tracking-display uppercase">
                          {labels.nav[item.key]}
                        </span>
                        <span className="font-jp text-sm text-bone-faint">
                          {item.jp}
                        </span>
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>
            </nav>

            <div className="flex flex-col gap-5 px-gutter pt-6 pb-10">
              {auth && <div className="flex justify-center">{auth}</div>}
              <NotchButton href={SITE.discord} external size="lg" className="w-full">
                {labels.joinTheDiscord}
              </NotchButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

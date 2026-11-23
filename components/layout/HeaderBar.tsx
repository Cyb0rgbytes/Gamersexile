"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { LocaleLink as Link } from "@/components/i18n/LocaleLink";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import { stripLocale } from "@/lib/i18n/config";
import { LogoLockup } from "@/components/brand/LogoLockup";
import { NotchButton } from "@/components/ui/NotchButton";
import { MobileNav } from "./MobileNav";
import { NAV, SITE, isNavActive, type NavKey } from "@/lib/site";

/* ═══════════════════════════════════════════════════════════════════════════
 *  HEADER BAR
 *  Transparent over the hero, then condenses to an opaque bar once scrolled —
 *  the notched centred chrome from the reference shots.
 *
 *  Nine destinations do not fit one bar, so the five most used sit in it and
 *  the rest open from "More". The mobile menu and footer list all nine.
 *
 *  The scroll listener is passive and only commits on a threshold CROSSING,
 *  so it sets state twice per page rather than once per scroll event.
 * ═══════════════════════════════════════════════════════════════════════════ */

export interface HeaderLabels {
  nav: Record<NavKey | "more" | "primaryLabel" | "menu" | "openMenu" | "closeMenu" | "siteMenu", string>;
  joinDiscord: string;
  joinTheDiscord: string;
  language: string;
  homeLabel: string;
  emblemAlt: string;
}

const BAR = NAV.filter((n) => n.bar);
const MORE = NAV.filter((n) => !n.bar);

export function HeaderBar({ labels, auth }: { labels: HeaderLabels; auth: ReactNode }) {
  const pathname = stripLocale(usePathname() ?? "/");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const past = window.scrollY > 24;
      setScrolled((prev) => (prev === past ? prev : past));
    };

    onScroll(); // Deep-linked loads can start mid-page.
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "border-b border-steel-line bg-void/85 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-[110rem] items-center justify-between gap-4 px-gutter py-4">
        <LogoLockup
          size={scrolled ? 32 : 38}
          responsiveWordmark
          homeLabel={labels.homeLabel}
          emblemAlt={labels.emblemAlt}
          className="transition-all duration-500"
        />

        {/* Desktop nav */}
        <nav aria-label={labels.nav.primaryLabel} className="hidden lg:block">
          <ul className="flex items-center gap-0.5 xl:gap-1">
            {BAR.map((item) => {
              const active = isNavActive(item.href, pathname);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`group relative flex flex-col items-center px-3 py-2 transition-colors xl:px-4 ${
                      active ? "text-crimson-hot" : "text-bone-dim hover:text-bone"
                    }`}
                  >
                    <NavText label={labels.nav[item.key]} jp={item.jp} active={active} />
                  </Link>
                </li>
              );
            })}
            <li>
              <MoreMenu label={labels.nav.more} labels={labels.nav} pathname={pathname} />
            </li>
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSwitcher label={labels.language} className="hidden lg:block" />

          <NotchButton href={SITE.discord} external size="sm" className="hidden sm:inline-flex">
            {labels.joinDiscord}
          </NotchButton>

          {auth && <div className="hidden items-center lg:flex">{auth}</div>}

          <MobileNav labels={labels} auth={auth} />
        </div>
      </div>
    </header>
  );
}

/** Label, kanji accent and the underline that marks hover/active. */
function NavText({ label, jp, active }: { label: string; jp: string; active: boolean }) {
  return (
    <>
      <span className="font-display text-xs font-semibold tracking-[0.16em] whitespace-nowrap uppercase">
        {label}
      </span>
      <span className="font-jp text-[0.55rem] tracking-[0.2em] opacity-55">{jp}</span>

      {/* Underline: full width when active, drawn on hover. */}
      <span
        className={`absolute -bottom-0.5 h-px transition-all duration-300 ${
          active ? "w-6 bg-crimson" : "w-0 bg-violet-hot group-hover:w-6"
        }`}
      />
    </>
  );
}

/* "More" dropdown. A disclosure button (aria-expanded/aria-controls) over a
 * plain list of links, so Tab reaches every item in order. Esc closes it and
 * returns focus to the button; clicking outside or navigating closes it. */
function MoreMenu({
  label,
  labels,
  pathname,
}: {
  label: string;
  labels: HeaderLabels["nav"];
  pathname: string;
}) {
  const [open, setOpen] = useState(false);
  const listId = useId();
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const active = MORE.some((n) => isNavActive(n.href, pathname));

  // Navigation closes the menu (state reset on prop change, during render).
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        button.current?.focus();
      }
    };
    const onFocusOut = (e: FocusEvent) => {
      if (e.relatedTarget && !root.current?.contains(e.relatedTarget as Node)) setOpen(false);
    };
    const el = root.current;
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    el?.addEventListener("focusout", onFocusOut);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
      el?.removeEventListener("focusout", onFocusOut);
    };
  }, [open]);

  return (
    <div ref={root} className="relative">
      <button
        ref={button}
        type="button"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((o) => !o)}
        className={`group relative flex flex-col items-center px-3 py-2 transition-colors xl:px-4 ${
          active || open ? "text-crimson-hot" : "text-bone-dim hover:text-bone"
        }`}
      >
        <span className="flex items-center gap-1.5 font-display text-xs font-semibold tracking-[0.16em] whitespace-nowrap uppercase">
          {label}
          <svg
            aria-hidden="true"
            viewBox="0 0 10 6"
            className={`size-2 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
          >
            <path d="M1 1l4 4 4-4" />
          </svg>
        </span>
        <span className="font-jp text-[0.55rem] tracking-[0.2em] opacity-55">他</span>
        <span
          className={`absolute -bottom-0.5 h-px transition-all duration-300 ${
            active ? "w-6 bg-crimson" : "w-0 bg-violet-hot group-hover:w-6"
          }`}
        />
      </button>

      {open && (
        <ul
          id={listId}
          className="absolute end-0 top-full z-90 mt-3 min-w-52 border border-steel-line bg-void/95 py-1.5 shadow-violet-soft backdrop-blur"
        >
          {MORE.map((item) => {
            const current = isNavActive(item.href, pathname);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={current ? "page" : undefined}
                  onClick={() => setOpen(false)}
                  className={`flex items-baseline justify-between gap-6 px-4 py-2.5 transition-colors hover:bg-steel hover:text-bone focus-visible:bg-steel ${
                    current ? "text-crimson-hot" : "text-bone-dim"
                  }`}
                >
                  <span className="font-display text-xs font-semibold tracking-[0.16em] uppercase">
                    {labels[item.key]}
                  </span>
                  <span className="font-jp text-[0.6rem] text-bone-faint">{item.jp}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

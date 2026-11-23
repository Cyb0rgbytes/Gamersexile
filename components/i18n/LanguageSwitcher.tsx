"use client";

import { useEffect, useId, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  LOCALES,
  LOCALE_COOKIE,
  LOCALE_NAMES,
  LOCALE_SHORT,
  localePath,
  stripLocale,
  type Locale,
} from "@/lib/i18n/config";
import { useLocale } from "@/lib/i18n/client";

/* Compact globe button that opens a list of the eight languages, each named
 * in itself. Choosing one stores the choice in a cookie (so the proxy's
 * Accept-Language guess never overrides it) and moves to the same page in
 * the new language. Keyboard: Enter/Space opens, arrows move, Esc closes. */

/** Persist an explicit choice so the proxy's Accept-Language guess never overrides it. */
function rememberLocale(locale: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=31536000; samesite=lax`;
}

export function LanguageSwitcher({ label, className = "" }: { label: string; className?: string }) {
  const current = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const listId = useId();
  const root = useRef<HTMLDivElement>(null);
  const items = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    items.current[LOCALES.indexOf(current)]?.focus();
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open, current]);

  function choose(locale: Locale) {
    rememberLocale(locale);
    setOpen(false);
    if (locale === current) return;
    const rest = stripLocale(pathname ?? "/");
    router.push(localePath(locale, rest) + window.location.search + window.location.hash);
  }

  function onKey(e: React.KeyboardEvent, i: number) {
    if (e.key === "Escape") setOpen(false);
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const n = (i + (e.key === "ArrowDown" ? 1 : -1) + LOCALES.length) % LOCALES.length;
      items.current[n]?.focus();
    }
  }

  return (
    <div ref={root} className={`relative ${className}`}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={`${label}: ${LOCALE_NAMES[current]}`}
        onClick={() => setOpen((o) => !o)}
        className="flex h-9 items-center gap-1.5 border border-steel-line px-2.5 font-display text-[0.7rem] tracking-[0.12em] text-bone-dim transition-colors hover:border-steel-hi hover:text-bone"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.6">
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3Z" />
        </svg>
        {LOCALE_SHORT[current]}
      </button>

      {open && (
        <ul
          id={listId}
          role="listbox"
          aria-label={label}
          className="absolute end-0 top-full z-90 mt-2 min-w-44 border border-steel-line bg-void/95 py-1.5 shadow-violet-soft backdrop-blur"
        >
          {LOCALES.map((l, i) => (
            <li key={l} role="presentation">
              <button
                ref={(el) => {
                  items.current[i] = el;
                }}
                type="button"
                role="option"
                aria-selected={l === current}
                lang={l}
                onClick={() => choose(l)}
                onKeyDown={(e) => onKey(e, i)}
                className={`flex w-full items-center justify-between gap-4 px-4 py-2 text-start text-sm transition-colors hover:bg-steel hover:text-bone focus-visible:bg-steel ${
                  l === current ? "text-crimson-hot" : "text-bone-dim"
                }`}
              >
                {LOCALE_NAMES[l]}
                <span className="font-display text-[0.6rem] tracking-[0.15em] text-bone-faint">{LOCALE_SHORT[l]}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

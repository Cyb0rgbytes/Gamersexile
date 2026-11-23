"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";
import { RedSun } from "@/components/art/RedSun";
import { useLocale } from "@/lib/i18n/client";
import { fill, type Locale } from "@/lib/i18n/config";
import en from "@/dictionaries/en/errors.json";
import ar from "@/dictionaries/ar/errors.json";
import de from "@/dictionaries/de/errors.json";
import ru from "@/dictionaries/ru/errors.json";
import zhCN from "@/dictionaries/zh-CN/errors.json";
import es from "@/dictionaries/es/errors.json";
import fr from "@/dictionaries/fr/errors.json";
import ja from "@/dictionaries/ja/errors.json";

/* Segment error boundary. Next 16.3: `retry` (stable) re-fetches and
 * re-renders the segment; `error.digest` matches the server log entry.
 *
 * A Client Component cannot call getDictionary(), and an error boundary has
 * no server parent to pass strings down, so it bundles the small errors
 * namespace of every language and falls back to English per key. */

type ErrorCopy = (typeof en)["error"];

const ERRORS: Record<Locale, { error?: Partial<ErrorCopy> }> = {
  en,
  ar,
  de,
  ru,
  "zh-CN": zhCN,
  es,
  fr,
  ja,
};

function copyFor(locale: Locale): ErrorCopy {
  const over = ERRORS[locale]?.error ?? {};
  const out = { ...en.error };
  for (const k of Object.keys(out) as (keyof ErrorCopy)[]) {
    if (over[k]) out[k] = over[k];
  }
  return out;
}

export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  const t = copyFor(useLocale());

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="relative flex min-h-[80svh] items-center justify-center overflow-hidden px-gutter pt-32 pb-24 text-center">
      <div className="relative max-w-lg">
        <div aria-hidden="true" className="relative mx-auto grid size-36 place-items-center">
          <RedSun brush className="absolute inset-0 size-full opacity-80" />
          <span lang="ja" className="font-brush relative text-6xl leading-none text-bone">
            乱
          </span>
        </div>
        <h1 className="mt-8 font-display text-2xl font-bold tracking-display uppercase">
          {t.title}
        </h1>
        <p className="mt-4 text-base text-bone-dim">{t.body}</p>
        {error.digest && (
          <p className="mt-3 font-mono text-xs text-bone-faint">
            {fill(t.ref, { digest: error.digest })}
          </p>
        )}
        <button
          type="button"
          onClick={() => retry()}
          className="clip-notch-sm mt-9 inline-flex items-center gap-2 bg-crimson px-6 py-3 font-display text-sm font-semibold tracking-[0.14em] text-white uppercase transition-colors hover:bg-crimson-hot"
        >
          {t.retry}
        </button>
      </div>
    </section>
  );
}

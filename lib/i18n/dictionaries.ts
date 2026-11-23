import "server-only";
import { lang } from "next/root-params";
import { notFound } from "next/navigation";
import en from "@/dictionaries/en";
import { DEFAULT_LOCALE, isLocale, type Locale } from "./config";

/* ═══════════════════════════════════════════════════════════════════════════
 *  DICTIONARIES
 *  English (dictionaries/en/*.json) is the source of truth and defines the
 *  type. Other languages are deep-merged over it, so any key not yet
 *  translated shows in English instead of breaking the page.
 *
 *  Server Components:   const t = await getDictionary();     (reads [lang])
 *  Actions / handlers:  const t = await getDictionaryFor(locale);
 *  Client Components:   receive the strings they need as props.
 * ═══════════════════════════════════════════════════════════════════════════ */

export type Dictionary = typeof en;

const loaders: Record<Locale, () => Promise<unknown>> = {
  en: async () => en,
  ar: () => import("@/dictionaries/ar").then((m) => m.default),
  de: () => import("@/dictionaries/de").then((m) => m.default),
  ru: () => import("@/dictionaries/ru").then((m) => m.default),
  "zh-CN": () => import("@/dictionaries/zh-CN").then((m) => m.default),
  es: () => import("@/dictionaries/es").then((m) => m.default),
  fr: () => import("@/dictionaries/fr").then((m) => m.default),
  ja: () => import("@/dictionaries/ja").then((m) => m.default),
};

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

/** Overlay `over` onto `base`. Arrays and strings replace; objects merge. */
function deepMerge<T>(base: T, over: unknown): T {
  if (!isPlainObject(base) || !isPlainObject(over)) {
    return (over === undefined || over === null || over === "" ? base : over) as T;
  }
  const out: Record<string, unknown> = { ...base };
  for (const [k, v] of Object.entries(over)) out[k] = deepMerge((base as Record<string, unknown>)[k], v);
  return out as T;
}

const cache = new Map<Locale, Promise<Dictionary>>();

export function getDictionaryFor(locale: Locale): Promise<Dictionary> {
  if (locale === DEFAULT_LOCALE) return Promise.resolve(en);
  let hit = cache.get(locale);
  if (!hit) {
    hit = loaders[locale]().then((d) => deepMerge(en, d));
    cache.set(locale, hit);
  }
  return hit;
}

/** The current request's locale, from the [lang] root segment. */
export async function getLocale(): Promise<Locale> {
  const l = await lang();
  if (!isLocale(l)) notFound();
  return l;
}

/** Dictionary for the current request's locale. */
export async function getDictionary(): Promise<Dictionary> {
  return getDictionaryFor(await getLocale());
}

export { fill } from "./config";

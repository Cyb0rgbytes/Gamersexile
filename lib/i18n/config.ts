/* ═══════════════════════════════════════════════════════════════════════════
 *  LANGUAGES
 *  Every route lives under /[lang]. `en` is the source language and the
 *  fallback: any key missing from another dictionary falls back to English,
 *  so a half-translated namespace never breaks a page.
 *
 *  Safe to import from client components (no server-only code here).
 * ═══════════════════════════════════════════════════════════════════════════ */

export const LOCALES = ["en", "ar", "de", "ru", "zh-CN", "es", "fr", "ja"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

/** Cookie that remembers an explicit choice from the language switcher. */
export const LOCALE_COOKIE = "ge_lang";

/** Each language named in itself, as the switcher shows it. */
export const LOCALE_NAMES: Record<Locale, string> = {
  en: "English",
  ar: "العربية",
  de: "Deutsch",
  ru: "Русский",
  "zh-CN": "简体中文",
  es: "Español",
  fr: "Français",
  ja: "日本語",
};

/** Short code shown on the compact switcher button. */
export const LOCALE_SHORT: Record<Locale, string> = {
  en: "EN",
  ar: "AR",
  de: "DE",
  ru: "RU",
  "zh-CN": "中文",
  es: "ES",
  fr: "FR",
  ja: "日本",
};

/** OpenGraph locale codes. */
export const OG_LOCALE: Record<Locale, string> = {
  en: "en_US",
  ar: "ar_AR",
  de: "de_DE",
  ru: "ru_RU",
  "zh-CN": "zh_CN",
  es: "es_ES",
  fr: "fr_FR",
  ja: "ja_JP",
};

export const RTL_LOCALES: readonly Locale[] = ["ar"];

export const isLocale = (value: string): value is Locale =>
  (LOCALES as readonly string[]).includes(value);

export const dirOf = (locale: Locale): "rtl" | "ltr" =>
  RTL_LOCALES.includes(locale) ? "rtl" : "ltr";

/** Prefix an internal absolute path with the locale: ("de", "/teams") → "/de/teams". */
export function localePath(locale: Locale, path: string): string {
  if (!path.startsWith("/") || path.startsWith("//")) return path;
  return path === "/" ? `/${locale}` : `/${locale}${path}`;
}

/** Remove a leading locale segment: "/de/teams" → "/teams". */
export function stripLocale(pathname: string): string {
  const seg = pathname.split("/")[1] ?? "";
  if (!isLocale(seg)) return pathname;
  const rest = pathname.slice(seg.length + 1);
  return rest === "" ? "/" : rest;
}

/** Replace {name} placeholders: fill("Hi {name}", { name: "Ana" }). */
export function fill(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (m, k: string) => (k in vars ? String(vars[k]) : m));
}

/** hreflang map for `metadata.alternates.languages`, path without locale. */
export function languageAlternates(path: string): Record<string, string> {
  const map: Record<string, string> = {};
  for (const l of LOCALES) map[l] = localePath(l, path);
  map["x-default"] = localePath(DEFAULT_LOCALE, path);
  return map;
}

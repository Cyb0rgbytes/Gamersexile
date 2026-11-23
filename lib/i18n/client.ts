"use client";

import { useParams } from "next/navigation";
import { DEFAULT_LOCALE, isLocale, localePath, type Locale } from "./config";

/** Current locale in a Client Component, from the [lang] route param. */
export function useLocale(): Locale {
  const params = useParams<{ lang?: string }>();
  const l = params?.lang ?? "";
  return isLocale(l) ? l : DEFAULT_LOCALE;
}

/** Locale-prefixed path builder bound to the current locale. */
export function useLocalePath(): (path: string) => string {
  const locale = useLocale();
  return (path: string) => localePath(locale, path);
}

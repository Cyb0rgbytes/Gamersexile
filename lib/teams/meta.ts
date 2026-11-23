import type { Metadata } from "next";
import { languageAlternates, localePath, type Locale } from "@/lib/i18n/config";

/** Localized metadata with canonical + hreflang; `noindex` for private-ish pages. */
export function pageMeta(
  locale: Locale,
  path: string,
  title: string,
  description: string,
  opts: { noindex?: boolean } = {},
): Metadata {
  return {
    title,
    description,
    alternates: { canonical: localePath(locale, path), languages: languageAlternates(path) },
    ...(opts.noindex ? { robots: { index: false, follow: false } } : {}),
  };
}

import type { Metadata } from "next";
import { OG_LOCALE, languageAlternates, type Locale } from "@/lib/i18n/config";
import { SITE } from "@/lib/site";
import type { LegalDoc } from "./types";

/** Page metadata for a legal document at `path` (e.g. "/privacy"). */
export function legalMetadata(doc: LegalDoc, locale: Locale, path: string): Metadata {
  return {
    title: doc.title,
    description: doc.metaDescription,
    alternates: { canonical: `/${locale}${path}`, languages: languageAlternates(path) },
    openGraph: {
      type: "website",
      locale: OG_LOCALE[locale],
      url: `${SITE.url}/${locale}${path}`,
      siteName: SITE.name,
      title: doc.title,
      description: doc.metaDescription,
    },
  };
}

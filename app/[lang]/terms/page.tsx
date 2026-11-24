import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { LegalDocument } from "@/components/legal/LegalDocument";
import { getLocale } from "@/lib/i18n/dictionaries";
import { LEGAL_UPDATED, getLegal } from "@/lib/legal";
import { legalMetadata } from "@/lib/legal/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return legalMetadata(getLegal("terms", locale).doc, locale, "/terms");
}

export default async function TermsPage() {
  const locale = await getLocale();
  const { doc, lang, dir, notice } = getLegal("terms", locale);
  const updated = new Intl.DateTimeFormat(lang, { dateStyle: "long", timeZone: "UTC" }).format(new Date(LEGAL_UPDATED));

  return (
    <>
      <PageHeader eyebrow={{ en: doc.eyebrow, jp: "規約" }} title={doc.title} lead={doc.lead} watermark="約" />
      <LegalDocument doc={doc} updated={updated} notice={notice} lang={lang} dir={dir} />
    </>
  );
}

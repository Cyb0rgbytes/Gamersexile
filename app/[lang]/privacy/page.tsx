import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { LegalDocument } from "@/components/legal/LegalDocument";
import { getLocale } from "@/lib/i18n/dictionaries";
import { LEGAL_UPDATED, getLegal } from "@/lib/legal";
import { legalMetadata } from "@/lib/legal/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return legalMetadata(getLegal("privacy", locale).doc, locale, "/privacy");
}

export default async function PrivacyPage() {
  const locale = await getLocale();
  const { doc, lang, dir, notice } = getLegal("privacy", locale);
  const updated = new Intl.DateTimeFormat(lang, { dateStyle: "long", timeZone: "UTC" }).format(new Date(LEGAL_UPDATED));

  return (
    <>
      <PageHeader eyebrow={{ en: doc.eyebrow, jp: "個人情報" }} title={doc.title} lead={doc.lead} watermark="秘" />
      <LegalDocument doc={doc} updated={updated} notice={notice} lang={lang} dir={dir} />
    </>
  );
}

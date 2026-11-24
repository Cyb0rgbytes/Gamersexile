import type { Locale } from "@/lib/i18n/config";
import { privacyAr, privacyEn } from "./privacy";
import { termsAr, termsEn } from "./terms";
import type { LegalDoc } from "./types";

export { LEGAL_UPDATED } from "./types";
export type { LegalDoc } from "./types";

const DOCS = {
  privacy: { en: privacyEn, ar: privacyAr },
  terms: { en: termsEn, ar: termsAr },
} as const;

/* Shown above the English text in locales that have no translation yet. */
const ENGLISH_ONLY: Partial<Record<Locale, string>> = {
  de: "Dieses Dokument ist auf Englisch und Arabisch verfügbar. Die englische Fassung ist unten abgebildet.",
  ru: "Этот документ доступен на английском и арабском языках. Ниже приведена английская версия.",
  "zh-CN": "本文件提供英文和阿拉伯文版本。以下为英文版本。",
  es: "Este documento está disponible en inglés y en árabe. A continuación se muestra la versión en inglés.",
  fr: "Ce document est disponible en anglais et en arabe. La version anglaise figure ci-dessous.",
  ja: "この文書は英語とアラビア語で提供しています。以下は英語版です。",
};

export interface LegalView {
  doc: LegalDoc;
  /** Language and direction of the document text (not of the page chrome). */
  lang: "en" | "ar";
  dir: "ltr" | "rtl";
  notice?: string;
}

export function getLegal(kind: keyof typeof DOCS, locale: Locale): LegalView {
  if (locale === "ar") return { doc: DOCS[kind].ar, lang: "ar", dir: "rtl" };
  return { doc: DOCS[kind].en, lang: "en", dir: "ltr", notice: ENGLISH_ONLY[locale] };
}

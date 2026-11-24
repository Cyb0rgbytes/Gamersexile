/* ═══════════════════════════════════════════════════════════════════════════
 *  LEGAL PAGES — content model
 *  The policies live here rather than in dictionaries/: they are long,
 *  reviewed as whole documents, and exist in English and Arabic only.
 *  Other locales show the English text with a short note (lib/legal/index).
 *
 *  Plain strings only. Email addresses in any string become mailto links.
 * ═══════════════════════════════════════════════════════════════════════════ */

export type LegalBlock =
  | { p: string }
  | { list: string[] }
  | { table: { head: string[]; rows: string[][] } };

export interface LegalSection {
  id: string;
  heading: string;
  blocks: LegalBlock[];
}

export interface LegalDoc {
  eyebrow: string;
  title: string;
  lead: string;
  metaDescription: string;
  /** Label before the date, e.g. "Last updated". */
  updatedLabel: string;
  /** Heading above the list of sections. */
  contentsLabel: string;
  sections: LegalSection[];
}

/** Date both documents last changed. ISO; formatted per locale on the page. */
export const LEGAL_UPDATED = "2026-11-25";

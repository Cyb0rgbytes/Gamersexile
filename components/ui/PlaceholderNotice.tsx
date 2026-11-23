import { SITE } from "@/lib/site";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { richFill } from "./RichText";
import { PlaceholderNoticeBox } from "./PlaceholderNoticeBox";

/* ═══════════════════════════════════════════════════════════════════════════
 *  PLACEHOLDER NOTICE
 *  Every Discord and social URL on this site is currently a stub. That is easy
 *  to forget once the design looks finished, and a launched site whose main
 *  CTA 404s is the worst possible outcome — so the stubs announce themselves.
 *
 *  Dev-only: gated on NODE_ENV, so it can never reach production even if
 *  `linksArePlaceholder` is left set to true by accident.
 *
 *  Delete this component (and PlaceholderNoticeBox) and the
 *  SITE.linksArePlaceholder flag once the real links are in.
 * ═══════════════════════════════════════════════════════════════════════════ */

export async function PlaceholderNotice() {
  if (process.env.NODE_ENV === "production") return null;
  if (!SITE.linksArePlaceholder) return null;

  const t = (await getDictionary()).common.placeholderNotice;

  return (
    <PlaceholderNoticeBox title={t.title} dismiss={t.dismiss}>
      {richFill(t.body, {
        file: <code className="font-mono text-bone">lib/site.ts</code>,
        flag: <code className="font-mono text-bone">linksArePlaceholder</code>,
      })}
    </PlaceholderNoticeBox>
  );
}

import { Fragment, type ReactNode } from "react";
import type { LegalBlock, LegalDoc } from "@/lib/legal/types";

/* Renders a policy from lib/legal: a contents list, then one section per
 * heading. Server component; no client JS. */

const EMAIL_RE = /([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})/g;

/** Text with any email address turned into a mailto link. */
function linkify(text: string): ReactNode {
  return text.split(EMAIL_RE).map((part, i) =>
    i % 2 === 1 ? (
      <a key={i} href={`mailto:${part}`} dir="ltr" className="font-mono text-crimson-hot underline-offset-4 hover:underline">
        {part}
      </a>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}

function Block({ block }: { block: LegalBlock }) {
  if ("p" in block) return <p className="text-base leading-relaxed text-bone-dim">{linkify(block.p)}</p>;
  if ("list" in block)
    return (
      <ul className="list-disc space-y-2 ps-6 text-base leading-relaxed text-bone-dim marker:text-crimson-hot">
        {block.list.map((item, i) => (
          <li key={i}>{linkify(item)}</li>
        ))}
      </ul>
    );
  return (
    <div className="overflow-x-auto border border-steel-line">
      <table className="w-full min-w-[36rem] border-collapse text-start text-sm">
        <thead className="bg-steel/60">
          <tr>
            {block.table.head.map((h, i) => (
              <th key={i} scope="col" className="border-b border-steel-line px-4 py-3 text-start font-display text-xs tracking-wide text-bone uppercase">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {block.table.rows.map((row, r) => (
            <tr key={r} className="border-b border-steel-line/70 last:border-b-0 align-top">
              {row.map((cell, c) => (
                <td key={c} className={`px-4 py-3 leading-relaxed ${c === 0 ? "font-medium text-bone" : "text-bone-dim"}`}>
                  {linkify(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface LegalDocumentProps {
  doc: LegalDoc;
  updated: string;
  /** Shown above the text when it is not in the visitor's language. */
  notice?: string;
  /** BCP 47 tag and direction of the document text itself. */
  lang: string;
  dir: "ltr" | "rtl";
}

export function LegalDocument({ doc, updated, notice, lang, dir }: LegalDocumentProps) {
  return (
    <section className="relative py-section">
      <div className="mx-auto max-w-3xl px-gutter">
        {notice && (
          <p className="clip-notch-sm mb-10 border border-steel-line bg-steel/40 px-4 py-3 text-sm text-bone-dim">{notice}</p>
        )}

        <article lang={lang} dir={dir}>
          <p className="text-sm text-bone-faint">
            {doc.updatedLabel}: <time dateTime={updated.slice(0, 10)}>{updated}</time>
          </p>

          <nav aria-labelledby="legal-contents" className="mt-8 border-s-2 border-crimson/45 ps-5">
            <h2 id="legal-contents" className="font-display text-eyebrow tracking-eyebrow text-bone-faint uppercase">
              {doc.contentsLabel}
            </h2>
            <ol className="mt-3 space-y-1.5 text-sm">
              {doc.sections.map((s, i) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="text-bone-dim transition-colors hover:text-crimson-hot">
                    {i + 1}. {s.heading}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="mt-12 space-y-14">
            {doc.sections.map((s, i) => (
              <section key={s.id} id={s.id} aria-labelledby={`${s.id}-h`} className="scroll-mt-28 space-y-5">
                <h2 id={`${s.id}-h`} className="font-display text-xl font-bold tracking-wide text-bone">
                  {i + 1}. {s.heading}
                </h2>
                {s.blocks.map((b, j) => (
                  <Block key={j} block={b} />
                ))}
              </section>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}

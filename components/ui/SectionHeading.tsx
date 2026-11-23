import { Reveal } from "./Reveal";
import type { BilingualLabel } from "@/types";

/* The bilingual eyebrow is the accent layer's most repeated element: kanji,
 * hairline, then the English in tracked caps. Consistent everywhere so the
 * two scripts always sit in the same relationship. */

interface SectionHeadingProps {
  eyebrow: BilingualLabel;
  title: string;
  lead?: string;
  align?: "left" | "center";
  /** Renders as h1 on page headers, h2 inside a page. */
  as?: "h1" | "h2";
  /** "ink" for paper sections: crimson-ink / ink-dim instead of the night
   *  colours, which drop below 3:1 on paper. */
  tone?: "night" | "ink";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "left",
  as: Tag = "h2",
  tone = "night",
  className = "",
}: SectionHeadingProps) {
  const centered = align === "center";
  const ink = tone === "ink";

  return (
    <div
      className={`${centered ? "mx-auto max-w-2xl text-center" : "max-w-2xl"} ${className}`}
    >
      <Reveal>
        <div
          className={`flex items-center gap-3 ${centered ? "justify-center" : ""}`}
        >
          <span lang="ja" className={`font-jp text-sm ${ink ? "text-crimson-ink" : "text-crimson-hot"}`}>{eyebrow.jp}</span>
          <span className={`h-px w-8 ${ink ? "bg-ink/30" : "bg-crimson/45"}`} />
          <span className={`font-display text-eyebrow tracking-eyebrow uppercase ${ink ? "text-ink-dim" : "text-bone-faint"}`}>
            {eyebrow.en}
          </span>
        </div>
      </Reveal>

      <Reveal delay={0.08}>
        <Tag className="mt-4 font-display text-2xl leading-tight font-bold tracking-display uppercase">
          {title}
        </Tag>
      </Reveal>

      {lead && (
        <Reveal delay={0.14}>
          <p className={`mt-5 text-base ${ink ? "text-ink-dim" : "text-bone-dim"}`}>{lead}</p>
        </Reveal>
      )}
    </div>
  );
}

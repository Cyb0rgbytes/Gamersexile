/* ═══════════════════════════════════════════════════════════════════════════
 *  MARQUEE
 *  Infinite bilingual band. The track renders its items TWICE and translates
 *  exactly -50%, so the loop point lands on an identical frame and the seam is
 *  invisible. Changing either half without the other breaks the illusion.
 *
 *  Server component: the motion is a CSS keyframe, and the global
 *  prefers-reduced-motion rule in globals.css freezes it. No JS involved.
 * ═══════════════════════════════════════════════════════════════════════════ */

export interface MarqueeItem {
  text: string;
  /** Japanese accent entry: JP face, accent colour, lang="ja". Flagged
   *  explicitly, because sniffing for CJK would also catch Chinese and
   *  Japanese translations of the phrases. */
  jp?: boolean;
}

interface MarqueeProps {
  items: MarqueeItem[];
  className?: string;
}

export function Marquee({ items, className = "" }: MarqueeProps) {
  return (
    <div
      className={`relative flex overflow-hidden border-y border-steel-line bg-steel/40 py-3.5 ${className}`}
      // The strings are decorative brand texture and repeat twice in the DOM.
      aria-hidden="true"
      // The loop translates -50% on X, which only seams cleanly in LTR flow.
      // Each item still shapes in its own script direction inside.
      dir="ltr"
    >
      {/* Edge fades so the band dissolves rather than being cut off. */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-void to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-void to-transparent" />

      <div className="animate-marquee flex shrink-0 items-center gap-8 pe-8 whitespace-nowrap">
        {[...items, ...items].map((item, i) => (
          <span key={i} className="flex items-center gap-8">
            <span
              lang={item.jp ? "ja" : undefined}
              className={`text-sm tracking-[0.2em] uppercase ${
                item.jp ? "font-jp text-crimson-hot" : "font-display text-bone-faint"
              }`}
            >
              {item.text}
            </span>
            <span className="size-1 rotate-45 bg-crimson/50" />
          </span>
        ))}
      </div>
    </div>
  );
}

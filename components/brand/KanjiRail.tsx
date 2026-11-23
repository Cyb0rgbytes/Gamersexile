/* ═══════════════════════════════════════════════════════════════════════════
 *  KANJI RAIL
 *  A vertical strip of Japanese text running down the edge of a section, with
 *  a hairline and a terminal dot. This is the accent layer's signature move —
 *  it fills the wide outer margins that a centred layout leaves empty on
 *  desktop without competing with the English content.
 *
 *  Hidden below `lg` (the margins do not exist on narrow viewports) and
 *  aria-hidden throughout: it is texture, not information.
 * ═══════════════════════════════════════════════════════════════════════════ */

interface KanjiRailProps {
  text: string;
  side?: "left" | "right";
  /** Distance from the viewport edge. */
  offset?: string;
  className?: string;
}

export function KanjiRail({
  text,
  side = "left",
  offset = "1.75rem",
  className = "",
}: KanjiRailProps) {
  return (
    <div
      aria-hidden="true"
      // Fixed w-4: a vertical-rl child inside a flex column was resolving to a
      // ~58px box, which pushed the rail's centre line onto the content gutter
      // and over the section eyebrows. The glyphs are 11px; 16px holds them.
      className={`pointer-events-none absolute top-0 hidden h-full w-4 select-none lg:flex lg:flex-col lg:items-center ${className}`}
      style={{ [side]: offset } as React.CSSProperties}
    >
      <span className="h-16 w-px bg-gradient-to-b from-transparent to-steel-hi" />
      <span className="vertical-jp py-5 text-[0.7rem] tracking-[0.42em] text-bone-faint/55">
        {text}
      </span>
      <span className="w-px flex-1 bg-gradient-to-b from-steel-hi to-transparent" />
      <span className="mb-8 size-1 rounded-full bg-crimson/60" />
    </div>
  );
}

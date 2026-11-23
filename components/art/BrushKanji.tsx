/* ═══════════════════════════════════════════════════════════════════════════
 *  BRUSH KANJI — a word in brush script with its reading and meaning.
 *
 *  The rule from the mood boards: the kanji is never orphaned decoration. It
 *  always carries its romaji and an English label, so a visitor who can't
 *  read Japanese still gets the meaning — the kanji is the image, the label
 *  is the information.
 *
 *  Presentational only. Wrap in <BrushReveal> for the scroll-in sweep.
 * ═══════════════════════════════════════════════════════════════════════════ */

interface BrushKanjiProps {
  kanji: string;
  en: string;
  romaji?: string;
  /** night = bone brush on dark; ink = black brush on paper. */
  tone?: "night" | "ink";
  size?: "md" | "lg" | "xl";
  /** Stack the glyphs vertically, as on the hanging scrolls. */
  vertical?: boolean;
  className?: string;
}

const SIZES = {
  md: "text-[clamp(2.75rem,5vw,4rem)]",
  lg: "text-[clamp(3.5rem,8vw,6.5rem)]",
  xl: "text-[clamp(4.5rem,14vw,11rem)]",
};

export function BrushKanji({
  kanji,
  en,
  romaji,
  tone = "night",
  size = "lg",
  vertical = false,
  className = "",
}: BrushKanjiProps) {
  const ink = tone === "ink";

  return (
    <figure className={`flex flex-col items-center text-center ${className}`}>
      <span
        lang="ja"
        className={`font-brush leading-[0.95] select-none ${SIZES[size]} ${
          vertical ? "[writing-mode:vertical-rl]" : ""
        } ${ink ? "text-ink" : "text-bone"}`}
        // Brush strokes get a faint bleed on night so they don't look pasted
        // on; on paper the ink is crisp.
        style={ink ? undefined : { textShadow: "0 0 18px rgb(0 0 0 / 0.6)" }}
      >
        {kanji}
      </span>
      <figcaption className="mt-3 flex flex-col items-center gap-1">
        {romaji && (
          <span
            className={`font-mono text-[0.7rem] tracking-[0.12em] ${
              ink ? "text-ink-dim" : "text-bone-faint"
            }`}
          >
            [{romaji}]
          </span>
        )}
        <span
          className={`font-display text-sm font-semibold tracking-[0.32em] uppercase ${
            ink ? "text-ink" : "text-bone"
          }`}
        >
          {en}
        </span>
      </figcaption>
    </figure>
  );
}

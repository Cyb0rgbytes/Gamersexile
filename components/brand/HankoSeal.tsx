/* ═══════════════════════════════════════════════════════════════════════════
 *  HANKO SEAL
 *  A Japanese name-stamp: a single kanji in a rounded-square crimson frame,
 *  rotated a few degrees so it reads as pressed by hand rather than placed by
 *  a layout engine.
 *
 *  Used to mark the four brand pillars, the culture values and each event row.
 *  It is decoration, so it is aria-hidden — the English label beside it always
 *  carries the meaning.
 * ═══════════════════════════════════════════════════════════════════════════ */

interface HankoSealProps {
  kanji: string;
  size?: number;
  /** "solid" fills the stamp (high emphasis); "outline" is the default. */
  variant?: "solid" | "outline";
  className?: string;
}

export function HankoSeal({
  kanji,
  size = 52,
  variant = "outline",
  className = "",
}: HankoSealProps) {
  const solid = variant === "solid";

  return (
    <span
      aria-hidden="true"
      className={`inline-grid place-items-center rounded-[22%] border-2 select-none ${
        solid
          ? "border-crimson bg-crimson text-white"
          : "border-crimson/70 text-crimson-hot bg-crimson/8"
      } ${className}`}
      style={{
        width: size,
        height: size,
        // A real stamp is never quite square to the page.
        transform: "rotate(-4deg)",
      }}
    >
      <span
        className="font-jp leading-none"
        style={{ fontSize: size * 0.5, paddingTop: size * 0.02 }}
      >
        {kanji}
      </span>
    </span>
  );
}

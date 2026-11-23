/* ═══════════════════════════════════════════════════════════════════════════
 *  PROCEDURAL ART PRIMITIVES
 *
 *  There is no photography for this project — the only real asset is the logo.
 *  Every surface that would normally carry an image is generated here instead:
 *  gradient meshes seeded from a hue, an SVG grain overlay, and a hex grid.
 *
 *  All three are server components rendering static markup. The grain and grid
 *  are defined ONCE at the document level (NoiseDefs, mounted in the layout)
 *  and referenced by URL, so 40 cards on a page share a single filter instance
 *  rather than each instantiating their own feTurbulence — which is the
 *  difference between a smooth page and a stuttering one.
 * ═══════════════════════════════════════════════════════════════════════════ */

/** Mounted once in app/layout.tsx. Everything below references these by id. */
export function NoiseDefs() {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute size-0"
      focusable="false"
    >
      <defs>
        {/* Film grain. baseFrequency this high gives per-pixel noise; the
         * desaturating matrix stops it tinting the crimson surfaces green. */}
        <filter id="grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.82"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>

        <pattern
          id="hexgrid"
          width="56"
          height="48"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M28 0 L56 16 L56 40 L28 56 L0 40 L0 16 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          />
        </pattern>

        <pattern id="dotgrid" width="22" height="22" patternUnits="userSpaceOnUse">
          <circle cx="1.5" cy="1.5" r="1.5" fill="currentColor" />
        </pattern>

        <pattern
          id="hatch"
          width="10"
          height="10"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
        >
          <line x1="0" y1="0" x2="0" y2="10" stroke="currentColor" strokeWidth="2" />
        </pattern>
      </defs>
    </svg>
  );
}

/* ── Grain overlay ─────────────────────────────────────────────────────── */

export function Grain({
  opacity = 0.16,
  className = "",
}: {
  opacity?: number;
  className?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 size-full mix-blend-overlay ${className}`}
      style={{ opacity }}
    >
      <rect width="100%" height="100%" filter="url(#grain)" />
    </svg>
  );
}

/* ── Patterned overlay ─────────────────────────────────────────────────── */

export type PatternName = "hexgrid" | "dotgrid" | "hatch";

export function PatternOverlay({
  pattern = "hexgrid",
  opacity = 0.12,
  className = "",
}: {
  pattern?: PatternName;
  opacity?: number;
  className?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 size-full text-bone ${className}`}
      style={{ opacity }}
    >
      <rect width="100%" height="100%" fill={`url(#${pattern})`} />
    </svg>
  );
}

/* ── Gradient mesh ─────────────────────────────────────────────────────────
 * Three offset radial blooms in the item's own hue. Deterministic: the same
 * hue always produces the same mesh, so a card looks identical between server
 * and client renders and across reloads. */

export function GradientMesh({
  hue,
  intensity = 1,
  className = "",
}: {
  hue: number;
  intensity?: number;
  className?: string;
}) {
  const a = `oklch(0.62 0.19 ${hue} / ${0.5 * intensity})`;
  const b = `oklch(0.55 0.16 ${(hue + 42) % 360} / ${0.34 * intensity})`;
  const c = `oklch(0.48 0.13 ${(hue + 310) % 360} / ${0.28 * intensity})`;

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 ${className}`}
      style={{
        backgroundImage: `
          radial-gradient(60% 70% at 18% 12%, ${a}, transparent 62%),
          radial-gradient(52% 62% at 88% 28%, ${b}, transparent 60%),
          radial-gradient(70% 58% at 52% 104%, ${c}, transparent 66%)
        `,
      }}
    />
  );
}

/* ── Kanji watermark ───────────────────────────────────────────────────────
 * Oversized, cropped Japanese glyphs as card and section art. This is what
 * replaces the character render in the reference shots. */

export function KanjiWatermark({
  kanji,
  className = "",
  size = "clamp(7rem, 20vw, 14rem)",
  opacity = 0.07,
}: {
  kanji: string;
  className?: string;
  size?: string;
  opacity?: number;
}) {
  return (
    <span
      aria-hidden="true"
      className={`font-jp pointer-events-none absolute leading-none font-bold text-bone select-none ${className}`}
      style={{ fontSize: size, opacity }}
    >
      {kanji}
    </span>
  );
}

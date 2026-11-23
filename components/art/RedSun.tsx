import { useId } from "react";

/* ═══════════════════════════════════════════════════════════════════════════
 *  RED SUN — the signature motif (hinomaru).
 *
 *  One flat crimson disc does most of the work; the only "effects" are a
 *  slightly darker rim (so it sits IN the scene rather than on it) and an
 *  optional brush edge, a turbulence displacement that roughs the outline
 *  like an ink stamp. Used big in the hero, small as section markers.
 * ═══════════════════════════════════════════════════════════════════════════ */

interface RedSunProps {
  /** Rendered width/height in px or any CSS length. Defaults to fill parent. */
  size?: number | string;
  /** Rough, stamped edge instead of a clean circle. */
  brush?: boolean;
  /** Soft crimson halo behind the disc (night scenes only). */
  glow?: boolean;
  className?: string;
}

export function RedSun({
  size = "100%",
  brush = false,
  glow = false,
  className = "",
}: RedSunProps) {
  // Filter / gradient ids must be unique per instance or the second sun on a
  // page silently reuses the first one's defs.
  const id = useId().replace(/:/g, "");

  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      aria-hidden="true"
      className={`overflow-visible ${className}`}
    >
      <defs>
        <radialGradient id={`sun-${id}`} cx="42%" cy="38%" r="62%">
          <stop offset="0%" stopColor="#F43F5E" />
          <stop offset="70%" stopColor="#E11D48" />
          <stop offset="100%" stopColor="#BE123C" />
        </radialGradient>
        {glow && (
          <radialGradient id={`halo-${id}`}>
            <stop offset="45%" stopColor="#E11D48" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#E11D48" stopOpacity="0" />
          </radialGradient>
        )}
        {brush && (
          <filter id={`brush-${id}`} x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="3" seed="7" />
            <feDisplacementMap in="SourceGraphic" scale="7" />
          </filter>
        )}
      </defs>

      {glow && <circle cx="100" cy="100" r="100" fill={`url(#halo-${id})`} />}
      <circle
        cx="100"
        cy="100"
        r="70"
        fill={`url(#sun-${id})`}
        filter={brush ? `url(#brush-${id})` : undefined}
      />
    </svg>
  );
}

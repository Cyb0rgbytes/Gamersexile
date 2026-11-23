/* ═══════════════════════════════════════════════════════════════════════════
 *  TORII — gate silhouette, drawn from scratch (no traced artwork).
 *
 *  Anatomy, top down: kasagi (the upswept top beam), shimaki under it, the
 *  gakuzuka plaque post, nuki (the through-beam), and two slightly splayed
 *  hashira (pillars). A myōjin torii; the upswept kasagi is what makes it read
 *  instantly as a torii and not as a doorway.
 *
 *  `neon` adds a violet tube outline over the silhouette for night scenes.
 * ═══════════════════════════════════════════════════════════════════════════ */

const GATE = [
  // Kasagi: a shallow arc with flared tips.
  "M8 34 Q100 12 192 34 L196 26 Q100 0 4 26 Z",
  // Shimaki
  "M22 36 H178 V46 H22 Z",
  // Gakuzuka (centre post between the beams)
  "M94 46 H106 V72 H94 Z",
  // Nuki — extends past the pillars, as on real gates
  "M14 72 H186 V82 H14 Z",
  // Hashira — tapered: narrower at the top
  "M40 46 H54 L57 200 H37 Z",
  "M146 46 H160 L163 200 H143 Z",
].join(" ");

interface ToriiProps {
  className?: string;
  /** Silhouette fill. Defaults to currentColor so Tailwind text-* sets it. */
  fill?: string;
  neon?: boolean;
}

export function Torii({ className = "", fill = "currentColor", neon = false }: ToriiProps) {
  return (
    <svg
      viewBox="0 0 200 200"
      preserveAspectRatio="xMidYMax meet"
      aria-hidden="true"
      // overflow visible: the neon drop-shadow must spill past the viewBox, or
      // it is clipped to a hard rectangle once the gate is scaled.
      className={`overflow-visible ${className}`}
    >
      <path d={GATE} fill={fill} />
      {neon && (
        <path
          d={GATE}
          fill="none"
          stroke="#A78BFA"
          strokeWidth="1.2"
          strokeLinejoin="round"
          style={{ filter: "drop-shadow(0 0 3px #8B5CF6) drop-shadow(0 0 10px #8B5CF6)" }}
        />
      )}
    </svg>
  );
}

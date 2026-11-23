/* ═══════════════════════════════════════════════════════════════════════════
 *  SKYLINE — procedural night city with pagodas, seeded.
 *
 *  Same idea as the existing `hue`-seeded card art: deterministic from a seed,
 *  so the server and client render identical paths (no hydration mismatch)
 *  and two cards with different seeds never share a silhouette.
 *
 *  Each tower gets a few lit windows; every Nth slot becomes a tiered pagoda,
 *  which is what turns "generic city" into the neo-Tokyo of the mood boards.
 * ═══════════════════════════════════════════════════════════════════════════ */

/** mulberry32 — tiny, fast, good enough for layout jitter. */
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const W = 1200;
const H = 300;

function pagoda(x: number, w: number, tiers: number, base: number): string {
  // Stacked roofs, each narrower; eaves flare past the body.
  let d = "";
  let y = base;
  let bw = w;
  const tierH = Math.min(34, (base - 40) / (tiers + 1));
  for (let i = 0; i < tiers; i++) {
    const cx = x + w / 2;
    const body = bw * 0.62;
    d += `M${cx - body / 2} ${y} V${y - tierH * 0.55} H${cx + body / 2} V${y} Z `;
    const ry = y - tierH * 0.55;
    d += `M${cx - bw / 2 - 6} ${ry + 4} Q${cx} ${ry - tierH * 0.7} ${cx + bw / 2 + 6} ${ry + 4} Z `;
    y = ry - tierH * 0.25;
    bw *= 0.78;
  }
  const cx = x + w / 2;
  d += `M${cx - 1.5} ${y} V${y - 26} H${cx + 1.5} V${y} Z`; // sōrin spire
  return d;
}

interface SkylineProps {
  seed?: number;
  /** Tallest building as a fraction of the viewBox height. */
  height?: number;
  /** Every Nth slot is a pagoda. 0 disables. */
  pagodaEvery?: number;
  fill?: string;
  /** Window colour; null for a pure silhouette (far layers). */
  windows?: string | null;
  className?: string;
}

export function Skyline({
  seed = 1,
  height = 0.75,
  pagodaEvery = 5,
  fill = "currentColor",
  windows = null,
  className = "",
}: SkylineProps) {
  const r = rng(seed);
  let d = "";
  const lit: { x: number; y: number }[] = [];

  let x = -10;
  let slot = 0;
  while (x < W + 10) {
    const w = 34 + r() * 70;
    if (pagodaEvery && slot % pagodaEvery === pagodaEvery - 1) {
      d += pagoda(x, w * 1.3, 3 + Math.floor(r() * 3), H) + " ";
      x += w * 1.3 + 4;
    } else {
      const h = H * (0.2 + r() * (height - 0.2));
      const top = H - h;
      d += `M${x} ${H} V${top} H${x + w} V${H} Z `;
      // Occasional antenna on taller towers.
      if (h > H * 0.5 && r() > 0.55) {
        const ax = x + w * (0.3 + r() * 0.4);
        d += `M${ax} ${top} V${top - 18 - r() * 22} H${ax + 2} V${top} Z `;
      }
      if (windows) {
        const n = Math.floor(r() * 6);
        for (let i = 0; i < n; i++) {
          lit.push({ x: x + 6 + r() * (w - 14), y: top + 10 + r() * (h - 24) });
        }
      }
      x += w + 2 + r() * 6;
    }
    slot++;
  }

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
      className={className}
    >
      <path d={d} fill={fill} />
      {windows &&
        lit.map((p, i) => (
          <rect key={i} x={p.x.toFixed(1)} y={p.y.toFixed(1)} width="3" height="5" fill={windows} />
        ))}
    </svg>
  );
}

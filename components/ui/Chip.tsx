/* Status and category chips. `live` is violet neon with a pinging dot — crimson
 * is the brand (the sun) and cannot also mean "on air". Jade is for wins. */

type Tone = "crimson" | "live" | "jade" | "rose" | "neutral";

const TONES: Record<Tone, string> = {
  crimson: "border-crimson/45 bg-crimson/12 text-crimson-hot",
  live: "border-violet/60 bg-violet/12 text-violet-hot shadow-violet-soft",
  jade: "border-jade/45 bg-jade/12 text-jade",
  rose: "border-rose/45 bg-rose/12 text-rose",
  neutral: "border-steel-line bg-steel text-bone-dim",
};

interface ChipProps {
  children: React.ReactNode;
  tone?: Tone;
  /** Adds the animated ping dot. */
  pulse?: boolean;
  className?: string;
}

export function Chip({
  children,
  tone = "neutral",
  pulse = false,
  className = "",
}: ChipProps) {
  return (
    <span
      className={`clip-tag inline-flex items-center gap-2 border px-2.5 py-1 font-display text-[0.65rem] font-semibold tracking-[0.18em] uppercase ${TONES[tone]} ${className}`}
    >
      {pulse && (
        <span className="relative flex size-1.5">
          <span className="animate-live-ping absolute inline-flex size-full rounded-full bg-current" />
          <span className="relative inline-flex size-1.5 rounded-full bg-current" />
        </span>
      )}
      {children}
    </span>
  );
}

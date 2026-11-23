import { LocaleLink as Link } from "@/components/i18n/LocaleLink";

/* ═══════════════════════════════════════════════════════════════════════════
 *  NOTCH BUTTON
 *  The site's clipped-corner CTA. Two-cut geometry from the reference shots.
 *
 *  Accessibility notes, both load-bearing:
 *
 *  1. The SOLID variant takes a VOID label, never white. Computed against
 *     --color-crimson: void = 6.8:1 (AA), white = 2.9:1 (fail). On a dark site
 *     the instinct is white text, so it is fixed here rather than per call site.
 *
 *  2. clip-path crops outlines, so :focus-visible draws an INSET ring — see
 *     the base layer in globals.css. Never add `outline` to a clipped element;
 *     it will be invisible.
 * ═══════════════════════════════════════════════════════════════════════════ */

type Variant = "solid" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

interface NotchButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  /** Adds target/rel. Set for the Discord CTA and every social link. */
  external?: boolean;
  className?: string;
}

const VARIANTS: Record<Variant, string> = {
  solid:
    "bg-crimson text-white font-semibold hover:bg-crimson-hot shadow-crimson-soft hover:shadow-crimson",
  outline:
    "border border-crimson/60 text-crimson-hot hover:border-crimson hover:text-crimson-hot hover:bg-crimson/8",
  ghost:
    "border border-steel-line text-bone-dim hover:border-steel-hi hover:text-bone hover:bg-steel",
};

const SIZES: Record<Size, string> = {
  sm: "px-4 py-2 text-xs clip-notch-sm",
  md: "px-6 py-3 text-sm clip-notch-sm",
  lg: "px-8 py-4 text-base clip-notch",
};

export function NotchButton({
  href,
  children,
  variant = "solid",
  size = "md",
  external = false,
  className = "",
}: NotchButtonProps) {
  const classes = `inline-flex items-center justify-center gap-2.5 font-display uppercase tracking-[0.14em] transition-all duration-300 ${VARIANTS[variant]} ${SIZES[size]} ${className}`;

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}

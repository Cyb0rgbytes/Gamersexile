import { LocaleLink as Link } from "@/components/i18n/LocaleLink";
import { ServerLogo } from "./ServerLogo";
import { SITE } from "@/lib/site";
import { fill } from "@/lib/i18n/config";

/* Mark + wordmark. The Japanese line under the wordmark is the accent layer's
 * smallest appearance — it sets the bilingual expectation in the first 100px
 * of the page. */

interface LogoLockupProps {
  size?: number;
  /** Hides the wordmark, leaving the mark alone. */
  markOnly?: boolean;
  /**
   * Drops the wordmark below 420px. The header needs this — at 390px the
   * lockup, the Join CTA and the menu trigger do not all fit — but the footer
   * has the full width, so it is opt-in rather than the default.
   */
  responsiveWordmark?: boolean;
  href?: string | null;
  /** Accessible name of the home link; "{name}" is replaced with the site name. */
  homeLabel?: string;
  /** Alt text for the emblem image. */
  emblemAlt?: string;
  className?: string;
}

export function LogoLockup({
  size = 38,
  markOnly = false,
  responsiveWordmark = false,
  href = "/",
  homeLabel = "{name} — home",
  emblemAlt,
  className = "",
}: LogoLockupProps) {
  const inner = (
    <>
      <ServerLogo size={size} priority alt={emblemAlt} />
      {!markOnly && (
        <span
          className={`flex-col leading-none ${
            responsiveWordmark ? "hidden min-[420px]:flex" : "flex"
          }`}
        >
          {/* nowrap: at 390px the two words wrapped and pushed the lockup into
           * the header CTA. The mark alone carries the brand below `sm`. */}
          <span className="font-display text-[0.95rem] font-bold tracking-[0.18em] whitespace-nowrap text-bone uppercase">
            Gamer&rsquo;s Exile
          </span>
          <span lang="ja" className="font-jp text-[0.6rem] tracking-[0.3em] text-bone-faint mt-1">
            {SITE.kanji}
          </span>
        </span>
      )}
    </>
  );

  const classes = `inline-flex items-center gap-3 ${className}`;

  if (!href) return <span className={classes}>{inner}</span>;

  return (
    <Link
      href={href}
      className={`${classes} transition-opacity hover:opacity-80`}
      aria-label={fill(homeLabel, { name: SITE.name })}
    >
      {inner}
    </Link>
  );
}

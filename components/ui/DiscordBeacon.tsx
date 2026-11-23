import { SocialIcon } from "@/components/ui/SocialIcon";
import { SITE } from "@/lib/site";
import { getDictionary } from "@/lib/i18n/dictionaries";

/* ═══════════════════════════════════════════════════════════════════════════
 *  DISCORD BEACON
 *  A glowing Discord button fixed bottom-end on every page, so the main CTA
 *  is always one tap away however far down a visitor has scrolled.
 *
 *  Discord blurple (#5865F2) with a violet neon halo, which sits naturally in
 *  the night palette. The glow breathes and a ring pings outward. Under
 *  reduced motion the global rule in globals.css freezes both, leaving a
 *  static glow. The label slides out on hover/focus from md up; on phones
 *  it stays a compact icon, and the accessible name is always the full text.
 * ═══════════════════════════════════════════════════════════════════════════ */

export async function DiscordBeacon() {
  const t = await getDictionary();

  return (
    <a
      href={SITE.discord}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t.common.beacon.ariaLabel}
      className="group fixed end-4 bottom-4 z-80 flex items-center sm:end-6 sm:bottom-6"
    >
      {/* Label: hidden until hover/focus, md and up only. */}
      <span
        aria-hidden="true"
        className="pointer-events-none me-3 hidden translate-x-2 rtl:-translate-x-2 rounded-full border border-violet/50 bg-void/90 px-4 py-2 font-display text-[0.7rem] font-semibold tracking-[0.18em] whitespace-nowrap text-bone uppercase opacity-0 shadow-violet-soft backdrop-blur transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 md:block"
      >
        {t.common.beacon.label}
      </span>

      <span className="relative grid size-14 place-items-center">
        {/* Expanding ring */}
        <span
          aria-hidden="true"
          className="animate-beacon-ring absolute inset-0 rounded-full border-2 border-[#5865F2]"
        />
        {/* Button face */}
        <span className="animate-beacon-glow relative grid size-14 place-items-center rounded-full bg-[#5865F2] text-white transition-transform duration-300 group-hover:scale-110 group-active:scale-95">
          <SocialIcon name="discord" size={26} />
        </span>
      </span>
    </a>
  );
}

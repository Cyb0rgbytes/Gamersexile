"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { NotchButton } from "@/components/ui/NotchButton";
import { Grain } from "@/components/ui/Texture";
import { Sakura } from "@/components/art/Sakura";
import { gsap, useGSAP } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { SITE } from "@/lib/site";
import { HIGHLIGHTS } from "@/lib/community";
import type { Dictionary } from "@/lib/i18n/dictionaries";

/* ═══════════════════════════════════════════════════════════════════════════
 *  HERO — "Exile at the Red Sun"
 *
 *  The scene is the "Sakura Shrine" artwork (public/art/hero-sakura.webp,
 *  from Assets/Backgrounds): a torii before a lantern-lit shrine at night.
 *  On md+ the image sits at the end side of the text column (right in LTR,
 *  left in RTL) so the gate stays visible;
 *  on phones it fills the section under a stronger scrim.
 *
 *  Layers, back to front:
 *    1. Shrine image
 *    2. Sakura canvas (petals drift over the artwork's own)
 *    3. Scrims: left fade for the text, bottom fade into the next section
 *    4. Content (headline, CTAs, highlights row)
 *    5. Grain over everything to bind the layers into one image
 *
 *  Scroll (≥768px, motion allowed): the section PINS for ~90vh while the
 *  shrine slowly pushes in and the content lifts away. Below 768px there is
 *  no pin (pins on phones fight the browser chrome); the image gets a light
 *  parallax instead.
 * ═══════════════════════════════════════════════════════════════════════════ */

/* The headline is a list of words from the dictionary (home.hero.headline)
 * plus the index of the word set in crimson, so a language can reorder the
 * phrase and still highlight the right word. Strings arrive as props from
 * the server page. */

export function Hero({ t }: { t: Dictionary["home"]["hero"] }) {
  const reduce = usePrefersReducedMotion();
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const q = gsap.utils.selector(root);

      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        gsap
          .timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: root.current,
              start: "top top",
              end: "+=90%",
              pin: true,
              scrub: 0.6,
              anticipatePin: 1,
            },
          })
          .to(q("[data-l='scene']"), { scale: 1.12, yPercent: 3 }, 0)
          .to(q("[data-l='content']"), { yPercent: -14, opacity: 0 }, 0.35);
      });

      mm.add("(max-width: 767px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.to(q("[data-l='scene']"), {
          yPercent: 12,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      className="relative flex min-h-[100svh] items-center overflow-hidden bg-void pt-32 pb-24"
    >
      {/* ── 1. Shrine ──
       * Full-bleed on phones; from md the frame starts at 22% so the torii
       * sits beside the headline instead of under it. Scaled from the
       * centre-bottom so the push-in moves toward the gate. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden md:start-[22%]"
      >
        <div data-l="scene" className="absolute inset-0 origin-[50%_70%]">
          <Image
            src="/art/hero-sakura.webp"
            alt=""
            fill
            priority
            sizes="(min-width: 768px) 78vw, 100vw"
            className="object-cover object-[50%_45%]"
          />
        </div>
      </div>

      {/* ── 2. Sakura ── */}
      <Sakura count={28} />

      {/* ── 3. Scrims ──
       * These keep body copy at AA over the artwork: the text column always
       * sits on near-solid void on md+, and on a 65% void wash on phones.
       * The bottom fade hands the scene off to the page below. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-void/65 md:bg-transparent md:bg-[linear-gradient(to_right,var(--color-void)_0%,var(--color-void)_24%,color-mix(in_oklab,var(--color-void)_70%,transparent)_42%,transparent_70%)] rtl:md:bg-[linear-gradient(to_left,var(--color-void)_0%,var(--color-void)_24%,color-mix(in_oklab,var(--color-void)_70%,transparent)_42%,transparent_70%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-void/80 to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-void to-transparent"
      />

      <div data-l="content" className="relative z-10 mx-auto w-full max-w-[110rem] px-gutter">
        <div className="max-w-4xl">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap items-center gap-x-3 gap-y-1"
          >
            {/* nowrap on both halves: at 390px the katakana broke mid-word. */}
            <span lang="ja" className="font-jp text-sm whitespace-nowrap text-crimson-hot">{SITE.nameJp}</span>
            <span className="hidden h-px w-10 bg-crimson/60 sm:block" />
            <span className="font-display text-eyebrow tracking-eyebrow whitespace-nowrap text-bone-faint uppercase">
              {t.eyebrow}
            </span>
          </motion.div>

          {/* Per-word stagger. Each word has its own overflow mask so the
           * letters rise from behind a hard edge rather than fading in. */}
          <h1 className="mt-6 font-display text-display leading-display font-bold tracking-display text-bone uppercase italic">
            {t.headline.map((word, i) => (
              <span key={i} className="inline-block overflow-hidden pe-[0.22em] align-bottom">
                <motion.span
                  className={`inline-block ${i === t.highlightIndex ? "text-crimson-hot" : ""}`}
                  initial={reduce ? false : { y: "110%" }}
                  animate={{ y: "0%" }}
                  transition={{ duration: 0.9, delay: 0.1 + i * 0.09, ease: [0.16, 1, 0.3, 1] }}
                >
                  {word}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 max-w-xl text-base text-bone-dim lg:text-lg"
          >
            {t.lead}
          </motion.p>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.56, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10 flex flex-wrap gap-4"
          >
            <NotchButton href={SITE.discord} external size="lg">
              {t.ctaPrimary}
            </NotchButton>
            <NotchButton href="/tournaments" variant="outline" size="lg">
              {t.ctaSecondary}
            </NotchButton>
          </motion.div>

          {/* ── Highlights row ── */}
          <motion.dl
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.75 }}
            className="mt-12 grid max-w-xl grid-cols-3 gap-x-6 gap-y-6"
          >
            {HIGHLIGHTS.map((stat) => (
              <div key={stat.key} className="flex flex-col border-s border-crimson/50 ps-4">
                {/* dt first in the DOM (a <dl> pairs term → value); order-*
                 * keeps the figure visually on top. */}
                <dt className="order-2 mt-1.5 font-display text-[0.65rem] tracking-[0.18em] text-bone-faint uppercase">
                  {t.highlights[stat.key]}
                  <span lang="ja" className="block font-jp text-[0.6rem] tracking-normal text-bone-faint/70 normal-case">
                    {stat.jp}
                  </span>
                </dt>
                <dd className="order-1 font-mono text-xl font-bold text-bone">{stat.value ?? t.soon}</dd>
              </div>
            ))}
          </motion.dl>
        </div>
      </div>

      {/* ── 5. Grain ── */}
      <Grain opacity={0.12} />

      {/* Scroll cue */}
      <div
        aria-hidden="true"
        className="absolute bottom-7 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2.5 lg:flex"
      >
        <span className="font-display text-[0.6rem] tracking-[0.28em] text-bone-faint uppercase">{t.scroll}</span>
        <span className="h-12 w-px bg-gradient-to-b from-crimson/70 to-transparent" />
      </div>
    </section>
  );
}

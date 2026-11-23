import { RedSun } from "@/components/art/RedSun";
import { Torii } from "@/components/art/Torii";
import { ParallaxLayer } from "@/components/motion/ParallaxLayer";
import { NotchButton } from "@/components/ui/NotchButton";
import { Reveal } from "@/components/ui/Reveal";
import { Grain } from "@/components/ui/Texture";
import { SITE } from "@/lib/site";
import { getDictionary } from "@/lib/i18n/dictionaries";

/* Closing CTA, repeated at the foot of every page. A red sun RISES behind
 * the text as the section scrolls up (the hero sun sets; this one rises — the
 * page opens and closes on the same motif), with a torii framing the CTA. */

export async function JoinCta({ heading, lead }: { heading?: string; lead?: string }) {
  const t = await getDictionary();
  heading ??= t.common.joinCta.heading;
  lead ??= t.common.joinCta.lead;

  return (
    <section className="relative overflow-hidden py-section">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_50%,color-mix(in_oklab,#E11D48_16%,transparent),transparent_70%)]"
      />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-[12%] mx-auto w-[min(34rem,80vw)] opacity-30">
        <ParallaxLayer speed={-0.2}>
          <RedSun glow brush />
        </ParallaxLayer>
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-1/2 h-[70%] -translate-x-1/2 text-steel opacity-30"
      >
        <Torii neon className="h-full w-auto" />
      </div>
      {/* Keeps the copy on near-void whatever the sun and gate do behind it. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_45%_55%_at_50%_55%,rgb(7_6_11/0.85),transparent_75%)]"
      />

      <div className="relative mx-auto max-w-3xl px-gutter text-center">
        <Reveal>
          <p lang="ja" className="font-jp text-sm tracking-[0.3em] text-crimson-hot">入隊</p>
        </Reveal>

        <Reveal delay={0.08}>
          <h2 className="mt-5 font-display text-3xl leading-display font-bold tracking-display text-bone uppercase italic">
            {heading}
          </h2>
        </Reveal>

        <Reveal delay={0.14}>
          <p className="mx-auto mt-6 max-w-xl text-base text-bone-dim">{lead}</p>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <NotchButton href={SITE.discord} external size="lg">
              {t.common.cta.joinTheDiscord}
            </NotchButton>
            <NotchButton href="/join" variant="outline" size="lg">
              {t.common.joinCta.secondary}
            </NotchButton>
          </div>
        </Reveal>

        <Reveal delay={0.26}>
          <p className="mt-8 font-display text-[0.65rem] tracking-[0.22em] text-bone-faint uppercase">
            {t.common.cta.freeLine}
          </p>
        </Reveal>
      </div>

      <Grain opacity={0.12} />
    </section>
  );
}

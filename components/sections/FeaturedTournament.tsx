import type { ReactNode } from "react";
import { Chip } from "@/components/ui/Chip";
import { Countdown } from "@/components/ui/Countdown";
import { NotchButton } from "@/components/ui/NotchButton";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GradientMesh, Grain } from "@/components/ui/Texture";
import { RedSun } from "@/components/art/RedSun";
import { Torii } from "@/components/art/Torii";
import { Skyline } from "@/components/art/Skyline";
import { ParallaxLayer } from "@/components/motion/ParallaxLayer";
import { FEATURED_TOURNAMENT } from "@/lib/tournaments";
import { SITE } from "@/lib/site";
import { getDictionary } from "@/lib/i18n/dictionaries";

/* The featured tournament, given the full-width split treatment: procedural
 * art panel on one side, countdown and detail on the other. */

export async function FeaturedTournament() {
  const dict = await getDictionary();
  const c = dict.home.featured;
  const s = dict.common.status;
  const t = FEATURED_TOURNAMENT;
  // null = nothing scheduled yet; the panel shows "Coming Soon" instead.

  return (
    <section className="relative py-section">
      <div className="mx-auto max-w-[110rem] px-gutter">
        <SectionHeading
          eyebrow={{ en: c.eyebrow, jp: "次の大会" }}
          title={c.title}
        />

        <Reveal className="mt-12">
          <article className="clip-notch relative grid overflow-hidden border border-steel-line bg-steel lg:grid-cols-2">
            <ArtPanel
              hue={t?.hue ?? 348}
              kanji={t ? t.jp.split(/\s+/).pop() ?? "" : "近日"}
              chips={
                t ? (
                  <>
                    <Chip tone="crimson">{s.featured}</Chip>
                    <Chip tone="neutral">{t.region}</Chip>
                  </>
                ) : (
                  <Chip tone="crimson">{s.comingSoon}</Chip>
                )
              }
            />

            {/* Detail panel */}
            {t ? (
              <div className="flex flex-col justify-center p-7 sm:p-10">
                <p className="font-display text-[0.7rem] tracking-[0.22em] text-crimson-hot uppercase">
                  {t.game}
                </p>

                <h3 className="mt-3 font-display text-2xl font-bold tracking-display text-bone uppercase">
                  {t.title}
                </h3>
                <p className="font-jp mt-2 text-sm text-bone-faint">{t.jp}</p>

                <div className="mt-8">
                  <p className="font-display text-[0.6rem] tracking-[0.22em] text-bone-faint uppercase">
                    {c.bracketOpensIn}
                  </p>
                  <Countdown target={t.startsAt} labels={dict.common.countdown} className="mt-3" />
                </div>

                <dl className="mt-8 grid grid-cols-3 gap-4 border-t border-steel-line pt-6">
                  <div>
                    <dt className="font-display text-[0.6rem] tracking-[0.18em] text-bone-faint uppercase">
                      {c.prizePool}
                    </dt>
                    <dd className="mt-1.5 font-mono text-lg font-bold text-crimson-hot">
                      {t.prizePool}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-display text-[0.6rem] tracking-[0.18em] text-bone-faint uppercase">
                      {c.teams}
                    </dt>
                    <dd className="mt-1.5 font-mono text-lg font-bold text-bone">
                      {t.teamCount}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-display text-[0.6rem] tracking-[0.18em] text-bone-faint uppercase">
                      {c.format}
                    </dt>
                    <dd className="mt-1.5 text-sm text-bone-dim">{t.format}</dd>
                  </div>
                </dl>

                <div className="mt-9 flex flex-wrap gap-3">
                  <NotchButton href="/tournaments">{c.viewBracket}</NotchButton>
                  <NotchButton href="/tournaments#enter" variant="outline">
                    {c.howToEnter}
                  </NotchButton>
                </div>
              </div>
            ) : (
              <div className="flex flex-col justify-center p-7 sm:p-10">
                <p className="font-display text-[0.7rem] tracking-[0.22em] text-crimson-hot uppercase">
                  {s.toBeAnnounced}
                </p>
                <h3 className="mt-3 font-display text-2xl font-bold tracking-display text-bone uppercase">
                  {s.comingSoon}
                </h3>
                <p className="font-jp mt-2 text-sm text-bone-faint" lang="ja">近日公開</p>
                <p className="mt-6 max-w-md text-sm text-bone-dim">{c.emptyBody}</p>
                <div className="mt-9 flex flex-wrap gap-3">
                  <NotchButton href={SITE.discord} external>
                    {c.getNotified}
                  </NotchButton>
                  <NotchButton href="/tournaments#enter" variant="outline">
                    {c.howToEnter}
                  </NotchButton>
                </div>
              </div>
            )}
          </article>
        </Reveal>
      </div>
    </section>
  );
}

/* The scene half of the panel: a miniature of the hero scene. The sun sets
 * behind a torii as the card scrolls past. Original, code-drawn, seeded by
 * hue. */
function ArtPanel({ hue, kanji, chips }: { hue: number; kanji: string; chips: ReactNode }) {
  return (
    <div className="relative min-h-[20rem] overflow-hidden border-b border-steel-line lg:border-e lg:border-b-0">
      <GradientMesh hue={hue} intensity={0.7} />
      <ParallaxLayer speed={0.18} className="absolute inset-x-0 top-[8%] mx-auto w-[62%] max-w-[22rem]">
        <RedSun glow brush />
      </ParallaxLayer>
      <Skyline
        seed={hue + 5}
        height={0.85}
        pagodaEvery={3}
        fill="#1B1628"
        className="absolute inset-x-0 bottom-0 h-1/2 w-full"
      />
      <div className="absolute bottom-[4%] left-1/2 h-[55%] -translate-x-1/2 text-[#0E0B16]">
        <Torii neon className="h-full w-auto" />
      </div>
      <Skyline
        seed={hue + 23}
        height={0.9}
        pagodaEvery={0}
        fill="#07060B"
        windows="#A78BFA"
        className="absolute inset-x-0 bottom-0 h-1/4 w-full"
      />
      {/* The event's name word in brush script, hung vertically like a
       * banner. The last space-separated word (追放杯 "Exile Cup"),
       * never a raw slice — slicing characters cut words in half. */}
      <span
        aria-hidden="true"
        lang="ja"
        className="font-brush pointer-events-none absolute end-6 top-6 text-[clamp(2.5rem,4.5vw,3.75rem)] leading-none text-bone/85 select-none [writing-mode:vertical-rl]"
        style={{ textShadow: "0 0 20px rgb(7 6 11 / 0.9)" }}
      >
        {kanji}
      </span>
      <Grain opacity={0.16} />

      <div className="absolute start-5 top-5 flex gap-2">{chips}</div>
    </div>
  );
}

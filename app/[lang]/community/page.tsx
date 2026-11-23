import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { JoinCta } from "@/components/sections/JoinCta";
import { HankoSeal } from "@/components/brand/HankoSeal";
import { KanjiRail } from "@/components/brand/KanjiRail";
import { Accordion } from "@/components/ui/Accordion";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Grain, PatternOverlay } from "@/components/ui/Texture";
import { RedSun } from "@/components/art/RedSun";
import { BrushReveal } from "@/components/motion/BrushReveal";
import { richFill } from "@/components/ui/RichText";
import { EVENTS, VALUES } from "@/lib/community";
import { SITE } from "@/lib/site";
import { getDictionary, getLocale } from "@/lib/i18n/dictionaries";
import { languageAlternates, localePath } from "@/lib/i18n/config";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getDictionary();
  return {
    title: t.community.meta.title,
    description: t.community.meta.description,
    alternates: { canonical: localePath(locale, "/community"), languages: languageAlternates("/community") },
  };
}

export default async function CommunityPage() {
  const t = await getDictionary();
  const c = t.community;

  return (
    <>
      <PageHeader
        eyebrow={{ en: c.header.eyebrow, jp: "仲間" }}
        title={c.header.title}
        lead={c.header.lead}
        watermark="仲間"
      />

      {/* ── Who we are ── */}
      <section className="relative py-section">
        <KanjiRail text="我々について" side="left" />

        <div className="mx-auto max-w-[110rem] px-gutter">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
            <SectionHeading
              eyebrow={{ en: c.who.eyebrow, jp: "紹介" }}
              title={c.who.title}
            />

            <div className="space-y-5">
              {c.who.paragraphs.map((para, i) => (
                <Reveal key={i} delay={i * 0.08}>
                  <p
                    className={
                      i === 0
                        ? // Drop cap: editorial weight on the opening line.
                          "text-base text-bone-dim first-letter:float-start first-letter:mt-1 first-letter:me-3 first-letter:font-display first-letter:text-5xl first-letter:leading-none first-letter:font-bold first-letter:text-crimson-hot"
                        : "text-base text-bone-dim"
                    }
                  >
                    {para}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Values — INK mood ──
       * The page's one paper section: red-sun kanji posters, the same
       * language as the poster mood board, so the values read as a code
       * pinned to the wall rather than four more dark cards. */}
      <section className="mood-ink relative overflow-hidden py-section">
        <div className="mx-auto max-w-[110rem] px-gutter">
          <SectionHeading
            tone="ink"
            eyebrow={{ en: c.values.eyebrow, jp: "文化" }}
            title={c.values.title}
            lead={c.values.lead}
            align="center"
          />

          <div className="mt-16 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {VALUES.map((value, i) => (
              <Reveal key={value.key} delay={i * 0.07} className="h-full">
                <article className="flex h-full flex-col items-center border border-ink/12 bg-[#f7f4ee] px-6 pt-10 pb-8 text-center shadow-[0_18px_40px_-24px_rgb(13_12_16/0.45)]">
                  <div className="relative grid aspect-square w-40 place-items-center">
                    <RedSun brush className="absolute inset-0 size-full" />
                    <BrushReveal direction="y" delay={0.1 + i * 0.08} className="relative">
                      <span
                        lang="ja"
                        className="font-brush block text-[3.6rem] leading-[1] text-ink [writing-mode:vertical-rl]"
                      >
                        {value.jp}
                      </span>
                    </BrushReveal>
                  </div>

                  {value.romaji && (
                    <p lang="ja-Latn" className="mt-6 font-mono text-[0.7rem] tracking-[0.12em] text-ink-dim">
                      [{value.romaji}]
                    </p>
                  )}
                  <h3 className="mt-1 font-display text-base font-bold tracking-[0.18em] uppercase">
                    {c.values.items[value.key].title}
                  </h3>
                  <p className="mt-4 text-sm text-ink-dim">{c.values.items[value.key].body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
        <Grain opacity={0.08} />
      </section>

      {/* ── Weekly rhythm ── */}
      <section className="relative py-section">
        <KanjiRail text="週間予定" side="right" />

        <div className="mx-auto max-w-[110rem] px-gutter">
          <SectionHeading
            eyebrow={{ en: c.rhythm.eyebrow, jp: "予定" }}
            title={EVENTS.length > 0 ? c.rhythm.title : c.rhythm.titleEmpty}
            lead={EVENTS.length > 0 ? c.rhythm.lead : c.rhythm.leadEmpty}
          />

          {EVENTS.length === 0 && (
            <Reveal>
              <div className="mt-14 flex flex-col gap-4 border-y border-dashed border-steel-hi py-6 sm:flex-row sm:items-center sm:gap-8">
                <div className="flex items-center gap-5 sm:w-64 sm:shrink-0">
                  <HankoSeal kanji="近" size={44} />
                  <div>
                    <h3 className="font-display text-base font-bold tracking-wide text-bone uppercase">
                      {t.common.status.comingSoon}
                    </h3>
                    <p className="font-jp text-xs text-bone-faint" lang="ja">近日公開</p>
                  </div>
                </div>
                <div className="sm:w-40 sm:shrink-0">
                  <p className="font-display text-sm font-semibold text-crimson-hot uppercase">{t.common.status.tba}</p>
                  <p className="font-mono text-xs text-bone-faint">{c.rhythm.timesUtc}</p>
                </div>
                <p className="text-sm text-bone-dim">
                  {richFill(c.rhythm.emptyBody, {
                    discord: (
                      <a
                        href={SITE.discord}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-crimson-hot underline-offset-4 hover:underline"
                      >
                        {c.rhythm.discord}
                      </a>
                    ),
                  })}
                </p>
              </div>
            </Reveal>
          )}

          {EVENTS.length > 0 && (
            <ol className="mt-14 divide-y divide-steel-line border-y border-steel-line">
              {EVENTS.map((event, i) => (
                <Reveal key={event.title} delay={i * 0.05}>
                  <li className="group flex flex-col gap-4 py-6 transition-colors sm:flex-row sm:items-center sm:gap-8">
                    <div className="flex items-center gap-5 sm:w-64 sm:shrink-0">
                      <HankoSeal kanji={event.seal} size={44} />
                      <div>
                        <h3 className="font-display text-base font-bold tracking-wide text-bone uppercase">
                          {event.title}
                        </h3>
                        <p className="font-jp text-xs text-bone-faint">{event.jp}</p>
                      </div>
                    </div>
  
                    <div className="sm:w-40 sm:shrink-0">
                      <p className="font-display text-sm font-semibold text-crimson-hot uppercase">
                        {event.day}
                      </p>
                      <p className="font-mono text-xs text-bone-faint">
                        {event.time}
                      </p>
                    </div>
  
                    <p className="text-sm text-bone-dim">{event.blurb}</p>
                  </li>
                </Reveal>
              ))}
            </ol>
          )}
        </div>
      </section>

      {/* ── Voice channels ── */}
      <section className="relative overflow-hidden border-y border-steel-line bg-steel/25 py-section">
        <PatternOverlay pattern="dotgrid" opacity={0.05} />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-[-30%] left-1/2 size-[40rem] max-w-[85vw] -translate-x-1/2 rounded-full bg-crimson/10 blur-[110px]"
        />

        <div className="relative mx-auto max-w-3xl px-gutter text-center">
          <Reveal>
            <p lang="ja" className="font-jp text-sm tracking-[0.35em] text-crimson-hot">
              常に賑やか
            </p>
          </Reveal>

          <Reveal delay={0.08}>
            <h2 className="mt-6 font-display text-2xl leading-tight font-bold tracking-display text-bone uppercase">
              {c.voice.title}
            </h2>
          </Reveal>

          <Reveal delay={0.14}>
            <p className="mx-auto mt-6 max-w-xl text-base text-bone-dim">
              {c.voice.body}
            </p>
          </Reveal>

          {/* Waveform: a static bar row with staggered pulse delays. Decorative,
           * so it carries no label and freezes under reduced motion. */}
          <Reveal delay={0.2}>
            <div
              aria-hidden="true"
              className="mt-10 flex items-end justify-center gap-1.5"
            >
              {[10, 22, 16, 34, 24, 42, 28, 18, 36, 20, 30, 14, 26, 12].map(
                (h, i) => (
                  <span
                    key={i}
                    className="animate-wave w-1 origin-bottom rounded-full bg-crimson/70"
                    style={{
                      height: `${h}px`,
                      animationDelay: `${i * 0.13}s`,
                    }}
                  />
                ),
              )}
            </div>
          </Reveal>
        </div>

        <Grain opacity={0.1} />
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="scroll-mt-24 py-section">
        <div className="mx-auto max-w-[110rem] px-gutter">
          <SectionHeading
            eyebrow={{ en: c.faq.eyebrow, jp: "質問" }}
            title={c.faq.title}
          />

          <Reveal className="mt-12 max-w-3xl">
            <Accordion items={c.faq.items} />
          </Reveal>
        </div>
      </section>

      <JoinCta />
    </>
  );
}

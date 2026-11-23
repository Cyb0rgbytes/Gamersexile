import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { Bracket } from "@/components/sections/Bracket";
import { JoinCta } from "@/components/sections/JoinCta";
import { ComingSoonCard, TournamentCard } from "@/components/cards/TournamentCard";
import { HankoSeal } from "@/components/brand/HankoSeal";
import { KanjiRail } from "@/components/brand/KanjiRail";
import { Chip } from "@/components/ui/Chip";
import { NotchButton } from "@/components/ui/NotchButton";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GradientMesh } from "@/components/ui/Texture";
import {
  BRACKET_ROUNDS,
  FINISHED_TOURNAMENTS,
  LIVE_TOURNAMENTS,
  UPCOMING_TOURNAMENTS,
} from "@/lib/tournaments";
import { Arrow } from "@/components/ui/Arrow";
import { ENTRY_STEPS } from "@/lib/community";
import { SITE } from "@/lib/site";
import { getDictionary, getLocale, fill } from "@/lib/i18n/dictionaries";
import { languageAlternates, localePath } from "@/lib/i18n/config";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getDictionary();
  return {
    title: t.tournaments.meta.title,
    description: t.tournaments.meta.description,
    alternates: { canonical: localePath(locale, "/tournaments"), languages: languageAlternates("/tournaments") },
  };
}

/* Shown while nothing is scheduled. Each slot gets its own hue and skyline. */
const COMING_SOON_SLOTS = [
  { hue: 348, seed: 11 },
  { hue: 270, seed: 47 },
  { hue: 205, seed: 83 },
];

export default async function TournamentsPage() {
  const dict = await getDictionary();
  const c = dict.tournaments;
  const hasUpcoming = UPCOMING_TOURNAMENTS.length > 0;

  return (
    <>
      <PageHeader
        eyebrow={{ en: c.header.eyebrow, jp: "大会" }}
        title={c.header.title}
        lead={c.header.lead}
        watermark="大会"
      />

      {/* ── Live now ── */}
      {LIVE_TOURNAMENTS.length > 0 && (
        <section className="border-b border-steel-line bg-violet/5">
          <div className="mx-auto max-w-[110rem] px-gutter py-6">
            {LIVE_TOURNAMENTS.map((t) => (
              <div
                key={t.slug}
                className="flex flex-wrap items-center gap-x-6 gap-y-3"
              >
                <Chip tone="live" pulse>
                  {dict.common.status.liveNow}
                </Chip>
                <p className="font-display text-sm font-semibold tracking-wide text-bone uppercase">
                  {t.title}
                </p>
                <p className="text-sm text-bone-dim">
                  {t.game} · {t.format} · {fill(c.live.entrants, { count: t.teamCount })}
                </p>
                <a
                  href={SITE.discord}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ms-auto inline-flex items-center gap-1.5 font-display text-[0.7rem] tracking-[0.18em] text-violet-hot uppercase transition-colors hover:text-bone"
                >
                  {c.live.watch}
                  <Arrow />
                </a>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Upcoming ── */}
      <section className="relative py-section">
        <KanjiRail text="次回大会" side="left" />

        <div className="mx-auto max-w-[110rem] px-gutter">
          <SectionHeading
            eyebrow={{ en: c.upcoming.eyebrow, jp: "次回" }}
            title={c.upcoming.title}
            lead={hasUpcoming ? c.upcoming.lead : c.upcoming.leadEmpty}
          />

          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {hasUpcoming
              ? UPCOMING_TOURNAMENTS.map((t, i) => (
                  <Reveal key={t.slug} delay={i * 0.07}>
                    <TournamentCard item={t} />
                  </Reveal>
                ))
              : COMING_SOON_SLOTS.map((slot, i) => (
                  <Reveal key={slot.seed} delay={i * 0.07} className="h-full">
                    <ComingSoonCard {...slot} discordHref={SITE.discord} />
                  </Reveal>
                ))}
          </div>
        </div>
      </section>

      {BRACKET_ROUNDS.length > 0 && <Bracket />}

      {/* ── How to enter ── */}
      <section
        id="enter"
        className="relative scroll-mt-24 border-y border-steel-line bg-steel/25 py-section"
      >
        <div className="mx-auto max-w-[110rem] px-gutter">
          <SectionHeading
            eyebrow={{ en: c.enter.eyebrow, jp: "参加方法" }}
            title={c.enter.title}
            align="center"
          />

          <ol className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {ENTRY_STEPS.map((step, i) => (
              <Reveal key={step.n} delay={i * 0.07}>
                <li className="clip-notch relative h-full border border-steel-line bg-steel p-6">
                  <span className="font-mono text-3xl font-bold text-crimson-hot/25">
                    {step.n}
                  </span>
                  <h3 className="mt-3 font-display text-base font-bold tracking-wide text-bone uppercase">
                    {c.enter.steps[step.key].title}
                  </h3>
                  <p className="mt-2.5 text-sm text-bone-dim">{c.enter.steps[step.key].body}</p>
                </li>
              </Reveal>
            ))}
          </ol>

          <Reveal delay={0.1}>
            <div className="mt-12 flex justify-center">
              <NotchButton href={SITE.discord} external size="lg">
                {c.enter.cta}
              </NotchButton>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Past results: hidden until an event has a `result` ── */}
      {FINISHED_TOURNAMENTS.length > 0 && (
        <section className="py-section">
          <div className="mx-auto max-w-[110rem] px-gutter">
            <SectionHeading
              eyebrow={{ en: c.records.eyebrow, jp: "戦績" }}
              title={c.records.title}
            />

            <Reveal className="mt-12">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[46rem] border-collapse text-start">
                  <caption className="sr-only">
                    {c.records.caption}
                  </caption>
                  <thead>
                    <tr className="border-b border-steel-line">
                      {(["tournament", "game", "champion", "runnerUp", "score"] as const).map(
                        (h) => (
                          <th
                            key={h}
                            scope="col"
                            className="pb-3 font-display text-[0.6rem] tracking-[0.2em] text-bone-faint uppercase"
                          >
                            {c.records.columns[h]}
                          </th>
                        ),
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {FINISHED_TOURNAMENTS.map((t) => (
                      <tr
                        key={t.slug}
                        className="group border-b border-steel-line transition-colors hover:bg-steel/50"
                      >
                        <td className="py-4 pe-4">
                          <span className="relative flex items-center gap-3">
                            <span className="clip-notch-sm relative size-9 shrink-0 overflow-hidden">
                              <GradientMesh hue={t.hue} intensity={0.9} />
                            </span>
                            <span>
                              <span className="block font-display text-sm font-semibold text-bone">
                                {t.title}
                              </span>
                              <span className="font-jp block text-[0.65rem] text-bone-faint">
                                {t.jp}
                              </span>
                            </span>
                          </span>
                        </td>
                        <td className="py-4 pe-4 text-sm text-bone-dim">{t.game}</td>
                        <td className="py-4 pe-4 text-sm font-semibold text-jade">
                          {t.result?.champion}
                        </td>
                        <td className="py-4 pe-4 text-sm text-bone-dim">
                          {t.result?.runnerUp}
                        </td>
                        <td className="py-4 font-mono text-sm text-bone-faint">
                          {t.result?.score}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="mt-12 flex items-center justify-center gap-5">
                <HankoSeal kanji="優" />
                <p className="max-w-md text-sm text-bone-dim">
                  {c.records.note}
                </p>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      <JoinCta heading={c.cta.heading} lead={c.cta.lead} />
    </>
  );
}

import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { CreatorRoster } from "@/components/sections/CreatorRoster";
import { JoinCta } from "@/components/sections/JoinCta";
import { HankoSeal } from "@/components/brand/HankoSeal";
import { KanjiRail } from "@/components/brand/KanjiRail";
import { Chip } from "@/components/ui/Chip";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  ComingSoonCreatorCard,
  comingSoonCreatorLabels,
  creatorCardLabels,
} from "@/components/cards/CreatorCard";
import { CREATOR_PERKS, CREATOR_PLACEHOLDERS, CREATORS, LIVE_CREATORS } from "@/lib/creators";
import { SITE } from "@/lib/site";
import { getDictionary, getLocale, fill } from "@/lib/i18n/dictionaries";
import { languageAlternates, localePath } from "@/lib/i18n/config";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getDictionary();
  return {
    title: t.creators.meta.title,
    description: t.creators.meta.description,
    alternates: { canonical: localePath(locale, "/creators"), languages: languageAlternates("/creators") },
  };
}

export default async function CreatorsPage() {
  const t = await getDictionary();
  const locale = await getLocale();
  const c = t.creators;
  const liveNames = new Intl.ListFormat(locale, { type: "conjunction" }).format(
    LIVE_CREATORS.map((cr) => cr.handle),
  );

  return (
    <>
      <PageHeader
        eyebrow={{ en: c.header.eyebrow, jp: "配信者" }}
        title={c.header.title}
        lead={c.header.lead}
        watermark="配信"
      />

      {/* ── Live now ── */}
      {LIVE_CREATORS.length > 0 && (
        <section className="border-b border-steel-line bg-violet/5">
          <div className="mx-auto flex max-w-[110rem] flex-wrap items-center gap-x-6 gap-y-3 px-gutter py-6">
            <Chip tone="live" pulse>
              {t.common.status.liveNow}
            </Chip>
            <p className="text-sm text-bone-dim">
              {fill(LIVE_CREATORS.length === 1 ? c.live.one : c.live.other, { names: liveNames })}
            </p>
          </div>
        </section>
      )}

      {/* ── Roster ── */}
      <section className="relative py-section">
        <KanjiRail text="仲間紹介" side="right" />

        <div className="mx-auto max-w-[110rem] px-gutter">
          <SectionHeading
            eyebrow={{ en: c.roster.eyebrow, jp: "名簿" }}
            title={c.roster.title}
            lead={CREATORS.length > 0 ? c.roster.lead : c.roster.leadEmpty}
          />

          {CREATORS.length > 0 ? (
            <Reveal className="mt-12">
              <CreatorRoster labels={{ filters: c.filters, card: creatorCardLabels(t) }} />
            </Reveal>
          ) : (
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {CREATOR_PLACEHOLDERS.map((slot, i) => (
                <Reveal key={slot.kanji} delay={i * 0.06} className="h-full">
                  <ComingSoonCreatorCard {...slot} discordHref={SITE.discord} labels={comingSoonCreatorLabels(t)} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── What we offer ── */}
      <section className="border-y border-steel-line bg-steel/25 py-section">
        <div className="mx-auto max-w-[110rem] px-gutter">
          <SectionHeading
            eyebrow={{ en: c.perks.eyebrow, jp: "支援" }}
            title={c.perks.title}
            lead={c.perks.lead}
          />

          <div className="mt-14 space-y-4">
            {CREATOR_PERKS.map((perk, i) => (
              <Reveal key={perk.key} delay={i * 0.06}>
                {/* Alternating rows read as a list on mobile and as a split
                 * layout from md up. */}
                <div className="clip-notch flex flex-col gap-5 border border-steel-line bg-steel p-6 md:flex-row md:items-center md:gap-10 md:p-8">
                  <div className="flex items-center gap-5 md:w-80 md:shrink-0">
                    <HankoSeal kanji={perk.jp.slice(0, 1)} />
                    <div>
                      <h3 className="font-display text-lg font-bold tracking-wide text-bone uppercase">
                        {c.perks.items[perk.key].title}
                      </h3>
                      <p lang="ja" className="font-jp mt-0.5 text-xs text-crimson-hot">
                        {perk.jp}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-bone-dim md:text-base">{c.perks.items[perk.key].body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <JoinCta heading={c.cta.heading} lead={c.cta.lead} />
    </>
  );
}

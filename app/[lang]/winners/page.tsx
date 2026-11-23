import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { JoinCta } from "@/components/sections/JoinCta";
import { KanjiRail } from "@/components/brand/KanjiRail";
import { HankoSeal } from "@/components/brand/HankoSeal";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GiveawayCard } from "@/components/winners/GiveawayCard";
import { WinnersComingSoon } from "@/components/winners/WinnersComingSoon";
import { FaqList } from "@/components/winners/FaqList";
import { getDictionary, getLocale } from "@/lib/i18n/dictionaries";
import { OG_LOCALE, languageAlternates } from "@/lib/i18n/config";
import { GIVEAWAY_STATS, SORTED_GIVEAWAYS, groupByMonth } from "@/lib/giveaways";
import { SITE } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = (await getDictionary()).winners;
  return {
    title: t.meta.title,
    description: t.meta.description,
    keywords: t.meta.keywords,
    alternates: { canonical: `/${locale}/winners`, languages: languageAlternates("/winners") },
    openGraph: {
      type: "website",
      locale: OG_LOCALE[locale],
      url: `${SITE.url}/${locale}/winners`,
      siteName: SITE.name,
      title: t.meta.title,
      description: t.meta.description,
    },
    twitter: { card: "summary_large_image", title: t.meta.title, description: t.meta.description },
  };
}

/** Serialize JSON-LD safely (Next JSON-LD guide: escape `<`). */
const ld = (data: unknown) => ({ __html: JSON.stringify(data).replace(/</g, "\\u003c") });

export default async function WinnersPage() {
  const locale = await getLocale();
  const t = (await getDictionary()).winners;
  const nf = new Intl.NumberFormat(locale);
  const usd = new Intl.NumberFormat(locale, { style: "currency", currency: "USD", maximumFractionDigits: 0 });
  const monthFmt = new Intl.DateTimeFormat(locale, { month: "long", year: "numeric", timeZone: "UTC" });
  const pageUrl = `${SITE.url}/${locale}/winners`;
  const hasGiveaways = SORTED_GIVEAWAYS.length > 0;

  /* ── Structured data ── */
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: locale,
    mainEntity: t.faq.items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const listLd = hasGiveaways
    ? {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: t.timeline.title,
        url: pageUrl,
        numberOfItems: SORTED_GIVEAWAYS.length,
        itemListElement: SORTED_GIVEAWAYS.map((g, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item: {
            "@type": "Event",
            "@id": `${pageUrl}#${g.id}`,
            name: g.prize,
            startDate: g.date,
            eventStatus: "https://schema.org/EventScheduled",
            eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
            location: { "@type": "VirtualLocation", url: SITE.discord },
            organizer: { "@type": "Organization", name: SITE.name, url: SITE.url },
            ...(g.sponsor ? { sponsor: { "@type": "Organization", name: g.sponsor } } : {}),
            ...(g.announcementUrl ? { url: g.announcementUrl } : {}),
            isAccessibleForFree: true,
          },
        })),
      }
    : null;

  const cardLabels = {
    winner: t.timeline.winnerLabel,
    winners: t.timeline.winnersLabel,
    sponsoredBy: t.timeline.sponsoredBy,
    announcement: t.timeline.announcement,
    avatarAlt: t.timeline.avatarAlt,
    value: t.timeline.value,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={ld(faqLd)} />
      {listLd && <script type="application/ld+json" dangerouslySetInnerHTML={ld(listLd)} />}

      <PageHeader
        eyebrow={{ en: t.header.eyebrow, jp: "当選者" }}
        title={t.header.title}
        lead={t.header.lead}
        watermark="当選"
      />

      {/* ── How it works ── */}
      <section className="relative border-b border-steel-line bg-steel/25 py-section">
        <div className="mx-auto max-w-[110rem] px-gutter">
          <SectionHeading eyebrow={{ en: t.how.eyebrow, jp: "参加方法" }} title={t.how.title} />
          <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {t.how.steps.map((step, i) => (
              <li key={step.title}>
                <Reveal delay={i * 0.07} className="clip-notch relative h-full border border-steel-line bg-steel p-6">
                  <span className="font-mono text-3xl font-bold text-crimson-hot/25" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-3 font-display text-base font-bold tracking-wide text-bone uppercase">
                    {step.title}
                  </h3>
                  <p className="mt-2.5 text-sm text-bone-dim">{step.body}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Winners ── */}
      <section className="relative py-section">
        <KanjiRail text="当選者一覧" side="left" />
        <div className="mx-auto max-w-[110rem] px-gutter">
          <SectionHeading eyebrow={{ en: t.timeline.eyebrow, jp: "栄誉" }} title={t.timeline.title} />

          {hasGiveaways ? (
            <>
              <dl
                aria-label={t.stats.label}
                className="mt-10 grid grid-cols-2 gap-px overflow-hidden border border-steel-line bg-steel-line sm:grid-cols-3"
              >
                {[
                  { label: t.stats.giveaways, value: nf.format(GIVEAWAY_STATS.giveaways) },
                  { label: t.stats.winners, value: nf.format(GIVEAWAY_STATS.winners) },
                  ...(GIVEAWAY_STATS.valueUsd !== null
                    ? [{ label: t.stats.value, value: usd.format(GIVEAWAY_STATS.valueUsd) }]
                    : []),
                ].map((s) => (
                  <div key={s.label} className="flex flex-col-reverse gap-1 bg-steel px-5 py-5">
                    <dt className="font-display text-[0.6rem] tracking-[0.2em] text-bone-faint uppercase">{s.label}</dt>
                    <dd className="font-display text-2xl font-bold text-crimson-hot">{s.value}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-14 space-y-14">
                {groupByMonth(SORTED_GIVEAWAYS).map((group) => {
                  const [y, m] = group.key.split("-").map(Number);
                  return (
                    <section key={group.key} aria-labelledby={`m-${group.key}`}>
                      <h3
                        id={`m-${group.key}`}
                        className="flex items-center gap-3 font-display text-sm font-semibold tracking-[0.2em] text-bone uppercase"
                      >
                        <span className="h-px w-8 bg-crimson/45" aria-hidden="true" />
                        <time dateTime={group.key}>{monthFmt.format(new Date(Date.UTC(y, m - 1, 1)))}</time>
                      </h3>
                      <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {group.items.map((g, i) => (
                          <li key={g.id} id={g.id} className="scroll-mt-24">
                            <Reveal delay={i * 0.05} className="h-full">
                              <GiveawayCard giveaway={g} locale={locale} labels={cardLabels} />
                            </Reveal>
                          </li>
                        ))}
                      </ul>
                    </section>
                  );
                })}
              </div>

              <div className="mt-14 flex items-center justify-center gap-5">
                <HankoSeal kanji="賞" />
                <p className="max-w-md text-sm text-bone-dim">{t.timeline.footer}</p>
              </div>
            </>
          ) : (
            <Reveal className="mt-12">
              <WinnersComingSoon
                chip={t.empty.chip}
                title={t.empty.title}
                body={t.empty.body}
                cta={t.empty.cta}
                discordHref={SITE.discord}
              />
            </Reveal>
          )}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="relative scroll-mt-24 border-t border-steel-line py-section">
        <div className="mx-auto max-w-3xl px-gutter">
          <SectionHeading eyebrow={{ en: t.faq.eyebrow, jp: "質問" }} title={t.faq.title} />
          <div className="mt-10">
            <FaqList items={t.faq.items} />
          </div>
        </div>
      </section>

      <JoinCta heading={t.cta.heading} lead={t.cta.lead} />
    </>
  );
}

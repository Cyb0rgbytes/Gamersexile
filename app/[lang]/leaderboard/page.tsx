import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { JoinCta } from "@/components/sections/JoinCta";
import { KanjiRail } from "@/components/brand/KanjiRail";
import { HankoSeal } from "@/components/brand/HankoSeal";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Podium } from "@/components/leaderboard/Podium";
import { LeaderboardTable } from "@/components/leaderboard/LeaderboardTable";
import { LeaderboardFallback } from "@/components/leaderboard/LeaderboardFallback";
import { getDictionary, getLocale } from "@/lib/i18n/dictionaries";
import { OG_LOCALE, fill, languageAlternates } from "@/lib/i18n/config";
import { MEE6_PUBLIC_URL, getLeaderboard } from "@/lib/mee6";
import { SITE } from "@/lib/site";

/* ISR: the page (and the MEE6 fetch inside it, see lib/mee6.ts) is
 * regenerated at most every 10 minutes. Must be a literal for static analysis. */
export const revalidate = 600;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = (await getDictionary()).leaderboard;
  return {
    title: t.meta.title,
    description: t.meta.description,
    alternates: { canonical: `/${locale}/leaderboard`, languages: languageAlternates("/leaderboard") },
    openGraph: {
      type: "website",
      locale: OG_LOCALE[locale],
      url: `${SITE.url}/${locale}/leaderboard`,
      siteName: SITE.name,
      title: t.meta.title,
      description: t.meta.description,
    },
  };
}

export default async function LeaderboardPage() {
  const locale = await getLocale();
  const t = (await getDictionary()).leaderboard;
  const data = await getLeaderboard();
  const nf = new Intl.NumberFormat(locale);

  return (
    <>
      <PageHeader
        eyebrow={{ en: t.header.eyebrow, jp: "番付" }}
        title={t.header.title}
        lead={t.header.lead}
        watermark="番付"
      />

      <section className="relative py-section">
        <KanjiRail text="番付表" side="left" />

        <div className="mx-auto max-w-[110rem] px-gutter">
          {!data.ok ? (
            <Reveal>
              <LeaderboardFallback
                title={data.reason === "not-configured" ? t.fallback.notConfiguredTitle : t.fallback.unavailableTitle}
                body={data.reason === "not-configured" ? t.fallback.notConfiguredBody : t.fallback.unavailableBody}
                cta={t.fallback.cta}
                href={MEE6_PUBLIC_URL}
              />
            </Reveal>
          ) : data.players.length === 0 ? (
            <Reveal>
              <LeaderboardFallback title={t.table.title} body={t.empty} cta={t.fallback.cta} href={MEE6_PUBLIC_URL} />
            </Reveal>
          ) : (
            <>
              <SectionHeading eyebrow={{ en: t.podium.eyebrow, jp: "三役" }} title={t.podium.title} />
              <div className="mt-12">
                <Podium
                  players={data.players.slice(0, 3)}
                  locale={locale}
                  labels={{
                    place: [t.podium.first, t.podium.second, t.podium.third],
                    level: t.levelShort,
                    xp: t.xpSuffix,
                    messages: t.messagesSuffix,
                  }}
                />
              </div>

              {data.players.length > 3 && (
                <div className="mt-section">
                  <SectionHeading eyebrow={{ en: t.table.eyebrow, jp: "順位" }} title={t.table.title} />
                  <div className="mt-10">
                    <LeaderboardTable
                      players={data.players.slice(3)}
                      locale={locale}
                      labels={{
                        caption: t.table.caption,
                        rank: t.table.rank,
                        member: t.table.member,
                        level: t.table.level,
                        xp: t.table.xp,
                        progress: t.table.progress,
                        messages: t.table.messages,
                        progressLabel: t.table.progressLabel,
                        searchLabel: t.table.searchLabel,
                        searchPlaceholder: t.table.searchPlaceholder,
                        noResults: t.table.noResults,
                        showing: t.table.showing,
                      }}
                    />
                  </div>
                </div>
              )}

              <div className="mt-10 flex flex-col gap-4 border-t border-steel-line pt-6 sm:flex-row sm:items-start sm:justify-between">
                <div className="max-w-2xl space-y-2 text-sm text-bone-dim">
                  <p>{t.footnote}</p>
                  <p className="font-mono text-xs text-bone-faint">
                    <time dateTime={data.fetchedAt}>
                      {fill(t.lastUpdated, {
                        time: `${new Intl.DateTimeFormat(locale, {
                          dateStyle: "medium",
                          timeStyle: "short",
                          timeZone: "UTC",
                        }).format(new Date(data.fetchedAt))} UTC`,
                      })}
                    </time>{" "}
                    · {t.refreshNote}
                  </p>
                </div>
                <a
                  href={MEE6_PUBLIC_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 font-display text-[0.7rem] tracking-[0.18em] text-crimson-hot uppercase transition-colors hover:text-bone"
                >
                  {t.fullBoard} ↗
                </a>
              </div>
            </>
          )}
        </div>
      </section>

      {data.ok && data.roleRewards.length > 0 && (
        <section className="relative border-y border-steel-line bg-steel/25 py-section">
          <div className="mx-auto max-w-[110rem] px-gutter">
            <SectionHeading eyebrow={{ en: t.rewards.eyebrow, jp: "褒賞" }} title={t.rewards.title} lead={t.rewards.lead} />
            <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {data.roleRewards.map((r) => (
                <li
                  key={`${r.rank}-${r.roleName}`}
                  className="clip-notch flex items-center gap-4 border border-steel-line bg-steel p-5"
                >
                  <HankoSeal kanji="級" size={44} />
                  <div className="min-w-0">
                    <p className="font-display text-[0.65rem] tracking-[0.2em] text-bone-faint uppercase">
                      {fill(t.rewards.item, { level: nf.format(r.rank) })}
                    </p>
                    <p className="mt-1 flex items-center gap-2 font-display text-base font-bold text-bone">
                      <span
                        aria-hidden="true"
                        className="size-2.5 shrink-0 rounded-full bg-bone-faint"
                        style={r.color ? { backgroundColor: r.color } : undefined}
                      />
                      <span className="truncate">{r.roleName}</span>
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <JoinCta heading={t.cta.heading} lead={t.cta.lead} />
    </>
  );
}

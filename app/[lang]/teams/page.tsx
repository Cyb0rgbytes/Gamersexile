import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { KanjiRail } from "@/components/brand/KanjiRail";
import { HankoSeal } from "@/components/brand/HankoSeal";
import { LocaleLink as Link } from "@/components/i18n/LocaleLink";
import { NotchButton } from "@/components/ui/NotchButton";
import { TeamCard } from "@/components/teams/TeamCard";
import { TeamFilters, type FilterValues } from "@/components/teams/TeamFilters";
import { signInHref } from "@/components/auth/AuthPanels";
import { AUTH_ENABLED, getUserId } from "@/lib/auth";
import { GAME_KEYS } from "@/lib/games";
import { fill, localePath } from "@/lib/i18n/config";
import { getDictionary, getLocale } from "@/lib/i18n/dictionaries";
import { SEARCH_MAX, TEAMS_PAGE_SIZE, isRegion } from "@/lib/teams/config";
import { listTeams } from "@/lib/teams/queries";
import { pageMeta } from "@/lib/teams/meta";

export async function generateMetadata(): Promise<Metadata> {
  const [locale, t] = await Promise.all([getLocale(), getDictionary()]);
  return pageMeta(locale, "/teams", t.teams.meta.title, t.teams.meta.description);
}

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

/** Only known values survive from the query string. */
function readFilters(sp: Record<string, string | string[] | undefined>): FilterValues & { page: number } {
  const game = one(sp.game);
  const region = one(sp.region);
  const page = Number.parseInt(one(sp.page), 10);
  return {
    game: GAME_KEYS.includes(game) ? game : "",
    region: isRegion(region) ? region : "",
    recruiting: one(sp.recruiting) === "1",
    q: one(sp.q).trim().slice(0, SEARCH_MAX),
    page: Number.isFinite(page) && page > 0 ? Math.min(page, 1000) : 1,
  };
}

function queryString(f: FilterValues, page: number): string {
  const p = new URLSearchParams();
  if (f.q) p.set("q", f.q);
  if (f.game) p.set("game", f.game);
  if (f.region) p.set("region", f.region);
  if (f.recruiting) p.set("recruiting", "1");
  if (page > 1) p.set("page", String(page));
  const s = p.toString();
  return s ? `?${s}` : "";
}

export default async function TeamsPage({ searchParams }: PageProps<"/[lang]/teams">) {
  const [locale, t, sp, userId] = await Promise.all([getLocale(), getDictionary(), searchParams, getUserId()]);
  const tt = t.teams;
  const filters = readFilters(sp);
  const { items, total } = await listTeams({ ...filters, recruiting: filters.recruiting || undefined });
  const pages = Math.max(1, Math.ceil(total / TEAMS_PAGE_SIZE));
  const filtered = Boolean(filters.q || filters.game || filters.region || filters.recruiting);

  const cta = userId ? (
    <NotchButton href="/teams/new">{tt.browse.createCta}</NotchButton>
  ) : (
    <NotchButton href={AUTH_ENABLED ? signInHref(localePath(locale, "/teams/new")) : "/sign-in"} variant="outline">
      {tt.browse.signInCta}
    </NotchButton>
  );

  return (
    <>
      <PageHeader eyebrow={{ en: tt.browse.eyebrow, jp: "チーム" }} title={tt.browse.title} lead={tt.browse.lead} watermark="隊" />

      <section className="relative py-16 sm:py-20">
        <KanjiRail text="仲間募集" side="left" />
        <div className="mx-auto max-w-[110rem] px-gutter">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <h2 className="font-display text-sm tracking-[0.2em] text-bone-faint uppercase" aria-live="polite">
              {total === 1 ? tt.browse.resultsOne : fill(tt.browse.results, { count: total })}
            </h2>
            {cta}
          </div>

          <TeamFilters action={localePath(locale, "/teams")} values={filters} t={tt} />

          {items.length > 0 ? (
            <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
              {items.map((team) => (
                <li key={team.id}>
                  <TeamCard team={team} t={tt} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="clip-notch mt-10 flex flex-col items-center border border-dashed border-steel-hi bg-steel/50 px-6 py-16 text-center">
              <HankoSeal kanji="空" />
              <h3 className="mt-6 font-display text-lg font-bold tracking-wide text-bone uppercase">{tt.browse.emptyTitle}</h3>
              <p className="mt-3 max-w-md text-sm text-bone-dim">{tt.browse.emptyBody}</p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                {filtered && (
                  <NotchButton href="/teams" variant="ghost">
                    {tt.browse.emptyClear}
                  </NotchButton>
                )}
                {cta}
              </div>
            </div>
          )}

          {pages > 1 && (
            <nav aria-label={tt.browse.pagination} className="mt-10 flex items-center justify-center gap-4 text-sm">
              {filters.page > 1 ? (
                <Link href={`/teams${queryString(filters, filters.page - 1)}`} rel="prev" className="font-display text-xs tracking-[0.16em] text-crimson-hot uppercase hover:text-bone">
                  <span aria-hidden="true" className="inline-block rtl:-scale-x-100">←</span> {tt.browse.prev}
                </Link>
              ) : (
                <span className="font-display text-xs tracking-[0.16em] text-bone-faint/50 uppercase" aria-hidden="true">
                  <span aria-hidden="true" className="inline-block rtl:-scale-x-100">←</span> {tt.browse.prev}
                </span>
              )}
              <span className="font-mono text-xs text-bone-dim" aria-current="page">
                {fill(tt.browse.pageOf, { page: Math.min(filters.page, pages), pages })}
              </span>
              {filters.page < pages ? (
                <Link href={`/teams${queryString(filters, filters.page + 1)}`} rel="next" className="font-display text-xs tracking-[0.16em] text-crimson-hot uppercase hover:text-bone">
                  {tt.browse.next} <span aria-hidden="true" className="inline-block rtl:-scale-x-100">→</span>
                </Link>
              ) : (
                <span className="font-display text-xs tracking-[0.16em] text-bone-faint/50 uppercase" aria-hidden="true">
                  {tt.browse.next} <span aria-hidden="true" className="inline-block rtl:-scale-x-100">→</span>
                </span>
              )}
            </nav>
          )}
        </div>
      </section>
    </>
  );
}

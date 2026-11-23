import type { Metadata } from "next";
import { connection } from "next/server";
import { PageHeader } from "@/components/layout/PageHeader";
import { NotchButton } from "@/components/ui/NotchButton";
import { ClipCard } from "@/components/clips/ClipCard";
import { GalleryControls } from "@/components/clips/GalleryControls";
import { AUTH_ENABLED, getUserId } from "@/lib/auth";
import { GAMES, GAME_KEYS } from "@/lib/games";
import { fill, languageAlternates, localePath } from "@/lib/i18n/config";
import { getDictionary, getLocale } from "@/lib/i18n/dictionaries";
import { clipsHref, type ClipSort } from "@/lib/clips/constants";
import { listClips } from "@/lib/clips/queries";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getDictionary();
  return {
    title: t.clips.meta.title,
    description: t.clips.meta.description,
    alternates: { canonical: localePath(locale, "/clips"), languages: languageAlternates("/clips") },
    openGraph: { title: t.clips.meta.title, description: t.clips.meta.description, url: localePath(locale, "/clips") },
  };
}

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export default async function ClipsPage({ searchParams }: { searchParams: SearchParams }) {
  await connection();
  const [locale, t, sp] = await Promise.all([getLocale(), getDictionary(), searchParams]);
  const c = t.clips;

  const sort: ClipSort = one(sp.sort) === "top" ? "top" : "new";
  const gameParam = one(sp.game) ?? null;
  const game = gameParam && GAME_KEYS.includes(gameParam) ? gameParam : null;
  const pageNum = Math.min(Math.max(1, Number.parseInt(one(sp.page) ?? "1", 10) || 1), 500);

  const [{ items, hasMore }, userId] = await Promise.all([listClips({ sort, game, page: pageNum }), getUserId()]);
  const games = GAMES.map((g) => ({ key: g.key, name: g.name }));

  return (
    <>
      <PageHeader
        eyebrow={{ en: c.header.eyebrow, jp: "名場面" }}
        title={c.header.title}
        lead={c.header.lead}
        watermark="名場面"
      />

      <section className="py-section">
        <div className="mx-auto max-w-[110rem] px-gutter">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-steel-line pb-6">
            {AUTH_ENABLED ? (
              userId ? (
                <NotchButton href="/clips/new">{c.gallery.post}</NotchButton>
              ) : (
                <NotchButton href={`/sign-in?redirect_url=${encodeURIComponent(localePath(locale, "/clips/new"))}`}>
                  {c.gallery.signInToPost}
                </NotchButton>
              )
            ) : (
              <p className="text-sm text-bone-faint">{c.gallery.authUnavailable}</p>
            )}
          </div>

          <div className="mt-6">
            <GalleryControls
              sort={sort}
              game={game}
              games={games}
              labels={{
                sortLabel: c.gallery.sortLabel,
                sortNew: c.gallery.sortNew,
                sortTop: c.gallery.sortTop,
                gameLabel: c.gallery.gameLabel,
                allGames: c.gallery.allGames,
                apply: c.gallery.apply,
              }}
            />
          </div>

          {items.length === 0 ? (
            <div className="clip-notch mt-10 border border-steel-line bg-steel/50 px-6 py-16 text-center">
              <p className="font-display text-lg font-bold tracking-wide text-bone uppercase">{c.gallery.emptyTitle}</p>
              <p className="mx-auto mt-3 max-w-md text-sm text-bone-dim">
                {game || sort === "top" || pageNum > 1 ? c.gallery.emptyFiltered : c.gallery.emptyBody}
              </p>
            </div>
          ) : (
            <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
              {items.map((clip) => (
                <li key={clip.id} className="min-w-0">
                  <ClipCard clip={clip} locale={locale} t={c} />
                </li>
              ))}
            </ul>
          )}

          {(pageNum > 1 || hasMore) && (
            <nav aria-label={c.gallery.pagination} className="mt-12 flex items-center justify-between gap-4">
              {pageNum > 1 ? (
                <NotchButton href={clipsHref(sort, game, pageNum - 1)} variant="ghost" size="sm">
                  <span aria-hidden="true" className="inline-block rtl:-scale-x-100">←</span> {c.gallery.prev}
                </NotchButton>
              ) : (
                <span />
              )}
              <span className="text-xs text-bone-faint">{fill(c.gallery.page, { page: pageNum })}</span>
              {hasMore ? (
                <NotchButton href={clipsHref(sort, game, pageNum + 1)} variant="ghost" size="sm">
                  {c.gallery.next} <span aria-hidden="true" className="inline-block rtl:-scale-x-100">→</span>
                </NotchButton>
              ) : (
                <span />
              )}
            </nav>
          )}
        </div>
      </section>
    </>
  );
}

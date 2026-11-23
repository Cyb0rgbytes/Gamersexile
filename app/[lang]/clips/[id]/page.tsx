import type { Metadata } from "next";
import { cache } from "react";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { LocaleLink as Link } from "@/components/i18n/LocaleLink";
import { Chip } from "@/components/ui/Chip";
import { Avatar } from "@/components/clips/Avatar";
import { ReactionBar } from "@/components/clips/ReactionBar";
import { ReportButton } from "@/components/clips/ReportButton";
import { DeleteClipButton, ShareButton } from "@/components/clips/ClipActions";
import { AUTH_ENABLED, getUserId, isAdmin } from "@/lib/auth";
import { gameByKey } from "@/lib/games";
import { SITE } from "@/lib/site";
import { OG_LOCALE, fill, languageAlternates, localePath } from "@/lib/i18n/config";
import { getDictionary, getLocale } from "@/lib/i18n/dictionaries";
import { thumbUrl, videoUrl } from "@/lib/clips/constants";
import { formatBytes, formatDuration, relativeTime } from "@/lib/clips/format";
import { getClip, viewerState } from "@/lib/clips/queries";

type Params = Promise<{ lang: string; id: string }>;

/** The clip as this viewer may see it: hidden clips exist only for their
 *  owner and admins. Cached so metadata and page share one lookup. */
const loadVisible = cache(async (id: string) => {
  const clip = await getClip(id);
  if (!clip) return null;
  const userId = await getUserId();
  const isOwner = Boolean(userId && userId === clip.userId);
  const admin = userId ? await isAdmin() : false;
  if (clip.status !== "published" && !isOwner && !admin) return null;
  return { clip, userId, isOwner, admin };
});

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params;
  const [locale, t, found] = await Promise.all([getLocale(), getDictionary(), loadVisible(id)]);
  if (!found) notFound();
  const { clip } = found;

  const game = gameByKey(clip.game)?.name ?? clip.game;
  const path = `/clips/${clip.id}`;
  const description = fill(t.clips.meta.clipDescription, { game, author: clip.author.name });
  const image = clip.hasThumb ? `${SITE.url}${thumbUrl(clip.id)}` : undefined;
  const video = `${SITE.url}${videoUrl(clip.id)}`;

  return {
    title: clip.title,
    description,
    alternates: { canonical: localePath(locale, path), languages: languageAlternates(path) },
    robots: clip.status === "published" ? undefined : { index: false, follow: false },
    openGraph: {
      type: "video.other",
      locale: OG_LOCALE[locale],
      url: `${SITE.url}${localePath(locale, path)}`,
      siteName: SITE.name,
      title: clip.title,
      description,
      videos: [{ url: video, secureUrl: video, type: clip.mime }],
      ...(image ? { images: [{ url: image, alt: clip.title }] } : {}),
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title: clip.title,
      description,
      ...(image ? { images: [image] } : {}),
    },
  };
}

export default async function ClipPage({ params }: { params: Params }) {
  await connection();
  const { id } = await params;
  const [locale, t, found] = await Promise.all([getLocale(), getDictionary(), loadVisible(id)]);
  if (!found) notFound();
  const { clip, userId, isOwner, admin } = found;
  const viewer = await viewerState(clip.id, userId);

  const c = t.clips;
  const game = gameByKey(clip.game);
  const path = `/clips/${clip.id}`;
  const signInHref = `/sign-in?redirect_url=${encodeURIComponent(localePath(locale, path))}`;
  const signedIn = AUTH_ENABLED && Boolean(userId);
  const created = new Date(clip.createdAt * 1000);

  return (
    <article className="mx-auto max-w-6xl px-gutter pt-32 pb-section">
      <Link
        href="/clips"
        className="inline-flex items-center gap-2 font-display text-xs tracking-[0.14em] text-bone-faint uppercase hover:text-crimson-hot"
      >
        <span aria-hidden="true" className="inline-block rtl:-scale-x-100">←</span> {c.clip.back}
      </Link>

      {clip.status !== "published" && (
        <p role="status" className="clip-notch-sm mt-6 border border-rose/50 bg-rose/10 px-4 py-3 text-sm text-rose">
          {c.clip.hiddenBanner}
        </p>
      )}

      <div className="clip-notch mt-6 overflow-hidden border border-steel-line bg-void">
        <video
          controls
          playsInline
          preload="metadata"
          poster={clip.hasThumb ? thumbUrl(clip.id) : undefined}
          src={videoUrl(clip.id)}
          className="aspect-video max-h-[75svh] w-full bg-black"
        >
          {c.clip.noVideo}
        </video>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-start">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            {game && (
              <Link href={`/clips?game=${game.key}`}>
                <Chip tone="crimson">{game.name}</Chip>
              </Link>
            )}
            {clip.durationS ? (
              <Chip>
                <span dir="ltr">{formatDuration(clip.durationS)}</span>
              </Chip>
            ) : null}
            <Chip>{formatBytes(clip.sizeBytes, locale)}</Chip>
          </div>

          <h1 className="mt-4 font-display text-2xl leading-tight font-bold tracking-display break-words text-bone">{clip.title}</h1>

          <div className="mt-4 flex items-center gap-3">
            <Avatar name={clip.author.name} url={clip.author.avatarUrl} size={36} />
            <div className="text-sm">
              <p className="text-bone">{clip.author.name}</p>
              <p className="text-xs text-bone-faint">
                <time dateTime={created.toISOString()} title={created.toLocaleString(locale)}>
                  {fill(c.clip.posted, { date: relativeTime(clip.createdAt, locale) })}
                </time>
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-start gap-2 lg:justify-end">
          <ShareButton path={localePath(locale, path)} title={clip.title} labels={{ share: c.clip.share, copied: c.clip.copied }} />
          {!isOwner && clip.status === "published" && (
            <ReportButton
              clipId={clip.id}
              canReport={signedIn}
              alreadyReported={viewer.reported}
              signInHref={signInHref}
              labels={c.report}
              signInLabel={c.reactions.signIn}
              errors={c.errors}
            />
          )}
          {(isOwner || admin) && (
            <DeleteClipButton
              clipId={clip.id}
              labels={{ delete: c.clip.delete, deleteConfirm: c.clip.deleteConfirm, deleting: c.clip.deleting }}
              errors={c.errors}
            />
          )}
        </div>
      </div>

      {clip.status === "published" && (
        <section aria-label={c.reactions.label} className="mt-8 border-t border-steel-line pt-6">
          <ReactionBar
            clipId={clip.id}
            initial={{ counts: clip.counts, mine: viewer.reaction }}
            canReact={signedIn}
            signInHref={signInHref}
            labels={c.reactions}
            errors={c.errors}
          />
        </section>
      )}
    </article>
  );
}

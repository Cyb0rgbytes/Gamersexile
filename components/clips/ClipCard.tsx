import { LocaleLink as Link } from "@/components/i18n/LocaleLink";
import { Chip } from "@/components/ui/Chip";
import { ReactionIcon } from "@/components/ui/ReactionIcon";
import { Avatar } from "./Avatar";
import { gameByKey } from "@/lib/games";
import { fill } from "@/lib/i18n/config";
import { REACTIONS, thumbUrl, totalReactions } from "@/lib/clips/constants";
import { compactNumber, formatDuration, relativeTime } from "@/lib/clips/format";
import type { ClipSummary } from "@/lib/clips/queries";
import type { Dictionary } from "@/lib/i18n/dictionaries";

/* Gallery card. The poster is a lazy <img>; the video itself is never loaded
 * in the grid — the whole poster links to the clip page, which owns the
 * player. */

interface ClipCardProps {
  clip: ClipSummary;
  locale: string;
  t: Dictionary["clips"];
}

export function ClipCard({ clip, locale, t }: ClipCardProps) {
  const game = gameByKey(clip.game);
  const total = totalReactions(clip.counts);
  const top = REACTIONS.filter((k) => clip.counts[k] > 0)
    .sort((a, b) => clip.counts[b] - clip.counts[a])
    .slice(0, 3);
  const href = `/clips/${clip.id}`;

  return (
    <article className="clip-notch group relative flex flex-col overflow-hidden border border-steel-line bg-steel transition-colors duration-500 hover:border-crimson/40">
      <Link
        href={href}
        className="relative block aspect-video overflow-hidden bg-void"
        aria-label={fill(t.gallery.play, { title: clip.title })}
      >
        {clip.hasThumb ? (
          // eslint-disable-next-line @next/next/no-img-element -- R2-served poster, already 640px WebP/JPEG
          <img
            src={thumbUrl(clip.id)}
            alt=""
            loading="lazy"
            decoding="async"
            width={640}
            height={360}
            className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
        ) : (
          <span
            aria-hidden="true"
            className="font-jp grid size-full place-items-center text-5xl text-bone/10"
            style={{ background: `radial-gradient(circle at 50% 60%, oklch(0.3 0.12 ${game?.hue ?? 348}), transparent 70%)` }}
          >
            {game?.jp.slice(0, 2) ?? "動画"}
          </span>
        )}

        {/* Play glyph */}
        <span
          aria-hidden="true"
          className="clip-notch-sm absolute inset-0 m-auto grid size-14 place-items-center bg-void/70 text-bone transition-colors duration-300 group-hover:bg-crimson"
        >
          <svg viewBox="0 0 24 24" width="22" height="22" className="ms-0.5 rtl:-scale-x-100">
            <path d="M7 4.5v15l12.5-7.5Z" fill="currentColor" />
          </svg>
        </span>

        {clip.durationS ? (
          <span className="absolute end-2 bottom-2 bg-void/80 px-1.5 py-0.5 font-mono text-[0.7rem] text-bone" dir="ltr">
            {formatDuration(clip.durationS)}
          </span>
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex flex-wrap items-center gap-2">
          {game && <Chip tone="crimson">{game.name}</Chip>}
        </div>

        <h3 className="line-clamp-2 font-display text-base font-bold tracking-wide break-words text-bone">
          <Link href={href} className="hover:text-crimson-hot">
            {clip.title}
          </Link>
        </h3>

        <div className="mt-auto flex items-center justify-between gap-3 pt-1">
          <div className="flex min-w-0 items-center gap-2">
            <Avatar name={clip.author.name} url={clip.author.avatarUrl} size={24} />
            <div className="min-w-0 text-xs">
              <p className="truncate text-bone-dim">{clip.author.name}</p>
              <p className="text-bone-faint">
                <time dateTime={new Date(clip.createdAt * 1000).toISOString()}>{relativeTime(clip.createdAt, locale)}</time>
              </p>
            </div>
          </div>

          {total > 0 && (
            <p className="flex shrink-0 items-center gap-1.5 text-xs text-bone-dim" title={fill(t.gallery.reactionsTotal, { count: total })}>
              <span className="flex -space-x-1 rtl:space-x-reverse" aria-hidden="true">
                {top.map((k) => (
                  <span key={k} className={`grid size-5 place-items-center rounded-full bg-void ${k === "respect" ? "text-crimson" : "text-bone-dim"}`}>
                    <ReactionIcon kind={k} size={14} />
                  </span>
                ))}
              </span>
              <span className="sr-only">{fill(t.gallery.reactionsTotal, { count: total })}</span>
              <span aria-hidden="true">{compactNumber(total, locale)}</span>
            </p>
          )}
        </div>
      </div>
    </article>
  );
}

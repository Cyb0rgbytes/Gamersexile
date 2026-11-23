import { MemberAvatar } from "@/components/leaderboard/MemberAvatar";
import { Chip } from "@/components/ui/Chip";
import { GradientMesh } from "@/components/ui/Texture";
import { fill } from "@/lib/i18n/config";
import { discordAvatarUrl } from "@/lib/mee6";
import type { Giveaway } from "@/lib/giveaways";

/* One drawn giveaway: prize, date, winners, sponsor, announcement link.
 * Server component; strings arrive pre-localized. */

export interface GiveawayCardLabels {
  winner: string;
  winners: string;
  sponsoredBy: string;
  announcement: string;
  avatarAlt: string;
  value: string;
}

const hueOf = (s: string) => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7) % 360;

export function GiveawayCard({
  giveaway: g,
  locale,
  labels,
}: {
  giveaway: Giveaway;
  locale: string;
  labels: GiveawayCardLabels;
}) {
  const date = new Date(g.date);
  const valid = !Number.isNaN(date.getTime());
  const usd = new Intl.NumberFormat(locale, { style: "currency", currency: "USD", maximumFractionDigits: 0 });

  return (
    <article className="clip-notch group relative flex h-full flex-col overflow-hidden border border-steel-line bg-steel transition-colors duration-500 hover:border-crimson/40">
      <div className="relative h-20 overflow-hidden border-b border-steel-line">
        <GradientMesh hue={hueOf(g.id)} intensity={0.7} />
        <span
          aria-hidden="true"
          className="font-jp pointer-events-none absolute -end-1 -bottom-5 text-[4.5rem] leading-none text-bone/10 select-none"
        >
          賞
        </span>
        <div className="absolute start-3 top-3">
          {valid && (
            <Chip tone="jade">
              <time dateTime={g.date}>
                {new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeZone: "UTC" }).format(date)}
              </time>
            </Chip>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h4 className="font-display text-lg font-bold tracking-wide text-bone">{g.prize}</h4>
        {(g.sponsor || typeof g.valueUsd === "number") && (
          <p className="mt-1 text-xs text-bone-faint">
            {[
              g.sponsor ? fill(labels.sponsoredBy, { sponsor: g.sponsor }) : null,
              typeof g.valueUsd === "number" ? fill(labels.value, { value: usd.format(g.valueUsd) }) : null,
            ]
              .filter(Boolean)
              .join(" · ")}
          </p>
        )}

        <p className="mt-4 border-t border-steel-line pt-4 font-display text-[0.6rem] tracking-[0.2em] text-bone-faint uppercase">
          {g.winners.length === 1 ? labels.winner : labels.winners}
        </p>
        <ul className="mt-3 space-y-2.5">
          {g.winners.map((w, i) => (
            <li key={`${w.name}-${i}`} className="flex items-center gap-3">
              <MemberAvatar
                name={w.name}
                src={w.discordId ? discordAvatarUrl(w.discordId, w.avatar) : null}
                size={32}
                alt={fill(labels.avatarAlt, { name: w.name })}
              />
              <span className="truncate font-display text-sm font-semibold text-jade">{w.name}</span>
            </li>
          ))}
        </ul>

        {g.announcementUrl && (
          <div className="mt-auto pt-5">
            <a
              href={g.announcementUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-display text-[0.65rem] tracking-[0.18em] text-crimson-hot uppercase transition-colors hover:text-bone"
            >
              {labels.announcement} ↗
            </a>
          </div>
        )}
      </div>
    </article>
  );
}

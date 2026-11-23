import { LocaleLink as Link } from "@/components/i18n/LocaleLink";
import { Chip } from "@/components/ui/Chip";
import { GradientMesh, KanjiWatermark } from "@/components/ui/Texture";
import { gameByKey } from "@/lib/games";
import { fill } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { TeamCardData } from "@/lib/teams/queries";
import { Avatar } from "./Avatar";

/* Browse card. Same shell as the tournament cards (clip-notch, steel, hairline)
 * with a short art band in the game's hue. The whole card is one link; the
 * heading carries the accessible name. */

export function roleLabel(t: Dictionary["teams"], key: string): string {
  return (t.roles as Record<string, string>)[key] ?? key;
}

export function regionLabel(t: Dictionary["teams"], key: string): string {
  return (t.regions as Record<string, string>)[key] ?? key;
}

export function TeamCard({ team, t }: { team: TeamCardData; t: Dictionary["teams"] }) {
  const game = gameByKey(team.game);
  const extra = team.memberCount - team.roster.length;

  return (
    <article className="clip-notch group relative flex h-full flex-col overflow-hidden border border-steel-line bg-steel transition-colors duration-500 focus-within:border-violet hover:border-crimson/40">
      <div className="relative h-24 overflow-hidden border-b border-steel-line">
        <GradientMesh hue={game?.hue ?? 348} intensity={team.recruiting ? 0.85 : 0.4} />
        <KanjiWatermark kanji={(game?.jp ?? "隊").slice(0, 2)} className="-bottom-5 end-1" size="4.5rem" opacity={0.14} />
        <div className="absolute start-3 top-3 flex flex-wrap gap-2">
          {team.recruiting ? <Chip tone="crimson">{t.card.recruiting}</Chip> : <Chip tone="neutral">{t.card.closed}</Chip>}
        </div>
        <span className="absolute end-3 bottom-3 font-display text-[0.65rem] tracking-[0.18em] text-bone/85 uppercase">
          {team.region}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="font-display text-[0.65rem] tracking-[0.2em] text-crimson-hot uppercase">{game?.name ?? team.game}</p>
        <h3 className="mt-2 flex min-w-0 items-baseline gap-2 font-display text-lg font-bold tracking-wide text-bone uppercase">
          <Link
            href={`/teams/${team.slug}`}
            className="min-w-0 truncate after:absolute after:inset-0 after:content-[''] focus-visible:shadow-none"
          >
            {team.name}
          </Link>
          {team.tag && <span className="shrink-0 font-mono text-xs font-medium text-bone-faint">[{team.tag}]</span>}
        </h3>

        <div className="mt-4 mb-5 flex items-center gap-3">
          <div className="flex -space-x-2">
            {team.roster.map((m, i) => (
              <Avatar key={i} name={m.displayName} src={m.avatarUrl} size={28} className="ring-2 ring-steel" />
            ))}
            {extra > 0 && (
              <span className="inline-grid size-7 place-items-center rounded-full border border-steel-line bg-void font-mono text-[0.6rem] text-bone-dim ring-2 ring-steel">
                +{extra}
              </span>
            )}
          </div>
          <span className="text-xs text-bone-dim">
            {team.memberCount === 1 ? t.card.membersOne : fill(t.card.members, { count: team.memberCount })}
          </span>
        </div>

        <div className="mt-auto border-t border-steel-line pt-4">
          <p className="font-display text-[0.6rem] tracking-[0.2em] text-bone-faint uppercase">{t.card.openRoles}</p>
          {team.recruiting && team.openRoles.length > 0 ? (
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {team.openRoles.map((r) => (
                <li key={r}>
                  <Chip tone="neutral">{roleLabel(t, r)}</Chip>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-xs text-bone-faint">{t.card.noOpenRoles}</p>
          )}
        </div>
      </div>
    </article>
  );
}

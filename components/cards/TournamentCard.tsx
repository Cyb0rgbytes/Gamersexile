import { Chip } from "@/components/ui/Chip";
import { Countdown } from "@/components/ui/Countdown";
import { GradientMesh, KanjiWatermark } from "@/components/ui/Texture";
import { RedSun } from "@/components/art/RedSun";
import { Skyline } from "@/components/art/Skyline";
import { Arrow } from "@/components/ui/Arrow";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Tournament } from "@/types";

/* Tournament card. The "image" is procedural and original: a gradient mesh in
 * the item's own hue, a red sun setting behind a skyline seeded from the slug,
 * and the Japanese title set oversized and cropped. Finished events dim; live
 * ones get the violet neon edge. */

/** Stable small integer from a string, so each card's skyline is its own. */
const seedOf = (s: string) => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);

export async function TournamentCard({ item }: { item: Tournament }) {
  const t = await getDictionary();
  const c = t.tournaments.card;
  const s = t.common.status;
  const isLive = item.status === "live";
  const isFinished = item.status === "finished";

  return (
    <article
      className={`clip-notch group relative flex flex-col overflow-hidden border bg-steel transition-colors duration-500 ${
        isLive
          ? "border-violet/70 shadow-violet-soft"
          : "border-steel-line hover:border-crimson/40"
      }`}
    >
      {/* Art panel */}
      <div className="relative h-40 overflow-hidden border-b border-steel-line">
        <GradientMesh hue={item.hue} intensity={isFinished ? 0.4 : 0.8} />
        <RedSun
          className={`absolute top-3 left-1/2 size-28 -translate-x-1/2 transition-transform duration-700 group-hover:translate-y-2 ${
            isFinished ? "opacity-35 grayscale-[60%]" : "opacity-90"
          }`}
        />
        <Skyline
          seed={seedOf(item.slug)}
          height={0.8}
          pagodaEvery={4}
          fill="#0A0910"
          windows={isFinished ? null : isLive ? "#A78BFA" : "#FF4D6D"}
          className="absolute inset-x-0 bottom-0 h-3/5 w-full"
        />
        <KanjiWatermark
          kanji={item.jp.slice(0, 2)}
          className="-right-2 -bottom-6"
          size="6.5rem"
          opacity={0.16}
        />

        {/* Scanline sweep on hover. */}
        <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-crimson/70 opacity-0 transition-opacity duration-300 group-hover:animate-scan group-hover:opacity-100" />

        <div className="absolute start-3 top-3 flex gap-2">
          {isLive && <Chip tone="live" pulse>{s.liveNow}</Chip>}
          {item.featured && <Chip tone="crimson">{s.featured}</Chip>}
          {isFinished && <Chip tone="neutral">{s.complete}</Chip>}
        </div>

        <span className="absolute end-3 bottom-3 font-display text-[0.65rem] tracking-[0.18em] text-bone/80 uppercase">
          {item.region}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        <p className="font-display text-[0.65rem] tracking-[0.2em] text-crimson-hot uppercase">
          {item.game}
        </p>
        <h3 className="mt-2 font-display text-lg font-bold tracking-wide text-bone uppercase">
          {item.title}
        </h3>
        <p className="font-jp mt-1 text-xs text-bone-faint">{item.jp}</p>

        <dl className="mt-4 grid grid-cols-2 gap-y-2.5 border-t border-steel-line pt-4 text-xs">
          <dt className="text-bone-faint">{c.format}</dt>
          <dd className="text-end text-bone-dim">{item.format}</dd>

          <dt className="text-bone-faint">{c.teams}</dt>
          <dd className="text-end font-mono text-bone-dim">{item.teamCount}</dd>

          {item.prizePool && (
            <>
              <dt className="text-bone-faint">{c.prizePool}</dt>
              <dd className="text-end font-mono font-semibold text-crimson-hot">
                {item.prizePool}
              </dd>
            </>
          )}
        </dl>

        <div className="mt-auto pt-5">
          {isFinished && item.result ? (
            <div className="border-t border-steel-line pt-4">
              <p className="font-display text-[0.6rem] tracking-[0.2em] text-bone-faint uppercase">
                {c.champion}
              </p>
              <p className="mt-1.5 flex items-baseline justify-between gap-3">
                <span className="font-display text-sm font-semibold text-jade">
                  {item.result.champion}
                </span>
                <span className="font-mono text-xs text-bone-faint">
                  {item.result.score}
                </span>
              </p>
            </div>
          ) : (
            <Countdown target={item.startsAt} labels={t.common.countdown} compact />
          )}
        </div>
      </div>
    </article>
  );
}

/* Placeholder card for a slot with nothing announced yet. Same shell and
 * scene as a real card so the grid reads as "being prepared", not empty:
 * the sun sits low and dim behind the skyline, and every detail is TBA. */
export async function ComingSoonCard({ hue, seed, discordHref }: { hue: number; seed: number; discordHref: string }) {
  const t = await getDictionary();
  const c = t.tournaments.card;
  const s = t.common.status;

  return (
    <article className="clip-notch group relative flex h-full flex-col overflow-hidden border border-dashed border-steel-hi bg-steel/70 transition-colors duration-500 hover:border-crimson/40">
      <div className="relative h-40 overflow-hidden border-b border-steel-line">
        <GradientMesh hue={hue} intensity={0.45} />
        <RedSun className="absolute top-12 left-1/2 size-28 -translate-x-1/2 opacity-55 transition-transform duration-700 group-hover:-translate-y-2" />
        <Skyline
          seed={seed}
          height={0.8}
          pagodaEvery={4}
          fill="#0A0910"
          windows={null}
          className="absolute inset-x-0 bottom-0 h-3/5 w-full"
        />
        <KanjiWatermark kanji="近日" className="-right-2 -bottom-6" size="6.5rem" opacity={0.12} />
        <div className="absolute start-3 top-3">
          <Chip tone="crimson">{s.comingSoon}</Chip>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="font-display text-[0.65rem] tracking-[0.2em] text-bone-faint uppercase">
          {c.gameTba}
        </p>
        <h3 className="mt-2 font-display text-lg font-bold tracking-wide text-bone uppercase">
          {s.comingSoon}
        </h3>
        <p className="font-jp mt-1 text-xs text-bone-faint" lang="ja">近日公開</p>

        <dl className="mt-4 grid grid-cols-2 gap-y-2.5 border-t border-steel-line pt-4 text-xs">
          <dt className="text-bone-faint">{c.format}</dt>
          <dd className="text-end font-mono text-bone-faint">{s.tba}</dd>
          <dt className="text-bone-faint">{c.teams}</dt>
          <dd className="text-end font-mono text-bone-faint">{s.tba}</dd>
          <dt className="text-bone-faint">{c.prizePool}</dt>
          <dd className="text-end font-mono text-bone-faint">{s.tba}</dd>
        </dl>

        <div className="mt-auto pt-5">
          <a
            href={discordHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-display text-[0.65rem] tracking-[0.18em] text-crimson-hot uppercase transition-colors hover:text-bone"
          >
            {c.announcedFirst}
            <Arrow />
          </a>
        </div>
      </div>
    </article>
  );
}

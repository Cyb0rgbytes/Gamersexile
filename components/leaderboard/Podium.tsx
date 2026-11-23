import { MemberAvatar } from "./MemberAvatar";
import { fill } from "@/lib/i18n/config";
import type { Mee6Player } from "@/lib/mee6";

/* Top-three podium. 1st sits in the centre and stands tallest with the
 * crimson treatment; 2nd and 3rd flank it. Below sm the three stack in rank
 * order (1, 2, 3), so the visual order follows the reading order. */

interface PodiumProps {
  players: Mee6Player[];
  locale: string;
  labels: { place: [string, string, string]; level: string; xp: string; messages: string };
}

const PLACE_STYLE = [
  // 1st
  {
    order: "sm:order-2",
    block: "sm:min-h-[22rem] border-crimson/70 bg-crimson/10 shadow-crimson-soft",
    num: "text-crimson-hot",
    kanji: "一",
    avatar: 96,
  },
  // 2nd
  {
    order: "sm:order-1",
    block: "sm:min-h-[18rem] border-steel-hi bg-steel",
    num: "text-bone",
    kanji: "二",
    avatar: 72,
  },
  // 3rd
  {
    order: "sm:order-3",
    block: "sm:min-h-[16rem] border-steel-line bg-steel",
    num: "text-bone-dim",
    kanji: "三",
    avatar: 72,
  },
] as const;

export function Podium({ players, locale, labels }: PodiumProps) {
  const nf = new Intl.NumberFormat(locale);

  return (
    <ol className="grid gap-4 sm:grid-cols-3 sm:items-end">
      {players.slice(0, 3).map((p, i) => {
        const s = PLACE_STYLE[i];
        return (
          <li key={p.id} className={s.order}>
            <article
              className={`clip-notch relative flex flex-col items-center overflow-hidden border px-5 pt-8 pb-6 text-center ${s.block}`}
            >
              <span
                aria-hidden="true"
                className="font-jp pointer-events-none absolute -end-2 -bottom-8 text-[7rem] leading-none text-bone/5 select-none"
              >
                {s.kanji}
              </span>

              <p className={`font-display text-sm font-bold tracking-[0.2em] uppercase ${s.num}`}>
                {labels.place[i]}
              </p>

              <MemberAvatar name={p.username} src={p.avatarUrl} size={s.avatar} className="mt-4" />

              <h3 className="mt-4 max-w-full truncate font-display text-lg font-bold tracking-wide text-bone">
                {p.username}
              </h3>

              <p className={`mt-1 font-display text-2xl font-bold ${i === 0 ? "text-crimson-hot" : "text-bone"}`}>
                {fill(labels.level, { level: nf.format(p.level) })}
              </p>

              <div className="mt-4 flex w-full justify-center gap-4 border-t border-steel-line pt-4 font-mono text-xs">
                <span className="text-bone-dim">{fill(labels.xp, { xp: nf.format(p.xp) })}</span>
                <span className="text-bone-faint">{fill(labels.messages, { count: nf.format(p.messageCount) })}</span>
              </div>
            </article>
          </li>
        );
      })}
    </ol>
  );
}

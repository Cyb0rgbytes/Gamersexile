import { DrawOnScroll } from "@/components/motion/DrawOnScroll";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { BRACKET_ROUNDS } from "@/lib/tournaments";
import { getDictionary, fill } from "@/lib/i18n/dictionaries";
import type { BracketMatch } from "@/types";

/* ═══════════════════════════════════════════════════════════════════════════
 *  BRACKET
 *  Single-elimination top-8, rendered as flex columns.
 *
 *  Layout approach: each round is a column whose matches are distributed with
 *  `justify-around`. Because every round halves the match count while the
 *  column height stays fixed, each match lands vertically centred between the
 *  two it feeds from — no absolute positioning and no per-match maths.
 *
 *  Connectors are borders on a spacer element rather than SVG paths, so they
 *  reflow automatically when the column heights change at different
 *  breakpoints.
 *
 *  Semantics: this is tabular data (round × match × score), but a <table>
 *  cannot express the tree. Instead each round is a <section> with a heading
 *  and an ordered list, which reads sensibly in a screen reader: "Round 1,
 *  Quarter-Finals, list of 4 matches…".
 * ═══════════════════════════════════════════════════════════════════════════ */

function MatchCard({ match, tbd }: { match: BracketMatch; tbd: string }) {
  const rows: { team: string | null; score?: number; won: boolean }[] = [
    { team: match.teamA, score: match.scoreA, won: match.winner === "a" },
    { team: match.teamB, score: match.scoreB, won: match.winner === "b" },
  ];

  return (
    <li className="clip-notch-sm w-56 shrink-0 border border-steel-line bg-steel">
      {rows.map((row, i) => (
        <div
          key={i}
          className={`flex items-center justify-between gap-3 px-3 py-2.5 text-sm ${
            i === 0 ? "border-b border-steel-line" : ""
          } ${row.won ? "bg-crimson/8" : ""}`}
        >
          <span className="flex min-w-0 items-center gap-2">
            {/* Winner marker. The colour is backed up by the bar and the bold
             * weight, so it does not rely on hue alone. */}
            <span
              className={`h-3.5 w-0.5 shrink-0 ${row.won ? "bg-crimson" : "bg-steel-hi"}`}
            />
            <span
              className={`truncate ${row.won ? "font-semibold text-bone" : "text-bone-dim"}`}
            >
              {row.team ?? tbd}
            </span>
          </span>

          <span
            className={`font-mono text-xs tabular-nums ${
              row.won ? "text-crimson-hot" : "text-bone-faint"
            }`}
          >
            {row.score ?? "–"}
          </span>
        </div>
      ))}
    </li>
  );
}

export async function Bracket() {
  const c = (await getDictionary()).tournaments.bracket;
  /* The champion is the winner of the last match of the last round. */
  const final = BRACKET_ROUNDS.at(-1)?.matches.at(-1);
  const champion = final?.winner === "a" ? final.teamA : final?.winner === "b" ? final.teamB : null;

  return (
    <section className="py-section">
      <div className="mx-auto max-w-[110rem] px-gutter">
        <SectionHeading
          eyebrow={{ en: c.eyebrow, jp: "対戦表" }}
          title={c.title}
          lead={c.lead}
        />
      </div>

      {/* Horizontal scroll container. The gutter padding keeps the first round
       * aligned with the heading above while still allowing the last round to
       * scroll into view on narrow screens. */}
      <Reveal className="mt-12">
        <div className="overflow-x-auto px-gutter pb-4">
          <DrawOnScroll selector="[data-connector], [data-champion]">
          <div className="mx-auto flex min-h-[26rem] w-max items-stretch gap-4">
            {BRACKET_ROUNDS.map((round, roundIndex) => (
              <section
                key={round.name}
                className="flex flex-col"
                aria-label={fill(round.matches.length === 1 ? c.roundLabelOne : c.roundLabel, {
                  round: round.name,
                  count: round.matches.length,
                })}
              >
                <header className="mb-4 text-center">
                  <h3 className="font-display text-[0.65rem] font-semibold tracking-[0.2em] text-bone uppercase">
                    {round.name}
                  </h3>
                  <p className="font-jp mt-1 text-[0.65rem] text-crimson-hot">
                    {round.jp}
                  </p>
                </header>

                <div className="flex flex-1 items-stretch">
                  <ol className="flex flex-1 flex-col justify-around gap-4">
                    {round.matches.map((m) => (
                      <MatchCard key={m.id} match={m} tbd={c.tbd} />
                    ))}
                  </ol>

                  {/* Connector column: a short spur out of each match, joined
                   * by a vertical spine. Omitted after the final round. */}
                  {roundIndex < BRACKET_ROUNDS.length - 1 && (
                    <div
                      aria-hidden="true"
                      className="flex w-6 flex-col justify-around"
                    >
                      {Array.from({
                        length: Math.ceil(round.matches.length / 2),
                      }).map((_, i) => (
                        <span
                          key={i}
                          data-connector
                          className="my-4 block flex-1 border-t border-e border-b border-crimson/55"
                        />
                      ))}
                    </div>
                  )}
                </div>
              </section>
            ))}

            {/* Champion */}
            <div data-champion className="flex flex-col justify-center ps-2">
              <p className="font-display text-[0.6rem] tracking-[0.2em] text-bone-faint uppercase">
                {c.champion}
              </p>
              <p className="mt-2 font-display text-lg font-bold tracking-wide text-crimson-hot uppercase">
                {champion ?? c.tbd}
              </p>
              <p className="font-jp mt-1 text-xs text-bone-faint">優勝</p>
            </div>
          </div>
          </DrawOnScroll>
        </div>
      </Reveal>

      <p className="mx-auto mt-4 max-w-[110rem] px-gutter text-xs text-bone-faint lg:hidden">
        {c.scrollHint}
      </p>
    </section>
  );
}

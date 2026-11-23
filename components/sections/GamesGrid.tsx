import { KanjiRail } from "@/components/brand/KanjiRail";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GAMES } from "@/lib/games";
import { getDictionary } from "@/lib/i18n/dictionaries";

/* The open-genre philosophy made visible. A dense tile grid — the point of the
 * section is the sheer count, so the tiles stay small and the list stays long. */

export async function GamesGrid() {
  const t = await getDictionary();
  const c = t.home.games;
  return (
    <section className="relative py-section">
      <KanjiRail text="全機種対応" side="right" />

      <div className="mx-auto max-w-[110rem] px-gutter">
        <SectionHeading
          eyebrow={{ en: c.eyebrow, jp: "遊戯" }}
          title={c.title}
          lead={c.lead}
        />

        <ul className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
          {GAMES.map((game, i) => (
            <Reveal key={game.key} delay={(i % 4) * 0.05} y={16}>
              <li className="clip-notch-sm group relative h-full overflow-hidden border border-steel-line bg-steel/50 p-4 transition-all duration-500 hover:border-crimson/40 hover:bg-steel">
                {/* The hue only surfaces on hover — sixteen coloured tiles at
                 * rest would be noise, not a palette. */}
                <span
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background: `linear-gradient(135deg, oklch(0.55 0.16 ${game.hue} / 0.18), transparent 65%)`,
                  }}
                />

                <div className="relative">
                  <p lang="ja" className="font-jp text-[0.65rem] text-bone-faint transition-colors duration-500 group-hover:text-crimson-hot">
                    {game.jp}
                  </p>
                  <h3 className="mt-1.5 font-display text-sm font-semibold tracking-wide text-bone">
                    {game.name}
                  </h3>
                  <p className="mt-2.5 text-[0.7rem] text-bone-faint">{t.common.genres[game.genre]}</p>
                  <p className="mt-0.5 font-mono text-[0.65rem] text-bone-faint/70">
                    {game.platforms.map((p) => t.common.platforms[p]).join(" · ")}
                  </p>
                </div>
              </li>
            </Reveal>
          ))}
        </ul>

        <Reveal delay={0.1}>
          <p className="mt-8 text-center text-sm text-bone-faint">
            {c.footnote}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

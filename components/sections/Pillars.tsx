import { LocaleLink as Link } from "@/components/i18n/LocaleLink";
import { HankoSeal } from "@/components/brand/HankoSeal";
import { KanjiRail } from "@/components/brand/KanjiRail";
import { RedSun } from "@/components/art/RedSun";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Arrow } from "@/components/ui/Arrow";
import { PILLARS } from "@/lib/community";
import { getDictionary } from "@/lib/i18n/dictionaries";

/* The four brand pillars as a bento grid. The first card spans two columns on
 * desktop so the block reads as a composition rather than a row of four. */

export async function Pillars() {
  const c = (await getDictionary()).home.pillars;
  return (
    <section className="relative py-section">
      <KanjiRail text="四本柱" side="left" />

      <div className="mx-auto max-w-[110rem] px-gutter">
        <SectionHeading
          eyebrow={{ en: c.eyebrow, jp: "活動" }}
          title={c.title}
          lead={c.lead}
        />

        {/* 2x2 on desktop. A 3-column grid with one 2-span card leaves a hole
         * in the second row, because four cards cannot fill six cells. */}
        <div className="mt-14 grid gap-4 md:grid-cols-2">
          {PILLARS.map((pillar, i) => (
            <Reveal key={pillar.key} delay={i * 0.07}>
              <Link
                href={pillar.href}
                className="clip-notch group relative flex h-full flex-col overflow-hidden border border-steel-line bg-steel/60 p-7 transition-all duration-500 hover:border-crimson/40 hover:bg-steel"
              >
                {/* Scanline sweep on hover */}
                <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-crimson/60 opacity-0 transition-opacity duration-300 group-hover:animate-scan group-hover:opacity-100" />

                {/* Brush kanji over a small red sun — the poster motif at card
                 * scale. The sun warms on hover; nothing else moves. */}
                <div className="flex items-start justify-between gap-4">
                  <HankoSeal kanji={pillar.seal} />
                  <div aria-hidden="true" className="relative -mt-2 -me-2 grid size-28 place-items-center">
                    <RedSun
                      brush
                      className="absolute inset-0 size-full opacity-70 transition-opacity duration-500 group-hover:opacity-100"
                    />
                    <span lang="ja" className="font-brush relative text-[2.6rem] leading-none text-bone">
                      {pillar.jp}
                    </span>
                  </div>
                </div>

                {pillar.romaji && (
                  <p lang="ja-Latn" className="mt-4 font-mono text-[0.7rem] tracking-[0.12em] text-bone-faint">
                    [{pillar.romaji}]
                  </p>
                )}
                <h3 className="mt-1 font-display text-xl font-bold tracking-wide text-bone uppercase">
                  {c.items[pillar.key].title}
                </h3>

                <p className="mt-3 max-w-md text-sm text-bone-dim">{c.items[pillar.key].body}</p>

                <span className="mt-auto flex items-center gap-2 pt-6 font-display text-[0.65rem] tracking-[0.2em] text-crimson-hot uppercase">
                  {c.explore}
                  <Arrow className="transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

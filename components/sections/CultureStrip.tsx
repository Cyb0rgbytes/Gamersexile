import { KanjiRail } from "@/components/brand/KanjiRail";
import { Reveal } from "@/components/ui/Reveal";
import { Grain, PatternOverlay } from "@/components/ui/Texture";
import { getDictionary } from "@/lib/i18n/dictionaries";

/* The culture statement as an oversized pull-quote. Deliberately the quietest
 * section on the page — no cards, no CTA, one sentence given room. It is the
 * thing most likely to decide whether a visitor joins. */

export async function CultureStrip() {
  const t = (await getDictionary()).home.culture;
  return (
    <section className="relative overflow-hidden border-y border-steel-line bg-steel/25 py-section">
      <KanjiRail text="無毒性" side="left" />
      <KanjiRail text="敬意第一" side="right" />

      <PatternOverlay
        pattern="dotgrid"
        opacity={0.05}
        className="[mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]"
      />

      {/* A single low bloom, so the section glows from underneath. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[-40%] left-1/2 size-[45rem] max-w-[90vw] -translate-x-1/2 rounded-full bg-crimson/10 blur-[120px]"
      />

      <div className="relative mx-auto max-w-4xl px-gutter text-center">
        <Reveal>
          <p lang="ja" className="font-jp text-sm tracking-[0.35em] text-crimson-hot">
            仲間・敬意・成長
          </p>
        </Reveal>

        <Reveal delay={0.08}>
          <blockquote className="mt-8">
            <p className="font-display text-2xl leading-tight font-bold tracking-display text-bone">
              <q>{t.quote}</q>
            </p>
          </blockquote>
        </Reveal>

        <Reveal delay={0.16}>
          <p className="mx-auto mt-8 max-w-2xl text-base text-bone-dim">
            {t.voiceChannels}
          </p>
        </Reveal>

        <Reveal delay={0.22}>
          <div className="mt-10 flex items-center justify-center gap-4">
            <span className="h-px w-12 bg-steel-hi" />
            <span className="size-1.5 rotate-45 bg-crimson" />
            <span className="h-px w-12 bg-steel-hi" />
          </div>
        </Reveal>
      </div>

      <Grain opacity={0.1} />
    </section>
  );
}

import { Reveal } from "@/components/ui/Reveal";
import { Grain, KanjiWatermark, PatternOverlay } from "@/components/ui/Texture";
import type { BilingualLabel } from "@/types";

/* Shared masthead for the four sub-pages. Carries the page's <h1>, so no
 * section below it may use one. */

interface PageHeaderProps {
  eyebrow: BilingualLabel;
  title: string;
  lead: string;
  /** Large kanji cropped against the end edge. */
  watermark: string;
}

export function PageHeader({ eyebrow, title, lead, watermark }: PageHeaderProps) {
  return (
    <section className="relative overflow-hidden border-b border-steel-line pt-40 pb-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-1/2 left-1/4 size-[45rem] max-w-[90vw] rounded-full bg-crimson/12 blur-[130px]"
      />
      <PatternOverlay
        pattern="hexgrid"
        opacity={0.05}
        className="[mask-image:linear-gradient(to_bottom,black,transparent)]"
      />
      <KanjiWatermark
        kanji={watermark}
        className="top-1/2 -end-8 -translate-y-1/2"
        size="clamp(8rem, 22vw, 20rem)"
        opacity={0.04}
      />

      <div className="relative mx-auto max-w-[110rem] px-gutter">
        <Reveal>
          <div className="flex items-center gap-3">
            <span lang="ja" className="font-jp text-sm text-crimson-hot">{eyebrow.jp}</span>
            <span className="h-px w-10 bg-crimson/45" />
            <span className="font-display text-eyebrow tracking-eyebrow text-bone-faint uppercase">
              {eyebrow.en}
            </span>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <h1 className="mt-5 max-w-4xl font-display text-3xl leading-display font-bold tracking-display text-bone uppercase italic">
            {title}
          </h1>
        </Reveal>

        <Reveal delay={0.14}>
          <p className="mt-6 max-w-2xl text-lg text-bone-dim">{lead}</p>
        </Reveal>
      </div>

      <Grain opacity={0.1} />
    </section>
  );
}

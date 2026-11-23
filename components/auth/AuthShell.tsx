import { Grain, KanjiWatermark, PatternOverlay } from "@/components/ui/Texture";

/* Compact centered stage for the sign-in / sign-up screens: eyebrow, title,
 * one line of lead, then the Clerk widget (or a notice panel) below. */

export function AuthShell({
  eyebrow,
  jp,
  title,
  lead,
  watermark,
  children,
}: {
  eyebrow: string;
  jp: string;
  title: string;
  lead: string;
  watermark: string;
  children: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden pt-36 pb-section">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-1/3 left-1/2 size-[40rem] max-w-[90vw] -translate-x-1/2 rounded-full bg-crimson/10 blur-[130px]"
      />
      <PatternOverlay pattern="hexgrid" opacity={0.04} className="[mask-image:linear-gradient(to_bottom,black,transparent)]" />
      <KanjiWatermark kanji={watermark} className="top-24 -right-8" size="clamp(8rem, 22vw, 18rem)" opacity={0.035} />

      <div className="relative mx-auto max-w-[110rem] px-gutter">
        <div className="mx-auto max-w-xl text-center">
          <div className="flex items-center justify-center gap-3">
            <span className="font-jp text-sm text-crimson-hot" lang="ja">
              {jp}
            </span>
            <span className="h-px w-8 bg-crimson/45" />
            <span className="font-display text-eyebrow tracking-eyebrow text-bone-faint uppercase">{eyebrow}</span>
          </div>
          <h1 className="mt-4 font-display text-2xl leading-tight font-bold tracking-display text-bone uppercase italic">
            {title}
          </h1>
          <p className="mt-4 text-base text-bone-dim">{lead}</p>
        </div>
        <div className="mt-10 flex justify-center">{children}</div>
      </div>
      <Grain opacity={0.08} />
    </section>
  );
}

import { HankoSeal } from "@/components/brand/HankoSeal";
import { NotchButton } from "@/components/ui/NotchButton";
import { GradientMesh } from "@/components/ui/Texture";

/* Shown when the guild id is not configured or MEE6 cannot be reached. The
 * page still renders (never a 500) and sends people to MEE6's own board. */

interface Props {
  title: string;
  body: string;
  cta: string;
  href: string;
}

export function LeaderboardFallback({ title, body, cta, href }: Props) {
  return (
    <div className="clip-notch relative overflow-hidden border border-dashed border-steel-hi bg-steel/70">
      <GradientMesh hue={348} intensity={0.35} />
      <div className="relative flex flex-col items-center gap-5 px-6 py-14 text-center sm:px-12">
        <HankoSeal kanji="番" size={60} />
        <h2 className="font-display text-xl font-bold tracking-wide text-bone uppercase">{title}</h2>
        <p className="max-w-lg text-sm text-bone-dim">{body}</p>
        <NotchButton href={href} external variant="outline">
          {cta} ↗
        </NotchButton>
      </div>
    </div>
  );
}

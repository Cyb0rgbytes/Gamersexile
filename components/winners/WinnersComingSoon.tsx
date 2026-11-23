import { RedSun } from "@/components/art/RedSun";
import { Skyline } from "@/components/art/Skyline";
import { Chip } from "@/components/ui/Chip";
import { NotchButton } from "@/components/ui/NotchButton";
import { GradientMesh, KanjiWatermark } from "@/components/ui/Texture";

/* Empty state for /winners, in the same visual language as ComingSoonCard:
 * dashed shell, low dim sun behind a skyline, 近日 watermark. */

interface Props {
  chip: string;
  title: string;
  body: string;
  cta: string;
  discordHref: string;
}

export function WinnersComingSoon({ chip, title, body, cta, discordHref }: Props) {
  return (
    <div className="clip-notch group relative overflow-hidden border border-dashed border-steel-hi bg-steel/70">
      <div className="relative h-44 overflow-hidden border-b border-steel-line sm:h-56">
        <GradientMesh hue={348} intensity={0.45} />
        <RedSun className="absolute top-14 left-1/2 size-32 -translate-x-1/2 opacity-55 transition-transform duration-700 group-hover:-translate-y-2 sm:size-40" />
        <Skyline
          seed={29}
          height={0.8}
          pagodaEvery={4}
          fill="#0A0910"
          windows={null}
          className="absolute inset-x-0 bottom-0 h-3/5 w-full"
        />
        <KanjiWatermark kanji="近日" className="-end-2 -bottom-6" size="7rem" opacity={0.12} />
        <div className="absolute start-3 top-3">
          <Chip tone="crimson">{chip}</Chip>
        </div>
      </div>

      <div className="flex flex-col items-center gap-4 px-6 py-10 text-center">
        <h3 className="font-display text-xl font-bold tracking-wide text-bone uppercase">{title}</h3>
        <p className="font-jp text-xs text-bone-faint" lang="ja">
          近日公開
        </p>
        <p className="max-w-lg text-sm text-bone-dim">{body}</p>
        <NotchButton href={discordHref} external className="mt-2 text-center">
          {cta}
        </NotchButton>
      </div>
    </div>
  );
}

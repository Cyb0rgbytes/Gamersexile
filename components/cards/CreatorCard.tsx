import { Chip } from "@/components/ui/Chip";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { GradientMesh, PatternOverlay } from "@/components/ui/Texture";
import { Arrow } from "@/components/ui/Arrow";
import { fill } from "@/lib/i18n/config";
import type { Creator, CreatorRole } from "@/types";
import type { SocialKey } from "@/lib/site";
import type { Dictionary } from "@/lib/i18n/dictionaries";

/* Creator card. The avatar is a procedural monogram tile — an SVG initial on
 * the creator's own hue — because there are no photographs. `avatarUrl` on the
 * Creator type is the swap-in point once there are.
 *
 * This module is also rendered inside the client <CreatorRoster>, so it
 * cannot read the dictionary itself: strings arrive as `labels`. */

export interface CreatorCardLabels {
  /** creators.roles */
  roles: Record<CreatorRole, string>;
  /** common.status.live */
  live: string;
  /** common.social.onPlatform: "{name} on {platform}" */
  onPlatform: string;
}

export interface ComingSoonCreatorLabels {
  comingSoon: string;
  yourName: string;
  slotOpen: string;
  placeholderBody: string;
  apply: string;
}

/** Pick both label sets out of a dictionary (call from a server parent). */
export const creatorCardLabels = (t: Dictionary): CreatorCardLabels => ({
  roles: t.creators.roles,
  live: t.common.status.live,
  onPlatform: t.common.social.onPlatform,
});

export const comingSoonCreatorLabels = (t: Dictionary): ComingSoonCreatorLabels => ({
  comingSoon: t.common.status.comingSoon,
  ...t.creators.card,
});

const PLATFORM_NAMES: Record<SocialKey, string> = {
  discord: "Discord",
  twitch: "Twitch",
  youtube: "YouTube",
  x: "X",
  tiktok: "TikTok",
};

export function CreatorCard({ item, labels }: { item: Creator; labels: CreatorCardLabels }) {
  const initials = item.name.slice(0, 2).toUpperCase();

  const platforms = Object.entries(item.platforms).filter(
    (entry): entry is [SocialKey, string] => Boolean(entry[1]),
  );

  return (
    <article className="clip-notch group relative flex flex-col overflow-hidden border border-steel-line bg-steel transition-colors duration-500 hover:border-crimson/40">
      <div className="relative overflow-hidden p-5">
        <GradientMesh hue={item.hue} intensity={0.75} />
        <PatternOverlay pattern="dotgrid" opacity={0.08} />

        <div className="relative flex items-start justify-between gap-4">
          {/* Monogram tile */}
          <div
            className="clip-notch-sm grid size-16 shrink-0 place-items-center border border-bone/15"
            style={{
              background: `linear-gradient(135deg, oklch(0.55 0.17 ${item.hue}), oklch(0.32 0.11 ${(item.hue + 40) % 360}))`,
            }}
          >
            <span className="font-display text-xl font-bold tracking-wider text-bone">
              {initials}
            </span>
          </div>

          {item.isLive && (
            <Chip tone="live" pulse>
              {labels.live}
            </Chip>
          )}
        </div>

        <div className="relative mt-4">
          <h3 className="font-display text-lg font-bold tracking-wide text-bone uppercase">
            {item.handle}
          </h3>
          <p className="mt-1 font-display text-[0.65rem] tracking-[0.18em] text-crimson-hot uppercase">
            {labels.roles[item.role]}
          </p>
        </div>
      </div>

      <div className="flex flex-1 flex-col border-t border-steel-line p-5">
        <p className="text-sm text-bone-dim">{item.blurb}</p>

        <ul className="mt-4 flex flex-wrap gap-1.5">
          {item.games.map((g) => (
            <li
              key={g}
              className="border border-steel-line px-2 py-1 text-[0.65rem] text-bone-faint"
            >
              {g}
            </li>
          ))}
        </ul>

        <ul className="mt-auto flex gap-2 pt-5">
          {platforms.map(([key, href]) => (
            <li key={key}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="clip-notch-sm grid size-9 place-items-center border border-steel-line text-bone-faint transition-all duration-300 hover:border-crimson/60 hover:text-crimson-hot"
              >
                <SocialIcon name={key} size={15} />
                <span className="sr-only">
                  {fill(labels.onPlatform, { name: item.name, platform: PLATFORM_NAMES[key] })}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

/* Placeholder for an empty roster slot. Same shell as a real card, dashed
 * edge, a brush kanji where the monogram goes, and a way in. */
export function ComingSoonCreatorCard({
  hue,
  kanji,
  discordHref,
  labels,
}: {
  hue: number;
  kanji: string;
  discordHref: string;
  labels: ComingSoonCreatorLabels;
}) {
  return (
    <article className="clip-notch group relative flex h-full flex-col overflow-hidden border border-dashed border-steel-hi bg-steel/70 transition-colors duration-500 hover:border-crimson/40">
      <div className="relative overflow-hidden p-5">
        <GradientMesh hue={hue} intensity={0.45} />
        <PatternOverlay pattern="dotgrid" opacity={0.08} />

        <div className="relative flex items-start justify-between gap-4">
          <div className="clip-notch-sm grid size-16 shrink-0 place-items-center border border-dashed border-bone/20 bg-void/40">
            <span lang="ja" aria-hidden="true" className="font-brush pt-1 text-2xl leading-none text-bone/70">
              {kanji}
            </span>
          </div>
          <Chip tone="crimson">{labels.comingSoon}</Chip>
        </div>

        <div className="relative mt-4">
          <h3 className="font-display text-lg font-bold tracking-wide text-bone uppercase">
            {labels.yourName}
          </h3>
          <p className="mt-1 font-display text-[0.65rem] tracking-[0.18em] text-bone-faint uppercase">
            {labels.slotOpen}
          </p>
        </div>
      </div>

      <div className="flex flex-1 flex-col border-t border-steel-line p-5">
        <p className="text-sm text-bone-dim">{labels.placeholderBody}</p>

        <div className="mt-auto pt-5">
          <a
            href={discordHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-display text-[0.65rem] tracking-[0.18em] text-crimson-hot uppercase transition-colors hover:text-bone"
          >
            {labels.apply}
            <Arrow />
          </a>
        </div>
      </div>
    </article>
  );
}

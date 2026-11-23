import {
  ComingSoonCreatorCard,
  CreatorCard,
  comingSoonCreatorLabels,
  creatorCardLabels,
} from "@/components/cards/CreatorCard";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { NotchButton } from "@/components/ui/NotchButton";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CREATOR_PLACEHOLDERS, CREATORS_LIVE_FIRST } from "@/lib/creators";
import { SITE } from "@/lib/site";

/* Horizontal scroll rail — live creators first. On mobile it is a real swipe
 * rail with snap points; from `lg` it becomes a four-up grid, because a
 * horizontal scroller on a wide desktop viewport hides content for no reason. */

export async function CreatorSpotlight() {
  const t = await getDictionary();
  const c = t.home.spotlight;
  const featured = CREATORS_LIVE_FIRST.slice(0, 4);
  const empty = featured.length === 0;

  return (
    <section className="relative overflow-hidden py-section">
      <div className="mx-auto max-w-[110rem] px-gutter">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow={{ en: c.eyebrow, jp: "配信者紹介" }}
            title={c.title}
            lead={empty ? c.leadEmpty : c.lead}
          />

          <Reveal delay={0.1}>
            {empty ? (
              <NotchButton href={SITE.discord} external variant="outline">
                {c.becomeCreator}
              </NotchButton>
            ) : (
              <NotchButton href="/creators" variant="outline">
                {c.fullRoster}
              </NotchButton>
            )}
          </Reveal>
        </div>
      </div>

      {/* The rail bleeds off the end edge on mobile to signal scrollability;
       * the gutter padding keeps the first card aligned with the heading. */}
      <div className="mt-14 flex snap-x snap-mandatory gap-4 overflow-x-auto px-gutter pb-4 lg:mx-auto lg:max-w-[110rem] lg:grid lg:grid-cols-4 lg:overflow-visible lg:pb-0">
        {empty
          ? CREATOR_PLACEHOLDERS.map((slot, i) => (
              <Reveal
                key={slot.kanji}
                delay={i * 0.06}
                className="w-[17rem] shrink-0 snap-start lg:w-auto"
              >
                <ComingSoonCreatorCard {...slot} discordHref={SITE.discord} labels={comingSoonCreatorLabels(t)} />
              </Reveal>
            ))
          : featured.map((creator, i) => (
              <Reveal
                key={creator.slug}
                delay={i * 0.06}
                className="w-[17rem] shrink-0 snap-start lg:w-auto"
              >
                <CreatorCard item={creator} labels={creatorCardLabels(t)} />
              </Reveal>
            ))}
      </div>
    </section>
  );
}

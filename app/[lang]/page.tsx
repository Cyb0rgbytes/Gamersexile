import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { Pillars } from "@/components/sections/Pillars";
import { FeaturedTournament } from "@/components/sections/FeaturedTournament";
import { CreatorSpotlight } from "@/components/sections/CreatorSpotlight";
import { GamesGrid } from "@/components/sections/GamesGrid";
import { CultureStrip } from "@/components/sections/CultureStrip";
import { JoinCta } from "@/components/sections/JoinCta";
import { Marquee } from "@/components/ui/Marquee";
import { BAND_JP } from "@/lib/community";
import { SITE } from "@/lib/site";
import { getDictionary, getLocale } from "@/lib/i18n/dictionaries";
import { languageAlternates, localePath } from "@/lib/i18n/config";

/* Pure server component. Only the leaves that animate carry "use client". */

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getDictionary();
  return {
    title: { absolute: `${SITE.name} — ${t.common.meta.tagline}` },
    description: t.home.meta.description,
    alternates: { canonical: localePath(locale, "/"), languages: languageAlternates("/") },
  };
}

export default async function HomePage() {
  const t = await getDictionary();

  /* Japanese accent, translated phrase, Japanese accent, … */
  const band = t.home.band.flatMap((text, i) =>
    BAND_JP[i] ? [{ text: BAND_JP[i], jp: true }, { text }] : [{ text }],
  );

  return (
    <>
      <Hero t={t.home.hero} />
      <Marquee items={band} />
      <Pillars />
      <FeaturedTournament />
      <CreatorSpotlight />
      <GamesGrid />
      <CultureStrip />
      <JoinCta />
    </>
  );
}

import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { LOCALES, localePath } from "@/lib/i18n/config";

/* Every public page in every language, each entry carrying hreflang
 * alternates for the other seven so search engines serve the right one.
 *
 * A fixed date, not `new Date()`: stamping every URL as "modified" on every
 * build trains crawlers to ignore the field. Bump it when content changes.
 * Dynamic pages (individual teams and clips) are added once they exist. */
const CONTENT_UPDATED = new Date("2026-11-25");

const PAGES: { path: string; freq: "daily" | "weekly" | "monthly"; priority: number }[] = [
  { path: "/", freq: "weekly", priority: 1 },
  { path: "/tournaments", freq: "weekly", priority: 0.8 },
  { path: "/teams", freq: "daily", priority: 0.8 },
  { path: "/clips", freq: "daily", priority: 0.8 },
  { path: "/leaderboard", freq: "daily", priority: 0.7 },
  { path: "/creators", freq: "monthly", priority: 0.7 },
  { path: "/community", freq: "monthly", priority: 0.7 },
  { path: "/join", freq: "monthly", priority: 0.8 },
  { path: "/privacy", freq: "monthly", priority: 0.3 },
  { path: "/terms", freq: "monthly", priority: 0.3 },
];

const abs = (path: string) => `${SITE.url}${path}`;

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.flatMap(({ path, freq, priority }) =>
    LOCALES.map((locale) => ({
      url: abs(localePath(locale, path)),
      lastModified: CONTENT_UPDATED,
      changeFrequency: freq,
      priority,
      alternates: {
        languages: Object.fromEntries(LOCALES.map((l) => [l, abs(localePath(l, path))])),
      },
    })),
  );
}

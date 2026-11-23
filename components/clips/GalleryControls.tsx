"use client";

import { useRouter } from "next/navigation";
import { LocaleLink as Link } from "@/components/i18n/LocaleLink";
import { useLocalePath } from "@/lib/i18n/client";
import { clipsHref, type ClipSort } from "@/lib/clips/constants";

/* Sort tabs + game filter. State lives in the URL (?sort=top&game=cs2), so
 * every view is linkable and the server renders it. Without JS the select
 * still works through the plain GET form and its Apply button. */

interface GalleryControlsProps {
  sort: ClipSort;
  game: string | null;
  games: { key: string; name: string }[];
  labels: { sortLabel: string; sortNew: string; sortTop: string; gameLabel: string; allGames: string; apply: string };
}

export function GalleryControls({ sort, game, games, labels }: GalleryControlsProps) {
  const router = useRouter();
  const toLocale = useLocalePath();

  const tab = (value: ClipSort, label: string) => {
    const active = value === sort;
    return (
      <Link
        href={clipsHref(value, game)}
        aria-current={active ? "page" : undefined}
        scroll={false}
        className={`clip-notch-sm px-4 py-2 font-display text-xs tracking-[0.14em] uppercase transition-colors duration-300 ${
          active ? "bg-crimson text-white" : "border border-steel-line text-bone-dim hover:border-steel-hi hover:text-bone"
        }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <nav aria-label={labels.sortLabel} className="flex flex-wrap gap-2">
        {tab("new", labels.sortNew)}
        {tab("top", labels.sortTop)}
      </nav>

      <form
        method="get"
        action={toLocale("/clips")}
        className="flex items-end gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          const value = new FormData(e.currentTarget).get("game");
          router.push(toLocale(clipsHref(sort, typeof value === "string" && value ? value : null)), { scroll: false });
        }}
      >
        {sort !== "new" && <input type="hidden" name="sort" value={sort} />}
        <label className="flex flex-col gap-1 text-xs text-bone-faint">
          <span className="font-display tracking-[0.14em] uppercase">{labels.gameLabel}</span>
          <select
            name="game"
            key={game ?? "all"}
            defaultValue={game ?? ""}
            onChange={(e) => e.currentTarget.form?.requestSubmit()}
            className="clip-notch-sm min-w-48 border border-steel-line bg-steel px-3 py-2 text-sm text-bone focus:border-crimson"
          >
            <option value="">{labels.allGames}</option>
            {games.map((g) => (
              <option key={g.key} value={g.key}>
                {g.name}
              </option>
            ))}
          </select>
        </label>
        <noscript>
          <button type="submit" className="border border-steel-line px-3 py-2 text-xs text-bone-dim">
            {labels.apply}
          </button>
        </noscript>
      </form>
    </div>
  );
}

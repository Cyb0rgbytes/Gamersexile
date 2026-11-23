import { GAMES } from "@/lib/games";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { REGIONS, SEARCH_MAX } from "@/lib/teams/config";
import { buttonClass, inputClass, labelClass } from "./fields";

/* Plain GET form: filters live in the URL (shareable, back-button friendly)
 * and work with JavaScript off. Server component, no client state. */

export interface FilterValues {
  game: string;
  region: string;
  recruiting: boolean;
  q: string;
}

export function TeamFilters({
  action,
  values,
  t,
}: {
  /** Locale-prefixed path of the browse page. */
  action: string;
  values: FilterValues;
  t: Dictionary["teams"];
}) {
  return (
    <form action={action} method="get" role="search" aria-label={t.filters.legend} className="clip-notch border border-steel-line bg-steel/60 p-4 sm:p-5">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_auto_auto] lg:items-end">
        <div>
          <label htmlFor="tf-q" className={labelClass}>
            {t.filters.search}
          </label>
          <input
            id="tf-q"
            name="q"
            type="search"
            defaultValue={values.q}
            maxLength={SEARCH_MAX}
            placeholder={t.filters.searchPlaceholder}
            className={`${inputClass} mt-2`}
          />
        </div>
        <div>
          <label htmlFor="tf-game" className={labelClass}>
            {t.filters.game}
          </label>
          <select id="tf-game" name="game" defaultValue={values.game} className={`${inputClass} mt-2`}>
            <option value="">{t.filters.anyGame}</option>
            {GAMES.map((g) => (
              <option key={g.key} value={g.key}>
                {g.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="tf-region" className={labelClass}>
            {t.filters.region}
          </label>
          <select id="tf-region" name="region" defaultValue={values.region} className={`${inputClass} mt-2`}>
            <option value="">{t.filters.anyRegion}</option>
            {REGIONS.map((r) => (
              <option key={r} value={r}>
                {(t.regions as Record<string, string>)[r] ?? r}
              </option>
            ))}
          </select>
        </div>
        <label className="flex cursor-pointer items-center gap-2.5 py-2.5 text-sm text-bone-dim lg:pb-3">
          <input
            type="checkbox"
            name="recruiting"
            value="1"
            defaultChecked={values.recruiting}
            className="size-4 accent-crimson"
          />
          {t.filters.recruitingOnly}
        </label>
        <div className="flex gap-2">
          <button type="submit" className={buttonClass.primary}>
            {t.filters.apply}
          </button>
          <a href={action} className={buttonClass.ghost}>
            {t.filters.clear}
          </a>
        </div>
      </div>
    </form>
  );
}

"use client";

import { useActionState, useId, useState } from "react";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { fill, type Locale } from "@/lib/i18n/config";
import { createTeam, updateTeam } from "@/lib/teams/actions";
import {
  DESCRIPTION_MAX,
  DISCORD_MAX,
  NAME_MAX,
  NAME_MIN,
  REGIONS,
  TAG_MAX,
  type ActionState,
} from "@/lib/teams/config";
import { Field, FormStatus, buttonClass, describedBy, fieldError, inputClass, labelClass } from "./fields";

/* Create / edit a team. The open-role checkboxes follow the selected game, so
 * this is a client island; everything is re-validated by the Server Action. */

export interface GameOption {
  key: string;
  name: string;
  roles: readonly string[];
}

interface Props {
  mode: "create" | "edit";
  locale: Locale;
  t: Dictionary["teams"];
  /** create: all games. edit: only the team's own game (it can't change). */
  games: GameOption[];
  teamId?: string;
  initial?: {
    name: string;
    tag: string | null;
    game: string;
    region: string;
    description: string | null;
    recruiting: boolean;
    openRoles: string[];
  };
  /** Show the inline Discord username field (create only, when missing). */
  needsDiscord?: boolean;
}

const FIELDS = ["name", "tag", "game", "region", "description", "openRoles", "discordUsername"];

export function TeamDetailsForm({ mode, locale, t, games, teamId, initial, needsDiscord }: Props) {
  const [state, action, pending] = useActionState<ActionState, FormData>(mode === "create" ? createTeam : updateTeam, null);
  const uid = useId();
  const id = (k: string) => `${uid}-${k}`;

  const [game, setGame] = useState(initial?.game ?? games[0]?.key ?? "");
  const [roles, setRoles] = useState<string[]>(initial?.openRoles ?? []);
  const [desc, setDesc] = useState(initial?.description ?? "");
  // Controlled so values survive React's post-action form reset on errors.
  const [name, setName] = useState(initial?.name ?? "");
  const [tag, setTag] = useState(initial?.tag ?? "");
  const [region, setRegion] = useState(initial?.region ?? "EU");
  const [recruiting, setRecruiting] = useState(initial?.recruiting ?? true);
  const [discord, setDiscord] = useState("");

  const gameRoles = games.find((g) => g.key === game)?.roles ?? [];
  const roleLabel = (k: string) => (t.roles as Record<string, string>)[k] ?? k;
  const err = (f: string) => fieldError(state, f, t);

  function onGameChange(next: string) {
    setGame(next);
    const allowed = games.find((g) => g.key === next)?.roles ?? [];
    setRoles((r) => r.filter((x) => allowed.includes(x)));
  }

  const errName = err("name");
  const errTag = err("tag");
  const errGame = err("game");
  const errRegion = err("region");
  const errDesc = err("description");
  const errRoles = err("openRoles");
  const errDiscord = err("discordUsername");

  return (
    <form action={action} className="grid gap-6">
      <input type="hidden" name="locale" value={locale} />
      {teamId && <input type="hidden" name="teamId" value={teamId} />}

      <div className="grid gap-6 sm:grid-cols-[1fr_10rem]">
        <Field id={id("name")} label={t.form.name} hint={t.form.nameHint} error={errName}>
          <input
            id={id("name")}
            name="name"
            required
            minLength={NAME_MIN}
            maxLength={NAME_MAX}
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="off"
            aria-invalid={Boolean(errName)}
            aria-describedby={describedBy(id("name"), t.form.nameHint, errName)}
            className={inputClass}
          />
        </Field>
        <Field id={id("tag")} label={t.form.tag} hint={t.form.tagHint} error={errTag}>
          <input
            id={id("tag")}
            name="tag"
            maxLength={TAG_MAX}
            pattern="[A-Za-z0-9]{2,5}"
            value={tag}
            onChange={(e) => setTag(e.target.value.toUpperCase())}
            autoComplete="off"
            aria-invalid={Boolean(errTag)}
            aria-describedby={describedBy(id("tag"), t.form.tagHint, errTag)}
            className={`${inputClass} font-mono uppercase`}
          />
        </Field>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {mode === "create" ? (
          <Field id={id("game")} label={t.form.game} hint={t.form.gameHint} error={errGame}>
            <select
              id={id("game")}
              name="game"
              required
              value={game}
              onChange={(e) => onGameChange(e.target.value)}
              aria-invalid={Boolean(errGame)}
              aria-describedby={describedBy(id("game"), t.form.gameHint, errGame)}
              className={inputClass}
            >
              {games.map((g) => (
                <option key={g.key} value={g.key}>
                  {g.name}
                </option>
              ))}
            </select>
          </Field>
        ) : (
          <div>
            <p className={labelClass}>{t.form.game}</p>
            <p className="mt-2 border border-steel-line bg-void/50 px-3.5 py-2.5 text-sm text-bone-dim">
              {games.find((g) => g.key === game)?.name ?? game}
            </p>
          </div>
        )}
        <Field id={id("region")} label={t.form.region} error={errRegion}>
          <select
            id={id("region")}
            name="region"
            required
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            aria-invalid={Boolean(errRegion)}
            aria-describedby={describedBy(id("region"), undefined, errRegion)}
            className={inputClass}
          >
            {REGIONS.map((r) => (
              <option key={r} value={r}>
                {(t.regions as Record<string, string>)[r] ?? r}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field
        id={id("description")}
        label={t.form.description}
        hint={`${t.form.descriptionHint} ${fill(t.form.charsLeft, { count: DESCRIPTION_MAX - desc.length })}`}
        error={errDesc}
      >
        <textarea
          id={id("description")}
          name="description"
          rows={4}
          maxLength={DESCRIPTION_MAX}
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          aria-invalid={Boolean(errDesc)}
          aria-describedby={describedBy(id("description"), "hint", errDesc)}
          className={`${inputClass} resize-y`}
        />
      </Field>

      <label className="flex cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          name="recruiting"
          checked={recruiting}
          onChange={(e) => setRecruiting(e.target.checked)}
          aria-describedby={id("recruiting-hint")}
          className="mt-0.5 size-4 accent-crimson"
        />
        <span>
          <span className={labelClass}>{t.form.recruiting}</span>
          <span id={id("recruiting-hint")} className="mt-1 block text-xs text-bone-faint">
            {t.form.recruitingHint}
          </span>
        </span>
      </label>

      <fieldset aria-describedby={[`${id("roles")}-hint`, errRoles ? `${id("roles")}-error` : ""].filter(Boolean).join(" ")}>
        <legend className={labelClass}>{t.form.openRoles}</legend>
        <p id={`${id("roles")}-hint`} className="mt-1.5 text-xs text-bone-faint">
          {t.form.openRolesHint}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {gameRoles.map((r) => {
            const checked = roles.includes(r);
            return (
              <label
                key={r}
                className={`clip-tag cursor-pointer border px-3 py-1.5 font-display text-[0.7rem] font-semibold tracking-[0.12em] uppercase transition-colors has-[:focus-visible]:border-violet-hot ${
                  checked ? "border-crimson/60 bg-crimson/15 text-crimson-hot" : "border-steel-line bg-steel text-bone-dim hover:border-steel-hi"
                }`}
              >
                <input
                  type="checkbox"
                  name="openRoles"
                  value={r}
                  checked={checked}
                  onChange={(e) => setRoles((prev) => (e.target.checked ? [...prev, r] : prev.filter((x) => x !== r)))}
                  className="sr-only"
                />
                {roleLabel(r)}
              </label>
            );
          })}
        </div>
        {errRoles && (
          <p id={`${id("roles")}-error`} className="mt-1.5 text-xs font-medium text-rose" role="alert">
            {errRoles}
          </p>
        )}
      </fieldset>

      {needsDiscord && (
        <Field id={id("discord")} label={t.form.discord} hint={t.form.discordHint} error={errDiscord}>
          <input
            id={id("discord")}
            name="discordUsername"
            required
            maxLength={DISCORD_MAX + 1}
            value={discord}
            onChange={(e) => setDiscord(e.target.value)}
            placeholder={t.form.discordPlaceholder}
            autoComplete="off"
            spellCheck={false}
            aria-invalid={Boolean(errDiscord)}
            aria-describedby={describedBy(id("discord"), t.form.discordHint, errDiscord)}
            className={`${inputClass} font-mono`}
          />
        </Field>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" disabled={pending} className={buttonClass.primary}>
          {pending ? t.form.saving : mode === "create" ? t.form.submitCreate : t.form.submitSave}
        </button>
        <FormStatus state={state} t={t} fields={FIELDS} success={t.form.saved} />
      </div>
    </form>
  );
}

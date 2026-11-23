"use client";

import { useActionState, useId, useState } from "react";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { saveDiscordUsername } from "@/lib/teams/actions";
import { DISCORD_MAX, type ActionState } from "@/lib/teams/config";
import { FormStatus, buttonClass, describedBy, fieldError, inputClass, labelClass } from "@/components/teams/fields";

/* Set / edit the Discord username teammates see. `next` (already sanitised
 * server-side) sends the user back to where they came from after saving. */

export function DiscordForm({
  t,
  tTeams,
  current,
  next,
}: {
  t: Dictionary["auth"];
  tTeams: Dictionary["teams"];
  current: string | null;
  next: string | null;
}) {
  const [state, action, pending] = useActionState<ActionState, FormData>(saveDiscordUsername, null);
  const [value, setValue] = useState(current ?? "");
  const uid = useId();
  const id = `${uid}-discord`;
  const err = fieldError(state, "discordUsername", tTeams);

  return (
    <form action={action}>
      {next && <input type="hidden" name="next" value={next} />}
      <label htmlFor={id} className={labelClass}>
        {t.account.discordLabel}
      </label>
      <div className="mt-2 flex flex-wrap gap-2">
        <input
          id={id}
          name="discordUsername"
          required
          maxLength={DISCORD_MAX + 1}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={t.account.discordPlaceholder}
          autoComplete="off"
          spellCheck={false}
          dir="ltr"
          aria-invalid={Boolean(err)}
          aria-describedby={describedBy(id, "hint", err)}
          className={`${inputClass} min-w-0 flex-1 basis-48 font-mono`}
        />
        <button type="submit" disabled={pending} className={buttonClass.primary}>
          {pending ? t.account.saving : t.account.save}
        </button>
      </div>
      <p id={`${id}-hint`} className="mt-1.5 text-xs text-bone-faint">
        {t.account.discordHint} {next ? t.account.returnNote : ""}
      </p>
      {err && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-xs font-medium text-rose">
          {err}
        </p>
      )}
      <FormStatus state={state} t={tTeams} fields={["discordUsername"]} success={t.account.saved} className="mt-2" />
    </form>
  );
}

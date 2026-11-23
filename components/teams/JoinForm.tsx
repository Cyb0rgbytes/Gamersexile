"use client";

import { useActionState, useId, useState } from "react";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";
import { joinTeam } from "@/lib/teams/actions";
import { DISCORD_MAX, type ActionState } from "@/lib/teams/config";
import { Field, FormStatus, buttonClass, describedBy, fieldError, inputClass } from "./fields";

/* "Join team" from an invite link. Asks for a Discord username inline when
 * the profile has none. On success the action redirects to the team page. */

export function JoinForm({
  t,
  locale,
  token,
  needsDiscord,
}: {
  t: Dictionary["teams"];
  locale: Locale;
  token: string;
  needsDiscord: boolean;
}) {
  const [state, action, pending] = useActionState<ActionState, FormData>(joinTeam, null);
  const [discord, setDiscord] = useState("");
  const uid = useId();
  const err = fieldError(state, "discordUsername", t);

  return (
    <form action={action} className="grid gap-5">
      <input type="hidden" name="token" value={token} />
      <input type="hidden" name="locale" value={locale} />
      {needsDiscord && (
        <Field id={`${uid}-d`} label={t.form.discord} hint={t.form.discordHint} error={err}>
          <input
            id={`${uid}-d`}
            name="discordUsername"
            required
            maxLength={DISCORD_MAX + 1}
            value={discord}
            onChange={(e) => setDiscord(e.target.value)}
            placeholder={t.form.discordPlaceholder}
            autoComplete="off"
            spellCheck={false}
            aria-invalid={Boolean(err)}
            aria-describedby={describedBy(`${uid}-d`, t.form.discordHint, err)}
            className={`${inputClass} font-mono`}
          />
        </Field>
      )}
      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" disabled={pending} className={`${buttonClass.primary} px-7 py-3 text-sm`}>
          {pending ? t.invite.joining : t.invite.join}
        </button>
        <FormStatus state={state} t={t} fields={["discordUsername"]} />
      </div>
    </form>
  );
}

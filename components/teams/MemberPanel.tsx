"use client";

import { useActionState, useId, useState } from "react";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { fill, type Locale } from "@/lib/i18n/config";
import { leaveTeam, setOwnRole } from "@/lib/teams/actions";
import type { ActionState } from "@/lib/teams/config";
import { ConfirmAction } from "./ConfirmAction";
import { FormStatus, buttonClass, describedBy, fieldError, inputClass, labelClass } from "./fields";

/* What every member can do for themselves: pick a role, leave the team. */

export function MemberPanel({
  t,
  locale,
  teamId,
  teamName,
  roles,
  currentRole,
  isCaptain,
}: {
  t: Dictionary["teams"];
  locale: Locale;
  teamId: string;
  teamName: string;
  roles: readonly string[];
  currentRole: string | null;
  isCaptain: boolean;
}) {
  const [state, action, pending] = useActionState<ActionState, FormData>(setOwnRole, null);
  const [role, setRole] = useState(currentRole ?? "");
  const uid = useId();
  const err = fieldError(state, "role", t);

  return (
    <section aria-labelledby={`${uid}-h`} className="clip-notch border border-steel-line bg-steel p-5 sm:p-6">
      <h2 id={`${uid}-h`} className="font-display text-sm font-bold tracking-[0.16em] text-bone uppercase">
        {t.member.title}
      </h2>

      <form action={action} className="mt-5">
        <input type="hidden" name="teamId" value={teamId} />
        <input type="hidden" name="locale" value={locale} />
        <label htmlFor={`${uid}-role`} className={labelClass}>
          {t.member.yourRole}
        </label>
        <div className="mt-2 flex flex-wrap gap-2">
          <select
            id={`${uid}-role`}
            name="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            aria-invalid={Boolean(err)}
            aria-describedby={describedBy(`${uid}-role`, undefined, err)}
            className={`${inputClass} min-w-0 flex-1 basis-40`}
          >
            <option value="">{t.roles.unassigned}</option>
            {roles.map((r) => (
              <option key={r} value={r}>
                {(t.roles as Record<string, string>)[r] ?? r}
              </option>
            ))}
          </select>
          <button type="submit" disabled={pending} className={buttonClass.primary}>
            {pending ? t.form.saving : t.member.saveRole}
          </button>
        </div>
        {err && (
          <p id={`${uid}-role-error`} role="alert" className="mt-1.5 text-xs font-medium text-rose">
            {err}
          </p>
        )}
        <FormStatus state={state} t={t} fields={["role"]} success={t.member.roleSaved} className="mt-2" />
      </form>

      <div className="mt-6 border-t border-steel-line pt-5">
        {isCaptain ? (
          <p className="text-xs text-bone-faint">{t.member.captainLeaveNote}</p>
        ) : (
          <ConfirmAction
            action={leaveTeam}
            hidden={{ teamId, locale }}
            label={t.member.leave}
            question={fill(t.member.leaveConfirm, { name: teamName })}
            t={t}
          />
        )}
      </div>
    </section>
  );
}

"use client";

import { useActionState, useId, useState } from "react";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { fill, localePath, type Locale } from "@/lib/i18n/config";
import { createInvite, disbandTeam, removeMember, revokeInvite, transferCaptaincy } from "@/lib/teams/actions";
import { INVITE_EXPIRY_DAYS, INVITE_MAX_USES, type ActionState } from "@/lib/teams/config";
import { ConfirmAction } from "./ConfirmAction";
import { CopyButton } from "./CopyButton";
import { FormStatus, buttonClass, inputClass, labelClass } from "./fields";
import { TeamDetailsForm, type GameOption } from "./TeamDetailsForm";

/* Captain-only controls. Rendered only for the captain, but every action
 * re-checks captaincy on the server (lib/teams/guard.requireCaptain). */

export interface CaptainPanelProps {
  t: Dictionary["teams"];
  locale: Locale;
  team: {
    id: string;
    name: string;
    tag: string | null;
    game: string;
    region: string;
    description: string | null;
    recruiting: boolean;
    openRoles: string[];
  };
  game: GameOption;
  /** Everyone on the roster except the captain. */
  others: { userId: string; displayName: string }[];
  invites: { token: string; uses: number; maxUses: number; expires: string }[];
}

function Block({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  const id = useId();
  return (
    <section aria-labelledby={id} className="border-t border-steel-line pt-6 first:border-t-0 first:pt-0">
      <h3 id={id} className="font-display text-xs font-bold tracking-[0.18em] text-bone uppercase">
        {title}
      </h3>
      {hint && <p className="mt-1.5 text-xs text-bone-faint">{hint}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}

const invitePath = (locale: Locale, token: string) => localePath(locale, `/teams/invite/${token}`);

export function CaptainPanel({ t, locale, team, game, others, invites }: CaptainPanelProps) {
  const c = t.captain;
  const uid = useId();
  const [inviteState, inviteAction, invitePending] = useActionState<ActionState, FormData>(createInvite, null);
  const [transferTo, setTransferTo] = useState("");
  const [days, setDays] = useState("7");
  const [uses, setUses] = useState("10");
  const transferName = others.find((o) => o.userId === transferTo)?.displayName ?? "";
  const newToken = inviteState?.ok ? inviteState.inviteToken : undefined;

  return (
    <section aria-labelledby={`${uid}-h`} className="clip-notch border border-crimson/35 bg-steel p-5 sm:p-7">
      <div className="flex items-center gap-3">
        <span className="font-jp text-sm text-crimson-hot" lang="ja" aria-hidden="true">
          主将
        </span>
        <span className="h-px w-8 bg-crimson/45" aria-hidden="true" />
        <h2 id={`${uid}-h`} className="font-display text-sm font-bold tracking-[0.16em] text-bone uppercase">
          {c.title}
        </h2>
      </div>
      <p className="mt-2 text-xs text-bone-faint">{c.lead}</p>

      <div className="mt-7 grid grid-cols-1 gap-8">
        <Block title={c.editTitle}>
          <TeamDetailsForm mode="edit" locale={locale} t={t} games={[game]} teamId={team.id} initial={team} />
        </Block>

        <Block title={c.invitesTitle} hint={c.invitesHint}>
          <form action={inviteAction} className="flex flex-wrap items-end gap-3">
            <input type="hidden" name="teamId" value={team.id} />
            <input type="hidden" name="locale" value={locale} />
            <div className="min-w-32 flex-1">
              <label htmlFor={`${uid}-days`} className={labelClass}>
                {c.expiry}
              </label>
              <select id={`${uid}-days`} name="days" value={days} onChange={(e) => setDays(e.target.value)} className={`${inputClass} mt-2`}>
                {INVITE_EXPIRY_DAYS.map((d) => (
                  <option key={d} value={d}>
                    {d === 1 ? c.dayOne : fill(c.days, { count: d })}
                  </option>
                ))}
              </select>
            </div>
            <div className="min-w-32 flex-1">
              <label htmlFor={`${uid}-uses`} className={labelClass}>
                {c.maxUses}
              </label>
              <select id={`${uid}-uses`} name="maxUses" value={uses} onChange={(e) => setUses(e.target.value)} className={`${inputClass} mt-2`}>
                {INVITE_MAX_USES.map((n) => (
                  <option key={n} value={n}>
                    {n === 1 ? c.useOne : fill(c.uses, { count: n })}
                  </option>
                ))}
              </select>
            </div>
            <button type="submit" disabled={invitePending} className={buttonClass.primary}>
              {invitePending ? t.form.saving : c.createInvite}
            </button>
          </form>
          <FormStatus state={inviteState} t={t} success={c.inviteCreated} className="mt-2" />
          {newToken && (
            <div className="mt-3 flex flex-wrap items-center gap-3 border border-jade/40 bg-jade/5 p-3">
              <code className="min-w-0 flex-1 truncate font-mono text-xs text-bone" dir="ltr">
                {invitePath(locale, newToken)}
              </code>
              <CopyButton path={invitePath(locale, newToken)} label={c.copy} copiedLabel={c.copied} />
            </div>
          )}

          <h4 className="mt-6 font-display text-[0.65rem] tracking-[0.2em] text-bone-faint uppercase">{c.activeInvites}</h4>
          {invites.length === 0 ? (
            <p className="mt-2 text-xs text-bone-faint">{c.noInvites}</p>
          ) : (
            <ul className="mt-3 grid grid-cols-1 gap-3">
              {invites.map((inv) => (
                <li key={inv.token} className="min-w-0 border border-steel-line bg-void/40 p-3">
                  <code className="block truncate font-mono text-xs text-bone-dim" dir="ltr">
                    {invitePath(locale, inv.token)}
                  </code>
                  <p className="mt-1.5 text-xs text-bone-faint">
                    {fill(c.usesOf, { uses: inv.uses, max: inv.maxUses })} · {fill(c.expires, { date: inv.expires })}
                  </p>
                  <div className="mt-3 flex flex-wrap items-start gap-2">
                    <CopyButton path={invitePath(locale, inv.token)} label={c.copy} copiedLabel={c.copied} />
                    <ConfirmAction action={revokeInvite} hidden={{ token: inv.token, locale }} label={c.revoke} question={c.revokeConfirm} t={t} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Block>

        <Block title={c.rosterTitle}>
          {others.length === 0 ? (
            <p className="text-xs text-bone-faint">{c.noOthers}</p>
          ) : (
            <ul className="grid grid-cols-1 gap-3">
              {others.map((m) => (
                <li key={m.userId} className="flex flex-wrap items-start justify-between gap-3 border-b border-steel-line/60 pb-3 last:border-b-0">
                  <span className="pt-2 text-sm text-bone">{m.displayName}</span>
                  <ConfirmAction
                    action={removeMember}
                    hidden={{ teamId: team.id, userId: m.userId, locale }}
                    label={c.remove}
                    question={fill(c.removeConfirm, { name: m.displayName })}
                    t={t}
                  />
                </li>
              ))}
            </ul>
          )}
        </Block>

        {others.length > 0 && (
          <Block title={c.transferTitle} hint={c.transferHint}>
            <label htmlFor={`${uid}-transfer`} className={labelClass}>
              {c.transferTo}
            </label>
            <select
              id={`${uid}-transfer`}
              value={transferTo}
              onChange={(e) => setTransferTo(e.target.value)}
              className={`${inputClass} mt-2 mb-3`}
            >
              <option value="">{c.transferSelect}</option>
              {others.map((m) => (
                <option key={m.userId} value={m.userId}>
                  {m.displayName}
                </option>
              ))}
            </select>
            <ConfirmAction
              action={transferCaptaincy}
              hidden={{ teamId: team.id, userId: transferTo, locale }}
              label={c.transfer}
              question={fill(c.transferConfirm, { name: transferName })}
              t={t}
              disabled={!transferTo}
            />
          </Block>
        )}

        <Block title={c.disbandTitle} hint={c.disbandHint}>
          <ConfirmAction
            action={disbandTeam}
            hidden={{ teamId: team.id, locale }}
            label={c.disband}
            question={fill(c.disbandConfirm, { name: team.name })}
            t={t}
            typeToConfirm={{ name: "confirmName", label: fill(c.disbandType, { name: team.name }), expected: team.name }}
          />
        </Block>
      </div>
    </section>
  );
}

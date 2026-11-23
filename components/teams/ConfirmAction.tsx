"use client";

import { useActionState, useEffect, useId, useRef, useState } from "react";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { ActionState } from "@/lib/teams/config";
import { FormStatus, buttonClass, describedBy, fieldError, inputClass, labelClass } from "./fields";

/* A destructive action behind an explicit confirm step. First press reveals
 * the question with Confirm / Cancel (focus moves to Cancel, Escape backs
 * out); only Confirm submits. Optionally the user must type a phrase too
 * (disband: the team name), which the server checks again. */

interface Props {
  action: (state: ActionState, fd: FormData) => Promise<ActionState>;
  hidden: Record<string, string>;
  label: string;
  question: string;
  t: Dictionary["teams"];
  tone?: "danger" | "ghost";
  typeToConfirm?: { name: string; label: string; expected: string };
  className?: string;
  /** Disables the first-step button (e.g. nothing selected yet). */
  disabled?: boolean;
}

export function ConfirmAction({ action, hidden, label, question, t, tone = "danger", typeToConfirm, className = "", disabled = false }: Props) {
  const [armed, setArmed] = useState(false);
  const [state, formAction, pending] = useActionState<ActionState, FormData>(async (prev, fd) => {
    const result = await action(prev, fd);
    if (result?.ok) setArmed(false);
    return result;
  }, null);
  const [typed, setTyped] = useState("");
  const uid = useId();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const wasArmed = useRef(false);

  useEffect(() => {
    if (armed) cancelRef.current?.focus();
    else if (wasArmed.current) triggerRef.current?.focus();
    wasArmed.current = armed;
  }, [armed]);

  const typedError = typeToConfirm ? fieldError(state, typeToConfirm.name, t) : undefined;
  const canConfirm = !typeToConfirm || typed.trim() === typeToConfirm.expected;

  return (
    <form action={formAction} className={className} onKeyDown={(e) => e.key === "Escape" && armed && setArmed(false)}>
      {Object.entries(hidden).map(([k, v]) => (
        <input key={k} type="hidden" name={k} value={v} />
      ))}

      {!armed ? (
        <button ref={triggerRef} type="button" disabled={disabled} onClick={() => setArmed(true)} className={buttonClass[tone]}>
          {label}
        </button>
      ) : (
        <div role="group" aria-labelledby={`${uid}-q`} className="border border-rose/40 bg-rose/5 p-4">
          <p id={`${uid}-q`} className="text-sm text-bone">
            {question}
          </p>
          {typeToConfirm && (
            <div className="mt-3">
              <label htmlFor={`${uid}-type`} className={labelClass}>
                {typeToConfirm.label}
              </label>
              <input
                id={`${uid}-type`}
                name={typeToConfirm.name}
                value={typed}
                onChange={(e) => setTyped(e.target.value)}
                autoComplete="off"
                spellCheck={false}
                aria-invalid={Boolean(typedError)}
                aria-describedby={describedBy(`${uid}-type`, undefined, typedError)}
                className={`${inputClass} mt-2`}
              />
              {typedError && (
                <p id={`${uid}-type-error`} role="alert" className="mt-1.5 text-xs font-medium text-rose">
                  {typedError}
                </p>
              )}
            </div>
          )}
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="submit" disabled={pending || !canConfirm} aria-describedby={`${uid}-q`} className={buttonClass.danger}>
              {pending ? "…" : t.confirm.yes}
            </button>
            <button ref={cancelRef} type="button" onClick={() => setArmed(false)} className={buttonClass.ghost}>
              {t.confirm.cancel}
            </button>
          </div>
        </div>
      )}
      <FormStatus state={state} t={t} fields={typeToConfirm ? [typeToConfirm.name] : []} className="mt-2" />
    </form>
  );
}

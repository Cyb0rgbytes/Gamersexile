import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { ActionState } from "@/lib/teams/config";

/* Form primitives shared by every team / account form. Plain components (no
 * hooks) so they work in both server and client trees. Errors are tied to
 * their field with aria-describedby + aria-invalid. */

export const inputClass =
  "w-full border border-steel-line bg-void px-3.5 py-2.5 text-sm text-bone placeholder:text-bone-faint/70 transition-colors hover:border-steel-hi focus:border-violet aria-[invalid=true]:border-rose";

export const labelClass = "block font-display text-[0.7rem] font-semibold tracking-[0.16em] text-bone uppercase";

export const buttonClass = {
  primary:
    "clip-notch-sm inline-flex items-center justify-center gap-2 bg-crimson px-5 py-2.5 font-display text-xs font-semibold tracking-[0.14em] text-white uppercase transition-colors hover:bg-crimson-hot disabled:cursor-not-allowed disabled:opacity-60",
  ghost:
    "clip-notch-sm inline-flex items-center justify-center gap-2 border border-steel-line px-4 py-2 font-display text-[0.7rem] font-semibold tracking-[0.14em] text-bone-dim uppercase transition-colors hover:border-steel-hi hover:text-bone disabled:cursor-not-allowed disabled:opacity-60",
  danger:
    "clip-notch-sm inline-flex items-center justify-center gap-2 border border-rose/50 px-4 py-2 font-display text-[0.7rem] font-semibold tracking-[0.14em] text-rose uppercase transition-colors hover:border-rose hover:bg-rose/10 disabled:cursor-not-allowed disabled:opacity-60",
};

interface FieldProps {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}

/** Label + control + hint + error. The control must set id and aria-describedby={describedBy(id, ...)}. */
export function Field({ id, label, hint, error, children, className = "" }: FieldProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <div className="mt-2">{children}</div>
      {hint && (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-bone-faint">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-xs font-medium text-rose" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export const describedBy = (id: string, hint?: string, error?: string) =>
  [hint ? `${id}-hint` : "", error ? `${id}-error` : ""].filter(Boolean).join(" ") || undefined;

/** Error text for a given field, if the last action failed on it. */
export function fieldError(state: ActionState, field: string, t: Dictionary["teams"]): string | undefined {
  if (state && !state.ok && state.field === field) return t.errors[state.error];
  return undefined;
}

/** Form-level error (one not tied to a specific field) or a success notice. */
export function FormStatus({
  state,
  t,
  success,
  fields = [],
  className = "",
}: {
  state: ActionState;
  t: Dictionary["teams"];
  success?: string;
  /** Fields that render their own error inline. */
  fields?: string[];
  className?: string;
}) {
  const error = state && !state.ok && !(state.field && fields.includes(state.field)) ? t.errors[state.error] : null;
  const ok = state?.ok && success ? success : null;
  return (
    <p aria-live="polite" className={`text-sm empty:hidden ${error ? "font-medium text-rose" : "text-jade"} ${className}`}>
      {error ?? ok ?? ""}
    </p>
  );
}

"use client";

import { useRef, useState, useTransition } from "react";
import { LocaleLink as Link } from "@/components/i18n/LocaleLink";
import { reportClip } from "@/lib/clips/actions";
import { REPORT_REASONS, type ClipErrorCode, type ReportReason } from "@/lib/clips/constants";

/* Report flow in a native <dialog>: focus trap, Esc and backdrop handling
 * come from the platform. One report per user per clip (server-enforced). */

interface ReportButtonProps {
  clipId: string;
  canReport: boolean;
  alreadyReported: boolean;
  signInHref: string;
  labels: {
    button: string;
    title: string;
    lead: string;
    reasonLabel: string;
    reasons: Record<ReportReason, string>;
    submit: string;
    cancel: string;
    sending: string;
    done: string;
    reported: string;
    signInPrompt: string;
  };
  signInLabel: string;
  errors: Record<ClipErrorCode, string>;
}

export function ReportButton({ clipId, canReport, alreadyReported, signInHref, labels, signInLabel, errors }: ReportButtonProps) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [reported, setReported] = useState(alreadyReported);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  if (reported) {
    return (
      <span className="inline-flex items-center gap-2 px-3 py-2 text-xs text-bone-faint" role="status">
        <FlagIcon /> {message ?? labels.reported}
      </span>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setError(null);
          dialog.current?.showModal();
        }}
        className="clip-notch-sm inline-flex items-center gap-2 border border-steel-line px-3 py-2 text-xs text-bone-faint transition-colors hover:border-rose/60 hover:text-rose"
      >
        <FlagIcon /> {labels.button}
      </button>

      <dialog
        ref={dialog}
        aria-labelledby={`report-${clipId}`}
        className="clip-notch m-auto w-[min(28rem,calc(100vw-2rem))] border border-steel-line bg-steel p-0 text-bone-dim backdrop:bg-void/80"
        onClick={(e) => {
          if (e.target === e.currentTarget) dialog.current?.close();
        }}
      >
        <div className="p-6">
          <h2 id={`report-${clipId}`} className="font-display text-lg font-bold tracking-wide text-bone uppercase">
            {labels.title}
          </h2>

          {!canReport ? (
            <p className="mt-4 text-sm">
              {labels.signInPrompt}{" "}
              <Link href={signInHref} className="text-crimson-hot underline underline-offset-4">
                {signInLabel}
              </Link>
            </p>
          ) : (
            <form
              className="mt-3"
              onSubmit={(e) => {
                e.preventDefault();
                const reason = String(new FormData(e.currentTarget).get("reason") ?? "");
                startTransition(async () => {
                  const res = await reportClip(clipId, reason);
                  if (res.ok || res.error === "already-reported") {
                    dialog.current?.close();
                    setMessage(labels.done);
                    setReported(true);
                  } else {
                    setError(errors[res.error] ?? errors.server);
                  }
                });
              }}
            >
              <p className="text-sm">{labels.lead}</p>
              <fieldset className="mt-4">
                <legend className="font-display text-xs tracking-[0.14em] text-bone-faint uppercase">{labels.reasonLabel}</legend>
                <div className="mt-2 grid gap-1.5">
                  {REPORT_REASONS.map((r, i) => (
                    <label key={r} className="flex cursor-pointer items-center gap-3 border border-steel-line px-3 py-2 text-sm hover:border-steel-hi has-checked:border-crimson/60 has-checked:text-bone">
                      <input type="radio" name="reason" value={r} required defaultChecked={i === 0} className="accent-crimson" />
                      {labels.reasons[r]}
                    </label>
                  ))}
                </div>
              </fieldset>

              {error && (
                <p role="alert" className="mt-3 text-sm text-rose">
                  {error}
                </p>
              )}

              <div className="mt-5 flex flex-wrap justify-end gap-2">
                <button
                  type="button"
                  onClick={() => dialog.current?.close()}
                  className="clip-notch-sm border border-steel-line px-4 py-2 font-display text-xs tracking-[0.14em] text-bone-dim uppercase hover:text-bone"
                >
                  {labels.cancel}
                </button>
                <button
                  type="submit"
                  disabled={pending}
                  className="clip-notch-sm bg-crimson px-4 py-2 font-display text-xs font-semibold tracking-[0.14em] text-white uppercase hover:bg-crimson-hot disabled:opacity-60"
                >
                  {pending ? labels.sending : labels.submit}
                </button>
              </div>
            </form>
          )}
        </div>
      </dialog>
    </>
  );
}

function FlagIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 21V4M5 4h11l-2 4 2 4H5" />
    </svg>
  );
}

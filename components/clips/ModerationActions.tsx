"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { moderateClip } from "@/lib/clips/actions";
import type { ClipErrorCode } from "@/lib/clips/constants";

/* Admin buttons for one clip in the moderation queue. The server action
 * re-checks the admin role; these buttons are convenience only. */

type Action = "restore" | "restore-reset" | "hide" | "delete";

interface ModerationActionsProps {
  clipId: string;
  status: "published" | "hidden";
  labels: { restore: string; restoreReset: string; dismiss: string; hide: string; delete: string; deleteConfirm: string; working: string };
  errors: Record<ClipErrorCode, string>;
}

const btn = "clip-notch-sm border px-3 py-2 font-display text-[0.7rem] tracking-[0.14em] uppercase transition-colors disabled:opacity-50";

export function ModerationActions({ clipId, status, labels, errors }: ModerationActionsProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const run = (action: Action) => {
    if (action === "delete" && !window.confirm(labels.deleteConfirm)) return;
    setError(null);
    startTransition(async () => {
      const res = await moderateClip(clipId, action);
      if (res.ok) router.refresh();
      else setError(errors[res.error] ?? errors.server);
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-2" aria-busy={pending}>
      {status === "hidden" ? (
        <>
          <button type="button" disabled={pending} onClick={() => run("restore")} className={`${btn} border-jade/50 text-jade hover:bg-jade/10`}>
            {labels.restore}
          </button>
          <button type="button" disabled={pending} onClick={() => run("restore-reset")} className={`${btn} border-jade/50 text-jade hover:bg-jade/10`}>
            {labels.restoreReset}
          </button>
        </>
      ) : (
        <>
          <button type="button" disabled={pending} onClick={() => run("hide")} className={`${btn} border-steel-hi text-bone-dim hover:text-bone`}>
            {labels.hide}
          </button>
          <button type="button" disabled={pending} onClick={() => run("restore-reset")} className={`${btn} border-jade/50 text-jade hover:bg-jade/10`}>
            {labels.dismiss}
          </button>
        </>
      )}
      <button type="button" disabled={pending} onClick={() => run("delete")} className={`${btn} border-rose/50 text-rose hover:bg-rose/10`}>
        {labels.delete}
      </button>
      {pending && <span className="text-xs text-bone-faint">{labels.working}</span>}
      {error && (
        <span role="alert" className="text-xs text-rose">
          {error}
        </span>
      )}
    </div>
  );
}

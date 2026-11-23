"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteClip } from "@/lib/clips/actions";
import type { ClipErrorCode } from "@/lib/clips/constants";
import { useLocalePath } from "@/lib/i18n/client";

/* Share (native share sheet where available, else copy) and owner delete. */

export function ShareButton({ path, title, labels }: { path: string; title: string; labels: { share: string; copied: string } }) {
  const [copied, setCopied] = useState(false);

  async function share() {
    const url = new URL(path, window.location.origin).toString();
    if (typeof navigator.share === "function" && window.matchMedia("(pointer: coarse)").matches) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        /* dismissed: fall through to copy */
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt(labels.share, url);
    }
  }

  return (
    <button
      type="button"
      onClick={share}
      className="clip-notch-sm inline-flex items-center gap-2 border border-steel-line px-3 py-2 text-xs text-bone-dim transition-colors hover:border-steel-hi hover:text-bone"
    >
      <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" />
      </svg>
      <span aria-live="polite">{copied ? labels.copied : labels.share}</span>
    </button>
  );
}

export function DeleteClipButton({
  clipId,
  labels,
  errors,
}: {
  clipId: string;
  labels: { delete: string; deleteConfirm: string; deleting: string };
  errors: Record<ClipErrorCode, string>;
}) {
  const router = useRouter();
  const toLocale = useLocalePath();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <span className="inline-flex flex-col items-start gap-1">
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          if (!window.confirm(labels.deleteConfirm)) return;
          setError(null);
          startTransition(async () => {
            const res = await deleteClip(clipId);
            if (res.ok) router.replace(toLocale("/clips"));
            else setError(errors[res.error] ?? errors.server);
          });
        }}
        className="clip-notch-sm inline-flex items-center gap-2 border border-rose/40 px-3 py-2 text-xs text-rose transition-colors hover:border-rose hover:bg-rose/10 disabled:opacity-60"
      >
        {pending ? labels.deleting : labels.delete}
      </button>
      {error && (
        <span role="alert" className="text-xs text-rose">
          {error}
        </span>
      )}
    </span>
  );
}

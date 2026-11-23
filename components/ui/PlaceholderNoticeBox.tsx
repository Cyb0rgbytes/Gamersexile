"use client";

import { useState, type ReactNode } from "react";

/* The dismissible box behind <PlaceholderNotice>. Strings arrive as props
 * from the server wrapper. */

export function PlaceholderNoticeBox({
  title,
  dismiss,
  children,
}: {
  title: string;
  dismiss: string;
  children: ReactNode;
}) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <div className="fixed start-4 bottom-4 z-90 max-w-xs border border-crimson/40 bg-steel/95 p-4 text-xs shadow-lift backdrop-blur">
      <p className="font-display text-[0.65rem] tracking-[0.2em] text-crimson-hot uppercase">
        {title}
      </p>
      <p className="mt-2 text-bone-dim">{children}</p>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        className="mt-3 font-display text-[0.65rem] tracking-[0.18em] text-bone-faint uppercase transition-colors hover:text-bone"
      >
        {dismiss}
      </button>
    </div>
  );
}

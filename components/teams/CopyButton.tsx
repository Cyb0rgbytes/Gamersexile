"use client";

import { useState } from "react";
import { buttonClass } from "./fields";

/* Copies an absolute URL built from a site-relative path at click time, so
 * the server never needs to know the host. */
export function CopyButton({ path, label, copiedLabel }: { path: string; label: string; copiedLabel: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    const url = `${window.location.origin}${path}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      window.prompt(label, url);
      return;
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button type="button" onClick={copy} className={buttonClass.ghost}>
      <span aria-live="polite">{copied ? copiedLabel : label}</span>
    </button>
  );
}

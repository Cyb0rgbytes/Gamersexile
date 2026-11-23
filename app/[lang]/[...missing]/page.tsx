import { notFound } from "next/navigation";

/* Catch-all for unmatched paths under a locale ("/en/does-not-exist").
 * [lang]/not-found.tsx only renders for notFound() calls inside the
 * segment, so without this an unknown path would fall through to Next's
 * bare default 404 instead of the localized page inside the site chrome.
 * More specific routes always win over a catch-all. */

export default function CatchAll(): never {
  notFound();
}

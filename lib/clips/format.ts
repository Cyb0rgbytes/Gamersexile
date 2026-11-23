/* Locale-aware formatting for clip metadata. Safe on client and server. */

export function formatBytes(bytes: number, locale: string): string {
  const mb = bytes / (1024 * 1024);
  const nf = new Intl.NumberFormat(locale, { maximumFractionDigits: mb < 10 ? 1 : 0 });
  return mb >= 1 ? `${nf.format(mb)} MB` : `${new Intl.NumberFormat(locale).format(Math.ceil(bytes / 1024))} KB`;
}

/** 75 → "1:15". Digits are locale-formatted where the locale differs. */
export function formatDuration(seconds: number): string {
  const s = Math.max(0, Math.round(seconds));
  const m = Math.floor(s / 60);
  return `${m}:${String(s % 60).padStart(2, "0")}`;
}

const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 31536000],
  ["month", 2592000],
  ["week", 604800],
  ["day", 86400],
  ["hour", 3600],
  ["minute", 60],
];

/** Unix seconds → "3 days ago" in the given locale. */
export function relativeTime(unixSeconds: number, locale: string, nowSeconds = Date.now() / 1000): string {
  const diff = unixSeconds - nowSeconds;
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
  for (const [unit, secs] of UNITS) {
    if (Math.abs(diff) >= secs) return rtf.format(Math.round(diff / secs), unit);
  }
  return rtf.format(0, "minute");
}

export const compactNumber = (n: number, locale: string) =>
  new Intl.NumberFormat(locale, { notation: n >= 10000 ? "compact" : "standard" }).format(n);

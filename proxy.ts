import { NextResponse, type NextRequest } from "next/server";
import { clerkMiddleware } from "@clerk/nextjs/server";
import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import { DEFAULT_LOCALE, LOCALES, LOCALE_COOKIE, isLocale } from "@/lib/i18n/config";
import { AUTH_ENABLED } from "@/lib/auth/enabled";

/* ═══════════════════════════════════════════════════════════════════════════
 *  PROXY (Next 16's name for middleware)
 *  1. Clerk: makes the session available to auth() everywhere. Routes are
 *     NOT blanket-protected here; each page / action checks what it needs,
 *     so public pages stay static and crawlable.
 *  2. Locale: a path without a language prefix is redirected to one —
 *     the switcher cookie wins, then Accept-Language, then English.
 * ═══════════════════════════════════════════════════════════════════════════ */

function pickLocale(req: NextRequest): string {
  const cookie = req.cookies.get(LOCALE_COOKIE)?.value;
  if (cookie && isLocale(cookie)) return cookie;
  try {
    const languages = new Negotiator({
      headers: { "accept-language": req.headers.get("accept-language") ?? "" },
    }).languages();
    return match(languages, LOCALES as unknown as string[], DEFAULT_LOCALE);
  } catch {
    return DEFAULT_LOCALE;
  }
}

function localeRedirect(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // API routes and Clerk's own endpoints are language-neutral.
  if (pathname.startsWith("/api") || pathname.startsWith("/__clerk")) return;

  const first = pathname.split("/")[1] ?? "";
  if (isLocale(first)) return;

  const url = req.nextUrl.clone();
  url.pathname = `/${pickLocale(req)}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

/* Without Clerk keys the site still runs, minus sign-in (lib/auth/enabled). */
export default AUTH_ENABLED
  ? clerkMiddleware(async (_auth, req) => localeRedirect(req))
  : (req: NextRequest) => localeRedirect(req);

export const config = {
  matcher: [
    // Everything except Next internals and files with an extension
    // (static assets, sitemap.xml, robots.txt, manifest, icons…).
    "/((?!_next|.*\\.[\\w]+$).*)",
    "/(api|trpc)(.*)",
  ],
};

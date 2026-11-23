"use client";

import { Show, UserButton } from "@clerk/nextjs";
import { LocaleLink as Link } from "@/components/i18n/LocaleLink";

/* Header account slot. Rendered only when Clerk is configured (the parent
 * checks AUTH_ENABLED), so it always sits inside <ClerkProvider>. Clerk
 * Core 3 replaced <SignedIn>/<SignedOut> with <Show when="…">. The client
 * <Show> keeps pages static; the server one would read auth per request. */

export function HeaderAuth({ signInLabel }: { signInLabel: string }) {
  return (
    <>
      <Show when="signed-out">
        <Link
          href="/sign-in"
          className="font-display text-xs font-semibold tracking-[0.16em] whitespace-nowrap text-bone-dim uppercase transition-colors hover:text-crimson-hot"
        >
          {signInLabel}
        </Link>
      </Show>
      <Show when="signed-in">
        <UserButton />
      </Show>
    </>
  );
}

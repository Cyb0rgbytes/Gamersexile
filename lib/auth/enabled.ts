/* Clerk is switched on by its publishable key being present. Without keys
 * (local dev before setup, or a preview deploy) the site still renders:
 * the proxy skips Clerk, the layout skips <ClerkProvider>, and signed-in
 * features show a "sign-in is not available yet" state instead of crashing.
 *
 * NEXT_PUBLIC_ so the same check works in client components. */

export const AUTH_ENABLED = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

import { HankoSeal } from "@/components/brand/HankoSeal";
import { NotchButton } from "@/components/ui/NotchButton";
import type { Dictionary } from "@/lib/i18n/dictionaries";

/* Centered notice panels used wherever a page needs a signed-in user:
 *  - AuthUnavailable: Clerk keys are not configured (AUTH_ENABLED = false).
 *  - SignInPrompt:    auth is on but nobody is signed in.
 * `redirectTo` is a locale-prefixed path the user returns to after signing in. */

function Panel({ kanji, title, body, children }: { kanji: string; title: string; body: string; children: React.ReactNode }) {
  return (
    <div className="clip-notch relative mx-auto max-w-xl overflow-hidden border border-steel-line bg-steel p-6 sm:p-10">
      <div className="flex items-start gap-5">
        <HankoSeal kanji={kanji} size={48} className="shrink-0" />
        <div className="min-w-0">
          <h2 className="font-display text-lg font-bold tracking-wide text-bone uppercase">{title}</h2>
          <p className="mt-3 text-sm text-bone-dim">{body}</p>
        </div>
      </div>
      <div className="mt-8 flex flex-wrap gap-3">{children}</div>
    </div>
  );
}

export function AuthUnavailable({ t }: { t: Dictionary["auth"] }) {
  return (
    <Panel kanji="閉" title={t.unavailable.title} body={t.unavailable.body}>
      <NotchButton href="/teams">{t.unavailable.browseTeams}</NotchButton>
      <NotchButton href="/" variant="ghost">
        {t.unavailable.home}
      </NotchButton>
    </Panel>
  );
}

export const signInHref = (redirectTo?: string) =>
  `/sign-in${redirectTo ? `?redirect_url=${encodeURIComponent(redirectTo)}` : ""}`;

export function SignInPrompt({
  t,
  redirectTo,
  title,
  body,
}: {
  t: Dictionary["auth"];
  redirectTo?: string;
  title?: string;
  body?: string;
}) {
  return (
    <Panel kanji="門" title={title ?? t.prompt.title} body={body ?? t.prompt.body}>
      <NotchButton href={signInHref(redirectTo)}>{t.prompt.signIn}</NotchButton>
      <NotchButton
        href={`/sign-up${redirectTo ? `?redirect_url=${encodeURIComponent(redirectTo)}` : ""}`}
        variant="ghost"
      >
        {t.prompt.signUp}
      </NotchButton>
    </Panel>
  );
}

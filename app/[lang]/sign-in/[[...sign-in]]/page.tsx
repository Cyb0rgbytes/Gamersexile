import type { Metadata } from "next";
import { SignIn } from "@clerk/nextjs";
import { AuthShell } from "@/components/auth/AuthShell";
import { AuthUnavailable } from "@/components/auth/AuthPanels";
import { AUTH_ENABLED } from "@/lib/auth/enabled";
import { localePath } from "@/lib/i18n/config";
import { getDictionary, getLocale } from "@/lib/i18n/dictionaries";
import { pageMeta } from "@/lib/teams/meta";

export async function generateMetadata(): Promise<Metadata> {
  const [locale, t] = await Promise.all([getLocale(), getDictionary()]);
  return pageMeta(locale, "/sign-in", t.auth.meta.signInTitle, t.auth.meta.signInDescription, { noindex: true });
}

export default async function SignInPage() {
  const [locale, t] = await Promise.all([getLocale(), getDictionary()]);

  return (
    <AuthShell eyebrow={t.auth.signIn.eyebrow} jp="入場" title={t.auth.signIn.title} lead={t.auth.signIn.lead} watermark="入">
      {AUTH_ENABLED ? (
        /* Clerk honours ?redirect_url= over the fallback below. */
        <SignIn
          path={localePath(locale, "/sign-in")}
          routing="path"
          signUpUrl={localePath(locale, "/sign-up")}
          fallbackRedirectUrl={localePath(locale, "/account")}
        />
      ) : (
        <AuthUnavailable t={t.auth} />
      )}
    </AuthShell>
  );
}

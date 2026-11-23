import type { Metadata } from "next";
import { SignUp } from "@clerk/nextjs";
import { AuthShell } from "@/components/auth/AuthShell";
import { AuthUnavailable } from "@/components/auth/AuthPanels";
import { AUTH_ENABLED } from "@/lib/auth/enabled";
import { localePath } from "@/lib/i18n/config";
import { getDictionary, getLocale } from "@/lib/i18n/dictionaries";
import { pageMeta } from "@/lib/teams/meta";

export async function generateMetadata(): Promise<Metadata> {
  const [locale, t] = await Promise.all([getLocale(), getDictionary()]);
  return pageMeta(locale, "/sign-up", t.auth.meta.signUpTitle, t.auth.meta.signUpDescription, { noindex: true });
}

export default async function SignUpPage() {
  const [locale, t] = await Promise.all([getLocale(), getDictionary()]);

  return (
    <AuthShell eyebrow={t.auth.signUp.eyebrow} jp="登録" title={t.auth.signUp.title} lead={t.auth.signUp.lead} watermark="登">
      {AUTH_ENABLED ? (
        <SignUp
          path={localePath(locale, "/sign-up")}
          routing="path"
          signInUrl={localePath(locale, "/sign-in")}
          fallbackRedirectUrl={localePath(locale, "/account")}
        />
      ) : (
        <AuthUnavailable t={t.auth} />
      )}
    </AuthShell>
  );
}

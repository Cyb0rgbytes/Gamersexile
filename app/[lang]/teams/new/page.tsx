import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { LocaleLink as Link } from "@/components/i18n/LocaleLink";
import { AuthUnavailable, SignInPrompt } from "@/components/auth/AuthPanels";
import { TeamDetailsForm } from "@/components/teams/TeamDetailsForm";
import { AUTH_ENABLED, getUserId, syncProfile } from "@/lib/auth";
import { GAMES } from "@/lib/games";
import { localePath } from "@/lib/i18n/config";
import { getDictionary, getLocale } from "@/lib/i18n/dictionaries";
import { pageMeta } from "@/lib/teams/meta";

export async function generateMetadata(): Promise<Metadata> {
  const [locale, t] = await Promise.all([getLocale(), getDictionary()]);
  return pageMeta(locale, "/teams/new", t.teams.meta.newTitle, t.teams.meta.newDescription, { noindex: true });
}

export default async function NewTeamPage() {
  const [locale, t, userId] = await Promise.all([getLocale(), getDictionary(), getUserId()]);
  const tt = t.teams;

  let body: React.ReactNode;
  if (!AUTH_ENABLED) {
    body = <AuthUnavailable t={t.auth} />;
  } else if (!userId) {
    body = <SignInPrompt t={t.auth} redirectTo={localePath(locale, "/teams/new")} />;
  } else {
    const profile = await syncProfile();
    body = (
      <div className="clip-notch mx-auto max-w-3xl border border-steel-line bg-steel p-5 sm:p-8">
        <TeamDetailsForm
          mode="create"
          locale={locale}
          t={tt}
          games={GAMES.map((g) => ({ key: g.key, name: g.name, roles: g.roles }))}
          needsDiscord={!profile.discordUsername}
        />
      </div>
    );
  }

  return (
    <>
      <PageHeader eyebrow={{ en: tt.new.eyebrow, jp: "結成" }} title={tt.new.title} lead={tt.new.lead} watermark="旗" />
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-[110rem] px-gutter">
          <p className="mx-auto mb-6 max-w-3xl">
            <Link href="/teams" className="font-display text-xs tracking-[0.16em] text-bone-faint uppercase hover:text-bone">
              <span aria-hidden="true" className="inline-block rtl:-scale-x-100">←</span> {tt.new.backToTeams}
            </Link>
          </p>
          {body}
        </div>
      </section>
    </>
  );
}

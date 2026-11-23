import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { LocaleLink as Link } from "@/components/i18n/LocaleLink";
import { AuthUnavailable, SignInPrompt } from "@/components/auth/AuthPanels";
import { DiscordForm } from "@/components/auth/DiscordForm";
import { Avatar } from "@/components/teams/Avatar";
import { regionLabel, roleLabel } from "@/components/teams/TeamCard";
import { Chip } from "@/components/ui/Chip";
import { NotchButton } from "@/components/ui/NotchButton";
import { AUTH_ENABLED, getUserId, syncProfile } from "@/lib/auth";
import { gameByKey } from "@/lib/games";
import { localePath } from "@/lib/i18n/config";
import { getDictionary, getLocale } from "@/lib/i18n/dictionaries";
import { safeNextPath } from "@/lib/teams/config";
import { getUserTeams } from "@/lib/teams/queries";
import { pageMeta } from "@/lib/teams/meta";

export async function generateMetadata(): Promise<Metadata> {
  const [locale, t] = await Promise.all([getLocale(), getDictionary()]);
  return pageMeta(locale, "/account", t.auth.meta.accountTitle, t.auth.meta.accountDescription, { noindex: true });
}

export default async function AccountPage({ searchParams }: PageProps<"/[lang]/account">) {
  const [locale, t, sp, userId] = await Promise.all([getLocale(), getDictionary(), searchParams, getUserId()]);
  const ta = t.auth;
  const next = safeNextPath(Array.isArray(sp.next) ? sp.next[0] : sp.next);

  let body: React.ReactNode;
  if (!AUTH_ENABLED) {
    body = <AuthUnavailable t={ta} />;
  } else if (!userId) {
    const back = localePath(locale, "/account") + (next ? `?next=${encodeURIComponent(next)}` : "");
    body = <SignInPrompt t={ta} redirectTo={back} />;
  } else {
    const [profile, myTeams] = await Promise.all([syncProfile(), getUserTeams(userId)]);
    body = (
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <section aria-labelledby="acc-profile" className="clip-notch border border-steel-line bg-steel p-5 sm:p-7">
          <h2 id="acc-profile" className="font-display text-sm font-bold tracking-[0.16em] text-bone uppercase">
            {ta.account.profile}
          </h2>
          <div className="mt-5 flex items-center gap-4">
            <Avatar name={profile.displayName} src={profile.avatarUrl} size={64} />
            <div className="min-w-0">
              <p className="truncate font-display text-lg font-semibold text-bone">{profile.displayName}</p>
              <p className="mt-1 text-xs text-bone-faint">{ta.account.displayNameHint}</p>
            </div>
          </div>

          <div className="mt-7 border-t border-steel-line pt-6">
            <h3 className="font-display text-xs font-bold tracking-[0.18em] text-bone uppercase">{ta.account.discordTitle}</h3>
            {!profile.discordUsername && <p className="mt-1.5 text-xs text-rose">{ta.account.discordMissing}</p>}
            <div className="mt-4">
              <DiscordForm t={ta} tTeams={t.teams} current={profile.discordUsername} next={next} />
            </div>
          </div>
        </section>

        <section aria-labelledby="acc-teams" className="clip-notch border border-steel-line bg-steel p-5 sm:p-7">
          <h2 id="acc-teams" className="font-display text-sm font-bold tracking-[0.16em] text-bone uppercase">
            {ta.account.myTeams}
          </h2>
          {myTeams.length === 0 ? (
            <p className="mt-4 text-sm text-bone-dim">{ta.account.noTeams}</p>
          ) : (
            <ul className="mt-5 grid grid-cols-1 gap-3">
              {myTeams.map((team) => (
                <li key={team.slug} className="border border-steel-line bg-void/40 p-4 transition-colors hover:border-crimson/40">
                  <Link href={`/teams/${team.slug}`} className="block">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="font-display text-sm font-semibold text-bone uppercase">{team.name}</span>
                      {team.tag && <span className="font-mono text-xs text-bone-faint">[{team.tag}]</span>}
                      {team.captainId === userId && <Chip tone="crimson">{ta.account.captain}</Chip>}
                    </span>
                    <span className="mt-1.5 block text-xs text-bone-dim">
                      {gameByKey(team.game)?.name ?? team.game} · {regionLabel(t.teams, team.region)} ·{" "}
                      {team.role ? roleLabel(t.teams, team.role) : t.teams.roles.unassigned}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-6 flex flex-wrap gap-3">
            <NotchButton href="/teams" size="sm" variant="ghost">
              {ta.account.findTeam}
            </NotchButton>
            <NotchButton href="/teams/new" size="sm">
              {ta.account.createTeam}
            </NotchButton>
          </div>
        </section>
      </div>
    );
  }

  return (
    <>
      <PageHeader eyebrow={{ en: ta.account.eyebrow, jp: "会員" }} title={ta.account.title} lead={ta.account.lead} watermark="己" />
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-[110rem] px-gutter">{body}</div>
      </section>
    </>
  );
}

import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/AuthShell";
import { AuthUnavailable, SignInPrompt } from "@/components/auth/AuthPanels";
import { HankoSeal } from "@/components/brand/HankoSeal";
import { Chip } from "@/components/ui/Chip";
import { NotchButton } from "@/components/ui/NotchButton";
import { GradientMesh } from "@/components/ui/Texture";
import { JoinForm } from "@/components/teams/JoinForm";
import { regionLabel, roleLabel } from "@/components/teams/TeamCard";
import { AUTH_ENABLED, getUserId, syncProfile } from "@/lib/auth";
import { gameByKey } from "@/lib/games";
import { fill, localePath } from "@/lib/i18n/config";
import { getDictionary, getLocale } from "@/lib/i18n/dictionaries";
import { getMemberCount, getMembership, getUserTeamForGame, lookupInvite } from "@/lib/teams/queries";
import { pageMeta } from "@/lib/teams/meta";

export async function generateMetadata({ params }: PageProps<"/[lang]/teams/invite/[token]">): Promise<Metadata> {
  const [{ token }, locale, t] = await Promise.all([params, getLocale(), getDictionary()]);
  return pageMeta(locale, `/teams/invite/${token}`, t.teams.meta.inviteTitle, t.teams.meta.inviteDescription, { noindex: true });
}

export default async function InvitePage({ params }: PageProps<"/[lang]/teams/invite/[token]">) {
  const [{ token }, locale, t, userId] = await Promise.all([params, getLocale(), getDictionary(), getUserId()]);
  const tt = t.teams;
  const found = await lookupInvite(token);

  if (found.status !== "ok") {
    return (
      <AuthShell eyebrow={tt.invite.eyebrow} jp="招待" title={tt.invite.invalidTitle} lead={tt.invite.invalidBody} watermark="招">
        <div className="flex flex-col items-center gap-6">
          <HankoSeal kanji="無" />
          <NotchButton href="/teams">{tt.invite.browse}</NotchButton>
        </div>
      </AuthShell>
    );
  }

  const { team } = found;
  const game = gameByKey(team.game);
  const members = await getMemberCount(team.id);
  const here = localePath(locale, `/teams/invite/${token}`);
  const openRoles = Array.isArray(team.openRoles) ? team.openRoles : [];

  let action: React.ReactNode;
  if (!AUTH_ENABLED) {
    action = <AuthUnavailable t={t.auth} />;
  } else if (!userId) {
    action = <SignInPrompt t={t.auth} redirectTo={here} title={tt.invite.signIn} body={tt.invite.signInHint} />;
  } else if (await getMembership(team.id, userId)) {
    action = (
      <div className="flex flex-col items-center gap-4 text-center">
        <p className="text-sm text-jade">{tt.invite.alreadyMember}</p>
        <NotchButton href={`/teams/${team.slug}`}>{tt.invite.goToTeam}</NotchButton>
      </div>
    );
  } else {
    const other = await getUserTeamForGame(userId, team.game);
    if (other) {
      action = (
        <div className="flex flex-col items-center gap-4 text-center">
          <p className="max-w-md text-sm text-rose">
            {fill(tt.invite.otherTeam, { game: game?.name ?? team.game, team: other.name })}
          </p>
          <NotchButton href={`/teams/${other.slug}`} variant="ghost">
            {other.name}
          </NotchButton>
        </div>
      );
    } else {
      const profile = await syncProfile();
      action = <JoinForm t={tt} locale={locale} token={token} needsDiscord={!profile.discordUsername} />;
    }
  }

  return (
    <AuthShell eyebrow={tt.invite.eyebrow} jp="招待" title={tt.invite.title} lead={tt.invite.lead} watermark="招">
      <div className="grid w-full max-w-xl min-w-0 grid-cols-1 gap-8">
        <article className="clip-notch relative overflow-hidden border border-steel-line bg-steel">
          <div className="relative h-20 border-b border-steel-line">
            <GradientMesh hue={game?.hue ?? 348} intensity={0.8} />
            <div className="absolute start-4 bottom-3 flex flex-wrap gap-2">
              <Chip tone="crimson">{game?.name ?? team.game}</Chip>
              <Chip tone="neutral">{regionLabel(tt, team.region)}</Chip>
            </div>
          </div>
          <div className="p-5 sm:p-6">
            <h2 className="flex flex-wrap items-baseline gap-2 font-display text-xl font-bold tracking-wide break-words text-bone uppercase">
              {team.name}
              {team.tag && <span className="font-mono text-sm font-medium text-bone-faint">[{team.tag}]</span>}
            </h2>
            <p className="mt-1 text-xs text-bone-faint">
              {members === 1 ? tt.card.membersOne : fill(tt.card.members, { count: members })}
            </p>
            {team.description && <p className="mt-4 text-sm break-words whitespace-pre-line text-bone-dim">{team.description}</p>}
            {team.recruiting && openRoles.length > 0 && (
              <ul className="mt-4 flex flex-wrap gap-1.5" aria-label={tt.card.openRoles}>
                {openRoles.map((r) => (
                  <li key={r}>
                    <Chip tone="neutral">{roleLabel(tt, r)}</Chip>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </article>
        {action}
      </div>
    </AuthShell>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LocaleLink as Link } from "@/components/i18n/LocaleLink";
import { Chip } from "@/components/ui/Chip";
import { Grain, GradientMesh, KanjiWatermark } from "@/components/ui/Texture";
import { HankoSeal } from "@/components/brand/HankoSeal";
import { Avatar } from "@/components/teams/Avatar";
import { CaptainPanel } from "@/components/teams/CaptainPanel";
import { MemberPanel } from "@/components/teams/MemberPanel";
import { regionLabel, roleLabel } from "@/components/teams/TeamCard";
import { getUserId } from "@/lib/auth";
import { gameByKey, rolesFor } from "@/lib/games";
import { fill } from "@/lib/i18n/config";
import { getDictionary, getLocale } from "@/lib/i18n/dictionaries";
import { getActiveInvites, getRoster, getTeamBySlug } from "@/lib/teams/queries";
import { pageMeta } from "@/lib/teams/meta";

export async function generateMetadata({ params }: PageProps<"/[lang]/teams/[slug]">): Promise<Metadata> {
  const [{ slug }, locale, t] = await Promise.all([params, getLocale(), getDictionary()]);
  const team = await getTeamBySlug(slug);
  if (!team) return { title: t.teams.meta.title, robots: { index: false } };
  const game = gameByKey(team.game)?.name ?? team.game;
  const title = team.tag ? `${team.name} [${team.tag}]` : team.name;
  const description =
    team.description ?? fill(t.teams.meta.teamDescription, { name: team.name, game, region: regionLabel(t.teams, team.region) });
  return pageMeta(locale, `/teams/${team.slug}`, title, description);
}

export default async function TeamPage({ params }: PageProps<"/[lang]/teams/[slug]">) {
  const [{ slug }, locale, t, userId] = await Promise.all([params, getLocale(), getDictionary(), getUserId()]);
  const tt = t.teams;
  const team = await getTeamBySlug(slug);
  if (!team) notFound();

  const game = gameByKey(team.game);
  const roster = await getRoster(team);
  const me = userId ? roster.find((m) => m.userId === userId) : undefined;
  const isCaptain = Boolean(userId && team.captainId === userId);
  /* Discord usernames are shown to members of this team only. */
  const showDiscord = Boolean(me);
  const invites = isCaptain ? await getActiveInvites(team.id) : [];
  const dateFmt = new Intl.DateTimeFormat(locale, { dateStyle: "medium" });
  const dateTimeFmt = new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" });
  const openRoles = Array.isArray(team.openRoles) ? team.openRoles : [];

  return (
    <>
      {/* ── Header ── */}
      <section className="relative overflow-hidden border-b border-steel-line pt-36 pb-14">
        <GradientMesh hue={game?.hue ?? 348} intensity={0.55} />
        <KanjiWatermark kanji={(game?.jp ?? "隊").slice(0, 2)} className="top-1/2 -end-6 -translate-y-1/2" size="clamp(7rem, 20vw, 16rem)" opacity={0.05} />
        <div className="relative mx-auto max-w-[110rem] px-gutter">
          <Link href="/teams" className="font-display text-xs tracking-[0.16em] text-bone-faint uppercase hover:text-bone">
            <span aria-hidden="true" className="inline-block rtl:-scale-x-100">←</span> {tt.team.backToTeams}
          </Link>
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <Chip tone="crimson">{game?.name ?? team.game}</Chip>
            <Chip tone="neutral">{regionLabel(tt, team.region)}</Chip>
            {team.recruiting ? <Chip tone="live">{tt.card.recruiting}</Chip> : <Chip tone="neutral">{tt.card.closed}</Chip>}
          </div>
          <h1 className="mt-5 flex flex-wrap items-baseline gap-x-4 gap-y-1 font-display text-3xl leading-display font-bold tracking-display break-words text-bone uppercase italic">
            <span className="min-w-0 break-words">{team.name}</span>
            {team.tag && <span className="font-mono text-lg font-medium text-bone-faint not-italic">[{team.tag}]</span>}
          </h1>
        </div>
        <Grain opacity={0.08} />
      </section>

      <section className="py-14 sm:py-16">
        <div className="mx-auto grid max-w-[110rem] grid-cols-1 gap-10 px-gutter lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)]">
          <div className="grid min-w-0 grid-cols-1 content-start gap-10">
            {/* ── About ── */}
            <div>
              <h2 className="font-display text-xs tracking-[0.2em] text-bone-faint uppercase">{tt.team.about}</h2>
              <p className="mt-3 max-w-2xl text-base break-words whitespace-pre-line text-bone-dim">
                {team.description || tt.team.noDescription}
              </p>
            </div>

            {/* ── Open roles ── */}
            {team.recruiting && openRoles.length > 0 && (
              <div>
                <h2 className="font-display text-xs tracking-[0.2em] text-bone-faint uppercase">{tt.team.openRoles}</h2>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {openRoles.map((r) => (
                    <li key={r}>
                      <Chip tone="crimson">{roleLabel(tt, r)}</Chip>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* ── Roster ── */}
            <div>
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <h2 className="font-display text-xs tracking-[0.2em] text-bone-faint uppercase">
                  {tt.team.roster} <span className="font-mono text-bone-dim">· {roster.length}</span>
                </h2>
                {!showDiscord && <p className="text-xs text-bone-faint">{tt.team.discordHidden}</p>}
              </div>
              <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {roster.map((m) => {
                  const captain = m.userId === team.captainId;
                  return (
                    <li
                      key={m.userId}
                      className={`clip-notch-sm flex items-center gap-4 border bg-steel p-4 ${captain ? "border-crimson/45" : "border-steel-line"}`}
                    >
                      <Avatar name={m.displayName} src={m.avatarUrl} size={44} />
                      <div className="min-w-0 flex-1">
                        <p className="flex flex-wrap items-center gap-2">
                          <span className="truncate font-display text-sm font-semibold text-bone">{m.displayName}</span>
                          {captain && (
                            <Chip tone="crimson">
                              {tt.team.captain}
                            </Chip>
                          )}
                          {m.userId === userId && <span className="text-[0.65rem] text-bone-faint">({tt.team.you})</span>}
                        </p>
                        <p className="mt-1 text-xs text-bone-dim">
                          <span className="sr-only">{tt.team.role}: </span>
                          {m.role ? roleLabel(tt, m.role) : tt.roles.unassigned}
                        </p>
                        {showDiscord && m.discordUsername && (
                          <p className="mt-1 truncate font-mono text-[0.7rem] text-violet-hot" dir="ltr">
                            @{m.discordUsername}
                          </p>
                        )}
                        <p className="mt-1 text-[0.65rem] text-bone-faint">
                          {fill(tt.team.joined, { date: dateFmt.format(new Date(m.joinedAt * 1000)) })}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/* ── Side: member / captain controls ── */}
          <aside className="grid min-w-0 grid-cols-1 content-start gap-6">
            {me ? (
              <MemberPanel
                t={tt}
                locale={locale}
                teamId={team.id}
                teamName={team.name}
                roles={rolesFor(team.game)}
                currentRole={me.role}
                isCaptain={isCaptain}
              />
            ) : (
              <div className="clip-notch flex items-start gap-4 border border-steel-line bg-steel p-5">
                <HankoSeal kanji="隊" size={40} className="shrink-0" />
                <p className="text-sm text-bone-dim">{tt.team.joinHint}</p>
              </div>
            )}
            {isCaptain && (
              <CaptainPanel
                t={tt}
                locale={locale}
                team={{
                  id: team.id,
                  name: team.name,
                  tag: team.tag,
                  game: team.game,
                  region: team.region,
                  description: team.description,
                  recruiting: team.recruiting,
                  openRoles,
                }}
                game={{ key: team.game, name: game?.name ?? team.game, roles: rolesFor(team.game) }}
                others={roster.filter((m) => m.userId !== userId).map((m) => ({ userId: m.userId, displayName: m.displayName }))}
                invites={invites.map((i) => ({
                  token: i.token,
                  uses: i.uses,
                  maxUses: i.maxUses,
                  expires: dateTimeFmt.format(new Date(i.expiresAt * 1000)),
                }))}
              />
            )}
          </aside>
        </div>
      </section>
    </>
  );
}

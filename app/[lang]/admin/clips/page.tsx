import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { LocaleLink as Link } from "@/components/i18n/LocaleLink";
import { Chip } from "@/components/ui/Chip";
import { Avatar } from "@/components/clips/Avatar";
import { ModerationActions } from "@/components/clips/ModerationActions";
import { isAdmin } from "@/lib/auth";
import { REPORT_HIDE_THRESHOLD } from "@/lib/db/schema";
import { gameByKey } from "@/lib/games";
import { fill, languageAlternates, localePath } from "@/lib/i18n/config";
import { getDictionary, getLocale } from "@/lib/i18n/dictionaries";
import { isReportReason, thumbUrl } from "@/lib/clips/constants";
import { relativeTime } from "@/lib/clips/format";
import { moderationQueue } from "@/lib/clips/queries";

/* Clip moderation queue. Non-admins (and everyone while auth is off) get a
 * 404, so the page does not even confirm it exists. Every action re-checks
 * the role on the server (lib/clips/actions.moderateClip). */

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getDictionary();
  return {
    title: t.admin.clips.metaTitle,
    alternates: { canonical: localePath(locale, "/admin/clips"), languages: languageAlternates("/admin/clips") },
    robots: { index: false, follow: false },
  };
}

export default async function AdminClipsPage() {
  await connection();
  if (!(await isAdmin())) notFound();

  const [locale, t, queue] = await Promise.all([getLocale(), getDictionary(), moderationQueue()]);
  const a = t.admin.clips;
  const c = t.clips;

  return (
    <section className="mx-auto max-w-6xl px-gutter pt-32 pb-section">
      <p className="flex items-center gap-3">
        <span className="font-jp text-sm text-crimson-hot">審査</span>
        <span className="h-px w-10 bg-crimson/45" />
        <span className="font-display text-eyebrow tracking-eyebrow text-bone-faint uppercase">{a.eyebrow}</span>
      </p>
      <h1 className="mt-4 font-display text-2xl font-bold tracking-display text-bone uppercase italic">{a.title}</h1>
      <p className="mt-3 max-w-2xl text-bone-dim">{fill(a.lead, { threshold: REPORT_HIDE_THRESHOLD })}</p>

      {queue.length === 0 ? (
        <p className="clip-notch mt-10 border border-steel-line bg-steel/50 px-6 py-12 text-center text-bone-dim">{a.empty}</p>
      ) : (
        <ul className="mt-10 grid gap-4">
          {queue.map((clip) => (
            <li key={clip.id} className="clip-notch grid gap-4 border border-steel-line bg-steel p-4 sm:grid-cols-[12rem_1fr]">
              <Link href={`/clips/${clip.id}`} className="block aspect-video overflow-hidden bg-void" aria-label={a.view}>
                {clip.hasThumb && (
                  // eslint-disable-next-line @next/next/no-img-element -- R2 poster, served privately for hidden clips
                  <img src={thumbUrl(clip.id)} alt="" loading="lazy" className="size-full object-cover" />
                )}
              </Link>

              <div className="grid min-w-0 gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Chip tone={clip.status === "hidden" ? "rose" : "jade"}>{a.status[clip.status]}</Chip>
                  <Chip tone={clip.reportCount > 0 ? "crimson" : "neutral"}>
                    {clip.reportCount > 0 ? fill(a.reports, { count: clip.reportCount }) : a.noReports}
                  </Chip>
                  {gameByKey(clip.game) && <Chip>{gameByKey(clip.game)!.name}</Chip>}
                </div>

                <h2 className="font-display text-base font-bold tracking-wide break-words text-bone">
                  <Link href={`/clips/${clip.id}`} className="hover:text-crimson-hot">
                    {clip.title}
                  </Link>
                </h2>

                <p className="flex items-center gap-2 text-xs text-bone-faint">
                  <Avatar name={clip.author.name} url={clip.author.avatarUrl} size={20} />
                  <span>{fill(a.uploader, { name: clip.author.name })}</span>
                  <span aria-hidden="true">·</span>
                  <span>{relativeTime(clip.createdAt, locale)}</span>
                </p>

                {clip.reasons.length > 0 && (
                  <ul className="flex flex-wrap gap-1.5 text-xs">
                    {clip.reasons.map((r) => (
                      <li key={r.reason} className="border border-steel-line px-2 py-1 text-bone-dim">
                        {isReportReason(r.reason) ? c.report.reasons[r.reason] : r.reason} × {r.n}
                      </li>
                    ))}
                  </ul>
                )}

                <ModerationActions clipId={clip.id} status={clip.status} labels={a} errors={c.errors} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

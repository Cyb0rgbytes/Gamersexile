import type { Metadata } from "next";
import { connection } from "next/server";
import { LocaleLink as Link } from "@/components/i18n/LocaleLink";
import { NotchButton } from "@/components/ui/NotchButton";
import { HankoSeal } from "@/components/brand/HankoSeal";
import { UploadForm } from "@/components/clips/UploadForm";
import { AUTH_ENABLED, getUserId } from "@/lib/auth";
import { GAMES } from "@/lib/games";
import { languageAlternates, localePath } from "@/lib/i18n/config";
import { getDictionary, getLocale } from "@/lib/i18n/dictionaries";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getDictionary();
  return {
    title: t.clips.meta.newTitle,
    description: t.clips.meta.newDescription,
    alternates: { canonical: localePath(locale, "/clips/new"), languages: languageAlternates("/clips/new") },
    robots: { index: false, follow: false },
  };
}

export default async function NewClipPage() {
  await connection();
  const [locale, t, userId] = await Promise.all([getLocale(), getDictionary(), getUserId()]);
  const c = t.clips;

  return (
    <section className="mx-auto max-w-3xl px-gutter pt-32 pb-section">
      <Link
        href="/clips"
        className="inline-flex items-center gap-2 font-display text-xs tracking-[0.14em] text-bone-faint uppercase hover:text-crimson-hot"
      >
        <span aria-hidden="true" className="inline-block rtl:-scale-x-100">←</span> {c.clip.back}
      </Link>

      <div className="mt-6 flex items-center gap-4">
        <HankoSeal kanji="投" size={48} />
        <h1 className="font-display text-2xl font-bold tracking-display text-bone uppercase italic">{c.upload.title}</h1>
      </div>
      <p className="mt-4 text-bone-dim">{c.upload.lead}</p>

      <div className="clip-notch mt-8 border border-steel-line bg-steel p-5 sm:p-8">
        {!AUTH_ENABLED ? (
          <p className="text-sm text-bone-dim">{c.upload.authUnavailable}</p>
        ) : !userId ? (
          <div className="grid gap-4">
            <h2 className="font-display text-lg font-bold tracking-wide text-bone uppercase">{c.upload.signedOutTitle}</h2>
            <p className="text-sm text-bone-dim">{c.upload.signedOutBody}</p>
            <div>
              <NotchButton href={`/sign-in?redirect_url=${encodeURIComponent(localePath(locale, "/clips/new"))}`}>
                {c.gallery.signInToPost}
              </NotchButton>
            </div>
          </div>
        ) : (
          <UploadForm games={GAMES.map((g) => ({ key: g.key, name: g.name }))} labels={c.upload} errors={c.errors} />
        )}
      </div>
    </section>
  );
}

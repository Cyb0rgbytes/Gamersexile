import Image from "next/image";
import { LocaleLink as Link } from "@/components/i18n/LocaleLink";
import { LogoLockup } from "@/components/brand/LogoLockup";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { PatternOverlay } from "@/components/ui/Texture";
import { NAV, SITE, SOCIAL_LINKS } from "@/lib/site";
import { getDictionary, fill } from "@/lib/i18n/dictionaries";

export async function Footer() {
  const t = await getDictionary();
  const f = t.common.footer;
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-steel-line bg-steel/30">
      <PatternOverlay pattern="dotgrid" opacity={0.04} />

      {/* Gate band: the neon torii scene (public/art/background.jpg), framed
       * on the gate and faded into the page above and the footer below so it
       * reads as a view through to the shrine, not a pasted rectangle. In
       * flow (not absolute) so it can never collide with the link columns. */}
      <div aria-hidden="true" className="pointer-events-none relative h-64 overflow-hidden md:h-80">
        <Image
          src="/art/background.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-[50%_40%]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-void via-transparent to-void/0" />
        <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-[#0b0a10] to-transparent" />
      </div>

      <div className="relative mx-auto max-w-[110rem] px-gutter py-16">
        <div className="flex flex-col gap-12 lg:flex-row lg:justify-between">
          <div className="max-w-sm">
            <LogoLockup homeLabel={t.common.brand.homeLabel} emblemAlt={t.common.brand.emblemAlt} />
            <p className="mt-5 text-sm text-bone-dim">{t.common.meta.description}</p>

            <ul className="mt-6 flex gap-2.5">
              {SOCIAL_LINKS.map((s) => (
                <li key={s.key}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="clip-notch-sm grid size-10 place-items-center border border-steel-line text-bone-dim transition-all duration-300 hover:border-crimson/60 hover:bg-crimson/10 hover:text-crimson-hot"
                  >
                    <SocialIcon name={s.key} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            <div>
              <h2 className="font-display text-eyebrow tracking-eyebrow text-bone-faint uppercase">
                {f.explore}
              </h2>
              <ul className="mt-4 space-y-2.5">
                {NAV.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="group flex items-baseline gap-2 text-sm text-bone-dim transition-colors hover:text-crimson-hot"
                    >
                      {t.common.nav[item.key]}
                      <span className="font-jp text-[0.6rem] text-bone-faint opacity-0 transition-opacity group-hover:opacity-100">
                        {item.jp}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="font-display text-eyebrow tracking-eyebrow text-bone-faint uppercase">
                {f.community}
              </h2>
              <ul className="mt-4 space-y-2.5 text-sm text-bone-dim">
                <li>
                  <a
                    href={SITE.discord}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-crimson-hot"
                  >
                    {f.discordServer}
                  </a>
                </li>
                <li>
                  <Link href="/tournaments" className="transition-colors hover:text-crimson-hot">
                    {f.tournamentSchedule}
                  </Link>
                </li>
                <li>
                  <Link href="/creators" className="transition-colors hover:text-crimson-hot">
                    {f.creatorRoster}
                  </Link>
                </li>
                <li>
                  <Link href="/community#faq" className="transition-colors hover:text-crimson-hot">
                    {f.faq}
                  </Link>
                </li>
              </ul>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <h2 className="font-display text-eyebrow tracking-eyebrow text-bone-faint uppercase">
                {f.getInTouch}
              </h2>
              <p className="mt-4 text-sm text-bone-dim">
                {f.contactLead}
              </p>
              <a
                href={`mailto:${SITE.email}`}
                className="mt-2.5 inline-block font-mono text-sm text-crimson-hot transition-colors hover:text-crimson-hot"
              >
                {SITE.email}
              </a>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-steel-line pt-7 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
            <p className="text-xs text-bone-faint">
              {fill(f.rights, { year, name: SITE.name })}
            </p>
            <nav aria-label={`${f.privacy} · ${f.terms}`} className="flex flex-wrap gap-x-5 gap-y-2 text-xs">
              <Link href="/privacy" className="text-bone-dim transition-colors hover:text-crimson-hot">
                {f.privacy}
              </Link>
              <Link href="/terms" className="text-bone-dim transition-colors hover:text-crimson-hot">
                {f.terms}
              </Link>
            </nav>
          </div>
          <p lang="ja" className="font-jp text-xs tracking-[0.3em] text-bone-faint/70">
            {SITE.taglineJp}
          </p>
        </div>
      </div>
    </footer>
  );
}

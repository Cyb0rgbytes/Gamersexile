import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { ServerLogo } from "@/components/brand/ServerLogo";
import { RedSun } from "@/components/art/RedSun";
import { BrushReveal } from "@/components/motion/BrushReveal";
import { KanjiRail } from "@/components/brand/KanjiRail";
import { NotchButton } from "@/components/ui/NotchButton";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { Grain, PatternOverlay } from "@/components/ui/Texture";
import { BELONGING, JOIN_STEPS } from "@/lib/community";
import { SITE, SOCIAL_LINKS } from "@/lib/site";
import { getDictionary, getLocale } from "@/lib/i18n/dictionaries";
import { languageAlternates, localePath } from "@/lib/i18n/config";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getDictionary();
  return {
    title: t.join.meta.title,
    description: t.join.meta.description,
    alternates: { canonical: localePath(locale, "/join"), languages: languageAlternates("/join") },
  };
}

export default async function JoinPage() {
  const t = await getDictionary();
  const locale = await getLocale();
  const c = t.join;
  const num = new Intl.NumberFormat(locale, { minimumIntegerDigits: 2 });

  return (
    <>
      <PageHeader
        eyebrow={{ en: c.header.eyebrow, jp: "入隊" }}
        title={c.header.title}
        lead={c.header.lead}
        watermark="入隊"
      />

      {/* ── Steps ── */}
      <section className="relative py-section">
        <KanjiRail text="参加手順" side="left" />

        <div className="mx-auto max-w-[110rem] px-gutter">
          <ol className="grid gap-4 md:grid-cols-3">
            {JOIN_STEPS.map((step, i) => (
              <Reveal key={step.n} delay={i * 0.08}>
                <li className="clip-notch group relative h-full overflow-hidden border border-steel-line bg-steel p-7">
                  <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-crimson/60 opacity-0 transition-opacity duration-300 group-hover:animate-scan group-hover:opacity-100" />

                  <div className="flex items-baseline justify-between">
                    <span className="font-mono text-4xl font-bold text-crimson-hot/25">
                      {step.n}
                    </span>
                    <span lang="ja" className="font-jp text-lg text-bone/10">
                      {step.jp}
                    </span>
                  </div>

                  <h2 className="mt-5 font-display text-lg font-bold tracking-wide text-bone uppercase">
                    {c.steps[step.key].title}
                  </h2>
                  <p className="mt-3 text-sm text-bone-dim">{c.steps[step.key].body}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Big Discord CTA ── */}
      <section className="relative overflow-hidden border-y border-steel-line py-section">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_60%_at_50%_50%,color-mix(in_oklab,#E11D48_18%,transparent),transparent_72%)]"
        />
        <PatternOverlay pattern="hexgrid" opacity={0.06} />

        <div className="relative mx-auto max-w-3xl px-gutter text-center">
          <Reveal>
            <div className="flex justify-center">
              <ServerLogo size={128} glow alt={t.common.brand.emblemAlt} />
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <h2 className="mt-8 font-display text-3xl leading-display font-bold tracking-display text-bone uppercase italic">
              {c.door.title}
            </h2>
          </Reveal>

          <Reveal delay={0.14}>
            <p className="mx-auto mt-5 max-w-lg text-base text-bone-dim">
              {c.door.body}
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="mt-9">
              <NotchButton href={SITE.discord} external size="lg">
                <SocialIcon name="discord" size={18} />
                {t.common.cta.joinTheDiscord}
              </NotchButton>
            </div>
          </Reveal>

          <Reveal delay={0.26}>
            <p className="mt-6 font-display text-[0.65rem] tracking-[0.22em] text-bone-faint uppercase">
              {t.common.cta.freeLine}
            </p>
          </Reveal>
        </div>

        <Grain opacity={0.12} />
      </section>

      {/* ── Who belongs ── */}
      <section className="relative py-section">
        <KanjiRail text="全員歓迎" side="right" />

        <div className="mx-auto max-w-[110rem] px-gutter">
          <SectionHeading
            eyebrow={{ en: c.belonging.eyebrow, jp: "歓迎" }}
            title={c.belonging.title}
            lead={c.belonging.lead}
          />

          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {BELONGING.map((item, i) => (
              <Reveal key={item.key} delay={i * 0.06}>
                <div className="clip-notch h-full border border-steel-line bg-steel/60 p-6">
                  <p lang="ja" className="font-jp text-xs text-crimson-hot">{item.jp}</p>
                  <h3 className="mt-2 font-display text-base font-bold tracking-wide text-bone uppercase">
                    {c.belonging.items[item.key].title}
                  </h3>
                  <p className="mt-3 text-sm text-bone-dim">{c.belonging.items[item.key].body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── House rules — INK mood ──
       * Written like a dojo code on rice paper: a brush 規則 over the red sun
       * on the left, the rules on the right in ink. */}
      <section className="mood-ink relative overflow-hidden py-section">
        <div className="mx-auto max-w-[110rem] px-gutter">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
            <div>
              <SectionHeading
                tone="ink"
                eyebrow={{ en: c.rules.eyebrow, jp: "規則" }}
                title={c.rules.title}
              />
              <div className="mt-10 flex items-center gap-8">
                <div aria-hidden="true" className="relative grid size-40 shrink-0 place-items-center">
                  <RedSun brush className="absolute inset-0 size-full" />
                  <BrushReveal direction="y" className="relative">
                    <span lang="ja" className="font-brush block text-[3.4rem] leading-none text-ink [writing-mode:vertical-rl]">
                      規則
                    </span>
                  </BrushReveal>
                </div>
                <p className="text-sm text-ink-dim">{c.rules.note}</p>
              </div>
            </div>

            <ol className="space-y-3">
              {c.rules.items.map((rule, i) => (
                <Reveal key={i} delay={i * 0.05}>
                  <li className="flex gap-4 border-b border-ink/15 pb-3">
                    <span className="font-mono text-sm font-bold text-crimson-ink">
                      {num.format(i + 1)}
                    </span>
                    <span className="text-sm text-ink">{rule}</span>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
        <Grain opacity={0.08} />
      </section>

      {/* ── Socials ── */}
      <section className="py-section">
        <div className="mx-auto max-w-[110rem] px-gutter">
          <SectionHeading
            eyebrow={{ en: c.elsewhere.eyebrow, jp: "他" }}
            title={c.elsewhere.title}
            align="center"
          />

          <ul className="mx-auto mt-12 grid max-w-4xl gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {SOCIAL_LINKS.map((s, i) => (
              <Reveal key={s.key} delay={i * 0.05}>
                <li>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="clip-notch group flex h-full flex-col items-center gap-3 border border-steel-line bg-steel/60 p-6 transition-all duration-300 hover:border-crimson/50 hover:bg-steel"
                  >
                    <span className="text-bone-faint transition-colors group-hover:text-crimson-hot">
                      <SocialIcon name={s.key} size={24} />
                    </span>
                    <span className="font-display text-sm font-semibold tracking-wide text-bone uppercase">
                      {s.label}
                    </span>
                    <span className="font-mono text-[0.7rem] text-bone-faint">
                      {s.handle}
                    </span>
                  </a>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}

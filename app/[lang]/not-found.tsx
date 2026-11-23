import { NotchButton } from "@/components/ui/NotchButton";
import { Grain } from "@/components/ui/Texture";
import { RedSun } from "@/components/art/RedSun";
import { Torii } from "@/components/art/Torii";
import { Skyline } from "@/components/art/Skyline";
import { getDictionary } from "@/lib/i18n/dictionaries";

/* 404 — "Lost exile". The hero scene, emptied: the gate is still standing,
 * the sun is down on the horizon, and the way back is one button. */

export default async function NotFound() {
  const t = (await getDictionary()).errors.notFound;

  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden bg-void pt-32 pb-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_70%,color-mix(in_oklab,var(--color-violet)_18%,transparent),transparent_70%)]"
      />
      <div aria-hidden="true" className="pointer-events-none absolute bottom-[12%] left-1/2 w-[min(30rem,80vw)] -translate-x-1/2 opacity-80">
        <RedSun glow brush />
      </div>
      <Skyline
        seed={404}
        height={0.6}
        pagodaEvery={4}
        fill="#1B1628"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[30%] w-full"
      />
      <div aria-hidden="true" className="pointer-events-none absolute bottom-0 left-1/2 h-[45%] -translate-x-1/2 text-[#0E0B16]">
        <Torii neon className="h-full w-auto" />
      </div>

      <div className="relative z-10 mx-auto max-w-2xl px-gutter text-center">
        <p lang="ja" className="font-brush text-[clamp(4rem,12vw,8rem)] leading-none text-bone" style={{ textShadow: "0 0 30px rgb(7 6 11 / 0.9)" }}>
          迷子
        </p>
        <p lang="ja-Latn" className="mt-3 font-mono text-[0.7rem] tracking-[0.12em] text-bone-faint">[maigo] · 404</p>
        <h1 className="mt-6 font-display text-2xl font-bold tracking-display uppercase">
          {t.title}
        </h1>
        <p className="mx-auto mt-4 max-w-md text-base text-bone-dim">{t.body}</p>
        <div className="mt-9 flex flex-wrap justify-center gap-4">
          <NotchButton href="/">{t.home}</NotchButton>
          <NotchButton href="/tournaments" variant="outline">
            {t.tournaments}
          </NotchButton>
        </div>
      </div>

      <Grain opacity={0.12} />
    </section>
  );
}

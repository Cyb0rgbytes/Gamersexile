# Gamer's Exile

Marketing site for the Gamer's Exile gaming and esports community.
"Exile at the Red Sun": a neo-samurai night canvas, one crimson sun as the
signature motif, violet neon for live/interactive lines, and paper-and-ink
poster sections. Japanese is an accent layer that always carries its English.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # all 5 routes prerender static
npm run lint
npm run typecheck
```

## Before launch — required

1. **Replace the placeholder links.** Every Discord and social URL lives in
   [lib/site.ts](lib/site.ts). Set the real ones, then delete the
   `linksArePlaceholder` flag and [components/ui/PlaceholderNotice.tsx](components/ui/PlaceholderNotice.tsx).
   A dev-only notice appears in the corner until you do.
2. **Replace the placeholder content.** Tournaments, creators and the stat
   figures are all invented. See "Content" below. The member counts in
   particular should be real Discord numbers — inflated figures are the fastest
   way to lose a visitor's trust.
3. **Set the real domain** in `SITE.url` (currently `https://gamersexile.gg`).
   It feeds the canonical URLs, OpenGraph tags, sitemap and JSON-LD.

## Stack

Next.js 16 App Router · React 19 · TypeScript · Tailwind v4 (CSS-first) ·
`motion` v13 · GSAP + ScrollTrigger · Lenis · `next/font/google`. No component
library. All artwork is original and code-drawn (SVG / canvas) — see `components/art/`.

## Where things live

| Path | What |
|---|---|
| [app/globals.css](app/globals.css) | The whole design system — colours, type scale, clip-path utilities, animations |
| [lib/site.ts](lib/site.ts) | Site config, nav, Discord + social links |
| [lib/tournaments.ts](lib/tournaments.ts) | Tournament schedule + the bracket data |
| [lib/creators.ts](lib/creators.ts) | Creator roster + what the community offers them |
| [lib/games.ts](lib/games.ts) | The games list |
| [lib/community.ts](lib/community.ts) | Pillars, stats, values, weekly events, FAQ, long-form copy |
| [types/index.ts](types/index.ts) | Shared interfaces every content file satisfies |
| [components/art/](components/art/) | Original code-drawn art: `RedSun`, `Torii`, `Skyline`, `Sakura`, `BrushKanji` |
| [components/motion/](components/motion/) | GSAP scroll helpers: `ParallaxLayer`, `BrushReveal`, `DrawOnScroll` |
| [reference/](reference/) | Competitor mood-boards. Not shipped, git-ignored. |
| `Assets/` | Mood-board / reference art. **Never shipped** — the game character renders are owned by their publishers. |

## Content

All content is static, typed TS constants — no CMS, no database. Edit the file,
the compiler catches missing fields, the page updates.

**Tournament status is derived, not written.** `upcoming` / `live` / `finished`
is computed from `startsAt` (+ optional `durationHours`, default 8) at build
time; anything with a `result` is finished. Rebuild to roll statuses forward.

**`hue` seeds the procedural art.** There is no photography in this project —
the only real image is the logo. Every card's gradient, skyline and monogram
tile is generated from its `hue` (0–360) or slug, so spread them across the wheel.
Each type also carries an optional `imageUrl` / `avatarUrl`, so dropping in
real art later is a data change, not a rewrite.

## Design system notes

Three things in [app/globals.css](app/globals.css) that are load-bearing:

- **Contrast ratios are computed, not estimated**, and written next to each
  colour token. `--color-crimson` is 4.3:1 on void — fills and large display
  type only; small crimson text uses `crimson-hot` (6.3:1), and on paper
  `crimson-ink` (5.4:1).
- **Solid crimson buttons take a WHITE label** (4.7:1; void on crimson fails).
  Enforced in `NotchButton` rather than left to each call site.
- **Two moods.** Add `mood-ink` to a section for paper + brush ink; pass
  `tone="ink"` to `SectionHeading` there. Focus rings switch to ink automatically.
- **`clip-path` crops outlines**, so `:focus-visible` draws an *inset*
  box-shadow ring. Never add `outline` to a clipped element — it will be
  invisible.

Motion is split by job: [components/ui/Reveal.tsx](components/ui/Reveal.tsx) (`motion`) is
the only enter animation; anything LINKED to scroll position (the hero pin,
parallax, the bracket draw) is GSAP ScrollTrigger via [lib/gsap.ts](lib/gsap.ts), fed by
Lenis in `SmoothScroll`. Every GSAP effect sits behind
`gsap.matchMedia("(prefers-reduced-motion: no-preference)")`. And
[lib/usePrefersReducedMotion.ts](lib/usePrefersReducedMotion.ts) exports two
hooks — the live one for style-only branches, the deferred one for anything
that changes DOM *structure* (using the live value there causes hydration
mismatches).

## Verified

Built and checked at 390 / 768 / 1440 / 2560px across all five routes: no
horizontal overflow, no console errors. Under `prefers-reduced-motion` Lenis is
bypassed entirely and no content is stranded mid-reveal. First tab stop is the
skip link; the mobile nav traps focus, locks body scroll and returns focus on
Escape.

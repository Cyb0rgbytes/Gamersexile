# Gamers Exile: Phase 1 summary

**Phase:** Neo-samurai redesign and launch polish
**Status:** Complete. The site runs locally. It isn't deployed yet.
**Date:** 22 November 2026

---

## 1. What this phase delivered

Gamers Exile is a static, five-page Next.js site: Home, Tournaments, Creators, Community and Join. Discord is the only way to join, and there is no backend.

This phase did three things:

- Gave the site a new look based on the mood boards in `Assets/`, called **"Exile at the Red Sun"**.
- Added the polish a site needs before launch.
- Connected the real Discord server, domains, logo and background image.

### Decisions made with the owner

| Topic | Decision |
|---|---|
| Priority | Launch-ready polish |
| Backend | None for now; the site stays static |
| Palette | Crimson and violet, replacing ember orange |
| Imagery | Original art only. The Overwatch, VALORANT and 007 renders in `Assets/` are mood reference and are never put on the site. |
| Motion | GSAP scroll animation, no 3D |

The four Fandom wiki pages (Overwatch, AC Shadows, CS2, VALORANT) block automated reading, so all design direction came from the `Assets/` mood boards.

---

## 2. Design system: "Exile at the Red Sun"

- **Signature element.** A large crimson sun disc anchors the hero. It returns as section markers, card art and kanji posters: one strong motif instead of many effects.
- **Two moods.** Most of the site uses the night mood: void black, crimson and violet neon. The community values and the house rules use the ink mood: off-white paper, black brush strokes and a red sun.
- **Colour roles:**
  - Crimson is for calls to action and the sun.
  - Violet appears only on live and interactive states.
  - Labels on crimson buttons are white.
  - Every text colour was contrast-checked against WCAG AA.
- **Type:**
  - Chakra Petch for display.
  - Inter for body text.
  - JetBrains Mono for data.
  - Yuji Boku for the large brush kanji.
  - Zen Kaku for small Japanese labels.
- **Japanese text:** each kanji is shown with its English meaning and romaji, as on the posters, for example 情熱 / *jōnetsu* / Passion.

### Main colour tokens (`app/globals.css`)

| Token | Value | Use |
|---|---|---|
| `void` | `#07060b` | Page background |
| `steel` / `steel-line` | `#13111b` / `#24202f` | Surfaces, borders |
| `bone` | `#f4f2f7` | Primary text |
| `crimson` / `crimson-hot` | `#e11d48` / `#ff4d6d` | CTA fills / text and hover |
| `violet` / `violet-hot` | `#8b5cf6` / `#a78bfa` | Live states, focus ring |
| `paper` / `ink` | `#f1ede6` / `#0d0c10` | Ink-mood sections |

---

## 3. What changed

### New original art (`components/art/`), all code-drawn
- `RedSun`: crimson sun, with optional brush edge and glow.
- `Torii`: gate outline, with optional violet neon.
- `Skyline`: night-city and pagoda layers. The same seed always draws the same skyline.
- `Sakura`: falling-petal canvas. It pauses when off-screen and is off when the visitor has asked for reduced motion.
- `BrushKanji`: large brush-script kanji with its English label.

### Motion (`components/motion/`, `lib/gsap.ts`)
- **Small entrance animations** use `motion`.
- **Scroll-linked effects** use GSAP ScrollTrigger:
  - `BrushReveal`: a brush-stroke wipe that uncovers headings.
  - `ParallaxLayer`: layers that move at different speeds as you scroll.
  - `DrawOnScroll`: draws the tournament bracket lines as you scroll.
- **Smooth scrolling (Lenis)** is linked to ScrollTrigger so the two stay in step.
- **Hero on desktop:** it stays fixed while you scroll. The sun sinks, the torii rises and the 亡命 kanji is brushed in.
- **Reduced motion:** for visitors who have asked their system for less motion, the site shows a static layout.

### Sections redesigned
- **Hero:** layered scene, from back to front: sky glow, sun, far skyline, neon torii, near skyline, sakura, kanji.
- **Pillars:** brush-kanji cards over red suns.
- **Community values:** ink-mood red-sun kanji posters.
- **Join:** house rules in ink mood, plus a "The Door Is Open" call to action with the animated logo.
- **Tournament cards and the featured tournament:** sun, skyline and torii scenes. Live events get a violet neon edge.
- **Bracket:** the lines draw themselves as you scroll.
- **Header:** crimson underline on the current page, violet underline on hover.

### Brand assets (supplied by the owner)
- **Animated logo:** the 4.8 MB GIF became animated WebP files of 282 KB and 764 KB, cropped to a circle. One component (`components/brand/ServerLogo.tsx`) shows it in the header, the footer and the Join page.
- **Favicon, Apple touch icon and app icons:** generated from `logo.jpg`.
- **Footer background:** the old drawn torii-and-sun band was replaced with the owner's neon shrine image, `public/art/background.jpg` (97 KB), faded into the page.

### Discord and domains
- **Discord invite:** `https://discord.gg/2enCfJbrMR` is used everywhere (12 links).
- **Discord button:** a glowing button sits bottom-right on every page. It pulses and shows a "Join the Discord" label on hover.
- **Main domain:** `gamersexile.net`.
- **Redirects:** `gamersexile.org`, `www.gamersexile.org` and `www.gamersexile.net` all send visitors to it permanently (HTTP 308, set in `next.config.ts`).

### Launch polish
- **New pages and screens:**
  - A 404 page with a "lost exile" torii scene.
  - An error page with a retry button.
  - A loading screen.
- **Metadata:** web app manifest, plus a sitemap whose dates no longer change on every build.
- **Tournament status:** the code now works out upcoming, live or finished from each tournament's start time and length, instead of reading a fixed label that went stale. This fixes a bug.
- **Tooling:** ESLint (Next.js config) and two new scripts, `npm run lint` and `npm run typecheck`.
- **Layout fixes:** the side kanji rail no longer overlaps headings; the hero's glow and torii no longer clip; the mobile torii no longer covers the buttons.

---

## 4. Verification

- `tsc`, `eslint` and `next build` pass with no errors. All 13 routes are pre-rendered as static pages.
- Screenshots were checked at 390, 768, 1440 and 2560 px wide. None of them scroll sideways.
- The reduced-motion version shows all content, with no pinning, parallax or sakura.
- The domain redirects return 308 as expected.
- The logo and background change passed typecheck, lint and visual checks on the dev server.
- **Not yet done:** a full production build after that last change.

---

## 5. Open items for the owner

| Item | Why it matters |
|---|---|
| Real Twitch, YouTube, X and TikTok links | They are placeholders in `lib/site.ts`. A notice shows on the local dev site only until they are filled in. |
| Create the `hello@gamersexile.net` mailbox | The footer and the contact links use it. |
| Point DNS for both domains at the host | Needed before the redirects can take effect. |
| Confirm rights to `Background.jpg` | It looks like a wallpaper or AI-generated image. You need the right to use it on a public site. |
| Update the share-preview image | `app/opengraph-image.tsx` still uses the old drawn emblem instead of the real logo. |
| Fix the graphify hooks in `.claude/settings.json` | They point to another user's path, `C:/Users/Omar/...`. |
| Delete `Assets/Characters/007 First Light/Git-2.56.1-64-bit.exe` | It's a 65 MB installer with nothing to do with the site. |
| Run `git init` and make a first commit | The project isn't under version control yet. A pre-redesign backup exists only in a temporary folder. |

---

## 6. Suggested next phase

1. Rebuild the share-preview image around the real logo and the shrine background.
2. Fill in the social links and remove the placeholder notice.
3. Deploy (for example to Vercel), connect both domains and confirm the redirects on the live site.
4. Optional: move tournament and creator data into a CMS or JSON feed, so events can be updated without code changes.

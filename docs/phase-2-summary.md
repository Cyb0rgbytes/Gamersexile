# Gamers Exile: Phase 2 summary

**Phase:** Community platform
**Status:** Built and verified locally. The site is not deployed yet, and the signed-in features are waiting for the Clerk keys.
**Date:** 23 November 2026
**Previous phase:** [phase-1-summary.md](phase-1-summary.md)

---

## 1. What this phase delivered

Phase 1 left a static showcase site. This phase turns it into a community platform:

| Feature | Route | Status |
|---|---|---|
| 8-language site with a language switcher | every page, under `/en`, `/ar`, `/de`, `/ru`, `/zh-CN`, `/es`, `/fr`, `/ja` | Done |
| Sign-in and accounts (Clerk: Discord, Google, email) | `/sign-in`, `/sign-up`, `/account` | Built; needs keys |
| Teams: create, browse, join, captains, roles, invites | `/teams` | Built; needs keys |
| Clips and highlights with Respect and other reactions | `/clips` | Built; needs keys |
| Admin clip moderation | `/admin/clips` | Built; needs keys |
| MEE6 leaderboard | `/leaderboard` | Built; needs Server ID |
| Giveaway winners, built for search engines | `/winners` | Built; needs data |
| New hero background (Sakura shrine) | home page | Done |

### Content cleanup (start of the phase)
- **Sample data removed:** all the made-up tournaments, the bracket, creators, weekly events and inflated stats. Each section now shows a "Coming Soon" state until real content is added.
- **Hero stats:** now **687** Members, **Soon** Tournaments and **5+** Creators.
- **Hero background:** replaced with the new Sakura shrine artwork at its full 1672 px width. The earlier 358 px version looked choppy.

---

## 2. Decisions made with the owner

| Topic | Decision |
|---|---|
| Delivering the code | Push to a new `redesign` branch on GitHub and open a pull request. `main` and the live Worker stay untouched until you merge. |
| Clip moderation | Clips go live instantly. Three reports hide a clip automatically, and admins can restore or delete it. |
| Sign-in methods | Discord, Google and email |
| Translation | Everything, in all 8 languages, with Arabic right-to-left |
| Clerk app | The existing dashboard app, `app_3MW1woMFdnjjcjSxdfmyU5JluC9` |

---

## 3. How it's built

### Platform
- **Next.js 16.4.6:** upgraded from 16.3.0, because the Cloudflare adapter needs at least 16.4.5.
- **Cloudflare Workers** through `@opennextjs/cloudflare`. Configuration is in `wrangler.jsonc` and `open-next.config.ts`.
  - **D1 database (`DB`):** profiles, teams, team members and invites, clips, reactions and reports. The schema is in `lib/db/schema.ts`; migrations are in `migrations/`.
  - **R2 bucket (`CLIPS`):** the uploaded videos and their thumbnails.
  - **R2 bucket for the page cache:** lets pages such as the leaderboard refresh every 10 minutes.
- **Drizzle ORM** for type-safe database access. `lib/db/index.ts` provides `getDb()` and `getClipsBucket()`.
- **Clerk** for authentication.
  - `proxy.ts` handles the session; it's Next 16's name for middleware.
  - Helpers in `lib/auth/index.ts`: `requireUserId`, `isAdmin`, `syncProfile` and `setDiscordUsername`.
  - Without keys, sign-in switches off and every page still renders, through `lib/auth/enabled.ts`.

### Languages
- **Routing:** every page lives under `app/[lang]/`. A visitor without a language prefix in the URL is redirected by `proxy.ts`, in this order:
  1. their saved choice from the switcher (a cookie),
  2. their browser's language,
  3. English.
- **Translation files:** `dictionaries/<lang>/<area>.json`, 13 areas per language: common, home, tournaments, creators, community, join, errors, auth, teams, clips, leaderboard, winners and admin.
- **English is the source.** Any text that's missing in another language shows in English instead of breaking the page.
- **Arabic:** `dir="rtl"` mirrors the layout, and letter-spacing and italics are turned off because they break Arabic letter-joining.
- **Fonts:** fallback fonts for Arabic (IBM Plex Sans Arabic), Chinese (Noto Sans SC) and Cyrillic (Russo One). A browser only downloads them when it shows that script.
- **SEO:**
  - every page has a translated title and description;
  - hreflang links point between the 8 versions of each page;
  - the sitemap lists every page in every language.
- **Checker:** `npm run i18n:check` compares each language with English and reports missing text and broken placeholders such as `{name}`.

### Teams
- **One team per game per person.** The database enforces this.
- **Only the captain** can edit the team, remove members, hand over captaincy, disband the team, and create, copy or revoke invite links.
  - The server re-checks the captain on every action (`lib/teams/guard.ts`), so hiding a button is never the only protection.
- **Invite links:** expire after 1, 7 or 30 days; allow 1, 5, 10 or 25 uses; and can be revoked.
  - Joining is a single database transaction, so a link can never go over its use limit.
- **Game roles:** each game has its own list (for example Duelist, Controller and IGL for Valorant), in `lib/games.ts`.
- **Discord usernames:** required before joining a team, and shown only to that team's members.

### Clips
- **Uploads:**
  - 45 MB maximum, in mp4, webm or mov.
  - The limit is checked in the browser, then on the server, which counts the actual bytes received in 8 MiB chunks and rejects anything over.
  - The server also checks the first bytes of the file to confirm it really is a video.
  - Each person can upload 10 clips per day.
- **Reactions:**
  - **Respect** (a crimson seal with 礼), **GG**, **Hype**, **Clutch** and **LOL**.
  - Each person can leave one reaction per clip and change it.
  - Counts are recalculated from the stored reactions every time, so they can't drift.
- **Gallery and clip pages:** sort by Newest or Top this week, with a game filter. Each clip page previews properly when its link is shared in Discord, and videos support seeking.

### Leaderboard and winners
- **Leaderboard:** reads MEE6's public data for the server every 10 minutes, then shows a top-3 podium and a ranked table with level progress bars.
  - If MEE6 is unavailable, or the Server ID isn't set, it shows a link to the MEE6 page instead.
- **Winners:** a timeline grouped by month, a stats strip, and an FAQ.
  - Structured data (`FAQPage` and `ItemList`) helps search engines show it in results.
  - It shows "Coming soon" until winners are added to `lib/giveaways.ts`.

---

## 4. Verification

- **Code checks:** `tsc` and `eslint` are clean, and `next build` passes with every page pre-rendered in all 8 languages.
- **Translations:** `npm run i18n:check` reports nothing missing and no placeholder errors in any language.
- **Routes:** 200 for real pages, 404 for unknown teams, clips and pages, 404 on the admin page for non-admins, and 401 from the upload API when signed out.
- **Screenshots:** checked at 390 and 1440 px, in left-to-right and right-to-left. No page scrolls sideways.
- **Tested with test data in the local database and storage** (then removed):
  - team pages and invite links that are valid, expired or used up;
  - the clip gallery and clip pages, video seeking, and hidden clips;
  - the leaderboard and winners layouts.
- **Not yet tested:** signing in, creating a team, joining by invite, uploading, and reacting. These need the Clerk keys.

---

## 5. Open items for the owner

| # | Item | Why |
|---|---|---|
| 1 | Run `npx -y clerk@latest auth login`, then say "yes" | I can then link app `app_3MW1woMFdnjjcjSxdfmyU5JluC9`, pull the development keys and test sign-in. |
| 2 | In the Clerk dashboard, turn on **Discord, Google and email** | These are the chosen sign-in methods. |
| 3 | Send the Discord **Server ID** | MEE6 needs the number; it rejects the name "gamersexile". Also check the leaderboard is set to public in MEE6. |
| 4 | Run `npx wrangler login`, and tell me the **Worker's name** | Needed to create the D1 database and both R2 buckets, and to deploy. The config assumes `gamersexile`. |
| 5 | Add an R2 rule to the clips bucket that removes unfinished uploads after 1 day | Otherwise abandoned uploads leave files behind. |
| 6 | Send the giveaway winners as CSV, one row per giveaway, with columns `id, date, prize, winner_names, winner_discord_ids, winner_avatar_hashes, sponsor, announcement_url, value_usd` | Separate multiple winners with `\|`. Only include winners who agreed to be listed. |
| 7 | Mark moderators in Clerk with public metadata `{ "role": "admin" }` | Gives them access to `/admin/clips`. |
| 8 | Have native speakers review the translations, especially game role names and slang | They were machine-written with care, and each translator listed the strings it was unsure about. |
| 9 | Allow git on the M: drive, then push the `redesign` branch | Git reports "dubious ownership" on this folder; fixing that changes your global git settings, so it needs your OK. The project also has no commits yet. |
| 10 | Carried over from phase 1: real social links, the `hello@gamersexile.net` mailbox, DNS for both domains, and the rights to the background images | — |

### New commands
| Command | What it does |
|---|---|
| `npm run dev` | Local development, with local D1 and R2 |
| `npm run preview` | Builds for Cloudflare and runs it in a local Worker |
| `npm run deploy` | Builds and deploys to Cloudflare |
| `npm run db:generate` | Creates a migration after a schema change |
| `npm run db:migrate:local` / `npm run db:migrate:remote` | Applies migrations to the local or live database |
| `npm run i18n:check` | Checks the translations |
| `npm run cf-typegen` | Regenerates the Cloudflare binding types |

---

## 6. Suggested next phase

1. Connect Clerk, then test the signed-in flows end to end: create a team, invite, join, upload a clip, react, report.
2. Create the Cloudflare resources and run `npm run preview` to check everything works on the Worker, especially Safari video seeking.
3. Commit, push the `redesign` branch, open the pull request and deploy.
4. Load the real winners and the Server ID, then announce the site in the Discord.

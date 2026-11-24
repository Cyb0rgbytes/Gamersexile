# Graph Report - Gamers Exile Website  (2026-11-25)

## Corpus Check
- 268 files · ~170,927 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 5 file(s) not represented in the graph (top: (none) 2, .example 1, .css 1)

## Summary
- 2951 nodes · 5342 edges · 204 communities (45 shown, 159 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 18 edges (avg confidence: 0.88)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `f4e11b93`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- cloudflare-env.d.ts
- teams/actions.ts
- tournaments/page.tsx
- ServiceWorkerGlobalScope
- Event
- types/index.ts
- constants.ts
- legal/index.ts
- drizzle-kit
- Gamer's Exile
- fill
- HeaderBar.tsx
- community/page.tsx
- mee6.ts
- 3. What changed
- server.ts
- overrides
- getDictionary
- package.json
- clips/actions.ts
- fill
- clips/queries.ts
- Console
- TransformStream
- URL
- dependencies
- compilerOptions
- client.ts
- ArtifactsRepo
- URLSearchParams
- BrowserRun
- Container
- DurableObjectStorage
- ja/index.ts
- Element
- Headers
- SubtleCrypto
- models
- ar/index.ts
- de/index.ts
- en/index.ts
- es/index.ts
- fr/index.ts
- ru/index.ts
- zh-CN/index.ts
- [token]/page.tsx
- Blob
- Body
- FormData
- URLPattern
- schema.ts
- scripts
- error.tsx
- DurableObjectState
- Flagship
- 0000_init.sql
- StreamError
- WorkerEntrypoint
- Span
- R2ObjectBody
- AgentMemoryProfile
- ByteLengthQueuingStrategy
- WritableStream
- DurableObjectTransaction
- ReadableStream
- Socket
- WorkflowInstance
- WritableStreamDefaultWriter
- check-i18n.mjs
- Ai
- AiSearchInstance
- DurableObject
- DurableObject
- DurableObjectNamespace
- R2Bucket
- SqlStorageCursor
- Vectorize
- AiSearchNamespace
- ReadableStreamBYOBReader
- VectorizeIndex
- dictionaries.ts
- AiSearchItem
- AiSearchItems
- Artifacts
- D1Database
- D1PreparedStatement
- ImageHandle
- KVNamespace
- ReadableByteStreamController
- ReadableStreamDefaultReader
- TextDecoder
- tracing
- eslint.config.mjs
- AiGateway
- Comment
- DurableObjectFacets
- ForwardableEmailMessage
- ExecutionContext
- HostedImagesBinding
- HTMLRewriter
- HTMLRewriterDocumentContentHandlers
- ReadableStreamBYOBRequest
- ReadableStreamDefaultController
- StreamScopedCaptions
- StreamVideoHandle
- StreamWatermarks
- SyncKvStorage
- Text
- TextEncoder
- TransformStreamDefaultController
- Table
- Workflow
- allowScripts
- AbortController
- AiSearchJob
- AiSearchJobs
- AutoRAG
- cache
- Crypto
- D1DatabaseSession
- EndTag
- ExecProcess
- HTMLRewriterElementContentHandlers
- ImagesBinding
- ImageTransformationResult
- ImageTransformer
- MediaTransformationResult
- Performance
- Queue
- R2MultipartUpload
- StreamBinding
- StreamScopedDownloads
- Module
- WebSocketRequestResponsePair
- BrushKanji.tsx
- next.config.ts
- AgentMemoryNamespace
- __BaseEnv_CloudflareEnv
- BasicImageTransformations
- CacheContext
- NodeStyleServer
- PipelineTransformationEntrypoint
- WorkflowEntrypoint
- WorkflowStep
- ColoLocalActorNamespace
- DOMException
- DurableObjectId
- HelloWorldBinding
- HyperdriveDynamicApi
- MediaTransformer
- Message
- MessageBatch
- RequestInitCfPropertiesVaryHeader
- SqlStorage
- ToMarkdownService
- Global
- Memory
- WorkerLoader
- WorkerStub
- WritableStreamDefaultController
- AGENTS.md
- CLAUDE.md
- AnalyticsEngineDataset
- AnalyticsSQLBinding
- CacheStorage
- Pipeline
- NonRetryableError
- CloudflareAccessContext
- DispatchNamespace
- DocumentEnd
- EventListenerObject
- Hyperdrive
- IncomingRequestCfPropertiesBotManagement
- JsonWebKey
- MediaBinding
- MediaTransformationGenerator
- MessageChannel
- Navigator
- R2Checksums
- RateLimit
- ResponseFunctionToolCall
- StubBase
- ScheduledController
- Scheduler
- SecretsStoreSecret
- SendEmail
- StreamVideos
- TraceItemFetchEventInfoRequest
- UnsafeTraceMetrics
- CompileError
- Instance
- RuntimeError
- WebSearch
- copilot-instructions.md
- postcss.config.mjs
- Base_Ai_Cf_Google_Gemma_4_26B_A4B_It
- __DURABLE_OBJECT_BRAND
- onRequest
- __RPC_STUB_BRAND
- __RPC_TARGET_BRAND
- __WORKER_ENTRYPOINT_BRAND
- __WORKFLOW_ENTRYPOINT_BRAND
- ReportButton.tsx
- media.ts

## God Nodes (most connected - your core abstractions)
1. `getDictionary()` - 86 edges
2. `getLocale()` - 60 edges
3. `fill()` - 50 edges
4. `localePath()` - 50 edges
5. `next` - 48 edges
6. `getDb()` - 45 edges
7. `react` - 39 edges
8. `NotchButton()` - 34 edges
9. `Reveal()` - 30 edges
10. `languageAlternates()` - 28 edges

## Surprising Connections (you probably didn't know these)
- `Platform` --references--> `requireUserId()`  [INFERRED]
  docs/phase-2-summary.md → lib/auth/index.ts
- `Platform` --references--> `getClipsBucket()`  [INFERRED]
  docs/phase-2-summary.md → lib/db/index.ts
- `Platform` --references--> `isAdmin()`  [INFERRED]
  docs/phase-2-summary.md → lib/auth/index.ts
- `Platform` --references--> `setDiscordUsername()`  [INFERRED]
  docs/phase-2-summary.md → lib/auth/index.ts
- `Platform` --references--> `syncProfile()`  [INFERRED]
  docs/phase-2-summary.md → lib/auth/index.ts

## Import Cycles
- None detected.

## Communities (204 total, 159 thin omitted)

### Community 0 - "cloudflare-env.d.ts"
Cohesion: 0.00
Nodes (966): AgentMemoryGetSummaryOptions, AgentMemoryGetSummaryResponse, AgentMemoryIncomingMemory, AgentMemoryIngestOptions, AgentMemoryListMemoriesOptions, AgentMemoryListMemoriesResult, AgentMemoryMemory, AgentMemoryMemoryListEntry (+958 more)

### Community 1 - "teams/actions.ts"
Cohesion: 0.06
Nodes (97): DiscordForm(), Block(), CaptainPanel(), CaptainPanelProps, invitePath(), ConfirmAction(), Props, CopyButton() (+89 more)

### Community 2 - "tournaments/page.tsx"
Cohesion: 0.14
Nodes (21): NotFound(), RedSun(), RedSunProps, pagoda(), rng(), Skyline(), SkylineProps, GATE (+13 more)

### Community 3 - "ServiceWorkerGlobalScope"
Cohesion: 0.04
Nodes (7): AbortSignal, EventSource, EventTarget, MessagePort, ServiceWorkerGlobalScope, WebSocket, WorkerGlobalScope

### Community 4 - "Event"
Cohesion: 0.04
Nodes (12): CloseEvent, CustomEvent, EmailEvent, ErrorEvent, Event, ExtendableEvent, FetchEvent, MessageEvent (+4 more)

### Community 5 - "types/index.ts"
Cohesion: 0.13
Nodes (18): FEATURED_TOURNAMENT, FINISHED_TOURNAMENTS, getTournamentStatus(), LIVE_TOURNAMENTS, TOURNAMENT_SEEDS, TOURNAMENTS, UPCOMING_TOURNAMENTS, BracketMatch (+10 more)

### Community 6 - "constants.ts"
Cohesion: 0.09
Nodes (36): POST(), isCode(), Labels, makePoster(), once(), Picked, Poster, send() (+28 more)

### Community 7 - "legal/index.ts"
Cohesion: 0.15
Nodes (22): generateMetadata(), PrivacyPage(), generateMetadata(), TermsPage(), Block(), LegalDocument(), LegalDocumentProps, linkify() (+14 more)

### Community 9 - "Gamer's Exile"
Cohesion: 0.29
Nodes (7): Before launch — required, Content, Design system notes, Gamer's Exile, Stack, Verified, Where things live

### Community 10 - "fill"
Cohesion: 0.19
Nodes (19): ClipPage(), generateMetadata(), loadVisible, Params, Avatar(), AvatarProps, hueOf(), DeleteClipButton() (+11 more)

### Community 11 - "HeaderBar.tsx"
Cohesion: 0.08
Nodes (38): Petal, SakuraProps, GlitchText(), GlitchTextProps, LanguageSwitcher(), choose(), rememberLocale(), BAR (+30 more)

### Community 12 - "community/page.tsx"
Cohesion: 0.09
Nodes (32): CommunityPage(), JoinPage(), HomePage(), Sakura(), ServerLogo(), ServerLogoProps, PageHeader(), PageHeaderProps (+24 more)

### Community 13 - "mee6.ts"
Cohesion: 0.13
Nodes (21): LeaderboardTable(), LeaderboardTableLabels, Props, hueOf(), MemberAvatar(), MemberAvatarProps, PLACE_STYLE, PodiumProps (+13 more)

### Community 14 - "3. What changed"
Cohesion: 0.07
Nodes (28): 1. What this phase delivered, 2. Design system: "Exile at the Red Sun", 3. What changed, 4. Verification, 5. Open items for the owner, 6. Suggested next phase, Brand assets (supplied by the owner), Decisions made with the owner (+20 more)

### Community 15 - "server.ts"
Cohesion: 0.21
Nodes (28): POST(), PUT(), DELETE(), PUT(), requireUserId(), CLIP_ID_RE, isThumbMime(), ThumbMime (+20 more)

### Community 16 - "overrides"
Cohesion: 0.67
Nodes (3): cookie, overrides, @opennextjs/aws

### Community 17 - "getDictionary"
Cohesion: 0.11
Nodes (42): generateMetadata(), AdminClipsPage(), generateMetadata(), generateMetadata(), NewClipPage(), ClipsPage(), generateMetadata(), one() (+34 more)

### Community 18 - "package.json"
Cohesion: 0.13
Nodes (20): devDependencies, tailwindcss@^4, @tailwindcss/postcss@^4, @types/negotiator@^0.6.5, @types/node@^20, @types/react@^19, @types/react-dom@^19, typescript@^5 (+12 more)

### Community 19 - "clips/actions.ts"
Cohesion: 0.23
Nodes (18): apply(), ReactionBar(), react(), deleteClip(), fail(), moderateClip(), publishedClip(), reactionCount (+10 more)

### Community 20 - "fill"
Cohesion: 0.12
Nodes (42): CreatorsPage(), LeaderboardPage(), revalidate, COMING_SOON_SLOTS, TournamentsPage(), HankoSeal(), HankoSealProps, KanjiRail() (+34 more)

### Community 21 - "clips/queries.ts"
Cohesion: 0.22
Nodes (13): ClipCardProps, countsOf(), PAGE_SIZE, ReactionCounts, ClipSummary, getClip(), listClips(), ModerationItem (+5 more)

### Community 23 - "TransformStream"
Cohesion: 0.10
Nodes (7): CompressionStream, DecompressionStream, FixedLengthStream, IdentityTransformStream, TextDecoderStream, TextEncoderStream, TransformStream

### Community 25 - "dependencies"
Cohesion: 0.10
Nodes (20): dependencies, @clerk/nextjs@^7.10.7, drizzle-orm@^0.45.4, @formatjs/intl-localematcher@^0.10.2, gsap@^3.13.0, @gsap/react@^2.1.2, lenis@^1.3.26, negotiator@^1.1.0 (+12 more)

### Community 26 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 27 - "client.ts"
Cohesion: 0.19
Nodes (13): alt, contentType, OG_SCRIPT_OK, OpengraphImage(), size, useLocale(), useLocalePath(), DEFAULT_LOCALE (+5 more)

### Community 28 - "ArtifactsRepo"
Cohesion: 0.12
Nodes (4): ArtifactsRepo, Disposable, HyperdriveDynamic, WorkflowInstanceSubscription

### Community 37 - "models"
Cohesion: 0.14
Nodes (13): mcpServers, uses, models, apiKey, model, name, provider, uses (+5 more)

### Community 45 - "[token]/page.tsx"
Cohesion: 0.16
Nodes (34): AccountPage(), InvitePage(), NewTeamPage(), one(), queryString(), readFilters(), TeamsPage(), generateMetadata() (+26 more)

### Community 47 - "Body"
Cohesion: 0.15
Nodes (3): Body, Request, Response

### Community 50 - "schema.ts"
Cohesion: 0.15
Nodes (12): CLIP_STATUSES, clipReactions, clipReports, clips, now, profiles, ReactionKind, REACTIONS (+4 more)

### Community 51 - "scripts"
Cohesion: 0.15
Nodes (13): scripts, build, cf-typegen, db:generate, db:migrate:local, db:migrate:remote, deploy, dev (+5 more)

### Community 52 - "error.tsx"
Cohesion: 0.22
Nodes (4): copyFor(), Error(), ErrorCopy, ERRORS

### Community 55 - "0000_init.sql"
Cohesion: 0.23
Nodes (15): `clip_reactions`, `clip_reports`, `clips`, clips_game_idx, clips_status_created_idx, clips_user_idx, `profiles`, `team_invites` (+7 more)

### Community 56 - "StreamError"
Cohesion: 0.18
Nodes (11): AlreadyUploadedError, BadRequestError, ForbiddenError, InternalError, InvalidURLError, MaxFileSizeError, NotFoundError, QuotaReachedError (+3 more)

### Community 61 - "ByteLengthQueuingStrategy"
Cohesion: 0.22
Nodes (3): ByteLengthQueuingStrategy, CountQueuingStrategy, QueuingStrategy

### Community 68 - "check-i18n.mjs"
Cohesion: 0.15
Nodes (8): flat(), locales, namespaces, only, envFile, hits, lines, removed

### Community 81 - "dictionaries.ts"
Cohesion: 0.07
Nodes (37): AuthProvider(), chakra, fontVars, inter, jetbrains, notoSc, plexArabic, RootLayout() (+29 more)

### Community 93 - "eslint.config.mjs"
Cohesion: 0.33
Nodes (5): eslintConfig, eslint@^9.39.5, eslint-config-next@^16.4.6, eslint, eslint-config-next

### Community 113 - "allowScripts"
Cohesion: 0.40
Nodes (5): allowScripts, esbuild@0.18.20, esbuild@0.25.12, esbuild@0.28.2, workerd@1.20261119.1

### Community 136 - "next.config.ts"
Cohesion: 0.40
Nodes (3): ALT_HOSTS, nextConfig, SECURITY_HEADERS

### Community 138 - "__BaseEnv_CloudflareEnv"
Cohesion: 0.67
Nodes (3): __BaseEnv_CloudflareEnv, CloudflareEnv, env

### Community 139 - "BasicImageTransformations"
Cohesion: 0.67
Nodes (3): BasicImageTransformations, RequestInitCfPropertiesImage, RequestInitCfPropertiesImageDraw

### Community 153 - "RequestInitCfPropertiesVaryHeader"
Cohesion: 0.67
Nodes (3): RequestInitCfPropertiesVaryAcceptHeader, RequestInitCfPropertiesVaryAcceptLanguageHeader, RequestInitCfPropertiesVaryHeader

### Community 204 - "ReportButton.tsx"
Cohesion: 0.15
Nodes (16): Action, ModerationActionsProps, ReactionBarProps, FlagIcon(), ReportButton(), ReportButtonProps, UploadFormProps, ReactionIcon() (+8 more)

### Community 205 - "media.ts"
Cohesion: 0.16
Nodes (16): Ctx, GET(), HEAD(), Ctx, GET(), HEAD(), AuthError, isAdmin() (+8 more)

## Knowledge Gaps
- **11 isolated node(s):** `RFC-2253`, `RFC-3339`, `RFC-5246`, `RFC-9440`, `env` (+6 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 2028 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **159 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `SqlStorageCursor` connect `SqlStorageCursor` to `cloudflare-env.d.ts`?**
  _High betweenness centrality (0.014) - this node is a cross-community bridge._
- **What connects `RFC-2253`, `RFC-3339`, `RFC-5246` to the rest of the system?**
  _11 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `cloudflare-env.d.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.002061855670103093 - nodes in this community are weakly interconnected._
- **Why does `next` connect `getDictionary` to `teams/actions.ts`, `constants.ts`, `legal/index.ts`, `next.config.ts`, `fill`, `HeaderBar.tsx`, `community/page.tsx`, `[token]/page.tsx`, `ReportButton.tsx`, `server.ts`, `dictionaries.ts`, `package.json`, `clips/actions.ts`, `fill`, `dependencies`, `client.ts`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **Should `teams/actions.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06224256292906179 - nodes in this community are weakly interconnected._
- **Why does `Container` connect `Container` to `cloudflare-env.d.ts`?**
  _High betweenness centrality (0.009) - this node is a cross-community bridge._
- **Should `tournaments/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.13548387096774195 - nodes in this community are weakly interconnected._
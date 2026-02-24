

# Living in Truth — Final Implementation Plan

## Overview
A premium multi-workspace content + video + LMS platform. Each workspace (Global, Kids, Youth, Singles, Couples, Handmades, Servants, and unlimited more) is a self-contained site with its own content, categories, homepage layout, and analytics. Auth and user accounts are global. Subscriptions are **flexible**: a global plan unlocks premium everywhere, a workspace plan unlocks premium only in that workspace. Users can hold multiple subscriptions.

**Phase 0 limitation**: All data is in localStorage (single browser/device). Admin updates only reflect for that browser. Other users won't see updates until Phase 1 API.

---

## Step 1: Foundation — Theme, Fonts, Layout Shells & Logo

- **Fonts**: Plus Jakarta Sans (body, 400–500) + Space Grotesk (headings, 600–700) via Google Fonts
- **Theme tokens** as CSS variables mapped to Tailwind:
  - Light: bg `#FAFAFA`, surface `#FFFFFF`, surface2 `#F5F7FA`, text `#0B1220`, muted `#5B6475`, border `#E6EAF0`, accent `#0EA5A4`
  - Dark: bg `#0B0F17`, surface `#0F1623`, surface2 `#121B2B`, text `#EAF0FF`, muted `#A6B0C3`, border `#233047`, accent `#2DD4BF`
- **Workspace theme overrides**: each workspace can optionally override accent color and logo URL, applied at runtime when workspace is active
- **Premium styling**: 16px card radius, 12px input radius, generous spacing, subtle borders, soft shadows (light only), no pure black/white
- **Logo**: Stylized "LiT" monogram + "Living in Truth" text mark (default; workspace can override)
- **Public shell**: Header (workspace logo, nav, language switch filtered to workspace's `enabledLanguages` — hidden if workspace has `hideLanguageSwitcher: true`, theme toggle, auth), Footer
- **Admin shell**: collapsible sidebar + workspace switcher dropdown in admin header
- Theme toggle and language preference persisted via Zustand

## Step 2: Workspace Entity & Multi-Site Architecture

### Workspace entity fields:
- `id` (stable UUID), `name`, `slug` (unique enforced), `status` (active | disabled)
- `enabledLanguages[]`, `defaultLanguage`
- `hideLanguageSwitcher` (boolean, optional)
- `themeOverride` (optional: accent color, logo URL)
- `createdAt`, `updatedAt`

### Workspace rules:
- Cannot delete workspace if it has content — only disable
- **When workspace is disabled**: public routes show "site unavailable" page and content is not discoverable. Admin can still access disabled workspace for recovery.
- No hardcoded limit on number of workspaces

### Public routing: `/w/:workspaceSlug/...`
- Examples: `/w/global/`, `/w/kids/explore`, `/w/youth/watch/:videoSlug`
- If user visits `/` without slug: show Workspace Selector page listing active workspaces
- **Single-workspace shortcut**: if only one active workspace exists, `/` automatically redirects to that workspace's home page
- Workspace slug resolved at route level → `WorkspaceContext` provided to all child pages

### Admin routing: `/admin/...`
- Workspace switcher dropdown in admin header, role-filtered
- Selected workspace stored in user preferences (Zustand)
- All admin screens operate on the selected workspace
- Super_admin sees all workspaces; admin/editor only see assigned workspaces

### Admin Workspace CRUD (requires `manage_workspaces`):
- List, create (name, slug, enabledLanguages, defaultLanguage, hideLanguageSwitcher, optional logo + accent override), update, disable

## Step 3: LocalDB Engine, Seed Data & Config

- **`storage.ts`**: atomic get/set for `TRUTH_APP_DB` with `TRUTH_APP_DB_VERSION`, safe JSON parse, update timestamps
- **`init.ts`**: seed on first load or version mismatch
- **`migrate.ts`**: scaffold for future schema migrations
- **Single seed file** (`seed_db_v1.ts`) exports `SEED_DB_V1` containing:
  - **7 workspaces**: Global, Kids, Youth, Singles, Couples, Handmades, Servants
  - **Roles & 12 permissions**: super_admin, admin, editor, user → `view_admin`, `manage_workspaces`, `manage_users`, `manage_categories`, `manage_content`, `manage_videos`, `manage_courses`, `manage_home_layout`, `manage_plans`, `manage_subscriptions`, `view_analytics`, `manage_settings`
  - **4 default users**: super_admin assigned to all workspaces; admin to all; editor to a few; normal user
  - **Minimal sample content per workspace** — a few categories, articles, YouTube videos (some shorts), courses with modules/lessons
  - **Separate HomeSections per workspace** — each has its own hero slider and rails
  - **Plans**: All Access (scope=global), Kids Premium (scope=workspace/kids), Youth Premium (scope=workspace/youth)
  - **Content translations**: English only in seed; no placeholder stubs. Fallback to EN at runtime
- **All IDs**: stable UUID-like strings, never array indexes
- **All images**: URLs only (no base64)
- **Data mode config**: `local` | `api` switch for Phase 1 swap
- **Analytics cap**: 20K events max, oldest-first rotation, admin export available

### Slug indexes — single source of truth for slug lookups and uniqueness:
- `content.slugIndex[workspaceId][slug] = contentId`
- `video.slugIndex[workspaceId][slug] = videoId`
- `course.slugIndex[workspaceId][slug] = courseId`
- `category.slugIndex[workspaceId][slug] = categoryId`
- **No separate `bySlug` index** — `slugIndex` is the only slug lookup mechanism

### DB shape:
- `byId` indexes per entity type (primary lookup)
- `slugIndex` per entity type (workspace-scoped slug → id mapping)
- Workspace-keyed order arrays (`categoryOrderByWorkspaceId`, `itemOrderByWorkspaceId`, `homeSectionOrderByWorkspaceId`)
- `subscriptionIdsByUserId` for efficient lookups

## Step 4: Entity Lifecycle Fields

### ContentItem (article/blog):
- `id`, `type` (article | blog), `slug`, `workspaceId`
- `status`: draft | published | archived
- `publishedAt` (nullable), `createdAt`, `updatedAt`
- `createdByUserId`, `updatedByUserId`
- `categoryIds`, `access` (free | premium), `coverImageUrl`, `authorName`
- `translations: { [lang]: { title, excerpt, bodyHtml, seoTitle, seoDescription } }`

### VideoItem:
- `id`, `slug`, `workspaceId`
- `status`: draft | published | archived
- `publishedAt` (nullable), `createdAt`, `updatedAt`
- `createdByUserId`, `updatedByUserId`
- `categoryIds`, `access` (free | premium), `format` (short | long)
- `source: { provider: youtube | mp4 | hls, url, youtubeId? }`
- `translations: { [lang]: { title, description } }`
- `coverImageUrl`, `durationSeconds` (optional)

### Course:
- `id`, `slug`, `workspaceId`
- `status`: draft | published | archived
- `publishedAt` (nullable), `createdAt`, `updatedAt`
- `createdByUserId`, `updatedByUserId`
- `categoryIds`, `access` (free | premium), `moduleIds`
- `translations: { [lang]: { title, description } }`

### Module:
- `id`, `courseId`, `workspaceId`, `sortOrder`
- `translations: { [lang]: { title } }`
- `lessonIds`
- **No separate status field** — inherits Course publish status

### Lesson:
- `id`, `courseId`, `moduleId`, `workspaceId`, `sortOrder`
- `type`: video | text | mixed
- `videoId` (optional), `contentId` (optional)
- `translations: { [lang]: { title, summary } }`
- `createdAt`, `updatedAt`
- **No separate status field** — inherits Course publish status

### Category:
- `id`, `slug`, `workspaceId`, `parentId` (nullable), `sortOrder`
- `translations: { [lang]: { title, description } }`
- `createdAt`, `updatedAt`

### Content access — kept simple:
- `access`: `free` | `premium` only
- No `planId` gating at item level in Phase 0

## Step 5: RBAC — Per-Workspace Permissions

- **UserWorkspaceRole** mapping: `{ userId, workspaceId, roleId, status }`
- **12 permission strings**:
  - `view_admin`, `manage_workspaces`, `manage_users`
  - `manage_categories`, `manage_content`, `manage_videos`, `manage_courses`, `manage_home_layout`
  - `manage_plans` (create/edit/archive plans)
  - `manage_subscriptions` (assign/cancel user subscriptions — separated from manage_plans)
  - `view_analytics`, `manage_settings`
- **`rbac.ts`**: `hasPermission(userId, workspaceId, permission)` — resolves user's role in that workspace → role's permissions
- **Super_admin**: global bypass across all workspaces
- **No role-name string checks in UI** — always permission-based

## Step 6: Auth (Mock) & Session Management

- Mock Google login + mock email OTP flow — simulates success
- Session stored in LocalDB + Zustand for quick access
- Admin "Login as user" for testing different roles across workspaces
- Admin "Create member": create user, assign workspace roles, set status

## Step 7: Flexible Subscription Model & Access Control

### Plan entity:
- `id`, `name`, `scope` (global | workspace), `workspaceId` (nullable — required when scope=workspace)
- `price`, `interval` (monthly/yearly), `currency`
- `features: { premiumAccess: true }`, `status` (active | archived)
- `createdAt`, `updatedAt`

### UserSubscription entity:
- `id`, `userId`, `planId`, `status` (active | canceled | expired)
- `startAt`, `endAt`, `provider` (local in Phase 0), `providerRef` placeholder

### Access check — `canAccessItem(user, item)`:
- `item.access = free` → allow
- `item.access = premium` → allow if user has ANY active subscription where:
  - Plan `scope=global` → **always grants premium in any workspace** (overrides expired workspace plans), OR
  - Plan `scope=workspace` AND `plan.workspaceId = item.workspaceId` → grants premium only in that workspace
- Admin/super_admin always bypass
- Users can hold multiple active subscriptions simultaneously
- **Precedence rule**: a global subscription always grants access regardless of workspace-specific subscription status

### Pricing page per workspace:
- **Ordering**: Global plans listed first, then workspace-specific plans under a "This workspace" section

## Step 8: Repository Layer — All API-Ready

All repos return Promises. Data mode switch determines LocalDB vs HTTP. **All public-facing repo methods automatically exclude content from disabled workspaces.**

**Workspace-scoped repos** (require `workspaceId`):
- `CategoryRepo`: list, create, update, delete, reorder — slug unique per workspace via slugIndex
- `ContentRepo`: list(filters), getBySlug, create, update, publish, unpublish, archive, delete — slug unique per workspace
- `VideoRepo`: list(filters), getBySlug, create, update, publish, archive, delete — slug unique per workspace
- `CourseRepo`: list(filters), getBySlug, create, update, publish, archive, delete, getStructure
- `LessonRepo`: create, update, delete, reorder(moduleId, orderedIds)
- `HomeSectionRepo`: list, create, update, delete, reorder — validates referenced items belong to same workspace
- `ProgressRepo`: enroll, getMyProgress, updateLessonProgress, updateVideoPosition
- `EventRepo`: track (must include workspaceId), trackBatch, list(filters) — 20K cap with rotation

**Global repos** (no workspaceId):
- `WorkspaceRepo`: listWorkspaces, getBySlug, create, update, disable
  - **`getBySlug` has two modes**: public mode returns "not found" for disabled workspaces; admin mode returns disabled workspaces. `listWorkspaces` similarly filters disabled in public mode, includes all in admin mode.
- `AuthRepo`: loginGoogle, loginEmailStart, loginEmailVerify, logout, me
- `UserAdminRepo`: listUsers, createUser, setWorkspaceRole, setUserStatus
- `PlanRepo`: list, create, update, archive (requires `manage_plans`)
- `SubscriptionRepo`: getMySubscriptions, adminAssignPlan, adminCancelSubscription (requires `manage_subscriptions`)

**TanStack Query**: cache keys include `workspaceId` for workspace-scoped data

## Step 9: HomeSections — Fully Data-Driven Home Layout

### HomeSection entity:
- `id`, `workspaceId`, `type` (hero_slider | rail), `sortOrder`
- `titleTranslations: { [lang]: string }` (for rails)
- `itemRefs: [{ entityType: "video" | "content" | "course", id: string }]` (for hero slider)
- `filter: { categoryId?, format?, type? }` (for rails — dynamic query)
- `createdAt`, `updatedAt`

### Validation:
- All referenced items in `itemRefs` must belong to the same `workspaceId` as the HomeSection
- Admin UI prevents cross-workspace references

## Step 10: Admin Panel

- **Workspace Switcher**: dropdown in admin header, role-filtered
- **Workspace Management** (`manage_workspaces`): list, create, update, disable workspaces
- **Dashboard** (`view_analytics`): KPI cards + charts filtered by selected workspace
- **Users** (`manage_users`): list, create member, assign roles per workspace, disable, "login as"
- **Categories** (`manage_categories`): CRUD with parent/child hierarchy, translations, reorder
- **Content** (`manage_content`): CRUD articles/blogs, draft/publish/archive workflow, translations, SEO fields, cover image URLs, audit fields displayed
- **Videos** (`manage_videos`): CRUD with YouTube/MP4/HLS source selection, shorts toggle, draft/publish/archive
- **Courses** (`manage_courses`): course builder — modules & lessons (video/text/mixed, inheriting course publish status), drag-drop reorder, publish/archive at course level
- **Home Layout** (`manage_home_layout`): configure HomeSections per workspace — hero slider with typed itemRefs, rails with filters, validate same-workspace items
- **Plans** (`manage_plans`): create plans with scope (global or workspace + workspaceId), archive plans
- **Subscriptions** (`manage_subscriptions`): assign plan to user, cancel subscription, view user subscriptions
- **Analytics** (`view_analytics`): views, watch time, enrollments by category/language, event log, export, respect 20K cap
- **Settings** (`manage_settings`): import/export DB JSON, "Reset to defaults" with analytics export prompt

## Step 11: Public Pages — Workspace-Scoped, Fully Data-Driven

All pages within `/w/:workspaceSlug/` context. Disabled workspaces show "site unavailable" page (via WorkspaceRepo public mode). Public repos automatically filter out disabled workspace content.

- **Workspace Selector** (`/`): landing page listing active workspaces — **if only one active workspace exists, automatically redirect to that workspace's home page**
- **Home** (`/w/:slug/`): rendered entirely from workspace's HomeSections
- **Explore** (`/w/:slug/explore`): category browsing + search within workspace
- **Category Page** (`/w/:slug/category/:catSlug`): mixed content listing
- **Watch Page** (`/w/:slug/watch/:videoSlug`): VideoPlayer + related + subscription gate CTA
- **Read Page** (`/w/:slug/read/:contentSlug`): article/blog reader + related + gating
- **Courses List** (`/w/:slug/courses`): browse/filter by category, free/premium
- **Course Landing** (`/w/:slug/course/:courseSlug`): module overview, enroll, continue learning
- **Lesson Page** (`/w/:slug/course/:courseSlug/lesson/:lessonId`): player + sidebar nav + progress
- **Pricing** (`/w/:slug/pricing`): global plans first, then workspace-specific plans
- **Account** (`/w/:slug/account`): profile, all active subscriptions, progress

## Step 12: Video Player & Analytics Events

- **VideoPlayer** abstraction: YouTube embed, HTML5 `<video>` for MP4, `hls.js` for HLS
- **Events tracked**: `page_view`, `video_play`, `video_progress` (every 10s), `video_end`, `course_enroll`, `lesson_complete`, `subscribe_start`, `subscribe_success` (Phase 1)
- All events include `workspaceId` at event time
- Shorts display mode for short-format videos

## Step 13: LMS — Courses, Enrollment & Progress

- Course list, landing, lesson pages — all workspace-scoped
- Lessons and modules inherit course publish status (no individual publish workflow)
- Progress stored per user per workspace: enrollment, lesson completion, video position resume
- Continue learning state persists across sessions

## Step 14: Multi-Language (Per Workspace)

- Each workspace defines `enabledLanguages`, `defaultLanguage`, and optionally `hideLanguageSwitcher`
- UI language switcher shows only workspace's `enabledLanguages` (hidden entirely if `hideLanguageSwitcher: true`)
- Content translations stored only when actually translated — fallback to English
- UI string files: English complete first, others added incrementally
- Language preference persisted per user
- Analytics events track language dimension

---

## Architecture Rules (Enforced Throughout)
- ❌ No component reads seed data or writes localStorage directly
- ✅ All data access through Repository → LocalDB layer
- ✅ RBAC via per-workspace permission mapping, never role-name checks
- ✅ `manage_plans` and `manage_subscriptions` are separate permissions
- ✅ Slug uniqueness enforced via `slugIndex[workspaceId][slug]` — single source of truth (no duplicate `bySlug` index)
- ✅ All IDs are stable UUIDs
- ✅ Images stored as URLs only (never base64)
- ✅ Lifecycle fields (status, publishedAt, createdAt/updatedAt, createdByUserId/updatedByUserId) on ContentItem, VideoItem, Course, Category
- ✅ Lessons and Modules inherit Course publish status — no separate status fields
- ✅ `item.access` is only `free` | `premium` — no planId gating at item level
- ✅ Analytics capped at 20K events with rotation
- ✅ `workspaceId` on all content entities; workspace is first-class
- ✅ `WorkspaceRepo.getBySlug` has public mode (hides disabled) and admin mode (returns all)
- ✅ Public repos automatically exclude disabled workspace content
- ✅ Disabled workspaces show "site unavailable" publicly but remain accessible in admin
- ✅ Flexible subscriptions: global plans + workspace plans; global always overrides workspace-specific access
- ✅ Pricing page shows global plans first, then workspace-specific plans
- ✅ Single active workspace auto-redirects from `/` to that workspace
- ✅ Home layout fully admin-driven via HomeSections with typed `itemRefs` and same-workspace validation
- ✅ Data mode switch (`local`/`api`) for painless Phase 1 swap
- ✅ Unlimited workspaces supported
- ✅ Phase 0 is single-device only: admin updates only reflect for that browser until Phase 1 API


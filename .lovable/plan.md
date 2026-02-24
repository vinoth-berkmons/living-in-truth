

# Domain-Based Workspace Resolution + Auth Gating Overhaul

## Summary
Replace `/w/:workspaceSlug/` URL routing with hostname-based workspace resolution. Public routes become flat (`/`, `/explore`, `/watch/:slug`). Header shows "LiT - Living in Truth" branding (or per-site logo via `themeOverride.logoUrl`). Auth gating is tightened with Sign In / Sign Up / Upgrade CTAs and redirect-back logic. Phase 0 subscribe flow uses `SubscriptionRepo.subscribe(planId)`.

**Key domain resolution rule**: If hostname IS mapped but workspace is disabled, show "Site Unavailable" page. Fall back to Couples workspace ONLY when hostname is unmapped (preview/unknown domains).

---

## Step 1: New Entity + DB Schema

**`src/types/entities.ts`** -- Add `WorkspaceDomain` interface:
- `id`, `hostname` (unique), `workspaceId`, `isPrimary` (boolean), `createdAt`, `updatedAt`

**`src/types/db.ts`** -- Add to `AppDatabase`:
- `workspaceDomains: { byId: Record<string, WorkspaceDomain>; byHostname: Record<string, string> }` where `byHostname` maps hostname directly to workspaceId

**`src/lib/db/config.ts`**:
- Add `DEFAULT_WORKSPACE_SLUG = 'couples'`
- Bump `CURRENT_DB_VERSION` to `3`

---

## Step 2: Workspace Resolver

**New file: `src/lib/resolveWorkspace.ts`**

Synchronous function using `getDB()`:
1. Normalize hostname: lowercase + strip `www.` prefix
2. Look up `db.workspaceDomains.byHostname[normalizedHostname]` to get workspaceId directly
3. If found AND workspace is active: return `{ workspace, status: 'active' }`
4. If found AND workspace is disabled: return `{ workspace: null, status: 'disabled' }`
5. If NOT found (unmapped hostname like Lovable preview): fall back to workspace with `slug === 'couples'`, return `{ workspace, status: 'active' }`

---

## Step 3: Workspace Context

**New file: `src/contexts/WorkspaceContext.tsx`**

- React context wrapping the app inside `BrowserRouter`
- On mount: calls `initDB()` synchronously (it's already sync), then `resolveWorkspace()`
- Provides `workspace` and `status` to all children via `useWorkspace()` hook
- If `status === 'disabled'`, renders a full-page "Site Unavailable" message instead of children

---

## Step 4: Seed Domain Data

**Update `src/lib/db/seed_db_v1.ts`**:
- Add 7 `WorkspaceDomain` records mapping hostnames directly to workspace IDs:
  - `globallivingtruth.com` -> `ws-global-001`
  - `kidslivingtruth.com` -> `ws-kids-002`
  - `youthlivingtruth.com` -> `ws-youth-003`
  - `singleslivingtruth.com` -> `ws-singles-004`
  - `coupleslivingtruth.com` -> `ws-couples-005` (isPrimary)
  - `handmadeslivingtruth.com` -> `ws-handmades-006`
  - `servantslivingtruth.com` -> `ws-servants-007`
- Build `byHostname` index mapping hostname to workspaceId
- Set `version: 3`

---

## Step 5: Route Restructuring

**Update `src/App.tsx`**:
- Wrap all routes in `WorkspaceProvider`
- Remove all `/w/:workspaceSlug/` prefixed routes
- New flat public routes:

```text
/                                   -> WorkspaceHome
/explore                            -> ExplorePage
/category/:catSlug                  -> CategoryPage
/watch/:videoSlug                   -> WatchPage
/read/:contentSlug                  -> ReadPage
/courses                            -> CoursesPage
/course/:courseSlug                 -> CourseLandingPage
/course/:courseSlug/lesson/:lessonId -> LessonPage
/pricing                            -> PricingPage
/login                              -> LoginPage
/signup                             -> LoginPage (signup mode)
/account                            -> AccountPage
```

- Admin routes stay unchanged (`/admin/*`)
- Remove `Index` workspace-selector page (no longer needed)

---

## Step 6: Header Branding + Navigation

**Update `src/components/PublicLayout.tsx`**:

- **Left**: Show "LiT" monogram + "Living in Truth" text. If workspace has `themeOverride.logoUrl`, use that image instead of the monogram. Never show workspace name like "Global".
- **Center nav**: Links point to `/explore`, `/courses`, `/pricing` (no workspace slug prefix)
- **Right auth section**:
  - Logged out: "Sign In" button -> `/login`, "Sign Up" button -> `/signup`
  - Logged in: avatar -> `/account`
- **Footer**: Remove "Workspaces" section. Update all links to flat paths.
- Receive workspace from `useWorkspace()` context instead of props

---

## Step 7: Update All Pages (useWorkspace + flat links)

Every public page changes from `useParams<{ workspaceSlug }>()` to `useWorkspace()` and removes `/w/${workspace.slug}` from all link targets.

| File | Key Changes |
|------|-------------|
| `WorkspaceHome.tsx` | `useWorkspace()`, flat hrefs in rails and categories |
| `ExplorePage.tsx` | `useWorkspace()`, flat hrefs in results |
| `CategoryPage.tsx` | `useWorkspace()`, flat hrefs |
| `WatchPage.tsx` | `useWorkspace()`, enhanced locked CTA |
| `ReadPage.tsx` | `useWorkspace()`, enhanced locked CTA |
| `CoursesPage.tsx` | `useWorkspace()`, flat hrefs |
| `CourseLandingPage.tsx` | `useWorkspace()`, enhanced locked CTA |
| `LessonPage.tsx` | `useWorkspace()`, enhanced locked CTA |
| `PricingPage.tsx` | `useWorkspace()`, subscribe modal, redirect |
| `LoginPage.tsx` | `useWorkspace()`, signup mode, redirect support |
| `AccountPage.tsx` | `useWorkspace()`, subscription display |
| `HeroCarousel.tsx` | Remove `/w/${workspace.slug}` from resolved hrefs |

---

## Step 8: Login + Signup

**Update `src/pages/LoginPage.tsx`**:
- Accept `initialMode` prop: `'login'` (default) or `'signup'`
- Read `?redirect=` query param from URL
- After successful login: navigate to redirect URL (or `/`)
- Toggle link between modes: "Don't have an account? Sign up" / "Already have an account? Sign in"
- Phase 0: signup uses same mock flow as login (different UI text)

**In `src/App.tsx`**:
```tsx
<Route path="/login" element={<LoginPage />} />
<Route path="/signup" element={<LoginPage initialMode="signup" />} />
```

---

## Step 9: Enhanced Auth Gating (Locked Content)

For WatchPage, ReadPage, LessonPage, and CourseLandingPage:

- **If logged out**: "Sign In" -> `/login?redirect=/watch/current-slug`, "Sign Up" -> `/signup?redirect=/watch/current-slug`, "View Plans" -> `/pricing`
- **If logged in but no access**: "Upgrade" heading, show global plans first, then "This site" workspace plans (where `plan.scope === 'workspace' && plan.workspaceId === workspace.id`). "Subscribe" buttons on each plan.
- **If logged in with access**: Show content normally

---

## Step 10: Pricing Page Subscribe Flow (Phase 0)

**Add `subscribe()` to `src/repos/planAndAuthRepo.ts`**:
- Public method: gets current userId from session, looks up plan for interval duration, creates `UserSubscription` with `provider='local'`
- Keep `adminAssignPlan` for admin use only

**Update `src/pages/PricingPage.tsx`**:
- If logged out: "Subscribe" links to `/login?redirect=/pricing`
- If logged in: clicking opens a confirm dialog -> calls `SubscriptionRepo.subscribe(planId)` -> redirect to `?redirect` param or `/account` -> toast confirmation
- Plans ordering: global plans first, then workspace plans filtered by `plan.workspaceId === workspace.id`

---

## Step 11: Account Page Enhancements

**Update `src/pages/AccountPage.tsx`**:
- Active subscriptions with scope labels: "All Sites" for global, `workspace.name` (display name, not slug) for workspace-scoped
- Current site access status: "Premium Unlocked" or "Free Only"
- Quick link to `/pricing`

---

## Step 12: Admin Domain Management

**New file: `src/repos/workspaceDomainRepo.ts`**:
- `list(workspaceId?)`: list domains, optionally filtered
- `create(hostname, workspaceId, isPrimary)`: normalizes hostname, validates uniqueness globally, creates record + updates `byHostname` index
- `delete(domainId)`: removes record and index entry
- `setPrimary(domainId)`: sets isPrimary, unsets others for same workspace

**Update `src/pages/admin/AdminWorkspaces.tsx`**:
- "Domains" section per workspace: list hostnames with isPrimary indicator
- Add/remove hostname inputs
- Warning if workspace has no primary domain

**Update `src/repos/index.ts`**: export `WorkspaceDomainRepo`

---

## Step 13: Lock Badge on Content Cards

Verify `ContentRail.tsx` and explore results consistently show a lock/crown badge on premium items across all card types (video, article, course).

---

## Step 14: Cleanup

- Remove or repurpose `src/pages/Index.tsx` (workspace selector no longer needed)
- Remove `src/components/NavLink.tsx` if unused
- Remove any remaining `/w/:slug` references

---

## Files Summary

**New files (3):**
- `src/lib/resolveWorkspace.ts`
- `src/contexts/WorkspaceContext.tsx`
- `src/repos/workspaceDomainRepo.ts`

**Deleted/repurposed (1-2):**
- `src/pages/Index.tsx` (removed)
- `src/components/NavLink.tsx` (removed if unused)

**Modified files (20):**
- `src/types/entities.ts` -- add WorkspaceDomain
- `src/types/db.ts` -- add workspaceDomains to AppDatabase
- `src/lib/db/config.ts` -- add DEFAULT_WORKSPACE_SLUG, bump version to 3
- `src/lib/db/seed_db_v1.ts` -- add domain seed data, version 3
- `src/App.tsx` -- flat routes, WorkspaceProvider, /signup route
- `src/components/PublicLayout.tsx` -- LiT branding, flat links, Sign In + Sign Up
- `src/components/HeroCarousel.tsx` -- flat hrefs
- `src/pages/WorkspaceHome.tsx` -- useWorkspace(), flat links
- `src/pages/ExplorePage.tsx` -- useWorkspace(), flat links
- `src/pages/CategoryPage.tsx` -- useWorkspace(), flat links
- `src/pages/WatchPage.tsx` -- useWorkspace(), enhanced locked CTA
- `src/pages/ReadPage.tsx` -- useWorkspace(), enhanced locked CTA
- `src/pages/CoursesPage.tsx` -- useWorkspace(), flat links
- `src/pages/CourseLandingPage.tsx` -- useWorkspace(), enhanced locked CTA
- `src/pages/LessonPage.tsx` -- useWorkspace(), enhanced locked CTA
- `src/pages/PricingPage.tsx` -- useWorkspace(), subscribe modal
- `src/pages/LoginPage.tsx` -- signup mode, redirect support
- `src/pages/AccountPage.tsx` -- subscription display, access status
- `src/pages/admin/AdminWorkspaces.tsx` -- domain management section
- `src/repos/planAndAuthRepo.ts` -- add subscribe() method
- `src/repos/index.ts` -- export WorkspaceDomainRepo


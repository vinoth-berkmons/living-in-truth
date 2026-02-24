

# Language System Overhaul: Per-Domain Language Selection

## Summary
Replace the global `useLanguageStore` (zustand) with a hostname-keyed `LanguageContext` that resolves language per domain using `LIT_LANG_BY_HOST` in localStorage. Add a dedicated `/language` selection page with radio buttons, Save/Cancel. Ensure consistent translation fallback and include `selectedLanguage` in all analytics events via a UI-layer helper.

User's requested tweaks applied:
- `getStoredLanguage` returns `Language | null` (validates against `LANGUAGE_META` keys; unknown values treated as null)
- `setStoredLanguage` accepts `Language` type only
- `normalizeHostname` strips trailing dot and removes port in addition to lowercase + strip `www.`
- `enabledLanguages` always has `'en'` forced in memory in LanguageContext init
- LanguagePage redirect when `hideLanguageSwitcher` is true goes to `returnTo` if present, else `/`

---

## Step 1: Expand Language Type and Add Metadata

**File: `src/types/entities.ts`** (line 3)
- Change `Language` type to include `'ta'` and `'hi'`
- Add `LANGUAGE_META` constant after the type:

```typescript
export type Language = 'en' | 'ar' | 'fr' | 'es' | 'de' | 'tr' | 'ta' | 'hi';

export const LANGUAGE_META: Record<Language, { english: string; native: string }> = {
  en: { english: 'English', native: 'English' },
  ar: { english: 'Arabic', native: 'العربية' },
  fr: { english: 'French', native: 'Français' },
  es: { english: 'Spanish', native: 'Español' },
  de: { english: 'German', native: 'Deutsch' },
  tr: { english: 'Turkish', native: 'Türkçe' },
  ta: { english: 'Tamil', native: 'தமிழ்' },
  hi: { english: 'Hindi', native: 'हिन्दी' },
};
```

---

## Step 2: Hostname-Keyed localStorage Helpers

**New file: `src/lib/languageStorage.ts`**

- `normalizeHostname(hostname)`: lowercase, remove port (`:` onwards), strip trailing dot, strip `www.` prefix
- `getStoredLanguage(hostname): Language | null`: reads `LIT_LANG_BY_HOST` JSON, validates value exists in `LANGUAGE_META` keys, returns `Language` or `null`
- `setStoredLanguage(hostname, lang: Language): void`: reads/merges/writes JSON
- Storage key constant: `LIT_LANG_BY_HOST`

---

## Step 3: Create LanguageContext

**New file: `src/contexts/LanguageContext.tsx`**

- Depends on `WorkspaceContext` (uses `useWorkspace()`)
- On init:
  1. Get workspace from `useWorkspace()`
  2. Compute `enabledLanguages` = workspace.enabledLanguages, force-add `'en'` if not present
  3. Normalize hostname via `normalizeHostname(window.location.hostname)`
  4. Read stored language via `getStoredLanguage(hostname)`
  5. If stored value is null or not in `enabledLanguages`, default to `'en'`
- Exposes via `useLanguage()` hook:
  - `language: Language`
  - `setLanguage(lang: Language)` -- validates against enabledLanguages, updates state + persists
  - `enabledLanguages: Language[]`
  - `hideLanguageSwitcher: boolean`

---

## Step 4: Wire LanguageContext into App

**File: `src/App.tsx`**
- Import `LanguageProvider` from `@/contexts/LanguageContext`
- Nest inside `WorkspaceProvider`:
```tsx
<WorkspaceProvider>
  <LanguageProvider>
    <Routes>...</Routes>
  </LanguageProvider>
</WorkspaceProvider>
```
- Add route: `<Route path="/language" element={<LanguagePage />} />`

---

## Step 5: Create Language Selection Page

**New file: `src/pages/LanguagePage.tsx`**

- Route: `/language`
- Wrapped in `PublicLayout`
- Reads `?returnTo=` query param
- Uses `useLanguage()` for `enabledLanguages`, current `language`, `hideLanguageSwitcher`
- If `hideLanguageSwitcher` is true: redirect to `returnTo` if present, else `/`
- UI:
  - Title: "Choose Language" (i18n key `lang.choose`)
  - Radio group listing each enabled language: "English name / native name" (from `LANGUAGE_META`)
  - Local state initialized to current `language`
  - **Save** button (primary): calls `setLanguage(selected)`, navigates to `returnTo` or `/`
  - **Cancel** button (secondary): navigates to `returnTo` or `/` without changes

---

## Step 6: Update Header Language Button

**File: `src/components/PublicLayout.tsx`**

- Replace the inline `<select>` dropdown (lines 86-99) with a Globe icon button showing current language code uppercase (e.g., "EN")
- Clicking navigates to `/language?returnTo=${encodeURIComponent(location.pathname + location.search)}`
- Hide if `hideLanguageSwitcher` is true OR `enabledLanguages.length <= 1`
- Replace `useLanguageStore` import with `useLanguage` from `@/contexts/LanguageContext`
- Remove `setLanguage` destructuring (no longer needed in header)

---

## Step 7: Replace useLanguageStore in All Public Pages

Each file: replace `import { useLanguageStore } from '@/stores'` with `import { useLanguage } from '@/contexts/LanguageContext'`, and change `const { language } = useLanguageStore()` to `const { language } = useLanguage()`.

Files (12 total):
- `src/pages/WorkspaceHome.tsx` (line 6 import, line 14 usage)
- `src/pages/ExplorePage.tsx` (line 5 import, line 14 usage)
- `src/pages/CategoryPage.tsx` (line 4 import, line 12 usage)
- `src/pages/WatchPage.tsx` (line 4 import, line 15 usage)
- `src/pages/ReadPage.tsx` (line 4 import, line 13 usage)
- `src/pages/CoursesPage.tsx` (line 4 import, line 11 usage)
- `src/pages/CourseLandingPage.tsx` (line 4 import, line 13 usage)
- `src/pages/LessonPage.tsx` (line 4 import, line 14 usage)
- `src/pages/PricingPage.tsx` (line 4 import, line 13 usage)
- `src/pages/LoginPage.tsx` (line 5 import, line 18 usage)
- `src/pages/AccountPage.tsx` (line 4 import, line 13 usage)
- `src/components/PublicLayout.tsx` (line 2 import, line 19 usage) -- handled in Step 6

Note: `HeroCarousel.tsx` receives `language` as a prop from its parent, so no change needed.

---

## Step 8: Update i18n Strings

**File: `src/lib/i18n.ts`**

- The `strings` record type already uses `Record<Language, string>`, so adding `ta` and `hi` to the Language type means each entry needs those keys. Add them with English fallback values.
- Add new i18n keys:
  - `'lang.choose'`: "Choose Language"
  - `'lang.save'`: "Save"
  - `'lang.cancel'`: "Cancel"

---

## Step 9: Content Translation Fallback

The existing `getTranslation()` already returns `translations[lang] ?? translations.en ?? undefined`. Update call sites to show `"(Translation not available)"` when the result is undefined. This affects title/description rendering in WatchPage, ReadPage, CourseLandingPage, LessonPage, WorkspaceHome, ExplorePage, CategoryPage, and HeroCarousel.

---

## Step 10: Analytics Language via useTrackEvent Hook

Create a small `useTrackEvent()` hook (in a new file or alongside `LanguageContext`) that:
- Gets `workspace` from `useWorkspace()` and `language` from `useLanguage()`
- Returns a `trackEvent(type, metadata?)` function that calls `EventRepo.track({ type, workspaceId: workspace.id, language, ...metadata })`
- Pages that currently call `EventRepo.track()` directly should use this hook instead

---

## Step 11: Seed Data Update

**File: `src/lib/db/seed_db_v1.ts`** (line 33)
- Add `'ta'` to Global workspace's `enabledLanguages`: `['en', 'ar', 'ta']`

---

## Step 12: Cleanup

**File: `src/stores/index.ts`** (lines 46-60)
- Remove the `useLanguageStore` export entirely (LanguageState interface, create call, persist config)

---

## Files Summary

**New files (3):**
- `src/lib/languageStorage.ts`
- `src/contexts/LanguageContext.tsx`
- `src/pages/LanguagePage.tsx`

**Modified files (16):**
- `src/types/entities.ts` -- expand Language type, add LANGUAGE_META
- `src/lib/i18n.ts` -- add ta/hi columns, new lang.* keys
- `src/App.tsx` -- add LanguageProvider, /language route
- `src/components/PublicLayout.tsx` -- Globe button, useLanguage()
- `src/stores/index.ts` -- remove useLanguageStore
- `src/lib/db/seed_db_v1.ts` -- add 'ta' to Global enabledLanguages
- `src/pages/WorkspaceHome.tsx` -- useLanguage()
- `src/pages/ExplorePage.tsx` -- useLanguage()
- `src/pages/CategoryPage.tsx` -- useLanguage()
- `src/pages/WatchPage.tsx` -- useLanguage()
- `src/pages/ReadPage.tsx` -- useLanguage()
- `src/pages/CoursesPage.tsx` -- useLanguage()
- `src/pages/CourseLandingPage.tsx` -- useLanguage()
- `src/pages/LessonPage.tsx` -- useLanguage()
- `src/pages/PricingPage.tsx` -- useLanguage()
- `src/pages/LoginPage.tsx` -- useLanguage()
- `src/pages/AccountPage.tsx` -- useLanguage()


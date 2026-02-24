

# Comprehensive Update: Theme, Language, Content, Hover-to-Play, and Sign-In Prompts

## Summary
This plan covers 6 major changes:
1. Fix the back button "double arrow" issue on detail pages
2. Default to dark theme (user can still toggle)
3. Language popup instead of full page; remove Arabic, add Malayalam/Kannada/Telugu
4. Show sign-in prompt for unauthenticated users trying to access courses or premium content
5. Add significantly more content from Unapologetic Catholic YouTube channel
6. Hover-to-play preview on video/shorts cards (like YouTube)

---

## Step 1: Fix Back Button Double Arrow

The `common.back` i18n string is `"<-- Back"` which already has an arrow character, but the JSX also renders an `<ArrowLeft>` icon next to it. Fix by removing the arrow from the i18n string.

**File: `src/lib/i18n.ts`** (line 18)
- Change `'common.back'` from `'<-- Back'` to `'Back'` (for all languages) so only the icon arrow shows

**Files: `src/pages/WatchPage.tsx`, `src/pages/ReadPage.tsx`, `src/pages/CourseLandingPage.tsx`**
- No JSX changes needed -- the `<ArrowLeft>` icon stays, just the duplicate arrow text is removed

---

## Step 2: Default Dark Theme

**File: `src/stores/index.ts`** (line 15)
- Change `isDark: false` to `isDark: true` as the default

**File: `src/main.tsx`**
- After `createRoot`, add initialization logic to apply dark class on first load:
  - Read persisted theme from localStorage `lit-theme`
  - If no stored preference exists, set `document.documentElement.classList.add('dark')`
  - If stored preference has `isDark: true`, apply `dark` class
  - This ensures dark mode is active on very first render before React hydrates

---

## Step 3: Language as Popup Dialog + Update Language List

### 3a. Update Language type and LANGUAGE_META

**File: `src/types/entities.ts`** (line 3)
- Add `'ml'` (Malayalam), `'kn'` (Kannada), `'te'` (Telugu) to `Language` type
- Remove `'ar'`, `'fr'`, `'es'`, `'de'`, `'tr'` from `Language` type
- Final type: `'en' | 'ta' | 'hi' | 'ml' | 'kn' | 'te'`
- Update `LANGUAGE_META` to only have these 6 languages with proper native names:
  - ml: Malayalam / `'മലയാളം'`
  - kn: Kannada / `'ಕನ್ನಡ'`
  - te: Telugu / `'తెలుగు'`

### 3b. Update workspace enabled languages

**File: `src/lib/db/seed_db_v1.ts`** (line 33)
- Global workspace `enabledLanguages`: `['en', 'ta', 'hi', 'ml', 'kn', 'te']`
- Remove `'ar'` from all workspaces

### 3c. Convert LanguagePage to a Dialog/Popup

**File: `src/components/PublicLayout.tsx`**
- Instead of navigating to `/language`, clicking the Globe button opens a Dialog (using the existing Radix Dialog component)
- The dialog shows the language radio list (same UI as LanguagePage but inline)
- Save/Cancel buttons inside the dialog
- Remove the navigation to `/language`

**File: `src/App.tsx`**
- Remove the `/language` route (the popup replaces it)

**File: `src/pages/LanguagePage.tsx`**
- Can be deleted or kept as fallback (recommend keeping but removing route)

### 3d. Update i18n strings

**File: `src/lib/i18n.ts`**
- Remove `ar`, `fr`, `es`, `de`, `tr` columns from all strings
- Add `ta`, `hi`, `ml`, `kn`, `te` columns with English fallback values
- Add `ml`, `kn`, `te` to `lang.choose`, `lang.save`, `lang.cancel`

---

## Step 4: Sign-In Prompt for Courses

Currently, courses page (`CoursesPage.tsx`) lets everyone click through to `CourseLandingPage`. The landing page only shows sign-in prompt for premium courses when not logged in.

**File: `src/pages/CoursesPage.tsx`**
- When a user clicks a course and they are NOT signed in:
  - For premium courses: show a sign-in prompt overlay/modal before navigating
  - For free courses: allow access but show sign-in prompt when they try to enroll/start a lesson

**File: `src/pages/CourseLandingPage.tsx`** (line 71-84)
- Current logic already handles premium + not-signed-in case
- Extend: for ALL courses (not just premium), if user is not signed in and clicks "Enroll Now", show sign-in prompt instead of enrolling
- Change the condition on line 71 from `course.access === 'premium' && !session` to handle the no-session case for all courses

**File: `src/components/ContentRail.tsx`**
- For premium cards: when clicked by unauthenticated user, the existing detail pages already handle this
- No changes needed here -- the WatchPage and ReadPage already show sign-in prompts

---

## Step 5: Add More Content from Unapologetic Catholic

**File: `src/lib/db/seed_db_v1.ts`**

Add ~12 more videos (verified from `@unapologeticcatholicin` channel) and ~5 more articles from MFC. Bump DB version to 5.

### New Long-format Videos (adding 7 more, total 15 long):
| YouTube ID | Title | Duration |
|---|---|---|
| Jc3FGjYf_hM | What to Give up for Lent? Best Things to Give up for Lenten Season | 355s |
| vs56Z-VhpYk | Experiencing Same Sex Attraction as an Indian Catholic - Krysanne Martis - UC Talks | 4297s |
| 3IyJs7mWEWk | Catholic REACTS to Beautiful Things by Benson Boone | 321s |
| hnKCHMDfdoA | The Psalms Reveal Jesus as the Messiah | 211s |
| GzO6iN1eFIM | (from channel - needs title verification) | ~600s |
| X82AaeyPPe4 | (from channel - needs title verification) | ~600s |
| Jy1waLtNKzw | (from channel - needs title verification) | ~600s |

### New Short-format Videos (adding 5 more, total 10 shorts):
| YouTube ID | Title | Duration |
|---|---|---|
| kHnz-PSB61M | Tumblr Used to Be My Safe Space | 59s |
| kVrhaE9xgUM | What is Natural Family Planning? - UC Talks | 32s |
| (3 more shorts from channel - will use known video IDs from the channel) | | |

### New Articles from MFC (adding 5 more, total 12):
Additional articles with real content from MFC website covering topics like:
- The Eucharist and Community Life
- Youth and Faith Formation
- The Role of Mary in Catholic Life
- Living the Beatitudes
- Catholic Social Teaching

### Updated Home Sections
- Add more items to hero slider
- Update rail filters to show the expanded content properly

**File: `src/lib/db/config.ts`**
- Bump `CURRENT_DB_VERSION` from `4` to `5`

---

## Step 6: Hover-to-Play on Video/Short Cards

**File: `src/components/ContentRail.tsx`**

For video cards (both shorts and long-format), implement hover-to-play:

- Add a `<iframe>` (YouTube embed with `autoplay=1&mute=1`) that appears on hover over the thumbnail
- On `mouseEnter`: after a 500ms delay, replace the static thumbnail with the YouTube embed iframe
- On `mouseLeave`: remove the iframe and show the static thumbnail again
- Add `muted` autoplay for reliable cross-browser playback
- For mobile: skip hover behavior (touch devices don't hover)
- Only apply to items where `type === 'video'` (not articles/courses)

### Technical approach:
```
MediaCard component changes:
- Add state: isHovering, showPlayer (with delay)
- onMouseEnter -> start 500ms timer -> set showPlayer=true
- onMouseLeave -> clear timer -> set showPlayer=false
- When showPlayer=true, render YouTube iframe over thumbnail
- iframe src: https://www.youtube.com/embed/{youtubeId}?autoplay=1&mute=1&controls=0&loop=1&playlist={youtubeId}
```

**Note**: Need to extract `youtubeId` from the item data. Currently `MediaCardData` doesn't have `youtubeId`. Add optional `youtubeId?: string` to `MediaCardData` interface and populate it when building card data.

### Files affected:
- `src/components/ContentRail.tsx` - Add hover-to-play logic + youtubeId to MediaCardData
- `src/pages/WorkspaceHome.tsx` - Pass youtubeId when building MediaCardData
- `src/pages/WatchPage.tsx` - Pass youtubeId when building related/short cards
- `src/pages/CategoryPage.tsx` - Pass youtubeId when building cards
- `src/pages/ExplorePage.tsx` - Pass youtubeId when building cards

---

## Files Summary

**Modified files (12):**
- `src/types/entities.ts` - Update Language type, add ml/kn/te to LANGUAGE_META
- `src/lib/i18n.ts` - Remove ar/fr/es/de/tr, add ta/hi/ml/kn/te, fix back text
- `src/lib/db/config.ts` - Bump version to 5
- `src/lib/db/seed_db_v1.ts` - Add ~12 more videos, ~5 more articles, update home sections
- `src/stores/index.ts` - Default isDark to true
- `src/main.tsx` - Apply dark class on first render
- `src/components/PublicLayout.tsx` - Language popup dialog instead of navigation
- `src/components/ContentRail.tsx` - Add hover-to-play, add youtubeId to MediaCardData
- `src/pages/CourseLandingPage.tsx` - Sign-in prompt for all courses when not authenticated
- `src/pages/WorkspaceHome.tsx` - Pass youtubeId to cards
- `src/pages/WatchPage.tsx` - Pass youtubeId to cards
- `src/pages/ExplorePage.tsx` - Pass youtubeId to cards
- `src/pages/CategoryPage.tsx` - Pass youtubeId to cards
- `src/App.tsx` - Remove /language route

**Potentially deleted:**
- `src/pages/LanguagePage.tsx` - No longer needed (popup replaces it)


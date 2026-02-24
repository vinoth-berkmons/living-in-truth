

# Separate Videos and Articles Pages

## Problem
Currently, "Videos" and "Articles" in the navigation both link to the Explore page with a query parameter (`/explore?type=video`, `/explore?type=article`). They look identical to Explore. The user wants:
- `/videos` -- dedicated page showing only videos (with category sidebar, search, access filter, but NO type filter tabs)
- `/articles` -- dedicated page showing only articles/blogs (same layout, but only articles)
- `/explore` -- keeps all content types with the type filter tabs

## Approach
Rather than duplicating the entire ExplorePage three times, create a shared `BrowsePage` component that accepts a `contentType` prop (`'all' | 'video' | 'article'`). Each route passes the appropriate prop. This keeps the code DRY.

## Changes

### 1. New file: `src/pages/VideosPage.tsx`
- Simple wrapper that renders `BrowsePage` with `contentType="video"`
- Page title: "Videos"
- Shows only video items from the DB (long + short formats)
- Has category sidebar, search bar, and free/premium access filter
- No type filter tabs (since it's already scoped to videos)

### 2. New file: `src/pages/ArticlesPage.tsx`
- Simple wrapper that renders `BrowsePage` with `contentType="article"`
- Page title: "Articles"
- Shows only article and blog content items
- Same layout: category sidebar, search, access filter
- No type filter tabs

### 3. Refactor: `src/pages/ExplorePage.tsx`
- Extract the shared browse/grid logic into a reusable internal component or refactor in-place
- When `contentType` is `'all'`: show type filter tabs (Video, Article, Course) -- current behavior
- When `contentType` is `'video'`: fetch only videos, hide type tabs
- When `contentType` is `'article'`: fetch only articles+blogs, hide type tabs
- Add a page heading that reflects the current section ("Explore", "Videos", or "Articles")

### 4. Update: `src/App.tsx`
- Add route: `/videos` pointing to `VideosPage`
- Add route: `/articles` pointing to `ArticlesPage`

### 5. Update: `src/components/PublicLayout.tsx`
- Change nav link for Videos from `/explore?type=video` to `/videos`
- Change nav link for Articles from `/explore?type=article` to `/articles`
- Update footer links similarly

## Technical Details

### ExplorePage refactor
The `ExplorePage` component will accept an optional `contentType` prop:

```text
interface Props {
  contentType?: 'all' | 'video' | 'article';
}
```

- When `contentType="video"`: skip content and course queries, only load videos, hide type filter buttons
- When `contentType="article"`: skip video and course queries, only load articles+blogs, hide type filter buttons
- When `contentType="all"` (default): current behavior with all type tabs

### VideosPage / ArticlesPage
Each is a thin wrapper:
```text
const VideosPage = () => <ExplorePage contentType="video" />;
```

### Navigation updates in PublicLayout
```text
{ label: 'Videos', to: '/videos' }
{ label: 'Articles', to: '/articles' }
{ label: 'Explore', to: '/explore' }  // unchanged
```

### Files to create
- `src/pages/VideosPage.tsx`
- `src/pages/ArticlesPage.tsx`

### Files to modify
- `src/pages/ExplorePage.tsx` -- accept `contentType` prop, conditionally hide type tabs
- `src/App.tsx` -- add `/videos` and `/articles` routes
- `src/components/PublicLayout.tsx` -- update nav and footer links


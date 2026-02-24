

# Add Content Type Badge to All Cards

## Summary
Add a visible type badge (Video, Short, Course, Article, Blog) on every card so users can immediately identify what kind of content they're looking at. Currently, shorts have a "Short" badge but other types (video, article, blog, course) don't show their type.

## Change

### File: `src/components/ContentRail.tsx`

Replace the existing "Format badge for shorts" block (lines 218-223) with a unified **type/format badge** that shows on ALL cards (not just shorts), positioned at `bottom-2 left-2`:

- **Short** (when `isShort`): purple/primary badge, label "Short"
- **Video** (when `type === 'video'` and not short): blue-tinted badge with Play icon, label "Video"
- **Course** (when `type === 'course'`): green-tinted badge with BookOpen icon, label "Course"
- **Article** (when `type === 'article'`): amber-tinted badge with BookOpen icon, label "Article"
- **Blog** (when `type === 'blog'`): teal-tinted badge with BookOpen icon, label "Blog"

All badges use glass-morphism styling (`backdrop-blur-sm`) and only show when `!showPlayer` (hidden during hover preview).

### Badge Style
Each type gets a distinct background color for quick visual differentiation:
- Short: `bg-primary/90 text-primary-foreground`
- Video: `bg-blue-600/90 text-white`
- Course: `bg-emerald-600/90 text-white`
- Article: `bg-amber-600/90 text-white`
- Blog: `bg-teal-600/90 text-white`

All badges: `rounded-lg px-2 py-1 text-xs font-semibold shadow-lg backdrop-blur-sm flex items-center gap-1`

### No other files need changes
The `MediaCardData` interface already has the `type` and `format` fields needed.


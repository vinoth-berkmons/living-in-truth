

# Enhanced LMS Course Experience + Hover Icon Fix

## Summary
Two changes: (1) Fix the hover overlay icon so articles/blogs show a BookOpen icon instead of Play, and (2) build out a full LMS experience with progress tracking, resume-where-you-left-off, module-grouped sidebar, mark-as-complete, and client-side Q&A.

---

## 1. Fix Hover Overlay Icon (`ContentRail.tsx`)

Update lines 196-197 to conditionally render Play or BookOpen based on content type, matching the logic already used in the type badge.

---

## 2. Course Landing Page Upgrade (`CourseLandingPage.tsx`)

### Progress Overview (enrolled users)
- Calculate completion percentage from `progress.completedLessonIds` vs total lessons
- Show a progress bar with "X of Y lessons completed (Z%)"
- "Continue where you left off" button linking to the first incomplete lesson
- Total course duration summed from all linked videos' `durationSeconds`

### Course Stats Row
- Total duration (formatted as Xh Ym)
- Total lessons
- Module count

### Enhanced Module Accordion
- Per-module mini progress bar (completed lessons in that module / total in module)
- Each lesson row shows:
  - Green checkmark if completed, or lesson number
  - Lesson title
  - Type icon (Play for video, BookOpen for text)
  - Duration from linked video
  - "Resume here" indicator on the next incomplete lesson

---

## 3. Lesson Page Upgrade (`LessonPage.tsx`)

### Breadcrumb Navigation
- Course title > Module title > Lesson title

### Module-Grouped Sidebar (new component `LessonSidebar.tsx`)
- Collapsible module sections instead of flat list
- Per-module mini progress bar
- Active lesson highlighted with accent border
- Completed lessons show green checkmark
- Current module auto-expanded

### Mark as Complete Button
- Below lesson content, a "Mark as Complete" / "Completed" toggle button
- Uses `updateDB` to add/remove `lessonId` from `progress.completedLessonIds`
- Visual feedback with checkmark icon

### Enhanced Next/Previous
- Show lesson title in the next/prev buttons (not just arrows)
- Auto-suggest "Mark as Complete" before moving to next

### Lesson Duration Display
- Show video duration badge in the lesson header

---

## 4. Q&A Section (new component `LessonQA.tsx`)

- Collapsible "Questions & Answers" section below lesson content
- Client-side only (React state, no DB) -- resets on page reload
- Pre-populated with 2-3 sample Q&A entries for demo
- "Ask a Question" form with name input + textarea + submit
- Each question card shows: author avatar placeholder, name, timestamp, question text
- Simple reply capability (also in-memory only)

---

## 5. Course Progress Bar (new component `CourseProgressBar.tsx`)

Reusable component accepting `completed` and `total` counts:
- Linear progress bar using the existing `Progress` UI component
- "X/Y completed (Z%)" label
- Adapts colors based on completion (partial = primary, full = green)

---

## New Files
- `src/components/CourseProgressBar.tsx`
- `src/components/LessonSidebar.tsx`
- `src/components/LessonQA.tsx`

## Modified Files
- `src/components/ContentRail.tsx` -- hover overlay icon fix
- `src/pages/CourseLandingPage.tsx` -- progress overview, enhanced accordion, stats
- `src/pages/LessonPage.tsx` -- breadcrumb, mark-complete, Q&A section, new sidebar

## Technical Notes

**Resume point logic:**
```text
allLessons (ordered) -> find first where !completedIds.has(id)
If all complete -> link to last lesson
```

**Mark complete persistence:**
```text
Uses updateDB() from lib/db/storage.ts
Adds lessonId to progress.completedLessonIds in localStorage DB
Creates progress entry if user has none yet
```

**Duration formatting:**
```text
Sum durationSeconds from all lesson videos
Display as "Xh Ym" or "Xm Ys"
```

**Q&A state structure:**
```text
interface QAItem {
  id: string
  authorName: string
  question: string
  timestamp: Date
  replies: { authorName: string; text: string; timestamp: Date }[]
}
Initialized with sample data for demo purposes
```


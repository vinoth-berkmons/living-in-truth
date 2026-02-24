import { Link } from 'react-router-dom';
import { useState } from 'react';
import { ChevronDown, ChevronUp, CheckCircle2, Play, BookOpen, Lock } from 'lucide-react';
import { getTranslation } from '@/lib/i18n';
import { CourseProgressBar } from './CourseProgressBar';
import type { Language } from '@/types/entities';
import type { AppDatabase } from '@/types/db';

interface LessonSidebarProps {
  course: any;
  db: AppDatabase;
  language: Language;
  activeLessonId: string;
  completedIds: Set<string>;
  hasAccess: boolean;
}

export const LessonSidebar = ({ course, db, language, activeLessonId, completedIds, hasAccess }: LessonSidebarProps) => {
  const modules = course.moduleIds.map((id: string) => db.modules.byId[id]).filter(Boolean);
  const cTr = getTranslation(course.translations, language) as { title?: string } | undefined;

  // Find which module the active lesson is in
  const activeModuleId = modules.find((m: any) => m.lessonIds.includes(activeLessonId))?.id;

  return (
    <div className="space-y-2">
      <Link to={`/course/${course.slug}`} className="mb-3 block text-sm font-medium text-primary hover:underline">
        ← {cTr?.title ?? 'Course'}
      </Link>

      {/* Overall progress */}
      {(() => {
        const allLessons = modules.flatMap((m: any) => m.lessonIds);
        const done = allLessons.filter((id: string) => completedIds.has(id)).length;
        return <CourseProgressBar completed={done} total={allLessons.length} className="mb-4" />;
      })()}

      {modules.map((mod: any, mi: number) => (
        <ModuleGroup
          key={mod.id}
          mod={mod}
          mi={mi}
          db={db}
          course={course}
          language={language}
          activeLessonId={activeLessonId}
          completedIds={completedIds}
          hasAccess={hasAccess}
          defaultOpen={mod.id === activeModuleId}
        />
      ))}
    </div>
  );
};

function ModuleGroup({ mod, mi, db, course, language, activeLessonId, completedIds, hasAccess, defaultOpen }: {
  mod: any; mi: number; db: AppDatabase; course: any; language: Language;
  activeLessonId: string; completedIds: Set<string>; hasAccess: boolean; defaultOpen: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const modTr = getTranslation(mod.translations, language) as { title?: string } | undefined;
  const lessons = mod.lessonIds.map((id: string) => db.lessons.byId[id]).filter(Boolean);
  const doneLessons = lessons.filter((l: any) => completedIds.has(l.id)).length;

  return (
    <div className="rounded-lg border border-border/50 bg-card overflow-hidden">
      <button onClick={() => setOpen(!open)} className="flex w-full items-center justify-between px-3 py-2.5 text-left">
        <div className="flex-1 min-w-0">
          <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Module {mi + 1}</span>
          <h4 className="text-sm font-semibold text-foreground truncate">{modTr?.title ?? 'Untitled'}</h4>
          <div className="mt-1">
            <CourseProgressBar completed={doneLessons} total={lessons.length} showLabel={false} className="" />
          </div>
        </div>
        {open ? <ChevronUp className="ml-2 h-4 w-4 flex-shrink-0 text-muted-foreground" /> : <ChevronDown className="ml-2 h-4 w-4 flex-shrink-0 text-muted-foreground" />}
      </button>
      {open && (
        <div className="border-t border-border/50 px-1 pb-2 pt-1">
          {lessons.map((lesson: any, li: number) => {
            const lTr = getTranslation(lesson.translations, language) as { title?: string } | undefined;
            const isActive = lesson.id === activeLessonId;
            const isDone = completedIds.has(lesson.id);
            const video = lesson.videoId ? db.videos.byId[lesson.videoId] : undefined;
            const duration = video?.durationSeconds;

            return (
              <Link
                key={lesson.id}
                to={`/course/${course.slug}/lesson/${lesson.id}`}
                className={`flex items-center gap-2 rounded-md px-2.5 py-2 text-sm transition-colors ${
                  isActive
                    ? 'bg-primary/10 border-l-2 border-primary font-medium text-primary'
                    : 'text-foreground hover:bg-secondary border-l-2 border-transparent'
                }`}
              >
                <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs flex-shrink-0 ${
                  isDone ? 'bg-emerald-500/20 text-emerald-500' : 'bg-muted text-muted-foreground'
                }`}>
                  {isDone ? <CheckCircle2 className="h-3.5 w-3.5" /> : li + 1}
                </span>
                <span className="flex-1 truncate">{lTr?.title ?? 'Untitled'}</span>
                <span className="flex items-center gap-1 text-[10px] text-muted-foreground flex-shrink-0">
                  {lesson.type === 'video' ? <Play className="h-3 w-3" /> : <BookOpen className="h-3 w-3" />}
                  {duration && formatDur(duration)}
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

function formatDur(s: number): string {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return m > 0 ? `${m}m` : `${sec}s`;
}

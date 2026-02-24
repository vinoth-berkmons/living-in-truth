import { useParams, Link } from 'react-router-dom';
import { getDB } from '@/lib/db';
import { PublicLayout } from '@/components/PublicLayout';
import { useAuthStore } from '@/stores';
import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslation, t } from '@/lib/i18n';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { GraduationCap, Crown, ChevronDown, ChevronUp, Play, BookOpen, ArrowLeft, LogIn, UserPlus, Clock, CheckCircle2, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { CourseProgressBar } from '@/components/CourseProgressBar';

function formatTotalDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

const CourseLandingPage = () => {
  const { courseSlug } = useParams<{ courseSlug: string }>();
  const workspace = useWorkspace();
  const { language } = useLanguage();
  const { session } = useAuthStore();
  const db = getDB();
  if (!db) return null;

  const courseId = db.courses.slugIndex[workspace.id]?.[courseSlug!];
  const course = courseId ? db.courses.byId[courseId] : undefined;
  if (!course) return <div className="flex min-h-screen items-center justify-center bg-background"><p className="text-foreground">Course not found</p></div>;

  const tr = getTranslation(course.translations, language);
  const modules = course.moduleIds.map(id => db.modules.byId[id]).filter(Boolean);
  const allLessons = modules.flatMap(m => m!.lessonIds.map(id => db.lessons.byId[id]).filter(Boolean));
  const progress = session ? db.progress.find(p => p.userId === session.userId && p.courseId === course.id) : undefined;
  const enrolled = !!progress;
  const completedIds = new Set(progress?.completedLessonIds ?? []);

  // Resume point
  const resumeLesson = allLessons.find(l => l && !completedIds.has(l.id)) || allLessons[allLessons.length - 1];

  // Duration
  const totalDuration = allLessons.reduce((acc, l) => {
    if (!l?.videoId) return acc;
    const v = db.videos.byId[l.videoId];
    return acc + (v?.durationSeconds ?? 0);
  }, 0);

  const firstModId = course.moduleIds[0];
  const firstMod = firstModId ? db.modules.byId[firstModId] : undefined;
  const firstLessonId = firstMod?.lessonIds[0];
  const firstLesson = firstLessonId ? db.lessons.byId[firstLessonId] : undefined;
  const coverVideo = firstLesson?.videoId ? db.videos.byId[firstLesson.videoId] : undefined;
  const coverUrl = coverVideo?.coverImageUrl ?? 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=800&q=80';

  const totalLessons = allLessons.length;
  const currentPath = `/course/${courseSlug}`;

  return (
    <PublicLayout>
      {/* Hero */}
      <div className="relative h-[45vh] min-h-[350px] overflow-hidden">
        <img src={coverUrl} alt="" className="h-full w-full object-cover" />
        <div className="hero-overlay absolute inset-0" />
        <div className="hero-overlay-side absolute inset-0" />
        <div className="relative z-10 flex h-full items-end pb-10">
          <div className="container mx-auto px-6 md:px-12">
            <Link to="/courses" className="mb-3 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-3 w-3" />{t('common.back', language)}
            </Link>
            <div className="mb-2 flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-md bg-primary/20 px-2 py-1 text-xs font-semibold uppercase text-primary backdrop-blur-sm">
                <GraduationCap className="h-3 w-3" />Course
              </span>
              {course.access === 'premium' && (
                <span className="flex items-center gap-1 rounded bg-accent/20 px-2 py-1 text-xs font-semibold text-accent backdrop-blur-sm">
                  <Crown className="h-3 w-3" />{t('common.premium', language)}
                </span>
              )}
            </div>
            <h1 className="font-heading text-3xl font-bold text-foreground md:text-4xl">{tr?.title ?? 'Untitled'}</h1>
            {tr?.description && <p className="mt-2 max-w-2xl text-base text-muted-foreground">{tr.description}</p>}

            {/* Stats row */}
            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><BookOpen className="h-3.5 w-3.5" />{modules.length} module{modules.length !== 1 ? 's' : ''}</span>
              <span>·</span>
              <span className="flex items-center gap-1"><Play className="h-3.5 w-3.5" />{totalLessons} lesson{totalLessons !== 1 ? 's' : ''}</span>
              {totalDuration > 0 && (
                <>
                  <span>·</span>
                  <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{formatTotalDuration(totalDuration)}</span>
                </>
              )}
            </div>

            <div className="mt-5">
              {enrolled ? (
                <Link to={`/course/${course.slug}/lesson/${resumeLesson?.id || ''}`} className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90">
                  <Play className="h-4 w-4" />{t('course.continue', language)}
                </Link>
              ) : !session ? (
                <div className="flex items-center gap-3">
                  <Link to={`/login?redirect=${currentPath}`} className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90">
                    <LogIn className="h-4 w-4" />Sign In to Enroll
                  </Link>
                  <Link to={`/signup?redirect=${currentPath}`} className="inline-flex items-center gap-2 rounded-lg border border-primary px-6 py-3 font-semibold text-primary hover:bg-primary/5">
                    <UserPlus className="h-4 w-4" />Sign Up
                  </Link>
                </div>
              ) : (
                <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90">
                  <GraduationCap className="h-4 w-4" />{t('course.enroll', language)}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Progress overview for enrolled users */}
      {enrolled && (
        <div className="mx-auto max-w-3xl px-6 md:px-12 -mt-4 relative z-20">
          <div className="rounded-xl border border-border/50 bg-card p-5 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-foreground mb-2">Your Progress</h3>
                <CourseProgressBar completed={completedIds.size} total={totalLessons} />
              </div>
              {resumeLesson && !completedIds.has(resumeLesson.id) && (
                <Link
                  to={`/course/${course.slug}/lesson/${resumeLesson.id}`}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary/10 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/20 transition-colors flex-shrink-0"
                >
                  Continue <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Module accordion */}
      <div className="mx-auto max-w-3xl px-6 py-10 md:px-12">
        <h2 className="mb-6 font-heading text-xl font-bold text-foreground">Course Content</h2>
        <div className="space-y-3">
          {modules.map((mod, mi) => {
            if (!mod) return null;
            return <ModuleAccordion key={mod.id} mod={mod} mi={mi} db={db} course={course} language={language} completedIds={completedIds} resumeLessonId={resumeLesson?.id} defaultOpen={mi === 0} />;
          })}
        </div>
      </div>
    </PublicLayout>
  );
};

function ModuleAccordion({ mod, mi, db, course, language, completedIds, resumeLessonId, defaultOpen }: {
  mod: any; mi: number; db: any; course: any; language: any; completedIds: Set<string>; resumeLessonId?: string; defaultOpen: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const modTr = getTranslation(mod.translations, language) as { title?: string } | undefined;
  const lessons = mod.lessonIds.map((id: string) => db.lessons.byId[id]).filter(Boolean);
  const doneLessons = lessons.filter((l: any) => completedIds.has(l.id)).length;

  return (
    <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
      <button onClick={() => setOpen(!open)} className="flex w-full items-center justify-between p-5 text-left">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground">Module {mi + 1}</span>
            <span className="text-xs text-muted-foreground">· {doneLessons}/{lessons.length} completed</span>
          </div>
          <h3 className="font-heading text-base font-semibold text-foreground">{modTr?.title ?? 'Untitled'}</h3>
          <div className="mt-2 max-w-[200px]">
            <CourseProgressBar completed={doneLessons} total={lessons.length} showLabel={false} />
          </div>
        </div>
        {open ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
      </button>
      {open && (
        <div className="border-t border-border/50 px-5 pb-4 pt-2 animate-fade-in">
          {lessons.map((lesson: any, li: number) => {
            const lTr = getTranslation(lesson.translations, language) as { title?: string; summary?: string } | undefined;
            const isDone = completedIds.has(lesson.id);
            const isResume = lesson.id === resumeLessonId;
            const video = lesson.videoId ? db.videos.byId[lesson.videoId] : undefined;
            const duration = video?.durationSeconds;

            return (
              <Link key={lesson.id} to={`/course/${course.slug}/lesson/${lesson.id}`} className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-secondary ${isResume ? 'bg-primary/5 border border-primary/20' : 'text-foreground'}`}>
                <span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold flex-shrink-0 ${
                  isDone ? 'bg-emerald-500/20 text-emerald-500' : 'bg-primary/10 text-primary'
                }`}>
                  {isDone ? <CheckCircle2 className="h-4 w-4" /> : li + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <span className="line-clamp-1">{lTr?.title ?? 'Untitled'}</span>
                  {isResume && <span className="text-[10px] font-medium text-primary">▶ Resume here</span>}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground flex-shrink-0">
                  {duration && (
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {Math.floor(duration / 60)}m
                    </span>
                  )}
                  {lesson.type === 'video' && <Play className="h-3 w-3" />}
                  {lesson.type === 'text' && <BookOpen className="h-3 w-3" />}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default CourseLandingPage;

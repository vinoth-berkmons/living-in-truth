import { useParams, Link } from 'react-router-dom';
import { getDB, updateDB } from '@/lib/db';
import { PublicLayout } from '@/components/PublicLayout';
import { useAuthStore } from '@/stores';
import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslation, t } from '@/lib/i18n';
import { VideoPlayer } from '@/components/VideoPlayer';
import { canAccessItem } from '@/lib/rbac';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { LogIn, UserPlus, CheckCircle2, ChevronRight, Clock, ArrowLeft, ArrowRight } from 'lucide-react';
import { LessonSidebar } from '@/components/LessonSidebar';
import { LessonQA } from '@/components/LessonQA';
import { useState, useCallback } from 'react';

const LessonPage = () => {
  const { courseSlug, lessonId } = useParams<{ courseSlug: string; lessonId: string }>();
  const workspace = useWorkspace();
  const { language } = useLanguage();
  const { session } = useAuthStore();
  const [renderKey, forceRender] = useState(0);

  const handleMarkComplete = useCallback(() => {
    if (!session || !lessonId) return;
    const db = getDB();
    if (!db) return;
    const courseEntryId = db.courses.slugIndex[workspace.id]?.[courseSlug!];
    if (!courseEntryId) return;
    updateDB(currentDb => {
      const progressArr = [...currentDb.progress];
      let entry = progressArr.find(p => p.userId === session.userId && p.courseId === courseEntryId);
      if (!entry) {
        entry = {
          userId: session.userId,
          workspaceId: workspace.id,
          courseId: courseEntryId,
          enrolledAt: new Date().toISOString(),
          completedLessonIds: [],
          videoPositions: {},
        };
        progressArr.push(entry);
      }
      const ids = new Set(entry.completedLessonIds);
      if (ids.has(lessonId)) {
        ids.delete(lessonId);
      } else {
        ids.add(lessonId);
      }
      entry.completedLessonIds = [...ids];
      return { ...currentDb, progress: progressArr };
    });
    forceRender(n => n + 1);
  }, [session, courseSlug, lessonId, workspace.id]);

  const db = getDB();
  if (!db) return null;

  const courseEntryId = db.courses.slugIndex[workspace.id]?.[courseSlug!];
  const course = courseEntryId ? db.courses.byId[courseEntryId] : undefined;
  const lesson = lessonId ? db.lessons.byId[lessonId] : undefined;
  if (!course || !lesson) return <div className="flex min-h-screen items-center justify-center bg-background"><p>Lesson not found</p></div>;

  const lTr = getTranslation(lesson.translations, language) as { title?: string; summary?: string } | undefined;
  const cTr = getTranslation(course.translations, language) as { title?: string } | undefined;
  const hasAccess = canAccessItem(session?.userId, course);

  const modules = course.moduleIds.map(id => db.modules.byId[id]).filter(Boolean);
  const allLessons = modules.flatMap(m => m!.lessonIds.map(id => db.lessons.byId[id]).filter(Boolean));
  const currentModule = modules.find(m => m!.lessonIds.includes(lessonId!));
  const modTr = currentModule ? getTranslation(currentModule.translations, language) as { title?: string } | undefined : undefined;

  const progress = session ? db.progress.find(p => p.userId === session.userId && p.courseId === course.id) : undefined;
  const completedIds = new Set(progress?.completedLessonIds ?? []);
  const isCompleted = completedIds.has(lessonId!);
  const currentPath = `/course/${courseSlug}/lesson/${lessonId}`;

  const video = lesson.videoId ? db.videos.byId[lesson.videoId] : undefined;
  const duration = video?.durationSeconds;

  const idx = allLessons.findIndex(l => l?.id === lessonId);
  const prevLesson = idx > 0 ? allLessons[idx - 1] : null;
  const nextLesson = idx < allLessons.length - 1 ? allLessons[idx + 1] : null;
  const prevTr = prevLesson ? getTranslation(prevLesson.translations, language) as { title?: string } | undefined : undefined;
  const nextTr = nextLesson ? getTranslation(nextLesson.translations, language) as { title?: string } | undefined : undefined;

  return (
    <PublicLayout>
      <div className="container mx-auto grid gap-8 px-6 py-8 lg:grid-cols-4">
        {/* Sidebar */}
        <div className="order-2 lg:order-1 lg:col-span-1">
          <LessonSidebar
            course={course}
            db={db}
            language={language}
            activeLessonId={lessonId!}
            completedIds={completedIds}
            hasAccess={hasAccess}
          />
        </div>

        {/* Main content */}
        <div className="order-1 lg:order-2 lg:col-span-3">
          {/* Breadcrumb */}
          <nav className="mb-4 flex items-center gap-1 text-xs text-muted-foreground">
            <Link to={`/course/${course.slug}`} className="hover:text-primary transition-colors">{cTr?.title ?? 'Course'}</Link>
            <ChevronRight className="h-3 w-3" />
            {modTr && <><span>{modTr.title}</span><ChevronRight className="h-3 w-3" /></>}
            <span className="text-foreground font-medium">{lTr?.title ?? 'Untitled'}</span>
          </nav>

          {/* Lesson header */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="font-heading text-2xl font-bold text-foreground">{lTr?.title ?? 'Untitled'}</h1>
              {lTr?.summary && <p className="mt-2 text-muted-foreground">{lTr.summary}</p>}
            </div>
            {duration && (
              <span className="flex items-center gap-1 rounded-lg bg-secondary px-2.5 py-1 text-xs font-medium text-muted-foreground flex-shrink-0">
                <Clock className="h-3 w-3" />
                {Math.floor(duration / 60)}m {duration % 60}s
              </span>
            )}
          </div>

          {!hasAccess ? (
            <div className="mt-6 rounded-lg border border-border bg-secondary p-8 text-center">
              <p className="font-heading text-lg font-semibold text-foreground">{t('common.premium', language)} Course</p>
              {!session ? (
                <div className="mt-4 flex flex-col items-center gap-2 sm:flex-row sm:justify-center">
                  <Link to={`/login?redirect=${currentPath}`} className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2 text-sm font-medium text-primary-foreground">
                    <LogIn className="h-4 w-4" />Sign In
                  </Link>
                  <Link to={`/signup?redirect=${currentPath}`} className="inline-flex items-center gap-2 rounded-lg border border-primary px-6 py-2 text-sm font-medium text-primary">
                    <UserPlus className="h-4 w-4" />Sign Up
                  </Link>
                </div>
              ) : (
                <Link to="/pricing" className="mt-3 inline-block rounded-lg bg-primary px-6 py-2 text-sm font-medium text-primary-foreground">Upgrade</Link>
              )}
            </div>
          ) : (
            <div className="mt-6">
              {lesson.videoId && db.videos.byId[lesson.videoId] && (
                <VideoPlayer source={db.videos.byId[lesson.videoId].source} format={db.videos.byId[lesson.videoId].format} />
              )}
              {lesson.contentId && db.content.byId[lesson.contentId] && (
                <div className="prose mt-4 max-w-none text-foreground" dangerouslySetInnerHTML={{ __html: (getTranslation(db.content.byId[lesson.contentId].translations, language) as { bodyHtml?: string } | undefined)?.bodyHtml ?? '' }} />
              )}

              {/* Mark as Complete */}
              {session && (
                <div className="mt-6">
                  <button
                    onClick={handleMarkComplete}
                    className={`inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition-all ${
                      isCompleted
                        ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 hover:bg-emerald-500/20'
                        : 'bg-primary text-primary-foreground hover:bg-primary/90'
                    }`}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    {isCompleted ? 'Completed ✓' : 'Mark as Complete'}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Next/Prev */}
          <div className="mt-8 flex justify-between gap-4">
            {prevLesson ? (
              <Link to={`/course/${course.slug}/lesson/${prevLesson.id}`} className="flex items-center gap-2 rounded-lg border border-border/50 bg-card px-4 py-3 text-sm text-foreground hover:bg-secondary transition-colors group">
                <ArrowLeft className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                <div className="text-left">
                  <span className="text-[10px] text-muted-foreground">Previous</span>
                  <p className="font-medium line-clamp-1">{prevTr?.title ?? 'Previous'}</p>
                </div>
              </Link>
            ) : <span />}
            {nextLesson ? (
              <Link to={`/course/${course.slug}/lesson/${nextLesson.id}`} className="flex items-center gap-2 rounded-lg border border-border/50 bg-card px-4 py-3 text-sm text-foreground hover:bg-secondary transition-colors group ml-auto">
                <div className="text-right">
                  <span className="text-[10px] text-muted-foreground">Next</span>
                  <p className="font-medium line-clamp-1">{nextTr?.title ?? 'Next'}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </Link>
            ) : <span />}
          </div>

          {/* Q&A */}
          {hasAccess && <LessonQA />}
        </div>
      </div>
    </PublicLayout>
  );
};

export default LessonPage;

import { useParams, Link } from 'react-router-dom';
import { getDB } from '@/lib/db';
import { PublicLayout } from '@/components/PublicLayout';
import { useLanguageStore, useAuthStore } from '@/stores';
import { getTranslation, t } from '@/lib/i18n';
import { VideoPlayer } from '@/components/VideoPlayer';
import { canAccessItem } from '@/lib/rbac';

const LessonPage = () => {
  const { workspaceSlug, courseSlug, lessonId } = useParams<{ workspaceSlug: string; courseSlug: string; lessonId: string }>();
  const { language } = useLanguageStore();
  const { session } = useAuthStore();
  const db = getDB();
  const workspace = db ? Object.values(db.workspaces.byId).find(w => w.slug === workspaceSlug && w.status === 'active') : undefined;
  if (!workspace || !db) return <div className="flex min-h-screen items-center justify-center bg-background"><p>{t('site.unavailable', language)}</p></div>;

  const courseEntryId = db.courses.slugIndex[workspace.id]?.[courseSlug!];
  const course = courseEntryId ? db.courses.byId[courseEntryId] : undefined;
  const lesson = lessonId ? db.lessons.byId[lessonId] : undefined;
  if (!course || !lesson) return <div className="flex min-h-screen items-center justify-center bg-background"><p>Lesson not found</p></div>;

  const lTr = getTranslation(lesson.translations, language);
  const cTr = getTranslation(course.translations, language);
  const hasAccess = canAccessItem(session?.userId, course);

  // Sidebar nav — all lessons
  const modules = course.moduleIds.map(id => db.modules.byId[id]).filter(Boolean);
  const allLessons = modules.flatMap(m => m!.lessonIds.map(id => db.lessons.byId[id]).filter(Boolean));

  // Progress
  const progress = session ? db.progress.find(p => p.userId === session.userId && p.courseId === course.id) : undefined;
  const completedIds = new Set(progress?.completedLessonIds ?? []);

  return (
    <PublicLayout workspace={workspace}>
      <div className="container mx-auto grid gap-8 px-6 py-8 lg:grid-cols-4">
        {/* Sidebar */}
        <div className="order-2 lg:order-1 lg:col-span-1">
          <Link to={`/w/${workspace.slug}/course/${course.slug}`} className="text-sm text-primary hover:underline">← {cTr?.title ?? 'Course'}</Link>
          <nav className="mt-4 space-y-1">
            {allLessons.map((l, i) => {
              if (!l) return null;
              const lt = getTranslation(l.translations, language);
              const isActive = l.id === lessonId;
              const isDone = completedIds.has(l.id);
              return (
                <Link key={l.id} to={`/w/${workspace.slug}/course/${course.slug}/lesson/${l.id}`} className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${isActive ? 'bg-primary/10 font-medium text-primary' : 'text-foreground hover:bg-secondary'}`}>
                  <span className={`flex h-5 w-5 items-center justify-center rounded-full text-xs ${isDone ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                    {isDone ? '✓' : i + 1}
                  </span>
                  <span className="line-clamp-1">{lt?.title ?? 'Untitled'}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Main content */}
        <div className="order-1 lg:order-2 lg:col-span-3">
          <h1 className="font-heading text-2xl font-bold text-foreground">{lTr?.title ?? 'Untitled'}</h1>
          {lTr?.summary && <p className="mt-2 text-muted-foreground">{lTr.summary}</p>}

          {!hasAccess ? (
            <div className="mt-6 rounded-lg border border-border bg-secondary p-8 text-center">
              <p className="font-heading text-lg font-semibold text-foreground">{t('common.premium', language)} Course</p>
              <Link to={`/w/${workspace.slug}/pricing`} className="mt-3 inline-block rounded-lg bg-primary px-6 py-2 text-sm font-medium text-primary-foreground">Subscribe</Link>
            </div>
          ) : (
            <div className="mt-6">
              {/* Video lesson */}
              {lesson.videoId && db.videos.byId[lesson.videoId] && (
                <VideoPlayer source={db.videos.byId[lesson.videoId].source} format={db.videos.byId[lesson.videoId].format} />
              )}
              {/* Text lesson */}
              {lesson.contentId && db.content.byId[lesson.contentId] && (
                <div className="prose mt-4 max-w-none text-foreground" dangerouslySetInnerHTML={{ __html: getTranslation(db.content.byId[lesson.contentId].translations, language)?.bodyHtml ?? '' }} />
              )}
            </div>
          )}

          {/* Next/Prev */}
          <div className="mt-8 flex justify-between">
            {(() => {
              const idx = allLessons.findIndex(l => l?.id === lessonId);
              const prev = idx > 0 ? allLessons[idx - 1] : null;
              const next = idx < allLessons.length - 1 ? allLessons[idx + 1] : null;
              return (
                <>
                  {prev ? <Link to={`/w/${workspace.slug}/course/${course.slug}/lesson/${prev!.id}`} className="text-sm text-primary hover:underline">← Previous</Link> : <span />}
                  {next ? <Link to={`/w/${workspace.slug}/course/${course.slug}/lesson/${next!.id}`} className="text-sm text-primary hover:underline">Next →</Link> : <span />}
                </>
              );
            })()}
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default LessonPage;

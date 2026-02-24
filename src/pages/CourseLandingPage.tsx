import { useParams, Link } from 'react-router-dom';
import { getDB } from '@/lib/db';
import { PublicLayout } from '@/components/PublicLayout';
import { useLanguageStore, useAuthStore } from '@/stores';
import { getTranslation, t } from '@/lib/i18n';

const CourseLandingPage = () => {
  const { workspaceSlug, courseSlug } = useParams<{ workspaceSlug: string; courseSlug: string }>();
  const { language } = useLanguageStore();
  const { session } = useAuthStore();
  const db = getDB();
  const workspace = db ? Object.values(db.workspaces.byId).find(w => w.slug === workspaceSlug && w.status === 'active') : undefined;
  if (!workspace || !db) return <div className="flex min-h-screen items-center justify-center bg-background"><p>{t('site.unavailable', language)}</p></div>;

  const courseId = db.courses.slugIndex[workspace.id]?.[courseSlug!];
  const course = courseId ? db.courses.byId[courseId] : undefined;
  if (!course) return <div className="flex min-h-screen items-center justify-center bg-background"><p>Course not found</p></div>;

  const tr = getTranslation(course.translations, language);
  const modules = course.moduleIds.map(id => db.modules.byId[id]).filter(Boolean);

  const enrolled = session ? db.progress.some(p => p.userId === session.userId && p.courseId === course.id) : false;

  return (
    <PublicLayout workspace={workspace}>
      <div className="container mx-auto max-w-3xl px-6 py-8">
        <Link to={`/w/${workspace.slug}/courses`} className="text-sm text-primary hover:underline">← Back to courses</Link>
        <div className="mt-4 flex items-center gap-2">
          <span className="rounded bg-primary/10 px-2 py-1 text-xs font-medium uppercase text-primary">{course.access}</span>
        </div>
        <h1 className="mt-4 font-heading text-3xl font-bold text-foreground">{tr?.title ?? 'Untitled'}</h1>
        {tr?.description && <p className="mt-3 text-lg text-muted-foreground">{tr.description}</p>}

        {enrolled ? (
          <Link to={`/w/${workspace.slug}/course/${course.slug}/lesson/${modules[0]?.lessonIds[0] || ''}`} className="mt-6 inline-block rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground hover:bg-primary/90">
            {t('course.continue', language)}
          </Link>
        ) : (
          <button className="mt-6 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground hover:bg-primary/90">
            {t('course.enroll', language)}
          </button>
        )}

        {/* Module list */}
        <div className="mt-10 space-y-6">
          {modules.map((mod, mi) => {
            if (!mod) return null;
            const modTr = getTranslation(mod.translations, language);
            const lessons = mod.lessonIds.map(id => db.lessons.byId[id]).filter(Boolean);
            return (
              <div key={mod.id} className="rounded-lg border border-border bg-card p-5">
                <h3 className="font-heading text-lg font-semibold text-foreground">Module {mi + 1}: {modTr?.title ?? 'Untitled'}</h3>
                <ul className="mt-3 space-y-2">
                  {lessons.map((lesson, li) => {
                    if (!lesson) return null;
                    const lTr = getTranslation(lesson.translations, language);
                    return (
                      <li key={lesson.id}>
                        <Link to={`/w/${workspace.slug}/course/${course.slug}/lesson/${lesson.id}`} className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-foreground hover:bg-secondary">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">{li + 1}</span>
                          <span>{lTr?.title ?? 'Untitled'}</span>
                          <span className="ml-auto text-xs text-muted-foreground">{lesson.type}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </PublicLayout>
  );
};

export default CourseLandingPage;

import { useParams, Link } from 'react-router-dom';
import { getDB } from '@/lib/db';
import { PublicLayout } from '@/components/PublicLayout';
import { useLanguageStore } from '@/stores';
import { getTranslation, t } from '@/lib/i18n';

const CoursesPage = () => {
  const { workspaceSlug } = useParams<{ workspaceSlug: string }>();
  const { language } = useLanguageStore();
  const db = getDB();
  const workspace = db ? Object.values(db.workspaces.byId).find(w => w.slug === workspaceSlug && w.status === 'active') : undefined;
  if (!workspace || !db) return <div className="flex min-h-screen items-center justify-center bg-background"><p>{t('site.unavailable', language)}</p></div>;

  const courses = Object.values(db.courses.byId).filter(c => c.workspaceId === workspace.id && c.status === 'published');

  return (
    <PublicLayout workspace={workspace}>
      <div className="container mx-auto px-6 py-8">
        <h1 className="font-heading text-3xl font-bold text-foreground">{t('nav.courses', language)}</h1>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map(course => {
            const tr = getTranslation(course.translations, language);
            const moduleCount = course.moduleIds.length;
            return (
              <Link key={course.id} to={`/w/${workspace.slug}/course/${course.slug}`} className="group rounded-lg border border-border bg-card p-6 transition-all hover:border-primary hover:shadow-md">
                <span className="text-xs font-medium uppercase text-primary">{course.access === 'premium' ? t('common.premium', language) : t('common.free', language)}</span>
                <h2 className="mt-2 font-heading text-xl font-semibold text-foreground">{tr?.title ?? 'Untitled'}</h2>
                {tr?.description && <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{tr.description}</p>}
                <p className="mt-3 text-xs text-muted-foreground">{moduleCount} module{moduleCount !== 1 ? 's' : ''}</p>
              </Link>
            );
          })}
          {courses.length === 0 && <p className="col-span-full text-muted-foreground">No courses available yet.</p>}
        </div>
      </div>
    </PublicLayout>
  );
};

export default CoursesPage;

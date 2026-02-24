import { Link } from 'react-router-dom';
import { getDB } from '@/lib/db';
import { PublicLayout } from '@/components/PublicLayout';
import { useLanguageStore } from '@/stores';
import { getTranslation, t } from '@/lib/i18n';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { GraduationCap, Crown } from 'lucide-react';

const CoursesPage = () => {
  const workspace = useWorkspace();
  const { language } = useLanguageStore();
  const db = getDB();
  if (!db) return null;

  const courses = Object.values(db.courses.byId).filter(c => c.workspaceId === workspace.id && c.status === 'published');

  return (
    <PublicLayout>
      <div className="px-6 py-10 md:px-12">
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold text-foreground md:text-4xl">{t('nav.courses', language)}</h1>
          <p className="mt-2 text-base text-muted-foreground">Learn at your own pace with structured courses.</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map(course => {
            const tr = getTranslation(course.translations, language);
            const moduleCount = course.moduleIds.length;
            const lessonCount = course.moduleIds.reduce((acc, mid) => acc + (db.modules.byId[mid]?.lessonIds.length ?? 0), 0);
            const firstModId = course.moduleIds[0];
            const firstMod = firstModId ? db.modules.byId[firstModId] : undefined;
            const firstLessonId = firstMod?.lessonIds[0];
            const firstLesson = firstLessonId ? db.lessons.byId[firstLessonId] : undefined;
            const coverVideo = firstLesson?.videoId ? db.videos.byId[firstLesson.videoId] : undefined;
            const coverUrl = coverVideo?.coverImageUrl ?? 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=800&q=80';

            return (
              <Link key={course.id} to={`/course/${course.slug}`} className="group overflow-hidden rounded-xl border border-border/50 bg-card transition-all hover:border-primary/30 hover:shadow-lg hover:-translate-y-1">
                <div className="relative aspect-video overflow-hidden bg-secondary">
                  <img src={coverUrl} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="rounded-full bg-primary p-3"><GraduationCap className="h-5 w-5 text-primary-foreground" /></div>
                  </div>
                  {course.access === 'premium' && (
                    <div className="absolute left-2 top-2 flex items-center gap-1 rounded bg-accent/90 px-1.5 py-0.5 text-xs font-semibold text-accent-foreground">
                      <Crown className="h-3 w-3" />{t('common.premium', language)}
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <div className="mb-1 flex items-center gap-1 text-xs font-medium text-primary">
                    <GraduationCap className="h-3 w-3" />Course
                  </div>
                  <h2 className="font-heading text-lg font-bold text-foreground">{tr?.title ?? 'Untitled'}</h2>
                  {tr?.description && <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">{tr.description}</p>}
                  <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{moduleCount} module{moduleCount !== 1 ? 's' : ''}</span>
                    <span>·</span>
                    <span>{lessonCount} lesson{lessonCount !== 1 ? 's' : ''}</span>
                  </div>
                </div>
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

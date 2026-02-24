import { Link } from 'react-router-dom';
import { getDB } from '@/lib/db';
import { PublicLayout } from '@/components/PublicLayout';
import { HeroCarousel } from '@/components/HeroCarousel';
import { ContentRail, type MediaCardData } from '@/components/ContentRail';
import { useLanguageStore } from '@/stores';
import { getTranslation } from '@/lib/i18n';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import type { HomeSection, Language } from '@/types/entities';
import type { AppDatabase } from '@/types/db';

const WorkspaceHome = () => {
  const workspace = useWorkspace();
  const { language } = useLanguageStore();
  const db = getDB();
  if (!db) return null;

  const sectionIds = db.homeSections.orderByWorkspaceId[workspace.id] || [];
  const sections = sectionIds.map(id => db.homeSections.byId[id]).filter(Boolean) as HomeSection[];

  const categories = Object.values(db.categories.byId).filter(c => c.workspaceId === workspace.id);

  return (
    <PublicLayout>
      {sections.map(section => {
        if (section.type === 'hero_slider' && section.itemRefs) {
          return (
            <HeroCarousel
              key={section.id}
              itemRefs={section.itemRefs}
              db={db}
              language={language}
            />
          );
        }

        if (section.type === 'rail') {
          const title = getTranslation(section.titleTranslations, language) ?? 'Untitled';
          const railItems = getRailItems(section, db, workspace, language);
          const isShorts = section.filter?.format === 'short';

          return (
            <ContentRail
              key={section.id}
              title={title}
              items={railItems}
              language={language}
              isShorts={isShorts}
              viewAllHref="/explore"
            />
          );
        }
        return null;
      })}

      {/* Categories / Browse All section */}
      {categories.length > 0 && (
        <section className="px-6 py-8 md:px-12">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-heading text-xl font-bold text-foreground md:text-2xl">Browse Categories</h2>
            <Link to="/explore" className="text-sm font-medium text-primary hover:underline">
              View All →
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {categories.map(cat => {
              const tr = getTranslation(cat.translations, language);
              return (
                <Link
                  key={cat.id}
                  to={`/category/${cat.slug}`}
                  className="group rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/50 hover:shadow-md"
                >
                  <h3 className="font-heading text-base font-semibold text-foreground">{tr?.title ?? cat.slug}</h3>
                  {tr?.description && <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{tr.description}</p>}
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {sections.length === 0 && (
        <div className="py-24 text-center">
          <p className="text-muted-foreground">No content configured yet.</p>
        </div>
      )}
    </PublicLayout>
  );
};

function getRailItems(section: HomeSection, db: AppDatabase, workspace: { id: string; slug: string }, lang: Language): MediaCardData[] {
  const results: MediaCardData[] = [];
  const filter = section.filter;

  const title = getTranslation(section.titleTranslations, lang)?.toLowerCase() ?? '';
  if (title.includes('course')) {
    const courses = Object.values(db.courses.byId).filter(c =>
      c.workspaceId === workspace.id && c.status === 'published'
    );
    for (const course of courses) {
      const tr = getTranslation(course.translations, lang);
      const firstModId = course.moduleIds[0];
      const firstMod = firstModId ? db.modules.byId[firstModId] : undefined;
      const firstLessonId = firstMod?.lessonIds[0];
      const firstLesson = firstLessonId ? db.lessons.byId[firstLessonId] : undefined;
      const coverVideo = firstLesson?.videoId ? db.videos.byId[firstLesson.videoId] : undefined;
      results.push({
        id: course.id, title: tr?.title ?? 'Untitled', excerpt: tr?.description,
        coverImageUrl: coverVideo?.coverImageUrl ?? 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=800&q=80',
        href: `/course/${course.slug}`,
        type: 'course', access: course.access, moduleCount: course.moduleIds.length,
      });
    }
    return results;
  }

  if (!filter?.format) {
    const items = Object.values(db.content.byId).filter(c => {
      if (c.workspaceId !== workspace.id || c.status !== 'published') return false;
      if (filter?.categoryId && !c.categoryIds.includes(filter.categoryId)) return false;
      if (filter?.type && c.type !== filter.type) return false;
      return true;
    });
    for (const item of items) {
      const tr = getTranslation(item.translations, lang);
      results.push({
        id: item.id, title: tr?.title ?? 'Untitled', excerpt: tr?.excerpt,
        coverImageUrl: item.coverImageUrl, href: `/read/${item.slug}`,
        type: item.type, access: item.access,
      });
    }
  }

  if (!filter?.type) {
    const vids = Object.values(db.videos.byId).filter(v => {
      if (v.workspaceId !== workspace.id || v.status !== 'published') return false;
      if (filter?.categoryId && !v.categoryIds.includes(filter.categoryId)) return false;
      if (filter?.format && v.format !== filter.format) return false;
      return true;
    });
    for (const item of vids) {
      const tr = getTranslation(item.translations, lang);
      results.push({
        id: item.id, title: tr?.title ?? 'Untitled', excerpt: tr?.description,
        coverImageUrl: item.coverImageUrl, href: `/watch/${item.slug}`,
        type: 'video', format: item.format, access: item.access, durationSeconds: item.durationSeconds,
      });
    }
  }

  return results;
}

export default WorkspaceHome;

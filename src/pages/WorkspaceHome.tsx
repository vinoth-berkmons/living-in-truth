import { useParams, Link } from 'react-router-dom';
import { getDB } from '@/lib/db';
import { PublicLayout } from '@/components/PublicLayout';
import { HeroCarousel } from '@/components/HeroCarousel';
import { ContentRail, type MediaCardData } from '@/components/ContentRail';
import { useLanguageStore } from '@/stores';
import { getTranslation } from '@/lib/i18n';
import type { Workspace, HomeSection, Language } from '@/types/entities';
import type { AppDatabase } from '@/types/db';

const WorkspaceHome = () => {
  const { workspaceSlug } = useParams<{ workspaceSlug: string }>();
  const { language } = useLanguageStore();
  const db = getDB();
  const workspace = db ? Object.values(db.workspaces.byId).find(w => w.slug === workspaceSlug && w.status === 'active') : undefined;

  if (!workspace) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="font-heading text-3xl font-bold text-foreground">Site Unavailable</h1>
          <p className="mt-2 text-muted-foreground">This workspace is not available.</p>
          <a href="/" className="mt-6 inline-block text-primary hover:underline">← Back to workspaces</a>
        </div>
      </div>
    );
  }

  const sectionIds = db?.homeSections.orderByWorkspaceId[workspace.id] || [];
  const sections = sectionIds.map(id => db?.homeSections.byId[id]).filter(Boolean) as HomeSection[];

  // Categories grid for "Browse All" section
  const categories = Object.values(db!.categories.byId).filter(c => c.workspaceId === workspace.id);

  return (
    <PublicLayout workspace={workspace}>
      {sections.map(section => {
        if (section.type === 'hero_slider' && section.itemRefs) {
          return (
            <HeroCarousel
              key={section.id}
              itemRefs={section.itemRefs}
              db={db!}
              workspace={workspace}
              language={language}
            />
          );
        }

        if (section.type === 'rail') {
          const title = getTranslation(section.titleTranslations, language) ?? 'Untitled';
          const railItems = getRailItems(section, db!, workspace, language);
          const isShorts = section.filter?.format === 'short';

          return (
            <ContentRail
              key={section.id}
              title={title}
              items={railItems}
              language={language}
              isShorts={isShorts}
              viewAllHref={`/w/${workspace.slug}/explore`}
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
            <Link to={`/w/${workspace.slug}/explore`} className="text-sm font-medium text-primary hover:underline">
              View All →
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {categories.map(cat => {
              const tr = getTranslation(cat.translations, language);
              return (
                <Link
                  key={cat.id}
                  to={`/w/${workspace.slug}/category/${cat.slug}`}
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

function getRailItems(section: HomeSection, db: AppDatabase, workspace: Workspace, lang: Language): MediaCardData[] {
  const results: MediaCardData[] = [];
  const filter = section.filter;

  // Check if this is a "Courses" rail by title
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
        href: `/w/${workspace.slug}/course/${course.slug}`,
        type: 'course', access: course.access, moduleCount: course.moduleIds.length,
      });
    }
    return results;
  }

  // Content items
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
        coverImageUrl: item.coverImageUrl, href: `/w/${workspace.slug}/read/${item.slug}`,
        type: item.type, access: item.access,
      });
    }
  }

  // Video items
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
        coverImageUrl: item.coverImageUrl, href: `/w/${workspace.slug}/watch/${item.slug}`,
        type: 'video', format: item.format, access: item.access, durationSeconds: item.durationSeconds,
      });
    }
  }

  return results;
}

export default WorkspaceHome;

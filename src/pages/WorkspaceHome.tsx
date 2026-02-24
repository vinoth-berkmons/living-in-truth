import { Link } from 'react-router-dom';
import { getDB } from '@/lib/db';
import { PublicLayout } from '@/components/PublicLayout';
import { HeroCarousel } from '@/components/HeroCarousel';
import { ContentRail, type MediaCardData } from '@/components/ContentRail';
import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslation } from '@/lib/i18n';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import type { HomeSection, Language } from '@/types/entities';
import type { AppDatabase } from '@/types/db';
import { Skeleton } from '@/components/ui/skeleton';
import { useEffect, useRef, useState } from 'react';

const WorkspaceHome = () => {
  const workspace = useWorkspace();
  const { language } = useLanguage();
  const db = getDB();
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsInitialLoading(false), 700);
    return () => clearTimeout(timer);
  }, []);

  if (!db) {
    return (
      <PublicLayout>
        <HomeLoadingSkeleton />
      </PublicLayout>
    );
  }

  const sectionIds = db.homeSections.orderByWorkspaceId[workspace.id] || [];
  const sections = sectionIds.map(id => db.homeSections.byId[id]).filter(Boolean) as HomeSection[];
  const categories = Object.values(db.categories.byId).filter(c => c.workspaceId === workspace.id);

  if (isInitialLoading) {
    return (
      <PublicLayout>
        <HomeLoadingSkeleton />
      </PublicLayout>
    );
  }

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
        <CategoriesSection categories={categories} language={language} />
      )}

      {sections.length === 0 && (
        <div className="py-24 text-center">
          <p className="text-muted-foreground">No content configured yet.</p>
        </div>
      )}
    </PublicLayout>
  );
};

function HomeLoadingSkeleton() {
  return (
    <div className="space-y-8 px-6 py-6 md:px-12">
      <section className="relative overflow-hidden rounded-2xl border border-border/40 bg-card/60 p-6 md:p-10">
        <div className="space-y-4 max-w-2xl">
          <Skeleton className="h-5 w-32 rounded-full" />
          <Skeleton className="h-10 w-full md:h-14" />
          <Skeleton className="h-10 w-5/6 md:h-14" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
          <div className="flex gap-3 pt-2">
            <Skeleton className="h-11 w-36 rounded-xl" />
            <Skeleton className="h-11 w-32 rounded-xl" />
          </div>
        </div>
      </section>

      {[0, 1].map((rail) => (
        <section key={rail} className="space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-6 w-20" />
          </div>
          <div className="flex gap-4 overflow-hidden">
            {[0, 1, 2, 3].map((card) => (
              <div key={card} className="min-w-[220px] space-y-3 md:min-w-[280px]">
                <Skeleton className="aspect-video w-full rounded-xl" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function CategoriesSection({ categories, language }: { categories: any[]; language: Language }) {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsVisible(true); observer.unobserve(el); } },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`px-6 py-10 md:px-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
    >
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-heading text-xl font-bold text-foreground md:text-2xl tracking-tight">Browse Categories</h2>
        <Link to="/explore" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors duration-300">
          View All →
        </Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {categories.map((cat: any, i: number) => {
          const tr = getTranslation(cat.translations, language) as { title?: string; description?: string } | undefined;
          return (
            <Link
              key={cat.id}
              to={`/category/${cat.slug}`}
              className="card-lift card-glow group rounded-xl border border-border/50 bg-card p-6 transition-all duration-300"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <h3 className="font-heading text-base font-semibold text-foreground group-hover:text-primary transition-colors duration-300">{tr?.title ?? cat.slug}</h3>
              {tr?.description && <p className="mt-2 text-xs text-muted-foreground line-clamp-2">{tr.description}</p>}
              <span className="mt-3 inline-block text-xs font-medium text-primary opacity-0 transform translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                Explore →
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

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
        youtubeId: item.source.youtubeId,
      });
    }
  }

  return results;
}

export default WorkspaceHome;

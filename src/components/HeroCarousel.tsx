import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, BookOpen, GraduationCap, ChevronLeft, ChevronRight } from 'lucide-react';
import type { ItemRef } from '@/types/entities';
import type { AppDatabase } from '@/types/db';
import { getTranslation, t } from '@/lib/i18n';
import type { Language } from '@/types/entities';

interface HeroCarouselProps {
  itemRefs: ItemRef[];
  db: AppDatabase;
  language: Language;
}

export const HeroCarousel = ({ itemRefs, db, language }: HeroCarouselProps) => {
  const [current, setCurrent] = useState(0);
  const slides = itemRefs.map(ref => resolveHeroSlide(ref, db, language)).filter(Boolean) as HeroSlide[];

  if (slides.length === 0) return null;

  const slide = slides[current];
  const goTo = (i: number) => setCurrent((i + slides.length) % slides.length);

  return (
    <section className="relative h-[70vh] min-h-[480px] w-full overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-700"
        style={{ backgroundImage: `url(${slide.coverImageUrl})` }}
      />
      {/* Overlays */}
      <div className="hero-overlay absolute inset-0" />
      <div className="hero-overlay-side absolute inset-0" />

      {/* Content */}
      <div className="relative flex h-full items-end pb-16 md:pb-20">
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-2xl animate-fade-in">
            {/* Type badge */}
            <span className="mb-3 inline-flex items-center gap-1.5 rounded-md bg-primary/20 px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-primary backdrop-blur-sm">
              {slide.entityType === 'video' && <Play className="h-3 w-3" />}
              {slide.entityType === 'content' && <BookOpen className="h-3 w-3" />}
              {slide.entityType === 'course' && <GraduationCap className="h-3 w-3" />}
              {slide.entityType}
            </span>

            <h2 className="font-heading text-3xl font-bold leading-tight text-foreground md:text-5xl">
              {slide.title}
            </h2>
            {slide.excerpt && (
              <p className="mt-3 text-base text-muted-foreground line-clamp-2 md:text-lg">{slide.excerpt}</p>
            )}

            {/* CTAs */}
            <div className="mt-6 flex items-center gap-3">
              <Link
                to={slide.href}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:scale-105"
              >
                {slide.entityType === 'video' && <><Play className="h-4 w-4" />{t('common.watchNow', language)}</>}
                {slide.entityType === 'content' && <><BookOpen className="h-4 w-4" />{t('common.readNow', language)}</>}
                {slide.entityType === 'course' && <><GraduationCap className="h-4 w-4" />{t('common.startCourse', language)}</>}
              </Link>
              {slide.categoryHref && (
                <Link
                  to={slide.categoryHref}
                  className="rounded-lg border border-foreground/20 px-5 py-3 text-sm font-medium text-foreground backdrop-blur-sm transition-all hover:bg-foreground/10"
                >
                  {t('nav.explore', language)}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation arrows */}
      {slides.length > 1 && (
        <>
          <button onClick={() => goTo(current - 1)} className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-background/30 p-2 text-foreground backdrop-blur-sm transition-all hover:bg-background/60">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button onClick={() => goTo(current + 1)} className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-background/30 p-2 text-foreground backdrop-blur-sm transition-all hover:bg-background/60">
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      {/* Dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`h-1.5 rounded-full transition-all ${i === current ? 'w-8 bg-primary' : 'w-1.5 bg-foreground/30'}`}
            />
          ))}
        </div>
      )}
    </section>
  );
};

interface HeroSlide {
  entityType: 'video' | 'content' | 'course';
  title: string;
  excerpt?: string;
  coverImageUrl: string;
  href: string;
  categoryHref?: string;
}

function resolveHeroSlide(ref: ItemRef, db: AppDatabase, lang: Language): HeroSlide | null {
  const l = lang as any;
  if (ref.entityType === 'video') {
    const item = db.videos.byId[ref.id];
    if (!item) return null;
    const tr = getTranslation(item.translations, l);
    const catSlug = item.categoryIds[0] ? db.categories.byId[item.categoryIds[0]]?.slug : undefined;
    return {
      entityType: 'video', title: tr?.title ?? 'Untitled', excerpt: tr?.description,
      coverImageUrl: item.coverImageUrl, href: `/watch/${item.slug}`,
      categoryHref: catSlug ? `/category/${catSlug}` : undefined,
    };
  }
  if (ref.entityType === 'content') {
    const item = db.content.byId[ref.id];
    if (!item) return null;
    const tr = getTranslation(item.translations, l);
    const catSlug = item.categoryIds[0] ? db.categories.byId[item.categoryIds[0]]?.slug : undefined;
    return {
      entityType: 'content', title: tr?.title ?? 'Untitled', excerpt: tr?.excerpt,
      coverImageUrl: item.coverImageUrl, href: `/read/${item.slug}`,
      categoryHref: catSlug ? `/category/${catSlug}` : undefined,
    };
  }
  if (ref.entityType === 'course') {
    const item = db.courses.byId[ref.id];
    if (!item) return null;
    const tr = getTranslation(item.translations, l);
    const firstModId = item.moduleIds[0];
    const firstMod = firstModId ? db.modules.byId[firstModId] : undefined;
    const firstLessonId = firstMod?.lessonIds[0];
    const firstLesson = firstLessonId ? db.lessons.byId[firstLessonId] : undefined;
    const coverVideo = firstLesson?.videoId ? db.videos.byId[firstLesson.videoId] : undefined;
    return {
      entityType: 'course', title: tr?.title ?? 'Untitled', excerpt: tr?.description,
      coverImageUrl: coverVideo?.coverImageUrl ?? 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=800&q=80',
      href: `/course/${item.slug}`,
    };
  }
  return null;
}

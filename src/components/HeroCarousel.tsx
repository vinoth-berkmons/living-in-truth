import { useState, useEffect, useCallback } from 'react';
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
  const [isTransitioning, setIsTransitioning] = useState(false);

  const slides = itemRefs.map(ref => resolveHeroSlide(ref, db, language)).filter(Boolean) as HeroSlide[];

  const goTo = useCallback((i: number) => {
    if (isTransitioning || slides.length === 0) return;
    setIsTransitioning(true);
    setCurrent((i + slides.length) % slides.length);
    setTimeout(() => setIsTransitioning(false), 700);
  }, [isTransitioning, slides.length]);

  // Auto-advance
  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => goTo(current + 1), 6000);
    return () => clearInterval(timer);
  }, [current, slides.length, goTo]);

  if (slides.length === 0) return null;

  const slide = slides[current];

  return (
    <section className="relative h-[75vh] min-h-[500px] w-full overflow-hidden md:h-[80vh]">
      {/* Background images with Ken Burns */}
      {slides.map((s, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            i === current ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div
            className={`h-full w-full bg-cover bg-center ${i === current ? 'animate-hero-ken-burns' : ''}`}
            style={{ backgroundImage: `url(${s.coverImageUrl})` }}
          />
        </div>
      ))}

      {/* Overlays */}
      <div className="hero-overlay absolute inset-0" />
      <div className="hero-overlay-side absolute inset-0" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/30" />

      {/* Content */}
      <div className="relative flex h-full items-end pb-20 md:pb-24">
        <div className="container mx-auto px-6 md:px-12">
          <div key={current} className="max-w-2xl animate-fade-in-up">
            {/* Type badge */}
            <span className="mb-4 inline-flex items-center gap-1.5 rounded-xl bg-primary/15 px-3 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary backdrop-blur-md border border-primary/20">
              {slide.entityType === 'video' && <Play className="h-3 w-3" />}
              {slide.entityType === 'content' && <BookOpen className="h-3 w-3" />}
              {slide.entityType === 'course' && <GraduationCap className="h-3 w-3" />}
              {slide.entityType}
            </span>

            <h2 className="font-heading text-3xl font-bold leading-tight text-foreground text-shadow-hero md:text-5xl lg:text-6xl">
              {slide.title}
            </h2>
            {slide.excerpt && (
              <p className="mt-4 text-base text-muted-foreground line-clamp-2 md:text-lg max-w-xl">{slide.excerpt}</p>
            )}

            {/* CTAs */}
            <div className="mt-8 flex items-center gap-3">
              <Link to={slide.href} className="btn-premium">
                {slide.entityType === 'video' && <><Play className="h-4 w-4" />{t('common.watchNow', language)}</>}
                {slide.entityType === 'content' && <><BookOpen className="h-4 w-4" />{t('common.readNow', language)}</>}
                {slide.entityType === 'course' && <><GraduationCap className="h-4 w-4" />{t('common.startCourse', language)}</>}
              </Link>
              {slide.categoryHref && (
                <Link
                  to={slide.categoryHref}
                  className="rounded-xl border border-foreground/20 px-5 py-3 text-sm font-medium text-foreground backdrop-blur-md transition-all duration-300 hover:bg-foreground/10 hover:border-foreground/40"
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
          <button onClick={() => goTo(current - 1)} className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full glass p-3 text-foreground transition-all duration-300 hover:scale-110 hover:bg-primary/10 md:left-6">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button onClick={() => goTo(current + 1)} className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full glass p-3 text-foreground transition-all duration-300 hover:scale-110 hover:bg-primary/10 md:right-6">
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      {/* Progress dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 items-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className="relative h-1.5 overflow-hidden rounded-full transition-all duration-500"
              style={{ width: i === current ? '2rem' : '0.5rem' }}
            >
              <div className={`absolute inset-0 rounded-full transition-colors duration-300 ${i === current ? 'bg-primary' : 'bg-foreground/30'}`} />
            </button>
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
    return { entityType: 'video', title: tr?.title ?? 'Untitled', excerpt: tr?.description, coverImageUrl: item.coverImageUrl, href: `/watch/${item.slug}`, categoryHref: catSlug ? `/category/${catSlug}` : undefined };
  }
  if (ref.entityType === 'content') {
    const item = db.content.byId[ref.id];
    if (!item) return null;
    const tr = getTranslation(item.translations, l);
    const catSlug = item.categoryIds[0] ? db.categories.byId[item.categoryIds[0]]?.slug : undefined;
    return { entityType: 'content', title: tr?.title ?? 'Untitled', excerpt: tr?.excerpt, coverImageUrl: item.coverImageUrl, href: `/read/${item.slug}`, categoryHref: catSlug ? `/category/${catSlug}` : undefined };
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
    return { entityType: 'course', title: tr?.title ?? 'Untitled', excerpt: tr?.description, coverImageUrl: coverVideo?.coverImageUrl ?? 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=800&q=80', href: `/course/${item.slug}` };
  }
  return null;
}

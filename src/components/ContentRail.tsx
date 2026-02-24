import { useRef, useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Play, Clock, Crown, BookOpen } from 'lucide-react';
import type { Language } from '@/types/entities';
import { t } from '@/lib/i18n';

export interface MediaCardData {
  id: string;
  title: string;
  excerpt?: string;
  coverImageUrl?: string;
  href: string;
  type: 'video' | 'article' | 'blog' | 'course';
  format?: 'short' | 'long';
  access: 'free' | 'premium';
  durationSeconds?: number;
  moduleCount?: number;
  youtubeId?: string;
}

interface ContentRailProps {
  title: string;
  items: MediaCardData[];
  language: Language;
  viewAllHref?: string;
  isShorts?: boolean;
}

export const ContentRail = ({ title, items, language, viewAllHref, isShorts }: ContentRailProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  useEffect(() => { checkScroll(); }, [items]);

  // Intersection observer for scroll reveal
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsVisible(true); observer.unobserve(el); } },
      { threshold: 0.1, rootMargin: '50px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const scroll = (dir: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.75;
    el.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  if (items.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      className={`relative py-6 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
    >
      {/* Header */}
      <div className="mb-4 flex items-center justify-between px-6 md:px-12">
        <h2 className="font-heading text-xl font-bold text-foreground md:text-2xl tracking-tight">{title}</h2>
        <div className="flex items-center gap-2">
          {viewAllHref && (
            <Link to={viewAllHref} className="text-sm font-medium text-primary hover:text-primary/80 transition-colors duration-300">
              {t('common.viewAll', language)} →
            </Link>
          )}
          <div className="hidden items-center gap-1 md:flex">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className="rounded-full border border-border/50 bg-surface p-2 text-muted-foreground transition-all duration-300 hover:bg-primary/10 hover:text-primary hover:border-primary/30 disabled:opacity-20 disabled:hover:bg-surface disabled:hover:text-muted-foreground"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className="rounded-full border border-border/50 bg-surface p-2 text-muted-foreground transition-all duration-300 hover:bg-primary/10 hover:text-primary hover:border-primary/30 disabled:opacity-20 disabled:hover:bg-surface disabled:hover:text-muted-foreground"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Rail */}
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex gap-4 overflow-x-auto px-6 pb-2 scrollbar-hide snap-x-mandatory md:gap-5 md:px-12"
      >
        {items.map((item, i) => (
          <MediaCard key={item.id} item={item} language={language} isShort={isShorts} index={i} />
        ))}
      </div>
    </section>
  );
};

interface MediaCardProps {
  item: MediaCardData;
  language: Language;
  isShort?: boolean;
  index: number;
}

const MediaCard = ({ item, language, isShort, index }: MediaCardProps) => {
  const cardWidth = isShort
    ? 'min-w-[150px] max-w-[150px] sm:min-w-[160px] sm:max-w-[160px]'
    : 'min-w-[240px] max-w-[240px] sm:min-w-[260px] sm:max-w-[260px] md:min-w-[300px] md:max-w-[300px]';
  const aspectRatio = isShort ? 'aspect-[9/16]' : 'aspect-video';

  const [showPlayer, setShowPlayer] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = useCallback(() => {
    if (!item.youtubeId || item.type !== 'video') return;
    timerRef.current = setTimeout(() => setShowPlayer(true), 600);
  }, [item.youtubeId, item.type]);

  const handleMouseLeave = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
    setShowPlayer(false);
  }, []);

  useEffect(() => {
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  const typeIcon = item.type === 'video' ? Play : item.type === 'course' ? null : BookOpen;

  return (
    <Link
      to={item.href}
      className={`group snap-start flex-shrink-0 ${cardWidth} overflow-hidden rounded-xl transition-all duration-300 hover:scale-[1.03]`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      {/* Thumbnail with glow effect */}
      <div className={`card-glow relative ${aspectRatio} overflow-hidden rounded-xl bg-secondary`}>
        {item.coverImageUrl && (
          <img
            src={item.coverImageUrl}
            alt={item.title}
            loading="lazy"
            className={`h-full w-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-110 ${showPlayer ? 'opacity-0' : 'opacity-100'}`}
          />
        )}

        {/* YouTube hover preview */}
        {showPlayer && item.youtubeId && (
          <iframe
            src={`https://www.youtube.com/embed/${item.youtubeId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${item.youtubeId}&modestbranding=1&showinfo=0&rel=0`}
            className="absolute inset-0 h-full w-full z-10"
            allow="autoplay; encrypted-media"
            frameBorder="0"
            loading="lazy"
          />
        )}

        {/* Overlay on hover (only when not playing) */}
        {!showPlayer && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/0 opacity-0 transition-all duration-400 group-hover:bg-background/40 group-hover:opacity-100">
            <div className="rounded-full bg-primary p-3.5 shadow-xl shadow-primary/30 transition-transform duration-300 scale-75 group-hover:scale-100">
              <Play className="h-5 w-5 text-primary-foreground" fill="currentColor" />
            </div>
          </div>
        )}

        {/* Duration badge */}
        {item.durationSeconds && !isShort && !showPlayer && (
          <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded-lg bg-background/80 px-2 py-1 text-xs font-medium text-foreground backdrop-blur-md">
            <Clock className="h-3 w-3" />
            {formatDuration(item.durationSeconds)}
          </div>
        )}

        {/* Premium badge */}
        {item.access === 'premium' && !showPlayer && (
          <div className="absolute left-2 top-2 flex items-center gap-1 rounded-lg bg-accent/90 px-2 py-1 text-xs font-semibold text-accent-foreground backdrop-blur-sm shadow-lg">
            <Crown className="h-3 w-3" />
            {t('common.premium', language)}
          </div>
        )}

        {/* Format badge for shorts */}
        {isShort && !showPlayer && (
          <div className="absolute bottom-2 left-2 rounded-lg bg-primary/90 px-2 py-1 text-xs font-semibold text-primary-foreground shadow-lg">
            Short
          </div>
        )}
      </div>

      {/* Info */}
      <div className="mt-3 px-0.5">
        <h3 className="text-sm font-semibold text-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors duration-300">{item.title}</h3>
        {!isShort && item.excerpt && (
          <p className="mt-1 text-xs text-muted-foreground line-clamp-1">{item.excerpt}</p>
        )}
        {!isShort && item.type === 'course' && item.moduleCount !== undefined && (
          <p className="mt-1 text-xs text-muted-foreground">{item.moduleCount} module{item.moduleCount !== 1 ? 's' : ''}</p>
        )}
      </div>
    </Link>
  );
};

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${m}:${String(s).padStart(2, '0')}`;
}

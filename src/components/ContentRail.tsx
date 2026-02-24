import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Play, Clock, Crown } from 'lucide-react';
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

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  useEffect(() => { checkScroll(); }, [items]);

  const scroll = (dir: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.75;
    el.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  if (items.length === 0) return null;

  return (
    <section className="relative py-4">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between px-6 md:px-12">
        <h2 className="font-heading text-xl font-bold text-foreground md:text-2xl">{title}</h2>
        <div className="flex items-center gap-2">
          {viewAllHref && (
            <Link to={viewAllHref} className="text-sm font-medium text-primary hover:underline">
              {t('common.viewAll', language)} →
            </Link>
          )}
          <div className="hidden items-center gap-1 md:flex">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className="rounded-full bg-surface p-1.5 text-muted-foreground transition-all hover:bg-secondary disabled:opacity-30"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className="rounded-full bg-surface p-1.5 text-muted-foreground transition-all hover:bg-secondary disabled:opacity-30"
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
        className="flex gap-3 overflow-x-auto px-6 pb-2 scrollbar-hide snap-x-mandatory md:gap-4 md:px-12"
      >
        {items.map(item => (
          <MediaCard key={item.id} item={item} language={language} isShort={isShorts} />
        ))}
      </div>
    </section>
  );
};

interface MediaCardProps {
  item: MediaCardData;
  language: Language;
  isShort?: boolean;
}

const MediaCard = ({ item, language, isShort }: MediaCardProps) => {
  const cardWidth = isShort ? 'min-w-[160px] max-w-[160px]' : 'min-w-[260px] max-w-[260px] md:min-w-[300px] md:max-w-[300px]';
  const aspectRatio = isShort ? 'aspect-[9/16]' : 'aspect-video';

  return (
    <Link
      to={item.href}
      className={`group snap-start flex-shrink-0 ${cardWidth} overflow-hidden rounded-lg transition-all hover:scale-[1.02]`}
    >
      {/* Thumbnail */}
      <div className={`relative ${aspectRatio} overflow-hidden rounded-lg bg-secondary`}>
        {item.coverImageUrl && (
          <img
            src={item.coverImageUrl}
            alt={item.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}

        {/* Overlay on hover */}
        <div className="absolute inset-0 flex items-center justify-center bg-background/0 opacity-0 transition-all group-hover:bg-background/30 group-hover:opacity-100">
          <div className="rounded-full bg-primary p-3 shadow-lg">
            <Play className="h-5 w-5 text-primary-foreground" fill="currentColor" />
          </div>
        </div>

        {/* Duration badge */}
        {item.durationSeconds && !isShort && (
          <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded bg-background/80 px-1.5 py-0.5 text-xs font-medium text-foreground backdrop-blur-sm">
            <Clock className="h-3 w-3" />
            {formatDuration(item.durationSeconds)}
          </div>
        )}

        {/* Premium badge */}
        {item.access === 'premium' && (
          <div className="absolute left-2 top-2 flex items-center gap-1 rounded bg-accent/90 px-1.5 py-0.5 text-xs font-semibold text-accent-foreground">
            <Crown className="h-3 w-3" />
            {t('common.premium', language)}
          </div>
        )}

        {/* Format badge for shorts */}
        {isShort && (
          <div className="absolute bottom-2 left-2 rounded bg-primary/90 px-1.5 py-0.5 text-xs font-semibold text-primary-foreground">
            Short
          </div>
        )}
      </div>

      {/* Info */}
      <div className="mt-2 px-0.5">
        <h3 className="text-sm font-semibold text-foreground line-clamp-2 leading-snug">{item.title}</h3>
        {!isShort && item.type === 'course' && item.moduleCount !== undefined && (
          <p className="mt-0.5 text-xs text-muted-foreground">{item.moduleCount} module{item.moduleCount !== 1 ? 's' : ''}</p>
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

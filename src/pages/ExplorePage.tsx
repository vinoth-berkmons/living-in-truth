import { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getDB } from '@/lib/db';
import { PublicLayout } from '@/components/PublicLayout';
import { useLanguageStore } from '@/stores';
import { getTranslation, t } from '@/lib/i18n';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { Search, Filter, Play, Clock, Crown, BookOpen, GraduationCap } from 'lucide-react';
import type { Language } from '@/types/entities';

const ExplorePage = () => {
  const workspace = useWorkspace();
  const [searchParams] = useSearchParams();
  const { language } = useLanguageStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>(searchParams.get('type') || 'all');
  const [filterAccess, setFilterAccess] = useState<string>('all');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');

  const db = getDB();

  const categories = useMemo(() => {
    if (!db) return [];
    return Object.values(db.categories.byId).filter(c => c.workspaceId === workspace.id);
  }, [db, workspace.id]);

  const allItems = useMemo(() => {
    if (!db) return [];
    const results: ExploreItem[] = [];

    if (filterType === 'all' || filterType === 'article' || filterType === 'blog') {
      Object.values(db.content.byId)
        .filter(c => c.workspaceId === workspace.id && c.status === 'published')
        .forEach(item => {
          if (filterType !== 'all' && item.type !== filterType) return;
          const tr = getTranslation(item.translations, language);
          results.push({
            id: item.id, title: tr?.title ?? '', excerpt: tr?.excerpt,
            coverImageUrl: item.coverImageUrl, href: `/read/${item.slug}`,
            type: item.type, access: item.access, categoryIds: item.categoryIds,
          });
        });
    }

    if (filterType === 'all' || filterType === 'video') {
      Object.values(db.videos.byId)
        .filter(v => v.workspaceId === workspace.id && v.status === 'published')
        .forEach(item => {
          const tr = getTranslation(item.translations, language);
          results.push({
            id: item.id, title: tr?.title ?? '', excerpt: tr?.description,
            coverImageUrl: item.coverImageUrl, href: `/watch/${item.slug}`,
            type: 'video', access: item.access, categoryIds: item.categoryIds,
            format: item.format, durationSeconds: item.durationSeconds,
          });
        });
    }

    if (filterType === 'all' || filterType === 'course') {
      Object.values(db.courses.byId)
        .filter(c => c.workspaceId === workspace.id && c.status === 'published')
        .forEach(item => {
          const tr = getTranslation(item.translations, language);
          results.push({
            id: item.id, title: tr?.title ?? '', excerpt: tr?.description,
            href: `/course/${item.slug}`,
            type: 'course', access: item.access, categoryIds: item.categoryIds,
            moduleCount: item.moduleIds.length,
          });
        });
    }

    return results;
  }, [db, workspace.id, filterType, language]);

  const filtered = useMemo(() => {
    let items = allItems;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      items = items.filter(i => i.title.toLowerCase().includes(q) || i.excerpt?.toLowerCase().includes(q));
    }
    if (filterAccess !== 'all') {
      items = items.filter(i => i.access === filterAccess);
    }
    if (selectedCategoryId !== 'all') {
      items = items.filter(i => i.categoryIds?.includes(selectedCategoryId));
    }
    return items;
  }, [allItems, searchQuery, filterAccess, selectedCategoryId]);

  if (!db) return null;

  const typeFilters = [
    { value: 'all', label: t('explore.all', language) },
    { value: 'video', label: t('nav.videos', language) },
    { value: 'article', label: t('nav.articles', language) },
    { value: 'course', label: t('nav.courses', language) },
  ];

  return (
    <PublicLayout>
      <div className="flex min-h-[80vh]">
        {/* Sidebar */}
        <aside className="hidden w-64 flex-shrink-0 border-r border-border/50 bg-surface/50 p-6 lg:block">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t('explore.categories', language)}</h3>
          <nav className="space-y-1">
            <button
              onClick={() => setSelectedCategoryId('all')}
              className={`block w-full rounded-md px-3 py-2 text-left text-sm transition-colors ${selectedCategoryId === 'all' ? 'bg-primary/10 font-medium text-primary' : 'text-foreground hover:bg-secondary'}`}
            >
              {t('explore.all', language)}
            </button>
            {categories.map(cat => {
              const tr = getTranslation(cat.translations, language);
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategoryId(cat.id)}
                  className={`block w-full rounded-md px-3 py-2 text-left text-sm transition-colors ${selectedCategoryId === cat.id ? 'bg-primary/10 font-medium text-primary' : 'text-foreground hover:bg-secondary'}`}
                >
                  {tr?.title ?? cat.slug}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main content */}
        <div className="flex-1 p-6 md:p-8">
          {/* Search bar */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={t('common.search', language)}
              className="w-full rounded-xl border border-border bg-surface py-3 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Filters */}
          <div className="mb-6 flex flex-wrap items-center gap-2">
            {typeFilters.map(f => (
              <button
                key={f.value}
                onClick={() => setFilterType(f.value)}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  filterType === f.value
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
              >
                {f.label}
              </button>
            ))}

            <div className="ml-auto flex items-center gap-2">
              <select
                value={filterAccess}
                onChange={e => setFilterAccess(e.target.value)}
                className="rounded-lg border border-border bg-surface px-3 py-1.5 text-sm text-foreground"
              >
                <option value="all">{t('explore.all', language)}</option>
                <option value="free">{t('common.free', language)}</option>
                <option value="premium">{t('common.premium', language)}</option>
              </select>
            </div>

            {/* Mobile categories */}
            <select
              value={selectedCategoryId}
              onChange={e => setSelectedCategoryId(e.target.value)}
              className="rounded-lg border border-border bg-surface px-3 py-1.5 text-sm text-foreground lg:hidden"
            >
              <option value="all">{t('explore.all', language)}</option>
              {categories.map(cat => {
                const tr = getTranslation(cat.translations, language);
                return <option key={cat.id} value={cat.id}>{tr?.title ?? cat.slug}</option>;
              })}
            </select>
          </div>

          {/* Results */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map(item => (
              <Link key={item.id} to={item.href} className="group overflow-hidden rounded-xl border border-border/50 bg-card transition-all hover:border-primary/30 hover:shadow-lg hover:-translate-y-0.5">
                <div className="relative aspect-video overflow-hidden bg-secondary">
                  {item.coverImageUrl && (
                    <img src={item.coverImageUrl} alt={item.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                  )}
                  {item.type === 'video' && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="rounded-full bg-primary p-3"><Play className="h-5 w-5 text-primary-foreground" fill="currentColor" /></div>
                    </div>
                  )}
                  {item.durationSeconds && (
                    <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded bg-background/80 px-1.5 py-0.5 text-xs font-medium text-foreground backdrop-blur-sm">
                      <Clock className="h-3 w-3" />{formatDuration(item.durationSeconds)}
                    </div>
                  )}
                  {item.access === 'premium' && (
                    <div className="absolute left-2 top-2 flex items-center gap-1 rounded bg-accent/90 px-1.5 py-0.5 text-xs font-semibold text-accent-foreground">
                      <Crown className="h-3 w-3" />{t('common.premium', language)}
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="mb-1 flex items-center gap-2">
                    <span className="flex items-center gap-1 text-xs font-medium uppercase text-primary">
                      {item.type === 'video' && <Play className="h-3 w-3" />}
                      {(item.type === 'article' || item.type === 'blog') && <BookOpen className="h-3 w-3" />}
                      {item.type === 'course' && <GraduationCap className="h-3 w-3" />}
                      {item.type}
                    </span>
                  </div>
                  <h3 className="font-heading text-sm font-semibold text-foreground line-clamp-2">{item.title}</h3>
                  {item.excerpt && <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{item.excerpt}</p>}
                </div>
              </Link>
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="py-20 text-center"><p className="text-muted-foreground">No content found.</p></div>
          )}
        </div>
      </div>
    </PublicLayout>
  );
};

interface ExploreItem {
  id: string;
  title: string;
  excerpt?: string;
  coverImageUrl?: string;
  href: string;
  type: string;
  access: 'free' | 'premium';
  categoryIds?: string[];
  format?: string;
  durationSeconds?: number;
  moduleCount?: number;
}

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export default ExplorePage;

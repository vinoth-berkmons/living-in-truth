import { useParams, Link } from 'react-router-dom';
import { getDB } from '@/lib/db';
import { PublicLayout } from '@/components/PublicLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslation, t } from '@/lib/i18n';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { Play, BookOpen, Crown, Clock, ArrowLeft } from 'lucide-react';

const CategoryPage = () => {
  const { catSlug } = useParams<{ catSlug: string }>();
  const workspace = useWorkspace();
  const { language } = useLanguage();
  const db = getDB();
  if (!db) return null;

  const category = Object.values(db.categories.byId).find(c => c.workspaceId === workspace.id && c.slug === catSlug);
  if (!category) return <div className="flex min-h-screen items-center justify-center bg-background"><p className="text-foreground">Category not found</p></div>;

  const catTr = getTranslation(category.translations, language);
  const content = Object.values(db.content.byId).filter(c => c.workspaceId === workspace.id && c.status === 'published' && c.categoryIds.includes(category.id));
  const videos = Object.values(db.videos.byId).filter(v => v.workspaceId === workspace.id && v.status === 'published' && v.categoryIds.includes(category.id));

  return (
    <PublicLayout>
      <div className="px-6 py-10 md:px-12">
        <Link to="/explore" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-3 w-3" />{t('common.back', language)}
        </Link>
        <h1 className="font-heading text-3xl font-bold text-foreground">{catTr?.title ?? catSlug}</h1>
        {catTr?.description && <p className="mt-2 text-base text-muted-foreground">{catTr.description}</p>}

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {videos.map(item => {
            const vtr = getTranslation(item.translations, language);
            return (
              <Link key={item.id} to={`/watch/${item.slug}`} className="group overflow-hidden rounded-xl border border-border/50 bg-card transition-all hover:border-primary/30 hover:shadow-lg">
                <div className="relative aspect-video overflow-hidden bg-secondary">
                  {item.coverImageUrl && <img src={item.coverImageUrl} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="rounded-full bg-primary p-3"><Play className="h-5 w-5 text-primary-foreground" fill="currentColor" /></div>
                  </div>
                  {item.durationSeconds && (
                    <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded bg-background/80 px-1.5 py-0.5 text-xs font-medium text-foreground backdrop-blur-sm">
                      <Clock className="h-3 w-3" />{Math.round(item.durationSeconds / 60)}m
                    </div>
                  )}
                  {item.access === 'premium' && (
                    <div className="absolute left-2 top-2 flex items-center gap-1 rounded bg-accent/90 px-1.5 py-0.5 text-xs font-semibold text-accent-foreground"><Crown className="h-3 w-3" />{t('common.premium', language)}</div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-foreground line-clamp-2">{vtr?.title ?? 'Untitled'}</h3>
                </div>
              </Link>
            );
          })}
          {content.map(item => {
            const ctr = getTranslation(item.translations, language);
            return (
              <Link key={item.id} to={`/read/${item.slug}`} className="group overflow-hidden rounded-xl border border-border/50 bg-card transition-all hover:border-primary/30 hover:shadow-lg">
                <div className="relative aspect-video overflow-hidden bg-secondary">
                  {item.coverImageUrl && <img src={item.coverImageUrl} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />}
                  {item.access === 'premium' && (
                    <div className="absolute left-2 top-2 flex items-center gap-1 rounded bg-accent/90 px-1.5 py-0.5 text-xs font-semibold text-accent-foreground"><Crown className="h-3 w-3" />{t('common.premium', language)}</div>
                  )}
                </div>
                <div className="p-4">
                  <span className="flex items-center gap-1 text-xs font-medium text-primary"><BookOpen className="h-3 w-3" />{item.type}</span>
                  <h3 className="mt-1 text-sm font-semibold text-foreground line-clamp-2">{ctr?.title ?? 'Untitled'}</h3>
                </div>
              </Link>
            );
          })}
          {content.length === 0 && videos.length === 0 && <p className="col-span-full text-muted-foreground">No content in this category yet.</p>}
        </div>
      </div>
    </PublicLayout>
  );
};

export default CategoryPage;

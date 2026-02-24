import { useParams, Link } from 'react-router-dom';
import { getDB } from '@/lib/db';
import { PublicLayout } from '@/components/PublicLayout';
import { useLanguageStore } from '@/stores';
import { getTranslation, t } from '@/lib/i18n';

const ExplorePage = () => {
  const { workspaceSlug } = useParams<{ workspaceSlug: string }>();
  const { language } = useLanguageStore();
  const db = getDB();
  const workspace = db ? Object.values(db.workspaces.byId).find(w => w.slug === workspaceSlug && w.status === 'active') : undefined;
  if (!workspace || !db) return <div className="flex min-h-screen items-center justify-center bg-background"><p className="text-foreground">{t('site.unavailable', language)}</p></div>;

  const categories = Object.values(db.categories.byId).filter(c => c.workspaceId === workspace.id);
  const contentItems = Object.values(db.content.byId).filter(c => c.workspaceId === workspace.id && c.status === 'published');
  const videoItems = Object.values(db.videos.byId).filter(v => v.workspaceId === workspace.id && v.status === 'published');

  return (
    <PublicLayout workspace={workspace}>
      <div className="container mx-auto px-6 py-8">
        <h1 className="font-heading text-3xl font-bold text-foreground">{t('nav.explore', language)}</h1>

        {/* Categories */}
        {categories.length > 0 && (
          <div className="mt-8">
            <h2 className="mb-4 font-heading text-xl font-semibold text-foreground">Categories</h2>
            <div className="flex flex-wrap gap-3">
              {categories.map(cat => {
                const tr = getTranslation(cat.translations, language);
                return (
                  <Link key={cat.id} to={`/w/${workspace.slug}/category/${cat.slug}`} className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary hover:bg-primary/5">
                    {tr?.title ?? cat.slug}
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="mt-10">
          <h2 className="mb-4 font-heading text-xl font-semibold text-foreground">Articles & Blogs</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {contentItems.map(item => {
              const tr = getTranslation(item.translations, language);
              return (
                <Link key={item.id} to={`/w/${workspace.slug}/read/${item.slug}`} className="group overflow-hidden rounded-lg border border-border bg-card transition-all hover:shadow-md">
                  {item.coverImageUrl && <div className="aspect-video bg-secondary" style={{ backgroundImage: `url(${item.coverImageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />}
                  <div className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium uppercase text-primary">{item.type}</span>
                      {item.access === 'premium' && <span className="rounded bg-accent/10 px-1.5 py-0.5 text-xs font-medium text-accent">{t('common.premium', language)}</span>}
                    </div>
                    <h3 className="mt-1 font-heading text-base font-semibold text-foreground">{tr?.title ?? 'Untitled'}</h3>
                    {tr?.excerpt && <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{tr.excerpt}</p>}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Videos */}
        <div className="mt-10">
          <h2 className="mb-4 font-heading text-xl font-semibold text-foreground">Videos</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {videoItems.map(item => {
              const tr = getTranslation(item.translations, language);
              return (
                <Link key={item.id} to={`/w/${workspace.slug}/watch/${item.slug}`} className="group overflow-hidden rounded-lg border border-border bg-card transition-all hover:shadow-md">
                  {item.coverImageUrl && <div className="aspect-video bg-secondary" style={{ backgroundImage: `url(${item.coverImageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />}
                  <div className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium uppercase text-primary">{item.format}</span>
                      {item.access === 'premium' && <span className="rounded bg-accent/10 px-1.5 py-0.5 text-xs font-medium text-accent">{t('common.premium', language)}</span>}
                    </div>
                    <h3 className="mt-1 font-heading text-base font-semibold text-foreground">{tr?.title ?? 'Untitled'}</h3>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default ExplorePage;

import { useParams, Link } from 'react-router-dom';
import { getDB } from '@/lib/db';
import { PublicLayout } from '@/components/PublicLayout';
import { useLanguageStore } from '@/stores';
import { getTranslation } from '@/lib/i18n';

const CategoryPage = () => {
  const { workspaceSlug, catSlug } = useParams<{ workspaceSlug: string; catSlug: string }>();
  const { language } = useLanguageStore();
  const db = getDB();
  const workspace = db ? Object.values(db.workspaces.byId).find(w => w.slug === workspaceSlug && w.status === 'active') : undefined;
  if (!workspace || !db) return <div className="flex min-h-screen items-center justify-center bg-background"><p>Not found</p></div>;

  const category = Object.values(db.categories.byId).find(c => c.workspaceId === workspace.id && c.slug === catSlug);
  if (!category) return <div className="flex min-h-screen items-center justify-center bg-background"><p>Category not found</p></div>;

  const catTr = getTranslation(category.translations, language);
  const content = Object.values(db.content.byId).filter(c => c.workspaceId === workspace.id && c.status === 'published' && c.categoryIds.includes(category.id));
  const videos = Object.values(db.videos.byId).filter(v => v.workspaceId === workspace.id && v.status === 'published' && v.categoryIds.includes(category.id));

  return (
    <PublicLayout workspace={workspace}>
      <div className="container mx-auto px-6 py-8">
        <Link to={`/w/${workspace.slug}/explore`} className="text-sm text-primary hover:underline">← Back</Link>
        <h1 className="mt-4 font-heading text-3xl font-bold text-foreground">{catTr?.title ?? catSlug}</h1>
        {catTr?.description && <p className="mt-2 text-muted-foreground">{catTr.description}</p>}

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {content.map(item => {
            const tr = getTranslation(item.translations, language);
            return (
              <Link key={item.id} to={`/w/${workspace.slug}/read/${item.slug}`} className="overflow-hidden rounded-lg border border-border bg-card hover:shadow-md">
                {item.coverImageUrl && <div className="aspect-video bg-secondary" style={{ backgroundImage: `url(${item.coverImageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />}
                <div className="p-4"><h3 className="font-heading text-base font-semibold text-foreground">{tr?.title ?? 'Untitled'}</h3></div>
              </Link>
            );
          })}
          {videos.map(item => {
            const tr = getTranslation(item.translations, language);
            return (
              <Link key={item.id} to={`/w/${workspace.slug}/watch/${item.slug}`} className="overflow-hidden rounded-lg border border-border bg-card hover:shadow-md">
                {item.coverImageUrl && <div className="aspect-video bg-secondary" style={{ backgroundImage: `url(${item.coverImageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />}
                <div className="p-4"><h3 className="font-heading text-base font-semibold text-foreground">{tr?.title ?? 'Untitled'}</h3></div>
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

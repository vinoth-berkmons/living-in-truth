import { useParams, Link } from 'react-router-dom';
import { getDB } from '@/lib/db';
import { PublicLayout } from '@/components/PublicLayout';
import { useLanguageStore, useAuthStore } from '@/stores';
import { getTranslation, t } from '@/lib/i18n';
import { canAccessItem } from '@/lib/rbac';

const ReadPage = () => {
  const { workspaceSlug, contentSlug } = useParams<{ workspaceSlug: string; contentSlug: string }>();
  const { language } = useLanguageStore();
  const { session } = useAuthStore();
  const db = getDB();
  const workspace = db ? Object.values(db.workspaces.byId).find(w => w.slug === workspaceSlug && w.status === 'active') : undefined;
  if (!workspace || !db) return <div className="flex min-h-screen items-center justify-center bg-background"><p>{t('site.unavailable', language)}</p></div>;

  const contentId = db.content.slugIndex[workspace.id]?.[contentSlug!];
  const content = contentId ? db.content.byId[contentId] : undefined;
  if (!content) return <div className="flex min-h-screen items-center justify-center bg-background"><p>Content not found</p></div>;

  const tr = getTranslation(content.translations, language);
  const hasAccess = canAccessItem(session?.userId, content);

  const related = Object.values(db.content.byId).filter(c => c.workspaceId === workspace.id && c.status === 'published' && c.id !== content.id).slice(0, 3);

  return (
    <PublicLayout workspace={workspace}>
      <article className="container mx-auto max-w-3xl px-6 py-8">
        <Link to={`/w/${workspace.slug}/explore`} className="text-sm text-primary hover:underline">← Back</Link>
        {content.coverImageUrl && (
          <div className="mt-4 aspect-video overflow-hidden rounded-lg bg-secondary" style={{ backgroundImage: `url(${content.coverImageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
        )}
        <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
          <span className="uppercase">{content.type}</span>
          <span>· {content.authorName}</span>
          {content.access === 'premium' && <span className="rounded bg-accent/10 px-1.5 py-0.5 text-xs font-medium text-accent">{t('common.premium', language)}</span>}
        </div>
        <h1 className="mt-4 font-heading text-3xl font-bold text-foreground">{tr?.title ?? 'Untitled'}</h1>
        {tr?.excerpt && <p className="mt-2 text-lg text-muted-foreground">{tr.excerpt}</p>}

        {hasAccess ? (
          <div className="prose prose-lg mt-8 max-w-none text-foreground" dangerouslySetInnerHTML={{ __html: tr?.bodyHtml ?? '' }} />
        ) : (
          <div className="mt-8 rounded-lg border border-border bg-secondary p-8 text-center">
            <p className="font-heading text-lg font-semibold text-foreground">This is {t('common.premium', language)} content</p>
            <Link to={`/w/${workspace.slug}/pricing`} className="mt-3 inline-block rounded-lg bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
              Subscribe to Read
            </Link>
          </div>
        )}
      </article>

      {/* Related */}
      {related.length > 0 && (
        <div className="container mx-auto max-w-3xl px-6 pb-8">
          <h2 className="mb-4 font-heading text-xl font-semibold text-foreground">Related</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {related.map(item => {
              const rTr = getTranslation(item.translations, language);
              return (
                <Link key={item.id} to={`/w/${workspace.slug}/read/${item.slug}`} className="overflow-hidden rounded-lg border border-border bg-card hover:shadow-md">
                  {item.coverImageUrl && <div className="aspect-video bg-secondary" style={{ backgroundImage: `url(${item.coverImageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />}
                  <div className="p-3"><h3 className="text-sm font-medium text-foreground">{rTr?.title ?? 'Untitled'}</h3></div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </PublicLayout>
  );
};

export default ReadPage;

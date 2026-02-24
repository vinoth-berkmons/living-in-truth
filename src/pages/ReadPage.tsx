import { useParams, Link } from 'react-router-dom';
import { getDB } from '@/lib/db';
import { PublicLayout } from '@/components/PublicLayout';
import { useLanguageStore, useAuthStore } from '@/stores';
import { getTranslation, t } from '@/lib/i18n';
import { canAccessItem } from '@/lib/rbac';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { Crown, BookOpen, ArrowLeft, Lock, LogIn, UserPlus } from 'lucide-react';

const ReadPage = () => {
  const { contentSlug } = useParams<{ contentSlug: string }>();
  const workspace = useWorkspace();
  const { language } = useLanguageStore();
  const { session } = useAuthStore();
  const db = getDB();
  if (!db) return null;

  const contentId = db.content.slugIndex[workspace.id]?.[contentSlug!];
  const content = contentId ? db.content.byId[contentId] : undefined;
  if (!content) return <div className="flex min-h-screen items-center justify-center bg-background"><p className="text-foreground">Content not found</p></div>;

  const tr = getTranslation(content.translations, language);
  const hasAccess = canAccessItem(session?.userId, content);
  const related = Object.values(db.content.byId).filter(c => c.workspaceId === workspace.id && c.status === 'published' && c.id !== content.id).slice(0, 4);
  const contentCats = content.categoryIds.map(id => db.categories.byId[id]).filter(Boolean);
  const currentPath = `/read/${contentSlug}`;

  return (
    <PublicLayout>
      {content.coverImageUrl && (
        <div className="relative h-[40vh] min-h-[300px] w-full overflow-hidden">
          <img src={content.coverImageUrl} alt="" className="h-full w-full object-cover" />
          <div className="hero-overlay absolute inset-0" />
        </div>
      )}

      <div className="relative mx-auto grid max-w-6xl gap-8 px-6 py-8 md:px-12 lg:grid-cols-[1fr_300px]">
        <article className={content.coverImageUrl ? '-mt-24 relative z-10' : ''}>
          <Link to="/explore" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-3 w-3" />{t('common.back', language)}
          </Link>

          <div className="rounded-xl border border-border/50 bg-card p-6 shadow-sm md:p-10">
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="flex items-center gap-1 text-xs font-medium uppercase text-primary">
                <BookOpen className="h-3 w-3" />{content.type}
              </span>
              <span className="text-muted-foreground">·</span>
              <span className="text-muted-foreground">{content.authorName}</span>
              {content.access === 'premium' && (
                <span className="flex items-center gap-1 rounded bg-accent/10 px-2 py-0.5 text-xs font-semibold text-accent">
                  <Crown className="h-3 w-3" />{t('common.premium', language)}
                </span>
              )}
            </div>

            <h1 className="mt-4 font-heading text-3xl font-bold leading-tight text-foreground md:text-4xl">{tr?.title ?? 'Untitled'}</h1>
            {tr?.excerpt && <p className="mt-3 text-lg text-muted-foreground leading-relaxed">{tr.excerpt}</p>}

            {contentCats.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {contentCats.map(cat => {
                  const ctr = getTranslation(cat.translations, language);
                  return <Link key={cat.id} to={`/category/${cat.slug}`} className="rounded-md bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground hover:bg-secondary/80">{ctr?.title ?? cat.slug}</Link>;
                })}
              </div>
            )}

            {hasAccess ? (
              <div className="prose prose-lg mt-8 max-w-none text-foreground/90 prose-headings:font-heading prose-headings:text-foreground prose-a:text-primary" dangerouslySetInnerHTML={{ __html: tr?.bodyHtml ?? '' }} />
            ) : (
              <div className="relative mt-8">
                <div className="blur-sm select-none" dangerouslySetInnerHTML={{ __html: (tr?.bodyHtml ?? '').slice(0, 200) + '...' }} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="rounded-xl border border-border bg-card p-8 text-center shadow-lg">
                    <Lock className="mx-auto mb-3 h-8 w-8 text-accent" />
                    <p className="font-heading text-lg font-bold text-foreground">{t('common.premium', language)} Content</p>
                    {!session ? (
                      <div className="mt-4 flex flex-col items-center gap-2">
                        <Link to={`/login?redirect=${currentPath}`} className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
                          <LogIn className="h-4 w-4" />Sign In
                        </Link>
                        <Link to={`/signup?redirect=${currentPath}`} className="text-sm text-primary hover:underline">
                          <UserPlus className="mr-1 inline h-3 w-3" />Sign Up
                        </Link>
                        <Link to="/pricing" className="text-sm text-muted-foreground hover:text-foreground">View Plans →</Link>
                      </div>
                    ) : (
                      <div className="mt-4">
                        <p className="text-sm text-muted-foreground">Subscribe to read the full article</p>
                        <Link to="/pricing" className="mt-3 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
                          Upgrade
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </article>

        <aside className="space-y-6">
          <div className="sticky top-20">
            <h3 className="mb-3 font-heading text-sm font-semibold text-foreground">Related</h3>
            <div className="space-y-3">
              {related.map(item => {
                const rTr = getTranslation(item.translations, language);
                return (
                  <Link key={item.id} to={`/read/${item.slug}`} className="group flex gap-3 rounded-lg border border-border/50 bg-card p-2 transition-all hover:border-primary/30 hover:shadow-sm">
                    {item.coverImageUrl && <img src={item.coverImageUrl} alt="" className="h-16 w-20 flex-shrink-0 rounded object-cover" />}
                    <div>
                      <h4 className="text-sm font-medium text-foreground line-clamp-2">{rTr?.title ?? 'Untitled'}</h4>
                      <span className="mt-0.5 text-xs text-muted-foreground">{item.type}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </aside>
      </div>
    </PublicLayout>
  );
};

export default ReadPage;

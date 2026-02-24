import { useParams, Link } from 'react-router-dom';
import { getDB } from '@/lib/db';
import { PublicLayout } from '@/components/PublicLayout';
import { useLanguageStore, useAuthStore } from '@/stores';
import { getTranslation, t } from '@/lib/i18n';
import { canAccessItem } from '@/lib/rbac';
import { VideoPlayer } from '@/components/VideoPlayer';

const WatchPage = () => {
  const { workspaceSlug, videoSlug } = useParams<{ workspaceSlug: string; videoSlug: string }>();
  const { language } = useLanguageStore();
  const { session } = useAuthStore();
  const db = getDB();
  const workspace = db ? Object.values(db.workspaces.byId).find(w => w.slug === workspaceSlug && w.status === 'active') : undefined;
  if (!workspace || !db) return <div className="flex min-h-screen items-center justify-center bg-background"><p>{t('site.unavailable', language)}</p></div>;

  const videoId = db.videos.slugIndex[workspace.id]?.[videoSlug!];
  const video = videoId ? db.videos.byId[videoId] : undefined;
  if (!video) return <div className="flex min-h-screen items-center justify-center bg-background"><p>Video not found</p></div>;

  const tr = getTranslation(video.translations, language);
  const hasAccess = canAccessItem(session?.userId, video);

  // Related videos
  const related = Object.values(db.videos.byId).filter(v => v.workspaceId === workspace.id && v.status === 'published' && v.id !== video.id).slice(0, 4);

  return (
    <PublicLayout workspace={workspace}>
      <div className="container mx-auto px-6 py-8">
        <Link to={`/w/${workspace.slug}/explore`} className="text-sm text-primary hover:underline">← Back</Link>

        <div className="mt-4 grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {hasAccess ? (
              <VideoPlayer source={video.source} format={video.format} />
            ) : (
              <div className="flex aspect-video items-center justify-center rounded-lg bg-secondary">
                <div className="text-center">
                  <p className="font-heading text-lg font-semibold text-foreground">{t('common.premium', language)} Content</p>
                  <Link to={`/w/${workspace.slug}/pricing`} className="mt-2 inline-block rounded-lg bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                    Subscribe to Watch
                  </Link>
                </div>
              </div>
            )}
            <h1 className="mt-4 font-heading text-2xl font-bold text-foreground">{tr?.title ?? 'Untitled'}</h1>
            {tr?.description && <p className="mt-2 text-muted-foreground">{tr.description}</p>}
            <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
              <span className="uppercase">{video.format}</span>
              {video.durationSeconds && <span>· {Math.round(video.durationSeconds / 60)} min</span>}
              {video.access === 'premium' && <span className="rounded bg-accent/10 px-1.5 py-0.5 text-xs font-medium text-accent">{t('common.premium', language)}</span>}
            </div>
          </div>

          <div>
            <h2 className="mb-4 font-heading text-lg font-semibold text-foreground">Related</h2>
            <div className="space-y-3">
              {related.map(v => {
                const vTr = getTranslation(v.translations, language);
                return (
                  <Link key={v.id} to={`/w/${workspace.slug}/watch/${v.slug}`} className="flex gap-3 rounded-lg border border-border bg-card p-2 hover:shadow-sm">
                    {v.coverImageUrl && <div className="h-16 w-24 flex-shrink-0 rounded bg-secondary" style={{ backgroundImage: `url(${v.coverImageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />}
                    <div><h3 className="text-sm font-medium text-foreground line-clamp-2">{vTr?.title ?? 'Untitled'}</h3></div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default WatchPage;

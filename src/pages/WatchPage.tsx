import { useParams, Link } from 'react-router-dom';
import { getDB } from '@/lib/db';
import { PublicLayout } from '@/components/PublicLayout';
import { useAuthStore } from '@/stores';
import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslation, t } from '@/lib/i18n';
import { canAccessItem } from '@/lib/rbac';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { VideoPlayer } from '@/components/VideoPlayer';
import { ContentRail, type MediaCardData } from '@/components/ContentRail';
import { Crown, Clock, Play, ArrowLeft, Lock, LogIn, UserPlus } from 'lucide-react';

const WatchPage = () => {
  const { videoSlug } = useParams<{ videoSlug: string }>();
  const workspace = useWorkspace();
  const { language } = useLanguage();
  const { session } = useAuthStore();
  const db = getDB();
  if (!db) return null;

  const videoId = db.videos.slugIndex[workspace.id]?.[videoSlug!];
  const video = videoId ? db.videos.byId[videoId] : undefined;
  if (!video) return <div className="flex min-h-screen items-center justify-center bg-background"><p className="text-foreground">Video not found</p></div>;

  const tr = getTranslation(video.translations, language);
  const hasAccess = canAccessItem(session?.userId, video);

  const related = Object.values(db.videos.byId)
    .filter(v => v.workspaceId === workspace.id && v.status === 'published' && v.id !== video.id && v.format === 'long')
    .slice(0, 6);
  const shorts = Object.values(db.videos.byId)
    .filter(v => v.workspaceId === workspace.id && v.status === 'published' && v.format === 'short')
    .slice(0, 8);

  const relatedCards: MediaCardData[] = related.map(v => {
    const vTr = getTranslation(v.translations, language);
    return { id: v.id, title: vTr?.title ?? 'Untitled', coverImageUrl: v.coverImageUrl, href: `/watch/${v.slug}`, type: 'video', format: v.format, access: v.access, durationSeconds: v.durationSeconds };
  });

  const shortCards: MediaCardData[] = shorts.map(v => {
    const vTr = getTranslation(v.translations, language);
    return { id: v.id, title: vTr?.title ?? 'Untitled', coverImageUrl: v.coverImageUrl, href: `/watch/${v.slug}`, type: 'video', format: v.format, access: v.access, durationSeconds: v.durationSeconds };
  });

  const videoCats = video.categoryIds.map(id => db.categories.byId[id]).filter(Boolean);
  const currentPath = `/watch/${videoSlug}`;

  return (
    <PublicLayout>
      <div className="bg-background">
        {hasAccess ? (
          <div className="mx-auto max-w-5xl">
            <VideoPlayer source={video.source} format={video.format} />
          </div>
        ) : (
          <div className="relative mx-auto max-w-5xl">
            <div className="flex aspect-video items-center justify-center rounded-b-xl bg-secondary">
              {video.coverImageUrl && (
                <img src={video.coverImageUrl} alt="" className="absolute inset-0 h-full w-full rounded-b-xl object-cover opacity-40 blur-sm" />
              )}
              <div className="relative z-10 text-center">
                <Crown className="mx-auto mb-3 h-10 w-10 text-accent" />
                <p className="font-heading text-xl font-bold text-foreground">{t('common.premium', language)} Content</p>
                {!session ? (
                  <div className="mt-4 flex flex-col items-center gap-2 sm:flex-row">
                    <Link to={`/login?redirect=${currentPath}`} className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
                      <LogIn className="h-4 w-4" />Sign In
                    </Link>
                    <Link to={`/signup?redirect=${currentPath}`} className="inline-flex items-center gap-2 rounded-lg border border-primary px-6 py-3 text-sm font-semibold text-primary hover:bg-primary/5">
                      <UserPlus className="h-4 w-4" />Sign Up
                    </Link>
                    <Link to="/pricing" className="text-sm text-muted-foreground hover:text-foreground">View Plans →</Link>
                  </div>
                ) : (
                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground">Subscribe to watch this video</p>
                    <Link to="/pricing" className="mt-3 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
                      Upgrade
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mx-auto max-w-5xl px-6 py-6 md:px-8">
        <Link to="/explore" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-3 w-3" />{t('common.back', language)}
        </Link>
        <h1 className="font-heading text-2xl font-bold text-foreground md:text-3xl">{tr?.title ?? 'Untitled'}</h1>
        {tr?.description && <p className="mt-2 text-base text-muted-foreground">{tr.description}</p>}
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <span className="flex items-center gap-1 text-xs text-muted-foreground uppercase"><Play className="h-3 w-3" />{video.format}</span>
          {video.durationSeconds && <span className="flex items-center gap-1 text-xs text-muted-foreground"><Clock className="h-3 w-3" />{Math.round(video.durationSeconds / 60)} min</span>}
          {video.access === 'premium' && <span className="flex items-center gap-1 rounded bg-accent/10 px-2 py-0.5 text-xs font-semibold text-accent"><Crown className="h-3 w-3" />{t('common.premium', language)}</span>}
          {videoCats.map(cat => {
            const ctr = getTranslation(cat.translations, language);
            return <Link key={cat.id} to={`/category/${cat.slug}`} className="rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground hover:bg-secondary/80">{ctr?.title ?? cat.slug}</Link>;
          })}
        </div>
      </div>

      {relatedCards.length > 0 && (
        <ContentRail title="Up Next" items={relatedCards} language={language} />
      )}
      {shortCards.length > 0 && (
        <ContentRail title="Shorts" items={shortCards} language={language} isShorts />
      )}
    </PublicLayout>
  );
};

export default WatchPage;

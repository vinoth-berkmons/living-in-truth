import { useParams, useNavigate, Link } from 'react-router-dom';
import { getDB } from '@/lib/db';
import { PublicLayout } from '@/components/PublicLayout';
import { useLanguageStore, useAuthStore } from '@/stores';
import { t, getTranslation } from '@/lib/i18n';
import { AuthRepo } from '@/repos';

const AccountPage = () => {
  const { workspaceSlug } = useParams<{ workspaceSlug: string }>();
  const navigate = useNavigate();
  const { language } = useLanguageStore();
  const { session, setSession } = useAuthStore();
  const db = getDB();
  const workspace = db ? Object.values(db.workspaces.byId).find(w => w.slug === workspaceSlug && w.status === 'active') : undefined;
  if (!workspace) return null;

  const user = session ? db?.users.byId[session.userId] : null;

  if (!user) {
    return (
      <PublicLayout workspace={workspace}>
        <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-6">
          <div className="text-center">
            <p className="text-muted-foreground">Please sign in to view your account.</p>
            <Link to={`/w/${workspace.slug}/login`} className="mt-4 inline-block rounded-lg bg-primary px-6 py-2 text-sm font-medium text-primary-foreground">{t('nav.login', language)}</Link>
          </div>
        </div>
      </PublicLayout>
    );
  }

  // User subscriptions
  const subIds = db?.subscriptions.idsByUserId[user.id] || [];
  const subs = subIds.map(id => db?.subscriptions.byId[id]).filter(Boolean);
  const progress = db?.progress.filter(p => p.userId === user.id) ?? [];

  const handleLogout = async () => {
    await AuthRepo.logout();
    setSession(null);
    navigate(`/w/${workspace.slug}`);
  };

  return (
    <PublicLayout workspace={workspace}>
      <div className="container mx-auto max-w-2xl px-6 py-8">
        <h1 className="font-heading text-3xl font-bold text-foreground">{t('nav.account', language)}</h1>

        {/* Profile */}
        <div className="mt-6 rounded-lg border border-border bg-card p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary font-heading text-xl font-bold text-primary-foreground">{user.displayName.charAt(0)}</div>
            <div>
              <h2 className="font-heading text-lg font-semibold text-foreground">{user.displayName}</h2>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="mt-4 text-sm text-destructive hover:underline">{t('nav.logout', language)}</button>
        </div>

        {/* Subscriptions */}
        <div className="mt-8">
          <h2 className="font-heading text-xl font-semibold text-foreground">Subscriptions</h2>
          {subs.length > 0 ? (
            <div className="mt-4 space-y-3">
              {subs.map(sub => {
                if (!sub) return null;
                const plan = db?.plans.byId[sub.planId];
                return (
                  <div key={sub.id} className="flex items-center justify-between rounded-lg border border-border bg-card p-4">
                    <div>
                      <p className="font-medium text-foreground">{plan?.name ?? 'Unknown Plan'}</p>
                      <p className="text-xs text-muted-foreground">Status: {sub.status}</p>
                    </div>
                    <span className={`rounded px-2 py-1 text-xs font-medium ${sub.status === 'active' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>{sub.status}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">No active subscriptions.</p>
          )}
        </div>

        {/* Progress */}
        <div className="mt-8">
          <h2 className="font-heading text-xl font-semibold text-foreground">Course Progress</h2>
          {progress.length > 0 ? (
            <div className="mt-4 space-y-3">
              {progress.map(p => {
                const course = db?.courses.byId[p.courseId];
                const cTr = course ? getTranslation(course.translations, language) : undefined;
                return (
                  <div key={`${p.courseId}-${p.workspaceId}`} className="rounded-lg border border-border bg-card p-4">
                    <p className="font-medium text-foreground">{cTr?.title ?? 'Course'}</p>
                    <p className="text-xs text-muted-foreground">{p.completedLessonIds.length} lessons completed</p>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">No courses enrolled yet.</p>
          )}
        </div>
      </div>
    </PublicLayout>
  );
};

export default AccountPage;

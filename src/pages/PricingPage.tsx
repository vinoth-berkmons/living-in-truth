import { useParams, Link } from 'react-router-dom';
import { getDB } from '@/lib/db';
import { PublicLayout } from '@/components/PublicLayout';
import { useLanguageStore } from '@/stores';
import { t } from '@/lib/i18n';

const PricingPage = () => {
  const { workspaceSlug } = useParams<{ workspaceSlug: string }>();
  const { language } = useLanguageStore();
  const db = getDB();
  const workspace = db ? Object.values(db.workspaces.byId).find(w => w.slug === workspaceSlug && w.status === 'active') : undefined;
  if (!workspace || !db) return <div className="flex min-h-screen items-center justify-center bg-background"><p>{t('site.unavailable', language)}</p></div>;

  const allPlans = Object.values(db.plans.byId).filter(p => p.status === 'active');
  const globalPlans = allPlans.filter(p => p.scope === 'global');
  const workspacePlans = allPlans.filter(p => p.scope === 'workspace' && p.workspaceId === workspace.id);

  return (
    <PublicLayout workspace={workspace}>
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-center font-heading text-3xl font-bold text-foreground">{t('nav.pricing', language)}</h1>

        {/* Global Plans */}
        {globalPlans.length > 0 && (
          <div className="mt-10">
            <h2 className="mb-6 text-center font-heading text-xl font-semibold text-foreground">{t('pricing.global', language)}</h2>
            <div className="mx-auto grid max-w-3xl gap-6 sm:grid-cols-2">
              {globalPlans.map(plan => (
                <div key={plan.id} className="rounded-lg border-2 border-primary bg-card p-6 shadow-sm">
                  <h3 className="font-heading text-xl font-bold text-foreground">{plan.name}</h3>
                  <div className="mt-3">
                    <span className="font-heading text-3xl font-bold text-foreground">${plan.price}</span>
                    <span className="text-muted-foreground">{plan.interval === 'monthly' ? t('pricing.month', language) : t('pricing.year', language)}</span>
                  </div>
                  <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                    <li>✓ Premium access to ALL workspaces</li>
                    <li>✓ Unlimited content & videos</li>
                    <li>✓ All courses included</li>
                  </ul>
                  <button className="mt-6 w-full rounded-lg bg-primary py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                    Get Started
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Workspace Plans */}
        {workspacePlans.length > 0 && (
          <div className="mt-12">
            <h2 className="mb-6 text-center font-heading text-xl font-semibold text-foreground">{t('pricing.workspace', language)}</h2>
            <div className="mx-auto grid max-w-3xl gap-6 sm:grid-cols-2">
              {workspacePlans.map(plan => (
                <div key={plan.id} className="rounded-lg border border-border bg-card p-6">
                  <h3 className="font-heading text-xl font-bold text-foreground">{plan.name}</h3>
                  <div className="mt-3">
                    <span className="font-heading text-3xl font-bold text-foreground">${plan.price}</span>
                    <span className="text-muted-foreground">{plan.interval === 'monthly' ? t('pricing.month', language) : t('pricing.year', language)}</span>
                  </div>
                  <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                    <li>✓ Premium access to {workspace.name}</li>
                    <li>✓ All {workspace.name} content</li>
                  </ul>
                  <button className="mt-6 w-full rounded-lg border border-primary bg-transparent py-2.5 text-sm font-medium text-primary hover:bg-primary/5">
                    Subscribe
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </PublicLayout>
  );
};

export default PricingPage;

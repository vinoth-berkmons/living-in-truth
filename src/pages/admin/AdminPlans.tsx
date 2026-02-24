import { useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { getDB } from '@/lib/db';
import { PlanRepo, SubscriptionRepo } from '@/repos';

const AdminPlans = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const db = getDB();
  const plans = db ? Object.values(db.plans.byId) : [];

  const handleArchive = async (id: string) => {
    await PlanRepo.archive(id);
    setRefreshKey(k => k + 1);
  };

  return (
    <AdminLayout requiredPermission="manage_plans">
      <h1 className="font-heading text-2xl font-bold text-foreground">Plans</h1>
      <div className="mt-6 space-y-3" key={refreshKey}>
        {plans.map(plan => {
          const ws = plan.workspaceId ? db?.workspaces.byId[plan.workspaceId] : null;
          return (
            <div key={plan.id} className="flex items-center justify-between rounded-lg border border-border bg-card p-4">
              <div>
                <h3 className="font-medium text-foreground">{plan.name}</h3>
                <p className="text-xs text-muted-foreground">
                  ${plan.price}/{plan.interval} · {plan.scope}{ws ? ` (${ws.name})` : ''} · {plan.status}
                </p>
              </div>
              {plan.status === 'active' && (
                <button onClick={() => handleArchive(plan.id)} className="rounded border border-border px-3 py-1 text-xs text-muted-foreground hover:bg-secondary">Archive</button>
              )}
            </div>
          );
        })}
      </div>
    </AdminLayout>
  );
};

export default AdminPlans;

import { useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { getDB } from '@/lib/db';
import { SubscriptionRepo } from '@/repos';

const AdminSubscriptions = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [assignUserId, setAssignUserId] = useState('');
  const [assignPlanId, setAssignPlanId] = useState('');
  const db = getDB();

  const allSubs = db ? Object.values(db.subscriptions.byId) : [];
  const users = db ? Object.values(db.users.byId) : [];
  const plans = db ? Object.values(db.plans.byId).filter(p => p.status === 'active') : [];

  const handleAssign = async () => {
    if (assignUserId && assignPlanId) {
      await SubscriptionRepo.adminAssignPlan(assignUserId, assignPlanId);
      setRefreshKey(k => k + 1);
      setAssignUserId('');
      setAssignPlanId('');
    }
  };

  const handleCancel = async (subId: string) => {
    await SubscriptionRepo.adminCancelSubscription(subId);
    setRefreshKey(k => k + 1);
  };

  return (
    <AdminLayout requiredPermission="manage_subscriptions">
      <h1 className="font-heading text-2xl font-bold text-foreground">Subscriptions</h1>

      {/* Assign */}
      <div className="mt-6 rounded-lg border border-border bg-card p-4">
        <h2 className="text-sm font-medium text-foreground">Assign Plan to User</h2>
        <div className="mt-3 flex gap-3">
          <select value={assignUserId} onChange={e => setAssignUserId(e.target.value)} className="flex-1 rounded-input border border-border bg-surface px-3 py-2 text-sm text-foreground">
            <option value="">Select user...</option>
            {users.map(u => <option key={u.id} value={u.id}>{u.displayName}</option>)}
          </select>
          <select value={assignPlanId} onChange={e => setAssignPlanId(e.target.value)} className="flex-1 rounded-input border border-border bg-surface px-3 py-2 text-sm text-foreground">
            <option value="">Select plan...</option>
            {plans.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <button onClick={handleAssign} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">Assign</button>
        </div>
      </div>

      {/* List */}
      <div className="mt-6 space-y-3" key={refreshKey}>
        {allSubs.map(sub => {
          const user = db?.users.byId[sub.userId];
          const plan = db?.plans.byId[sub.planId];
          return (
            <div key={sub.id} className="flex items-center justify-between rounded-lg border border-border bg-card p-4">
              <div>
                <h3 className="font-medium text-foreground">{user?.displayName ?? 'Unknown'} — {plan?.name ?? 'Unknown Plan'}</h3>
                <p className="text-xs text-muted-foreground">{sub.status} · {new Date(sub.startAt).toLocaleDateString()} → {new Date(sub.endAt).toLocaleDateString()}</p>
              </div>
              {sub.status === 'active' && (
                <button onClick={() => handleCancel(sub.id)} className="rounded border border-border px-3 py-1 text-xs text-destructive hover:bg-destructive/10">Cancel</button>
              )}
            </div>
          );
        })}
        {allSubs.length === 0 && <p className="text-muted-foreground">No subscriptions yet.</p>}
      </div>
    </AdminLayout>
  );
};

export default AdminSubscriptions;

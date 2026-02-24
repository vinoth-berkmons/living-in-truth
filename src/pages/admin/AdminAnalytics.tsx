import { AdminLayout } from '@/components/AdminLayout';
import { getDB } from '@/lib/db';
import { useAdminWorkspaceStore } from '@/stores';

const AdminAnalytics = () => {
  const { selectedWorkspaceId } = useAdminWorkspaceStore();
  const db = getDB();

  if (!db || !selectedWorkspaceId) return <AdminLayout requiredPermission="view_analytics"><p className="text-muted-foreground">Select a workspace.</p></AdminLayout>;

  const events = db.events.filter(e => e.workspaceId === selectedWorkspaceId);
  const recentEvents = [...events].reverse().slice(0, 50);

  // Group by type
  const byType: Record<string, number> = {};
  events.forEach(e => { byType[e.type] = (byType[e.type] || 0) + 1; });

  return (
    <AdminLayout requiredPermission="view_analytics">
      <h1 className="font-heading text-2xl font-bold text-foreground">Analytics</h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {Object.entries(byType).map(([type, count]) => (
          <div key={type} className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">{type}</p>
            <p className="mt-1 font-heading text-2xl font-bold text-foreground">{count}</p>
          </div>
        ))}
        {Object.keys(byType).length === 0 && <p className="col-span-full text-muted-foreground">No events recorded yet.</p>}
      </div>

      <div className="mt-8">
        <h2 className="font-heading text-lg font-semibold text-foreground">Recent Events</h2>
        <div className="mt-4 space-y-2">
          {recentEvents.map(e => (
            <div key={e.id} className="flex items-center justify-between rounded border border-border bg-card px-3 py-2 text-sm">
              <span className="font-medium text-foreground">{e.type}</span>
              <span className="text-xs text-muted-foreground">{new Date(e.timestamp).toLocaleString()}</span>
            </div>
          ))}
          {recentEvents.length === 0 && <p className="text-sm text-muted-foreground">No events yet.</p>}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminAnalytics;

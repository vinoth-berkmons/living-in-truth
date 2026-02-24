import { useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { getDB } from '@/lib/db';
import { WorkspaceRepo } from '@/repos';
import type { Language } from '@/types/entities';

const AdminWorkspaces = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const db = getDB();
  const workspaces = db ? Object.values(db.workspaces.byId) : [];

  const handleDisable = async (id: string) => {
    await WorkspaceRepo.disable(id);
    setRefreshKey(k => k + 1);
  };

  return (
    <AdminLayout requiredPermission="manage_workspaces">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold text-foreground">Workspaces</h1>
      </div>
      <div className="mt-6 space-y-3" key={refreshKey}>
        {workspaces.map(ws => (
          <div key={ws.id} className="flex items-center justify-between rounded-lg border border-border bg-card p-4">
            <div>
              <h3 className="font-medium text-foreground">{ws.name}</h3>
              <p className="text-xs text-muted-foreground">/{ws.slug} · {ws.enabledLanguages.join(', ')} · {ws.status}</p>
            </div>
            <div className="flex gap-2">
              {ws.status === 'active' && (
                <button onClick={() => handleDisable(ws.id)} className="rounded border border-border px-3 py-1 text-xs text-destructive hover:bg-destructive/10">Disable</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
};

export default AdminWorkspaces;

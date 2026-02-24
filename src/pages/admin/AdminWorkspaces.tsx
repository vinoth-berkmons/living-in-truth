import { useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { getDB } from '@/lib/db';
import { WorkspaceRepo, WorkspaceDomainRepo } from '@/repos';
import { Globe, Trash2, Star, AlertTriangle, Plus } from 'lucide-react';

const AdminWorkspaces = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [newHostnames, setNewHostnames] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const db = getDB();
  const workspaces = db ? Object.values(db.workspaces.byId) : [];
  const allDomains = db ? Object.values(db.workspaceDomains.byId) : [];

  const handleDisable = async (id: string) => {
    await WorkspaceRepo.disable(id);
    setRefreshKey(k => k + 1);
  };

  const handleAddDomain = async (workspaceId: string) => {
    const hostname = newHostnames[workspaceId]?.trim();
    if (!hostname) return;
    setError(null);
    try {
      const wsDomains = allDomains.filter(d => d.workspaceId === workspaceId);
      await WorkspaceDomainRepo.create(hostname, workspaceId, wsDomains.length === 0);
      setNewHostnames(prev => ({ ...prev, [workspaceId]: '' }));
      setRefreshKey(k => k + 1);
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleDeleteDomain = async (domainId: string) => {
    await WorkspaceDomainRepo.delete(domainId);
    setRefreshKey(k => k + 1);
  };

  const handleSetPrimary = async (domainId: string) => {
    await WorkspaceDomainRepo.setPrimary(domainId);
    setRefreshKey(k => k + 1);
  };

  return (
    <AdminLayout requiredPermission="manage_workspaces">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold text-foreground">Workspaces</h1>
      </div>
      {error && (
        <div className="mt-4 rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}
      <div className="mt-6 space-y-6" key={refreshKey}>
        {workspaces.map(ws => {
          const wsDomains = allDomains.filter(d => d.workspaceId === ws.id);
          const hasPrimary = wsDomains.some(d => d.isPrimary);

          return (
            <div key={ws.id} className="rounded-lg border border-border bg-card p-5">
              <div className="flex items-center justify-between">
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

              {/* Domains section */}
              <div className="mt-4 border-t border-border/50 pt-4">
                <div className="mb-2 flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <h4 className="text-sm font-medium text-foreground">Domains</h4>
                  {!hasPrimary && wsDomains.length > 0 && (
                    <span className="flex items-center gap-1 text-xs text-amber-500">
                      <AlertTriangle className="h-3 w-3" />No primary domain
                    </span>
                  )}
                </div>

                {wsDomains.length > 0 ? (
                  <div className="space-y-1">
                    {wsDomains.map(domain => (
                      <div key={domain.id} className="flex items-center justify-between rounded bg-surface px-3 py-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-foreground">{domain.hostname}</span>
                          {domain.isPrimary && (
                            <span className="flex items-center gap-1 rounded bg-primary/10 px-1.5 py-0.5 text-xs font-medium text-primary">
                              <Star className="h-3 w-3" />Primary
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          {!domain.isPrimary && (
                            <button onClick={() => handleSetPrimary(domain.id)} className="rounded px-2 py-1 text-xs text-muted-foreground hover:text-foreground">
                              Set Primary
                            </button>
                          )}
                          <button onClick={() => handleDeleteDomain(domain.id)} className="rounded p-1 text-muted-foreground hover:text-destructive">
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">No domains mapped.</p>
                )}

                {/* Add domain */}
                <div className="mt-2 flex items-center gap-2">
                  <input
                    type="text"
                    value={newHostnames[ws.id] || ''}
                    onChange={e => setNewHostnames(prev => ({ ...prev, [ws.id]: e.target.value }))}
                    placeholder="example.com"
                    className="flex-1 rounded border border-border bg-surface px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground"
                    onKeyDown={e => e.key === 'Enter' && handleAddDomain(ws.id)}
                  />
                  <button
                    onClick={() => handleAddDomain(ws.id)}
                    className="inline-flex items-center gap-1 rounded bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
                  >
                    <Plus className="h-3 w-3" />Add
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </AdminLayout>
  );
};

export default AdminWorkspaces;

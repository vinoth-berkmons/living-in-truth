import { useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { getDB } from '@/lib/db';
import { UserAdminRepo, AuthRepo } from '@/repos';
import { useAuthStore } from '@/stores';

const AdminUsers = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const { setSession } = useAuthStore();
  const db = getDB();
  const users = db ? Object.values(db.users.byId) : [];
  const roles = db ? Object.values(db.roles.byId) : [];

  const handleLoginAs = async (userId: string) => {
    await UserAdminRepo.loginAs(userId);
    const d = getDB();
    if (d?.session) setSession(d.session);
    setRefreshKey(k => k + 1);
  };

  const handleToggleStatus = async (userId: string, current: string) => {
    await UserAdminRepo.setUserStatus(userId, current === 'active' ? 'disabled' : 'active');
    setRefreshKey(k => k + 1);
  };

  return (
    <AdminLayout requiredPermission="manage_users">
      <h1 className="font-heading text-2xl font-bold text-foreground">Users</h1>
      <div className="mt-6 space-y-3" key={refreshKey}>
        {users.map(user => {
          const userRoles = db?.userWorkspaceRoles.filter(r => r.userId === user.id) ?? [];
          return (
            <div key={user.id} className="rounded-lg border border-border bg-card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-foreground">{user.displayName}</h3>
                  <p className="text-xs text-muted-foreground">{user.email} · {user.status}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleLoginAs(user.id)} className="rounded border border-border px-3 py-1 text-xs text-primary hover:bg-primary/5">Login As</button>
                  <button onClick={() => handleToggleStatus(user.id, user.status)} className="rounded border border-border px-3 py-1 text-xs text-muted-foreground hover:bg-secondary">
                    {user.status === 'active' ? 'Disable' : 'Enable'}
                  </button>
                </div>
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {userRoles.map(ur => {
                  const role = db?.roles.byId[ur.roleId];
                  const ws = db?.workspaces.byId[ur.workspaceId];
                  return (
                    <span key={`${ur.workspaceId}-${ur.roleId}`} className="rounded bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
                      {ws?.name}: {role?.name}
                    </span>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;

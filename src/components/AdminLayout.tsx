import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { getDB } from '@/lib/db';
import { useAuthStore, useAdminWorkspaceStore, useThemeStore } from '@/stores';
import { hasPermission, isSuperAdmin, getUserWorkspaceIds } from '@/lib/rbac';
import type { Permission, Workspace } from '@/types/entities';

interface AdminLayoutProps {
  children: React.ReactNode;
  requiredPermission?: Permission;
}

export const AdminLayout = ({ children, requiredPermission }: AdminLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { session, setSession } = useAuthStore();
  const { selectedWorkspaceId, setSelectedWorkspaceId } = useAdminWorkspaceStore();
  const { isDark, toggle } = useThemeStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const db = getDB();

  if (!session || !db) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-foreground">Please log in to access admin.</p>
          <Link to="/" className="mt-4 inline-block text-primary hover:underline">Go to home</Link>
        </div>
      </div>
    );
  }

  const user = db.users.byId[session.userId];
  const isSuper = isSuperAdmin(session.userId);

  // Get workspaces user can access
  const userWsIds = getUserWorkspaceIds(session.userId);
  const allWorkspaces = Object.values(db.workspaces.byId);
  const accessibleWorkspaces = isSuper ? allWorkspaces : allWorkspaces.filter(w => userWsIds.includes(w.id));

  // Auto-select first workspace if none selected
  if (!selectedWorkspaceId && accessibleWorkspaces.length > 0) {
    setSelectedWorkspaceId(accessibleWorkspaces[0].id);
  }

  const currentWs = selectedWorkspaceId ? db.workspaces.byId[selectedWorkspaceId] : null;

  // Permission check
  if (requiredPermission && selectedWorkspaceId && !hasPermission(session.userId, selectedWorkspaceId, requiredPermission)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-foreground">You don't have permission to access this page.</p>
      </div>
    );
  }

  const navItems: { label: string; path: string; permission?: Permission }[] = [
    { label: 'Dashboard', path: '/admin', permission: 'view_analytics' },
    { label: 'Workspaces', path: '/admin/workspaces', permission: 'manage_workspaces' },
    { label: 'Users', path: '/admin/users', permission: 'manage_users' },
    { label: 'Categories', path: '/admin/categories', permission: 'manage_categories' },
    { label: 'Content', path: '/admin/content', permission: 'manage_content' },
    { label: 'Videos', path: '/admin/videos', permission: 'manage_videos' },
    { label: 'Courses', path: '/admin/courses', permission: 'manage_courses' },
    { label: 'Home Layout', path: '/admin/home-layout', permission: 'manage_home_layout' },
    { label: 'Plans', path: '/admin/plans', permission: 'manage_plans' },
    { label: 'Subscriptions', path: '/admin/subscriptions', permission: 'manage_subscriptions' },
    { label: 'Analytics', path: '/admin/analytics', permission: 'view_analytics' },
    { label: 'Settings', path: '/admin/settings', permission: 'manage_settings' },
  ];

  const visibleNav = navItems.filter(item => {
    if (!item.permission) return true;
    if (isSuper) return true;
    if (!selectedWorkspaceId) return false;
    return hasPermission(session.userId, selectedWorkspaceId, item.permission);
  });

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      {sidebarOpen && (
        <aside className="w-60 flex-shrink-0 border-r border-border bg-surface">
          <div className="flex h-14 items-center gap-3 border-b border-border px-4">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-primary font-heading text-xs font-bold text-primary-foreground">LiT</div>
            <span className="font-heading text-sm font-bold text-foreground">Admin</span>
          </div>
          <nav className="space-y-1 p-3">
            {visibleNav.map(item => (
              <Link key={item.path} to={item.path} className={`block rounded-lg px-3 py-2 text-sm transition-colors ${location.pathname === item.path ? 'bg-primary/10 font-medium text-primary' : 'text-foreground hover:bg-secondary'}`}>
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
      )}

      {/* Main */}
      <div className="flex flex-1 flex-col">
        <header className="flex h-14 items-center justify-between border-b border-border bg-surface px-6">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-muted-foreground hover:text-foreground">☰</button>
            {/* Workspace Switcher */}
            <select
              value={selectedWorkspaceId || ''}
              onChange={e => setSelectedWorkspaceId(e.target.value)}
              className="rounded-input border border-border bg-surface px-3 py-1.5 text-sm text-foreground"
            >
              {accessibleWorkspaces.map(ws => (
                <option key={ws.id} value={ws.id}>{ws.name}{ws.status === 'disabled' ? ' (disabled)' : ''}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={toggle} className="rounded-lg border border-border p-1.5 text-sm text-muted-foreground hover:text-foreground">{isDark ? '☀️' : '🌙'}</button>
            <span className="text-sm text-muted-foreground">{user?.displayName}</span>
            <button onClick={() => { setSession(null); navigate('/'); }} className="text-xs text-destructive hover:underline">Logout</button>
          </div>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
};

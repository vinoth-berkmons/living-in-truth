import { getDB } from '@/lib/db';
import type { Permission } from '@/types/entities';

/**
 * Check if a user has a specific permission in a workspace.
 * Super_admin bypasses all checks.
 */
export function hasPermission(userId: string, workspaceId: string, permission: Permission): boolean {
  const db = getDB();
  if (!db) return false;

  // Find user's role in this workspace
  const uwr = db.userWorkspaceRoles.find(
    r => r.userId === userId && r.workspaceId === workspaceId && r.status === 'active'
  );

  if (!uwr) return false;

  const role = db.roles.byId[uwr.roleId];
  if (!role) return false;

  // Super admin bypasses everything
  if (role.name === 'super_admin') return true;

  return role.permissions.includes(permission);
}

/**
 * Check if user is super_admin in ANY workspace (global bypass).
 */
export function isSuperAdmin(userId: string): boolean {
  const db = getDB();
  if (!db) return false;

  return db.userWorkspaceRoles.some(uwr => {
    if (uwr.userId !== userId || uwr.status !== 'active') return false;
    const role = db.roles.byId[uwr.roleId];
    return role?.name === 'super_admin';
  });
}

/**
 * Get all workspace IDs a user has access to (active role).
 */
export function getUserWorkspaceIds(userId: string): string[] {
  const db = getDB();
  if (!db) return [];

  return db.userWorkspaceRoles
    .filter(uwr => uwr.userId === userId && uwr.status === 'active')
    .map(uwr => uwr.workspaceId);
}

/**
 * Check if user can access premium content.
 * Global subscription overrides workspace-specific.
 */
export function canAccessItem(
  userId: string | undefined,
  item: { access: 'free' | 'premium'; workspaceId: string }
): boolean {
  if (item.access === 'free') return true;
  if (!userId) return false;

  const db = getDB();
  if (!db) return false;

  // Admin/super_admin bypass
  if (isSuperAdmin(userId)) return true;

  // Check subscriptions
  const subIds = db.subscriptions.idsByUserId[userId] || [];
  for (const subId of subIds) {
    const sub = db.subscriptions.byId[subId];
    if (!sub || sub.status !== 'active') continue;

    const plan = db.plans.byId[sub.planId];
    if (!plan || plan.status !== 'active') continue;

    // Global plan grants access everywhere
    if (plan.scope === 'global') return true;

    // Workspace plan grants access only in that workspace
    if (plan.scope === 'workspace' && plan.workspaceId === item.workspaceId) return true;
  }

  return false;
}

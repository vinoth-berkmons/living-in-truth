import { getDB } from '@/lib/db';
import { DEFAULT_WORKSPACE_SLUG } from '@/lib/db/config';
import type { Workspace } from '@/types/entities';

export type WorkspaceResolution =
  | { workspace: Workspace; status: 'active' }
  | { workspace: null; status: 'disabled' };

/**
 * Resolve the active workspace from the current hostname.
 * - Normalizes hostname (lowercase, strip www.)
 * - If hostname is mapped to an active workspace: return it
 * - If hostname is mapped to a disabled workspace: return status 'disabled'
 * - If hostname is unmapped (preview/unknown): fall back to DEFAULT_WORKSPACE_SLUG
 */
export function resolveWorkspace(): WorkspaceResolution {
  const db = getDB();
  if (!db) {
    return { workspace: null, status: 'disabled' };
  }

  // Normalize hostname
  let hostname = window.location.hostname.toLowerCase();
  if (hostname.startsWith('www.')) {
    hostname = hostname.slice(4);
  }

  // Look up hostname in domain index
  const workspaceId = db.workspaceDomains.byHostname[hostname];

  if (workspaceId) {
    const workspace = db.workspaces.byId[workspaceId];
    if (workspace && workspace.status === 'active') {
      return { workspace, status: 'active' };
    }
    // Mapped but disabled
    return { workspace: null, status: 'disabled' };
  }

  // Unmapped hostname — fall back to default workspace
  const fallback = Object.values(db.workspaces.byId).find(
    w => w.slug === DEFAULT_WORKSPACE_SLUG && w.status === 'active'
  );

  if (fallback) {
    return { workspace: fallback, status: 'active' };
  }

  // No default workspace found
  return { workspace: null, status: 'disabled' };
}

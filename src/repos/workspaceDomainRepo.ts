import { getDB, updateDB } from '@/lib/db';
import type { WorkspaceDomain } from '@/types/entities';

function normalizeHostname(hostname: string): string {
  let h = hostname.toLowerCase().trim();
  if (h.startsWith('www.')) h = h.slice(4);
  return h;
}

export const WorkspaceDomainRepo = {
  async list(workspaceId?: string): Promise<WorkspaceDomain[]> {
    const db = getDB();
    if (!db) return [];
    let items = Object.values(db.workspaceDomains.byId);
    if (workspaceId) items = items.filter(d => d.workspaceId === workspaceId);
    return items;
  },

  async create(hostname: string, workspaceId: string, isPrimary: boolean): Promise<WorkspaceDomain | null> {
    const normalized = normalizeHostname(hostname);
    const db = getDB();
    if (!db) return null;

    // Validate uniqueness
    if (db.workspaceDomains.byHostname[normalized]) {
      throw new Error(`Hostname "${normalized}" is already mapped to another workspace.`);
    }

    const now = new Date().toISOString();
    const domain: WorkspaceDomain = {
      id: `domain-${crypto.randomUUID().slice(0, 8)}`,
      hostname: normalized,
      workspaceId,
      isPrimary,
      createdAt: now,
      updatedAt: now,
    };

    updateDB(db => {
      // If setting as primary, unset others for this workspace
      if (isPrimary) {
        Object.values(db.workspaceDomains.byId).forEach(d => {
          if (d.workspaceId === workspaceId) d.isPrimary = false;
        });
      }
      db.workspaceDomains.byId[domain.id] = domain;
      db.workspaceDomains.byHostname[normalized] = workspaceId;
      return db;
    });

    return domain;
  },

  async delete(domainId: string): Promise<boolean> {
    let success = false;
    updateDB(db => {
      const domain = db.workspaceDomains.byId[domainId];
      if (!domain) return db;
      delete db.workspaceDomains.byHostname[domain.hostname];
      delete db.workspaceDomains.byId[domainId];
      success = true;
      return db;
    });
    return success;
  },

  async setPrimary(domainId: string): Promise<boolean> {
    let success = false;
    updateDB(db => {
      const domain = db.workspaceDomains.byId[domainId];
      if (!domain) return db;
      // Unset all others for this workspace
      Object.values(db.workspaceDomains.byId).forEach(d => {
        if (d.workspaceId === domain.workspaceId) d.isPrimary = false;
      });
      domain.isPrimary = true;
      domain.updatedAt = new Date().toISOString();
      success = true;
      return db;
    });
    return success;
  },
};

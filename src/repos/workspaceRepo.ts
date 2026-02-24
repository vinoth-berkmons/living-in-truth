import { getDB, updateDB } from '@/lib/db';
import type { Workspace } from '@/types/entities';

export const WorkspaceRepo = {
  async listWorkspaces(mode: 'public' | 'admin' = 'public'): Promise<Workspace[]> {
    const db = getDB();
    if (!db) return [];
    const all = Object.values(db.workspaces.byId);
    return mode === 'public' ? all.filter(w => w.status === 'active') : all;
  },

  async getBySlug(slug: string, mode: 'public' | 'admin' = 'public'): Promise<Workspace | null> {
    const db = getDB();
    if (!db) return null;
    const ws = Object.values(db.workspaces.byId).find(w => w.slug === slug);
    if (!ws) return null;
    if (mode === 'public' && ws.status === 'disabled') return null;
    return ws;
  },

  async getById(id: string): Promise<Workspace | null> {
    const db = getDB();
    return db?.workspaces.byId[id] ?? null;
  },

  async create(data: Omit<Workspace, 'id' | 'createdAt' | 'updatedAt'>): Promise<Workspace> {
    const now = new Date().toISOString();
    const ws: Workspace = {
      ...data,
      id: `ws-${crypto.randomUUID().slice(0, 8)}`,
      createdAt: now,
      updatedAt: now,
    };
    updateDB(db => {
      db.workspaces.byId[ws.id] = ws;
      return db;
    });
    return ws;
  },

  async update(id: string, data: Partial<Workspace>): Promise<Workspace | null> {
    let updated: Workspace | null = null;
    updateDB(db => {
      const existing = db.workspaces.byId[id];
      if (!existing) return db;
      updated = { ...existing, ...data, id, updatedAt: new Date().toISOString() };
      db.workspaces.byId[id] = updated;
      return db;
    });
    return updated;
  },

  async disable(id: string): Promise<boolean> {
    let success = false;
    updateDB(db => {
      if (db.workspaces.byId[id]) {
        db.workspaces.byId[id].status = 'disabled';
        db.workspaces.byId[id].updatedAt = new Date().toISOString();
        success = true;
      }
      return db;
    });
    return success;
  },
};

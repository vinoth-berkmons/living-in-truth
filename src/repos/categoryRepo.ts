import { getDB, updateDB } from '@/lib/db';
import type { Category } from '@/types/entities';

export const CategoryRepo = {
  async list(workspaceId: string): Promise<Category[]> {
    const db = getDB();
    if (!db) return [];
    const orderIds = db.categories.orderByWorkspaceId[workspaceId] || [];
    if (orderIds.length > 0) return orderIds.map(id => db.categories.byId[id]).filter(Boolean) as Category[];
    return Object.values(db.categories.byId).filter(c => c.workspaceId === workspaceId).sort((a, b) => a.sortOrder - b.sortOrder);
  },

  async getBySlug(workspaceId: string, slug: string): Promise<Category | null> {
    const db = getDB();
    if (!db) return null;
    const id = db.categories.slugIndex[workspaceId]?.[slug];
    return id ? db.categories.byId[id] ?? null : null;
  },

  async create(data: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Promise<Category> {
    const now = new Date().toISOString();
    const cat: Category = { ...data, id: `cat-${crypto.randomUUID().slice(0, 8)}`, createdAt: now, updatedAt: now };
    updateDB(db => {
      db.categories.byId[cat.id] = cat;
      if (!db.categories.slugIndex[cat.workspaceId]) db.categories.slugIndex[cat.workspaceId] = {};
      db.categories.slugIndex[cat.workspaceId][cat.slug] = cat.id;
      if (!db.categories.orderByWorkspaceId[cat.workspaceId]) db.categories.orderByWorkspaceId[cat.workspaceId] = [];
      db.categories.orderByWorkspaceId[cat.workspaceId].push(cat.id);
      return db;
    });
    return cat;
  },

  async update(id: string, data: Partial<Category>): Promise<Category | null> {
    let updated: Category | null = null;
    updateDB(db => {
      const existing = db.categories.byId[id];
      if (!existing) return db;
      const oldSlug = existing.slug;
      updated = { ...existing, ...data, id, updatedAt: new Date().toISOString() };
      db.categories.byId[id] = updated;
      if (data.slug && data.slug !== oldSlug) {
        delete db.categories.slugIndex[existing.workspaceId]?.[oldSlug];
        if (!db.categories.slugIndex[updated.workspaceId]) db.categories.slugIndex[updated.workspaceId] = {};
        db.categories.slugIndex[updated.workspaceId][updated.slug] = id;
      }
      return db;
    });
    return updated;
  },

  async delete(id: string): Promise<boolean> {
    let success = false;
    updateDB(db => {
      const cat = db.categories.byId[id];
      if (cat) {
        delete db.categories.slugIndex[cat.workspaceId]?.[cat.slug];
        delete db.categories.byId[id];
        const order = db.categories.orderByWorkspaceId[cat.workspaceId];
        if (order) db.categories.orderByWorkspaceId[cat.workspaceId] = order.filter(cid => cid !== id);
        success = true;
      }
      return db;
    });
    return success;
  },

  async reorder(workspaceId: string, orderedIds: string[]): Promise<void> {
    updateDB(db => {
      db.categories.orderByWorkspaceId[workspaceId] = orderedIds;
      orderedIds.forEach((id, i) => {
        if (db.categories.byId[id]) db.categories.byId[id].sortOrder = i;
      });
      return db;
    });
  },
};

import { getDB, updateDB } from '@/lib/db';
import type { ContentItem, EntityStatus } from '@/types/entities';

export const ContentRepo = {
  async list(workspaceId: string, filters?: { status?: EntityStatus; categoryId?: string; type?: 'article' | 'blog'; access?: 'free' | 'premium' }): Promise<ContentItem[]> {
    const db = getDB();
    if (!db) return [];
    // Check workspace is active for public queries
    const ws = db.workspaces.byId[workspaceId];
    if (!ws || ws.status === 'disabled') return [];
    let items = Object.values(db.content.byId).filter(c => c.workspaceId === workspaceId);
    if (filters?.status) items = items.filter(c => c.status === filters.status);
    if (filters?.categoryId) items = items.filter(c => c.categoryIds.includes(filters.categoryId!));
    if (filters?.type) items = items.filter(c => c.type === filters.type);
    if (filters?.access) items = items.filter(c => c.access === filters.access);
    return items;
  },

  async getBySlug(workspaceId: string, slug: string): Promise<ContentItem | null> {
    const db = getDB();
    if (!db) return null;
    const id = db.content.slugIndex[workspaceId]?.[slug];
    if (!id) return null;
    return db.content.byId[id] ?? null;
  },

  async getById(id: string): Promise<ContentItem | null> {
    const db = getDB();
    return db?.content.byId[id] ?? null;
  },

  async create(data: Omit<ContentItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<ContentItem> {
    const now = new Date().toISOString();
    const item: ContentItem = { ...data, id: `content-${crypto.randomUUID().slice(0, 8)}`, createdAt: now, updatedAt: now };
    updateDB(db => {
      db.content.byId[item.id] = item;
      if (!db.content.slugIndex[item.workspaceId]) db.content.slugIndex[item.workspaceId] = {};
      db.content.slugIndex[item.workspaceId][item.slug] = item.id;
      return db;
    });
    return item;
  },

  async update(id: string, data: Partial<ContentItem>): Promise<ContentItem | null> {
    let updated: ContentItem | null = null;
    updateDB(db => {
      const existing = db.content.byId[id];
      if (!existing) return db;
      const oldSlug = existing.slug;
      updated = { ...existing, ...data, id, updatedAt: new Date().toISOString() };
      db.content.byId[id] = updated;
      if (data.slug && data.slug !== oldSlug) {
        delete db.content.slugIndex[existing.workspaceId]?.[oldSlug];
        if (!db.content.slugIndex[updated.workspaceId]) db.content.slugIndex[updated.workspaceId] = {};
        db.content.slugIndex[updated.workspaceId][updated.slug] = id;
      }
      return db;
    });
    return updated;
  },

  async publish(id: string): Promise<ContentItem | null> {
    return this.update(id, { status: 'published', publishedAt: new Date().toISOString() });
  },

  async unpublish(id: string): Promise<ContentItem | null> {
    return this.update(id, { status: 'draft', publishedAt: null });
  },

  async archive(id: string): Promise<ContentItem | null> {
    return this.update(id, { status: 'archived' });
  },

  async delete(id: string): Promise<boolean> {
    let success = false;
    updateDB(db => {
      const item = db.content.byId[id];
      if (item) {
        delete db.content.slugIndex[item.workspaceId]?.[item.slug];
        delete db.content.byId[id];
        success = true;
      }
      return db;
    });
    return success;
  },
};

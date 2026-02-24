import { getDB, updateDB } from '@/lib/db';
import type { VideoItem, EntityStatus } from '@/types/entities';

export const VideoRepo = {
  async list(workspaceId: string, filters?: { status?: EntityStatus; categoryId?: string; format?: 'short' | 'long'; access?: 'free' | 'premium' }): Promise<VideoItem[]> {
    const db = getDB();
    if (!db) return [];
    const ws = db.workspaces.byId[workspaceId];
    if (!ws || ws.status === 'disabled') return [];
    let items = Object.values(db.videos.byId).filter(v => v.workspaceId === workspaceId);
    if (filters?.status) items = items.filter(v => v.status === filters.status);
    if (filters?.categoryId) items = items.filter(v => v.categoryIds.includes(filters.categoryId!));
    if (filters?.format) items = items.filter(v => v.format === filters.format);
    if (filters?.access) items = items.filter(v => v.access === filters.access);
    return items;
  },

  async getBySlug(workspaceId: string, slug: string): Promise<VideoItem | null> {
    const db = getDB();
    if (!db) return null;
    const id = db.videos.slugIndex[workspaceId]?.[slug];
    return id ? db.videos.byId[id] ?? null : null;
  },

  async getById(id: string): Promise<VideoItem | null> {
    const db = getDB();
    return db?.videos.byId[id] ?? null;
  },

  async create(data: Omit<VideoItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<VideoItem> {
    const now = new Date().toISOString();
    const item: VideoItem = { ...data, id: `video-${crypto.randomUUID().slice(0, 8)}`, createdAt: now, updatedAt: now };
    updateDB(db => {
      db.videos.byId[item.id] = item;
      if (!db.videos.slugIndex[item.workspaceId]) db.videos.slugIndex[item.workspaceId] = {};
      db.videos.slugIndex[item.workspaceId][item.slug] = item.id;
      return db;
    });
    return item;
  },

  async update(id: string, data: Partial<VideoItem>): Promise<VideoItem | null> {
    let updated: VideoItem | null = null;
    updateDB(db => {
      const existing = db.videos.byId[id];
      if (!existing) return db;
      const oldSlug = existing.slug;
      updated = { ...existing, ...data, id, updatedAt: new Date().toISOString() };
      db.videos.byId[id] = updated;
      if (data.slug && data.slug !== oldSlug) {
        delete db.videos.slugIndex[existing.workspaceId]?.[oldSlug];
        if (!db.videos.slugIndex[updated.workspaceId]) db.videos.slugIndex[updated.workspaceId] = {};
        db.videos.slugIndex[updated.workspaceId][updated.slug] = id;
      }
      return db;
    });
    return updated;
  },

  async publish(id: string): Promise<VideoItem | null> {
    return this.update(id, { status: 'published', publishedAt: new Date().toISOString() });
  },

  async archive(id: string): Promise<VideoItem | null> {
    return this.update(id, { status: 'archived' });
  },

  async delete(id: string): Promise<boolean> {
    let success = false;
    updateDB(db => {
      const item = db.videos.byId[id];
      if (item) {
        delete db.videos.slugIndex[item.workspaceId]?.[item.slug];
        delete db.videos.byId[id];
        success = true;
      }
      return db;
    });
    return success;
  },
};

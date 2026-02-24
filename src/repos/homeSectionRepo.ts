import { getDB, updateDB } from '@/lib/db';
import type { HomeSection } from '@/types/entities';

export const HomeSectionRepo = {
  async list(workspaceId: string): Promise<HomeSection[]> {
    const db = getDB();
    if (!db) return [];
    const orderIds = db.homeSections.orderByWorkspaceId[workspaceId] || [];
    if (orderIds.length > 0) return orderIds.map(id => db.homeSections.byId[id]).filter(Boolean) as HomeSection[];
    return Object.values(db.homeSections.byId).filter(hs => hs.workspaceId === workspaceId).sort((a, b) => a.sortOrder - b.sortOrder);
  },

  async create(data: Omit<HomeSection, 'id' | 'createdAt' | 'updatedAt'>): Promise<HomeSection> {
    const now = new Date().toISOString();
    const hs: HomeSection = { ...data, id: `hs-${crypto.randomUUID().slice(0, 8)}`, createdAt: now, updatedAt: now };
    updateDB(db => {
      db.homeSections.byId[hs.id] = hs;
      if (!db.homeSections.orderByWorkspaceId[hs.workspaceId]) db.homeSections.orderByWorkspaceId[hs.workspaceId] = [];
      db.homeSections.orderByWorkspaceId[hs.workspaceId].push(hs.id);
      return db;
    });
    return hs;
  },

  async update(id: string, data: Partial<HomeSection>): Promise<HomeSection | null> {
    let updated: HomeSection | null = null;
    updateDB(db => {
      const existing = db.homeSections.byId[id];
      if (!existing) return db;
      updated = { ...existing, ...data, id, updatedAt: new Date().toISOString() };
      db.homeSections.byId[id] = updated;
      return db;
    });
    return updated;
  },

  async delete(id: string): Promise<boolean> {
    let success = false;
    updateDB(db => {
      const hs = db.homeSections.byId[id];
      if (hs) {
        delete db.homeSections.byId[id];
        const order = db.homeSections.orderByWorkspaceId[hs.workspaceId];
        if (order) db.homeSections.orderByWorkspaceId[hs.workspaceId] = order.filter(hid => hid !== id);
        success = true;
      }
      return db;
    });
    return success;
  },

  async reorder(workspaceId: string, orderedIds: string[]): Promise<void> {
    updateDB(db => {
      db.homeSections.orderByWorkspaceId[workspaceId] = orderedIds;
      orderedIds.forEach((id, i) => {
        if (db.homeSections.byId[id]) db.homeSections.byId[id].sortOrder = i;
      });
      return db;
    });
  },
};

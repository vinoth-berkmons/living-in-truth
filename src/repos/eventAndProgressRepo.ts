import { getDB, updateDB, MAX_EVENTS } from '@/lib/db';
import type { AnalyticsEvent, UserProgress } from '@/types/entities';

export const EventRepo = {
  async track(event: Omit<AnalyticsEvent, 'id' | 'timestamp'>): Promise<void> {
    const entry: AnalyticsEvent = {
      ...event,
      id: `evt-${crypto.randomUUID().slice(0, 8)}`,
      timestamp: new Date().toISOString(),
    };
    updateDB(db => {
      db.events.push(entry);
      // Cap at MAX_EVENTS, oldest-first rotation
      if (db.events.length > MAX_EVENTS) {
        db.events = db.events.slice(db.events.length - MAX_EVENTS);
      }
      return db;
    });
  },

  async trackBatch(events: Omit<AnalyticsEvent, 'id' | 'timestamp'>[]): Promise<void> {
    for (const e of events) await this.track(e);
  },

  async list(filters?: { workspaceId?: string; type?: string; limit?: number }): Promise<AnalyticsEvent[]> {
    const db = getDB();
    if (!db) return [];
    let items = [...db.events];
    if (filters?.workspaceId) items = items.filter(e => e.workspaceId === filters.workspaceId);
    if (filters?.type) items = items.filter(e => e.type === filters.type);
    items.reverse(); // newest first
    if (filters?.limit) items = items.slice(0, filters.limit);
    return items;
  },

  async exportAll(): Promise<AnalyticsEvent[]> {
    const db = getDB();
    return db?.events ?? [];
  },
};

export const ProgressRepo = {
  async enroll(userId: string, workspaceId: string, courseId: string): Promise<UserProgress> {
    const progress: UserProgress = {
      userId, workspaceId, courseId,
      enrolledAt: new Date().toISOString(),
      completedLessonIds: [],
      videoPositions: {},
    };
    updateDB(db => { db.progress.push(progress); return db; });
    return progress;
  },

  async getMyProgress(userId: string, workspaceId?: string): Promise<UserProgress[]> {
    const db = getDB();
    if (!db) return [];
    let items = db.progress.filter(p => p.userId === userId);
    if (workspaceId) items = items.filter(p => p.workspaceId === workspaceId);
    return items;
  },

  async updateLessonProgress(userId: string, courseId: string, lessonId: string): Promise<void> {
    updateDB(db => {
      const p = db.progress.find(pr => pr.userId === userId && pr.courseId === courseId);
      if (p && !p.completedLessonIds.includes(lessonId)) {
        p.completedLessonIds.push(lessonId);
      }
      return db;
    });
  },

  async updateVideoPosition(userId: string, courseId: string, videoId: string, position: number): Promise<void> {
    updateDB(db => {
      const p = db.progress.find(pr => pr.userId === userId && pr.courseId === courseId);
      if (p) p.videoPositions[videoId] = position;
      return db;
    });
  },
};

import { getDB, updateDB } from '@/lib/db';
import type { Course, Module, Lesson, EntityStatus } from '@/types/entities';

export const CourseRepo = {
  async list(workspaceId: string, filters?: { status?: EntityStatus; categoryId?: string; access?: 'free' | 'premium' }): Promise<Course[]> {
    const db = getDB();
    if (!db) return [];
    const ws = db.workspaces.byId[workspaceId];
    if (!ws || ws.status === 'disabled') return [];
    let items = Object.values(db.courses.byId).filter(c => c.workspaceId === workspaceId);
    if (filters?.status) items = items.filter(c => c.status === filters.status);
    if (filters?.categoryId) items = items.filter(c => c.categoryIds.includes(filters.categoryId!));
    if (filters?.access) items = items.filter(c => c.access === filters.access);
    return items;
  },

  async getBySlug(workspaceId: string, slug: string): Promise<Course | null> {
    const db = getDB();
    if (!db) return null;
    const id = db.courses.slugIndex[workspaceId]?.[slug];
    return id ? db.courses.byId[id] ?? null : null;
  },

  async getById(id: string): Promise<Course | null> {
    const db = getDB();
    return db?.courses.byId[id] ?? null;
  },

  async getStructure(courseId: string): Promise<{ course: Course; modules: Module[]; lessons: Lesson[] } | null> {
    const db = getDB();
    if (!db) return null;
    const course = db.courses.byId[courseId];
    if (!course) return null;
    const modules = course.moduleIds.map(id => db.modules.byId[id]).filter(Boolean) as Module[];
    const lessonIds = modules.flatMap(m => m.lessonIds);
    const lessons = lessonIds.map(id => db.lessons.byId[id]).filter(Boolean) as Lesson[];
    return { course, modules, lessons };
  },

  async create(data: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>): Promise<Course> {
    const now = new Date().toISOString();
    const item: Course = { ...data, id: `course-${crypto.randomUUID().slice(0, 8)}`, createdAt: now, updatedAt: now };
    updateDB(db => {
      db.courses.byId[item.id] = item;
      if (!db.courses.slugIndex[item.workspaceId]) db.courses.slugIndex[item.workspaceId] = {};
      db.courses.slugIndex[item.workspaceId][item.slug] = item.id;
      return db;
    });
    return item;
  },

  async update(id: string, data: Partial<Course>): Promise<Course | null> {
    let updated: Course | null = null;
    updateDB(db => {
      const existing = db.courses.byId[id];
      if (!existing) return db;
      const oldSlug = existing.slug;
      updated = { ...existing, ...data, id, updatedAt: new Date().toISOString() };
      db.courses.byId[id] = updated;
      if (data.slug && data.slug !== oldSlug) {
        delete db.courses.slugIndex[existing.workspaceId]?.[oldSlug];
        if (!db.courses.slugIndex[updated.workspaceId]) db.courses.slugIndex[updated.workspaceId] = {};
        db.courses.slugIndex[updated.workspaceId][updated.slug] = id;
      }
      return db;
    });
    return updated;
  },

  async publish(id: string): Promise<Course | null> {
    return this.update(id, { status: 'published', publishedAt: new Date().toISOString() });
  },

  async archive(id: string): Promise<Course | null> {
    return this.update(id, { status: 'archived' });
  },

  async delete(id: string): Promise<boolean> {
    let success = false;
    updateDB(db => {
      const item = db.courses.byId[id];
      if (item) {
        delete db.courses.slugIndex[item.workspaceId]?.[item.slug];
        delete db.courses.byId[id];
        success = true;
      }
      return db;
    });
    return success;
  },
};

export const LessonRepo = {
  async create(data: Omit<Lesson, 'id' | 'createdAt' | 'updatedAt'>): Promise<Lesson> {
    const now = new Date().toISOString();
    const lesson: Lesson = { ...data, id: `lesson-${crypto.randomUUID().slice(0, 8)}`, createdAt: now, updatedAt: now };
    updateDB(db => {
      db.lessons.byId[lesson.id] = lesson;
      const mod = db.modules.byId[lesson.moduleId];
      if (mod) mod.lessonIds.push(lesson.id);
      return db;
    });
    return lesson;
  },

  async update(id: string, data: Partial<Lesson>): Promise<Lesson | null> {
    let updated: Lesson | null = null;
    updateDB(db => {
      const existing = db.lessons.byId[id];
      if (!existing) return db;
      updated = { ...existing, ...data, id, updatedAt: new Date().toISOString() };
      db.lessons.byId[id] = updated;
      return db;
    });
    return updated;
  },

  async delete(id: string): Promise<boolean> {
    let success = false;
    updateDB(db => {
      const lesson = db.lessons.byId[id];
      if (lesson) {
        const mod = db.modules.byId[lesson.moduleId];
        if (mod) mod.lessonIds = mod.lessonIds.filter(lid => lid !== id);
        delete db.lessons.byId[id];
        success = true;
      }
      return db;
    });
    return success;
  },

  async reorder(moduleId: string, orderedIds: string[]): Promise<void> {
    updateDB(db => {
      const mod = db.modules.byId[moduleId];
      if (mod) {
        mod.lessonIds = orderedIds;
        orderedIds.forEach((id, i) => {
          if (db.lessons.byId[id]) db.lessons.byId[id].sortOrder = i;
        });
      }
      return db;
    });
  },
};

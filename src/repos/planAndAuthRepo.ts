import { getDB, updateDB } from '@/lib/db';
import type { Plan, UserSubscription, User, UserWorkspaceRole } from '@/types/entities';

export const PlanRepo = {
  async list(filters?: { scope?: 'global' | 'workspace'; workspaceId?: string; status?: 'active' | 'archived' }): Promise<Plan[]> {
    const db = getDB();
    if (!db) return [];
    let items = Object.values(db.plans.byId);
    if (filters?.scope) items = items.filter(p => p.scope === filters.scope);
    if (filters?.workspaceId) items = items.filter(p => p.workspaceId === filters.workspaceId || p.scope === 'global');
    if (filters?.status) items = items.filter(p => p.status === filters.status);
    return items;
  },

  async create(data: Omit<Plan, 'id' | 'createdAt' | 'updatedAt'>): Promise<Plan> {
    const now = new Date().toISOString();
    const plan: Plan = { ...data, id: `plan-${crypto.randomUUID().slice(0, 8)}`, createdAt: now, updatedAt: now };
    updateDB(db => { db.plans.byId[plan.id] = plan; return db; });
    return plan;
  },

  async update(id: string, data: Partial<Plan>): Promise<Plan | null> {
    let updated: Plan | null = null;
    updateDB(db => {
      const existing = db.plans.byId[id];
      if (!existing) return db;
      updated = { ...existing, ...data, id, updatedAt: new Date().toISOString() };
      db.plans.byId[id] = updated;
      return db;
    });
    return updated;
  },

  async archive(id: string): Promise<Plan | null> {
    return this.update(id, { status: 'archived' });
  },
};

export const SubscriptionRepo = {
  async getMySubscriptions(userId: string): Promise<UserSubscription[]> {
    const db = getDB();
    if (!db) return [];
    const ids = db.subscriptions.idsByUserId[userId] || [];
    return ids.map(id => db.subscriptions.byId[id]).filter(Boolean) as UserSubscription[];
  },

  /** Public: subscribe current user to a plan */
  async subscribe(planId: string): Promise<UserSubscription | null> {
    const db = getDB();
    if (!db?.session) return null;
    const userId = db.session.userId;
    const plan = db.plans.byId[planId];
    if (!plan || plan.status !== 'active') return null;

    const now = new Date().toISOString();
    const endDate = new Date();
    if (plan.interval === 'yearly') {
      endDate.setFullYear(endDate.getFullYear() + 1);
    } else {
      endDate.setMonth(endDate.getMonth() + 1);
    }

    const sub: UserSubscription = {
      id: `sub-${crypto.randomUUID().slice(0, 8)}`,
      userId, planId, status: 'active',
      startAt: now, endAt: endDate.toISOString(),
      provider: 'local',
    };
    updateDB(db => {
      db.subscriptions.byId[sub.id] = sub;
      if (!db.subscriptions.idsByUserId[userId]) db.subscriptions.idsByUserId[userId] = [];
      db.subscriptions.idsByUserId[userId].push(sub.id);
      return db;
    });
    return sub;
  },

  /** Admin: assign a plan to any user */
  async adminAssignPlan(userId: string, planId: string): Promise<UserSubscription> {
    const now = new Date().toISOString();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1);
    const sub: UserSubscription = {
      id: `sub-${crypto.randomUUID().slice(0, 8)}`,
      userId, planId, status: 'active',
      startAt: now, endAt: endDate.toISOString(),
      provider: 'local',
    };
    updateDB(db => {
      db.subscriptions.byId[sub.id] = sub;
      if (!db.subscriptions.idsByUserId[userId]) db.subscriptions.idsByUserId[userId] = [];
      db.subscriptions.idsByUserId[userId].push(sub.id);
      return db;
    });
    return sub;
  },

  async adminCancelSubscription(subId: string): Promise<boolean> {
    let success = false;
    updateDB(db => {
      if (db.subscriptions.byId[subId]) {
        db.subscriptions.byId[subId].status = 'canceled';
        success = true;
      }
      return db;
    });
    return success;
  },
};

export const AuthRepo = {
  async loginGoogle(email: string): Promise<{ user: User; token: string } | null> {
    const db = getDB();
    if (!db) return null;
    const user = Object.values(db.users.byId).find(u => u.email === email);
    if (!user) return null;
    const token = `mock-token-${crypto.randomUUID().slice(0, 8)}`;
    updateDB(d => {
      d.session = { userId: user.id, token, expiresAt: new Date(Date.now() + 86400000).toISOString() };
      return d;
    });
    return { user, token };
  },

  async loginEmailStart(_email: string): Promise<{ success: boolean }> {
    return { success: true }; // Mock: always succeeds
  },

  async loginEmailVerify(email: string, _otp: string): Promise<{ user: User; token: string } | null> {
    return this.loginGoogle(email); // Same mock logic
  },

  async logout(): Promise<void> {
    updateDB(db => { db.session = null; return db; });
  },

  async me(): Promise<User | null> {
    const db = getDB();
    if (!db?.session) return null;
    return db.users.byId[db.session.userId] ?? null;
  },
};

export const UserAdminRepo = {
  async listUsers(): Promise<User[]> {
    const db = getDB();
    if (!db) return [];
    return Object.values(db.users.byId);
  },

  async createUser(data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const now = new Date().toISOString();
    const user: User = { ...data, id: `user-${crypto.randomUUID().slice(0, 8)}`, createdAt: now, updatedAt: now };
    updateDB(db => { db.users.byId[user.id] = user; return db; });
    return user;
  },

  async setWorkspaceRole(userId: string, workspaceId: string, roleId: string): Promise<void> {
    updateDB(db => {
      const existing = db.userWorkspaceRoles.findIndex(r => r.userId === userId && r.workspaceId === workspaceId);
      if (existing >= 0) {
        db.userWorkspaceRoles[existing].roleId = roleId;
        db.userWorkspaceRoles[existing].status = 'active';
      } else {
        db.userWorkspaceRoles.push({ userId, workspaceId, roleId, status: 'active' });
      }
      return db;
    });
  },

  async setUserStatus(userId: string, status: 'active' | 'disabled'): Promise<void> {
    updateDB(db => {
      if (db.users.byId[userId]) {
        db.users.byId[userId].status = status;
        db.users.byId[userId].updatedAt = new Date().toISOString();
      }
      return db;
    });
  },

  async loginAs(userId: string): Promise<void> {
    updateDB(db => {
      const user = db.users.byId[userId];
      if (user) {
        db.session = { userId: user.id, token: `mock-login-as-${user.id}`, expiresAt: new Date(Date.now() + 86400000).toISOString() };
      }
      return db;
    });
  },
};

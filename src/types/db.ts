import type {
  Workspace, User, Role, UserWorkspaceRole,
  ContentItem, VideoItem, Course, Module, Lesson, Category,
  HomeSection, Plan, UserSubscription, AnalyticsEvent, UserProgress, Session,
} from './entities';

export interface SlugIndex {
  [workspaceId: string]: { [slug: string]: string }; // slug → entityId
}

export interface OrderIndex {
  [workspaceId: string]: string[]; // ordered entity IDs
}

export interface AppDatabase {
  version: number;

  // Workspaces
  workspaces: { byId: Record<string, Workspace> };

  // Users & RBAC
  users: { byId: Record<string, User> };
  roles: { byId: Record<string, Role> };
  userWorkspaceRoles: UserWorkspaceRole[];

  // Content
  content: {
    byId: Record<string, ContentItem>;
    slugIndex: SlugIndex;
  };

  // Videos
  videos: {
    byId: Record<string, VideoItem>;
    slugIndex: SlugIndex;
  };

  // Courses
  courses: {
    byId: Record<string, Course>;
    slugIndex: SlugIndex;
  };

  // Modules
  modules: { byId: Record<string, Module> };

  // Lessons
  lessons: { byId: Record<string, Lesson> };

  // Categories
  categories: {
    byId: Record<string, Category>;
    slugIndex: SlugIndex;
    orderByWorkspaceId: OrderIndex;
  };

  // Home Sections
  homeSections: {
    byId: Record<string, HomeSection>;
    orderByWorkspaceId: OrderIndex;
  };

  // Plans & Subscriptions
  plans: { byId: Record<string, Plan> };
  subscriptions: {
    byId: Record<string, UserSubscription>;
    idsByUserId: Record<string, string[]>;
  };

  // Analytics
  events: AnalyticsEvent[];

  // Progress
  progress: UserProgress[];

  // Session
  session: Session | null;
}

export type DataMode = 'local' | 'api';

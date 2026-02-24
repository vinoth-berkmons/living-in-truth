// ========== Core Types ==========

export type Language = 'en' | 'ar' | 'fr' | 'es' | 'de' | 'tr' | 'ta' | 'hi';

export const LANGUAGE_META: Record<Language, { english: string; native: string }> = {
  en: { english: 'English', native: 'English' },
  ar: { english: 'Arabic', native: 'العربية' },
  fr: { english: 'French', native: 'Français' },
  es: { english: 'Spanish', native: 'Español' },
  de: { english: 'German', native: 'Deutsch' },
  tr: { english: 'Turkish', native: 'Türkçe' },
  ta: { english: 'Tamil', native: 'தமிழ்' },
  hi: { english: 'Hindi', native: 'हिन्दी' },
};

export type EntityStatus = 'draft' | 'published' | 'archived';
export type AccessLevel = 'free' | 'premium';
export type WorkspaceStatus = 'active' | 'disabled';
export type PlanScope = 'global' | 'workspace';
export type PlanInterval = 'monthly' | 'yearly';
export type PlanStatus = 'active' | 'archived';
export type SubscriptionStatus = 'active' | 'canceled' | 'expired';
export type VideoFormat = 'short' | 'long';
export type VideoProvider = 'youtube' | 'mp4' | 'hls';
export type LessonType = 'video' | 'text' | 'mixed';
export type HomeSectionType = 'hero_slider' | 'rail';
export type UserStatus = 'active' | 'disabled';
export type UserWorkspaceRoleStatus = 'active' | 'disabled';

// ========== Permission System ==========

export const PERMISSIONS = [
  'view_admin',
  'manage_workspaces',
  'manage_users',
  'manage_categories',
  'manage_content',
  'manage_videos',
  'manage_courses',
  'manage_home_layout',
  'manage_plans',
  'manage_subscriptions',
  'view_analytics',
  'manage_settings',
] as const;

export type Permission = typeof PERMISSIONS[number];

export interface Role {
  id: string;
  name: string; // super_admin | admin | editor | user — for display only
  permissions: Permission[];
}

// ========== Workspace ==========

export interface ThemeOverride {
  accentColor?: string; // HSL string
  logoUrl?: string;
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  status: WorkspaceStatus;
  enabledLanguages: Language[];
  defaultLanguage: Language;
  hideLanguageSwitcher?: boolean;
  themeOverride?: ThemeOverride;
  createdAt: string;
  updatedAt: string;
}

// ========== User & RBAC ==========

export interface User {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}

export interface UserWorkspaceRole {
  userId: string;
  workspaceId: string;
  roleId: string;
  status: UserWorkspaceRoleStatus;
}

// ========== Translations ==========

export type Translations<T> = Partial<Record<Language, T>>;

export interface ContentTranslation {
  title: string;
  excerpt: string;
  bodyHtml: string;
  seoTitle?: string;
  seoDescription?: string;
}

export interface VideoTranslation {
  title: string;
  description: string;
}

export interface CourseTranslation {
  title: string;
  description: string;
}

export interface CategoryTranslation {
  title: string;
  description?: string;
}

export interface LessonTranslation {
  title: string;
  summary?: string;
}

export interface ModuleTranslation {
  title: string;
}

// ========== Content Entities ==========

export interface ContentItem {
  id: string;
  type: 'article' | 'blog';
  slug: string;
  workspaceId: string;
  status: EntityStatus;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  createdByUserId: string;
  updatedByUserId: string;
  categoryIds: string[];
  access: AccessLevel;
  coverImageUrl: string;
  authorName: string;
  translations: Translations<ContentTranslation>;
}

export interface VideoSource {
  provider: VideoProvider;
  url: string;
  youtubeId?: string;
}

export interface VideoItem {
  id: string;
  slug: string;
  workspaceId: string;
  status: EntityStatus;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  createdByUserId: string;
  updatedByUserId: string;
  categoryIds: string[];
  access: AccessLevel;
  format: VideoFormat;
  source: VideoSource;
  translations: Translations<VideoTranslation>;
  coverImageUrl: string;
  durationSeconds?: number;
}

export interface Course {
  id: string;
  slug: string;
  workspaceId: string;
  status: EntityStatus;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  createdByUserId: string;
  updatedByUserId: string;
  categoryIds: string[];
  access: AccessLevel;
  moduleIds: string[];
  translations: Translations<CourseTranslation>;
}

export interface Module {
  id: string;
  courseId: string;
  workspaceId: string;
  sortOrder: number;
  translations: Translations<ModuleTranslation>;
  lessonIds: string[];
}

export interface Lesson {
  id: string;
  courseId: string;
  moduleId: string;
  workspaceId: string;
  sortOrder: number;
  type: LessonType;
  videoId?: string;
  contentId?: string;
  translations: Translations<LessonTranslation>;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  slug: string;
  workspaceId: string;
  parentId: string | null;
  sortOrder: number;
  translations: Translations<CategoryTranslation>;
  createdAt: string;
  updatedAt: string;
}

// ========== Home Sections ==========

export interface ItemRef {
  entityType: 'video' | 'content' | 'course';
  id: string;
}

export interface HomeSectionFilter {
  categoryId?: string;
  format?: VideoFormat;
  type?: 'article' | 'blog';
}

export interface HomeSection {
  id: string;
  workspaceId: string;
  type: HomeSectionType;
  sortOrder: number;
  titleTranslations?: Translations<string>;
  itemRefs?: ItemRef[];
  filter?: HomeSectionFilter;
  createdAt: string;
  updatedAt: string;
}

// ========== Subscriptions & Plans ==========

export interface PlanFeatures {
  premiumAccess: boolean;
}

export interface Plan {
  id: string;
  name: string;
  scope: PlanScope;
  workspaceId: string | null;
  price: number;
  interval: PlanInterval;
  currency: string;
  features: PlanFeatures;
  status: PlanStatus;
  createdAt: string;
  updatedAt: string;
}

export interface UserSubscription {
  id: string;
  userId: string;
  planId: string;
  status: SubscriptionStatus;
  startAt: string;
  endAt: string;
  provider: string;
  providerRef?: string;
}

// ========== Analytics ==========

export interface AnalyticsEvent {
  id: string;
  type: string;
  workspaceId: string;
  userId?: string;
  language?: Language;
  metadata?: Record<string, unknown>;
  timestamp: string;
}

// ========== User Progress ==========

export interface UserProgress {
  userId: string;
  workspaceId: string;
  courseId: string;
  enrolledAt: string;
  completedLessonIds: string[];
  videoPositions: Record<string, number>; // videoId → seconds
}

// ========== Workspace Domains ==========

export interface WorkspaceDomain {
  id: string;
  hostname: string;
  workspaceId: string;
  isPrimary: boolean;
  createdAt: string;
  updatedAt: string;
}

// ========== Session ==========

export interface Session {
  userId: string;
  token: string;
  expiresAt: string;
}

import type { AppDatabase } from '@/types/db';
import type {
  Workspace, User, Role, UserWorkspaceRole,
  Category, ContentItem, VideoItem, Course, Module, Lesson,
  HomeSection, Plan, UserSubscription,
} from '@/types/entities';

const now = '2025-01-01T00:00:00.000Z';

// ========== Workspace IDs ==========
const WS_GLOBAL = 'ws-global-001';
const WS_KIDS = 'ws-kids-002';
const WS_YOUTH = 'ws-youth-003';
const WS_SINGLES = 'ws-singles-004';
const WS_COUPLES = 'ws-couples-005';
const WS_HANDMADES = 'ws-handmades-006';
const WS_SERVANTS = 'ws-servants-007';

// ========== Role IDs ==========
const ROLE_SUPER_ADMIN = 'role-super-admin';
const ROLE_ADMIN = 'role-admin';
const ROLE_EDITOR = 'role-editor';
const ROLE_USER = 'role-user';

// ========== User IDs ==========
const USER_SUPER = 'user-super-001';
const USER_ADMIN = 'user-admin-002';
const USER_EDITOR = 'user-editor-003';
const USER_NORMAL = 'user-normal-004';

// ========== Workspaces ==========
const workspaces: Workspace[] = [
  { id: WS_GLOBAL, name: 'Global', slug: 'global', status: 'active', enabledLanguages: ['en', 'ar'], defaultLanguage: 'en', createdAt: now, updatedAt: now },
  { id: WS_KIDS, name: 'Kids', slug: 'kids', status: 'active', enabledLanguages: ['en', 'ar'], defaultLanguage: 'en', createdAt: now, updatedAt: now },
  { id: WS_YOUTH, name: 'Youth', slug: 'youth', status: 'active', enabledLanguages: ['en'], defaultLanguage: 'en', hideLanguageSwitcher: true, createdAt: now, updatedAt: now },
  { id: WS_SINGLES, name: 'Singles', slug: 'singles', status: 'active', enabledLanguages: ['en'], defaultLanguage: 'en', hideLanguageSwitcher: true, createdAt: now, updatedAt: now },
  { id: WS_COUPLES, name: 'Couples', slug: 'couples', status: 'active', enabledLanguages: ['en', 'ar'], defaultLanguage: 'en', createdAt: now, updatedAt: now },
  { id: WS_HANDMADES, name: 'Handmades', slug: 'handmades', status: 'active', enabledLanguages: ['en'], defaultLanguage: 'en', hideLanguageSwitcher: true, createdAt: now, updatedAt: now },
  { id: WS_SERVANTS, name: 'Servants', slug: 'servants', status: 'active', enabledLanguages: ['en', 'ar'], defaultLanguage: 'en', createdAt: now, updatedAt: now },
];

// ========== Roles ==========
const roles: Role[] = [
  { id: ROLE_SUPER_ADMIN, name: 'super_admin', permissions: ['view_admin','manage_workspaces','manage_users','manage_categories','manage_content','manage_videos','manage_courses','manage_home_layout','manage_plans','manage_subscriptions','view_analytics','manage_settings'] },
  { id: ROLE_ADMIN, name: 'admin', permissions: ['view_admin','manage_users','manage_categories','manage_content','manage_videos','manage_courses','manage_home_layout','manage_plans','manage_subscriptions','view_analytics','manage_settings'] },
  { id: ROLE_EDITOR, name: 'editor', permissions: ['view_admin','manage_categories','manage_content','manage_videos','manage_courses','manage_home_layout'] },
  { id: ROLE_USER, name: 'user', permissions: [] },
];

// ========== Users ==========
const users: User[] = [
  { id: USER_SUPER, email: 'super@livingintruth.app', displayName: 'Super Admin', status: 'active', createdAt: now, updatedAt: now },
  { id: USER_ADMIN, email: 'admin@livingintruth.app', displayName: 'Admin User', status: 'active', createdAt: now, updatedAt: now },
  { id: USER_EDITOR, email: 'editor@livingintruth.app', displayName: 'Editor User', status: 'active', createdAt: now, updatedAt: now },
  { id: USER_NORMAL, email: 'user@livingintruth.app', displayName: 'Regular User', status: 'active', createdAt: now, updatedAt: now },
];

// ========== User Workspace Roles ==========
const allWsIds = [WS_GLOBAL, WS_KIDS, WS_YOUTH, WS_SINGLES, WS_COUPLES, WS_HANDMADES, WS_SERVANTS];

const userWorkspaceRoles: UserWorkspaceRole[] = [
  // Super admin → all workspaces
  ...allWsIds.map(wsId => ({ userId: USER_SUPER, workspaceId: wsId, roleId: ROLE_SUPER_ADMIN, status: 'active' as const })),
  // Admin → all workspaces
  ...allWsIds.map(wsId => ({ userId: USER_ADMIN, workspaceId: wsId, roleId: ROLE_ADMIN, status: 'active' as const })),
  // Editor → Global, Kids, Youth
  { userId: USER_EDITOR, workspaceId: WS_GLOBAL, roleId: ROLE_EDITOR, status: 'active' },
  { userId: USER_EDITOR, workspaceId: WS_KIDS, roleId: ROLE_EDITOR, status: 'active' },
  { userId: USER_EDITOR, workspaceId: WS_YOUTH, roleId: ROLE_EDITOR, status: 'active' },
  // Normal user → Global only (as user role)
  { userId: USER_NORMAL, workspaceId: WS_GLOBAL, roleId: ROLE_USER, status: 'active' },
];

// ========== Categories (2 per workspace for Global & Kids) ==========
const categories: Category[] = [
  { id: 'cat-global-faith', slug: 'faith', workspaceId: WS_GLOBAL, parentId: null, sortOrder: 0, translations: { en: { title: 'Faith', description: 'Articles and resources on faith' } }, createdAt: now, updatedAt: now },
  { id: 'cat-global-life', slug: 'life', workspaceId: WS_GLOBAL, parentId: null, sortOrder: 1, translations: { en: { title: 'Life', description: 'Practical Christian living' } }, createdAt: now, updatedAt: now },
  { id: 'cat-kids-stories', slug: 'stories', workspaceId: WS_KIDS, parentId: null, sortOrder: 0, translations: { en: { title: 'Bible Stories', description: 'Stories for kids' } }, createdAt: now, updatedAt: now },
  { id: 'cat-kids-songs', slug: 'songs', workspaceId: WS_KIDS, parentId: null, sortOrder: 1, translations: { en: { title: 'Songs', description: 'Worship songs for kids' } }, createdAt: now, updatedAt: now },
  { id: 'cat-youth-devotion', slug: 'devotions', workspaceId: WS_YOUTH, parentId: null, sortOrder: 0, translations: { en: { title: 'Devotions', description: 'Daily youth devotions' } }, createdAt: now, updatedAt: now },
];

// ========== Content Items ==========
const contentItems: ContentItem[] = [
  {
    id: 'content-global-001', type: 'article', slug: 'walking-in-faith', workspaceId: WS_GLOBAL,
    status: 'published', publishedAt: now, createdAt: now, updatedAt: now,
    createdByUserId: USER_ADMIN, updatedByUserId: USER_ADMIN,
    categoryIds: ['cat-global-faith'], access: 'free',
    coverImageUrl: 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=800',
    authorName: 'Admin User',
    translations: { en: { title: 'Walking in Faith', excerpt: 'Discover what it means to walk by faith daily.', bodyHtml: '<p>Faith is not just belief — it is a daily walk...</p>', seoTitle: 'Walking in Faith', seoDescription: 'Learn about daily faith practices' } },
  },
  {
    id: 'content-global-002', type: 'blog', slug: 'grace-in-action', workspaceId: WS_GLOBAL,
    status: 'published', publishedAt: now, createdAt: now, updatedAt: now,
    createdByUserId: USER_EDITOR, updatedByUserId: USER_EDITOR,
    categoryIds: ['cat-global-life'], access: 'premium',
    coverImageUrl: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800',
    authorName: 'Editor User',
    translations: { en: { title: 'Grace in Action', excerpt: 'How grace transforms our everyday lives.', bodyHtml: '<p>Grace is more than a concept — it is a lifestyle...</p>', seoTitle: 'Grace in Action', seoDescription: 'How grace transforms everyday life' } },
  },
  {
    id: 'content-kids-001', type: 'article', slug: 'david-and-goliath', workspaceId: WS_KIDS,
    status: 'published', publishedAt: now, createdAt: now, updatedAt: now,
    createdByUserId: USER_ADMIN, updatedByUserId: USER_ADMIN,
    categoryIds: ['cat-kids-stories'], access: 'free',
    coverImageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800',
    authorName: 'Admin User',
    translations: { en: { title: 'David and Goliath', excerpt: 'The story of a boy who trusted God.', bodyHtml: '<p>Long ago, a shepherd boy named David faced a giant...</p>' } },
  },
];

// ========== Video Items ==========
const videoItems: VideoItem[] = [
  {
    id: 'video-global-001', slug: 'sunday-sermon-intro', workspaceId: WS_GLOBAL,
    status: 'published', publishedAt: now, createdAt: now, updatedAt: now,
    createdByUserId: USER_ADMIN, updatedByUserId: USER_ADMIN,
    categoryIds: ['cat-global-faith'], access: 'free', format: 'long',
    source: { provider: 'youtube', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', youtubeId: 'dQw4w9WgXcQ' },
    translations: { en: { title: 'Sunday Sermon: Introduction', description: 'Opening sermon for the new series.' } },
    coverImageUrl: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=800',
    durationSeconds: 1800,
  },
  {
    id: 'video-global-002', slug: 'faith-moment', workspaceId: WS_GLOBAL,
    status: 'published', publishedAt: now, createdAt: now, updatedAt: now,
    createdByUserId: USER_EDITOR, updatedByUserId: USER_EDITOR,
    categoryIds: ['cat-global-life'], access: 'free', format: 'short',
    source: { provider: 'youtube', url: 'https://www.youtube.com/shorts/abc123', youtubeId: 'abc123' },
    translations: { en: { title: 'Faith Moment', description: 'A quick faith inspiration.' } },
    coverImageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
    durationSeconds: 58,
  },
  {
    id: 'video-kids-001', slug: 'noahs-ark-song', workspaceId: WS_KIDS,
    status: 'published', publishedAt: now, createdAt: now, updatedAt: now,
    createdByUserId: USER_ADMIN, updatedByUserId: USER_ADMIN,
    categoryIds: ['cat-kids-songs'], access: 'free', format: 'long',
    source: { provider: 'youtube', url: 'https://www.youtube.com/watch?v=xyz789', youtubeId: 'xyz789' },
    translations: { en: { title: "Noah's Ark Song", description: 'A fun song about Noah and the animals.' } },
    coverImageUrl: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800',
    durationSeconds: 240,
  },
];

// ========== Courses, Modules, Lessons ==========
const courses: Course[] = [
  {
    id: 'course-global-001', slug: 'foundations-of-faith', workspaceId: WS_GLOBAL,
    status: 'published', publishedAt: now, createdAt: now, updatedAt: now,
    createdByUserId: USER_ADMIN, updatedByUserId: USER_ADMIN,
    categoryIds: ['cat-global-faith'], access: 'free',
    moduleIds: ['mod-global-001'],
    translations: { en: { title: 'Foundations of Faith', description: 'A beginner course on Christian foundations.' } },
  },
];

const modules: Module[] = [
  {
    id: 'mod-global-001', courseId: 'course-global-001', workspaceId: WS_GLOBAL,
    sortOrder: 0,
    translations: { en: { title: 'Getting Started' } },
    lessonIds: ['lesson-global-001', 'lesson-global-002'],
  },
];

const lessons: Lesson[] = [
  {
    id: 'lesson-global-001', courseId: 'course-global-001', moduleId: 'mod-global-001', workspaceId: WS_GLOBAL,
    sortOrder: 0, type: 'video', videoId: 'video-global-001',
    translations: { en: { title: 'Lesson 1: What is Faith?', summary: 'An introduction to faith.' } },
    createdAt: now, updatedAt: now,
  },
  {
    id: 'lesson-global-002', courseId: 'course-global-001', moduleId: 'mod-global-001', workspaceId: WS_GLOBAL,
    sortOrder: 1, type: 'text', contentId: 'content-global-001',
    translations: { en: { title: 'Lesson 2: Walking Daily', summary: 'Practical daily faith.' } },
    createdAt: now, updatedAt: now,
  },
];

// ========== Home Sections ==========
const homeSections: HomeSection[] = [
  // Global workspace
  {
    id: 'hs-global-hero', workspaceId: WS_GLOBAL, type: 'hero_slider', sortOrder: 0,
    itemRefs: [
      { entityType: 'content', id: 'content-global-001' },
      { entityType: 'video', id: 'video-global-001' },
      { entityType: 'course', id: 'course-global-001' },
    ],
    createdAt: now, updatedAt: now,
  },
  {
    id: 'hs-global-latest', workspaceId: WS_GLOBAL, type: 'rail', sortOrder: 1,
    titleTranslations: { en: 'Latest Articles' },
    filter: { type: 'article' },
    createdAt: now, updatedAt: now,
  },
  // Kids workspace
  {
    id: 'hs-kids-hero', workspaceId: WS_KIDS, type: 'hero_slider', sortOrder: 0,
    itemRefs: [
      { entityType: 'content', id: 'content-kids-001' },
      { entityType: 'video', id: 'video-kids-001' },
    ],
    createdAt: now, updatedAt: now,
  },
  {
    id: 'hs-kids-songs', workspaceId: WS_KIDS, type: 'rail', sortOrder: 1,
    titleTranslations: { en: 'Songs' },
    filter: { categoryId: 'cat-kids-songs' },
    createdAt: now, updatedAt: now,
  },
];

// ========== Plans ==========
const plans: Plan[] = [
  {
    id: 'plan-all-access', name: 'All Access', scope: 'global', workspaceId: null,
    price: 9.99, interval: 'monthly', currency: 'USD',
    features: { premiumAccess: true }, status: 'active',
    createdAt: now, updatedAt: now,
  },
  {
    id: 'plan-kids-premium', name: 'Kids Premium', scope: 'workspace', workspaceId: WS_KIDS,
    price: 4.99, interval: 'monthly', currency: 'USD',
    features: { premiumAccess: true }, status: 'active',
    createdAt: now, updatedAt: now,
  },
  {
    id: 'plan-youth-premium', name: 'Youth Premium', scope: 'workspace', workspaceId: WS_YOUTH,
    price: 4.99, interval: 'monthly', currency: 'USD',
    features: { premiumAccess: true }, status: 'active',
    createdAt: now, updatedAt: now,
  },
];

// ========== Helper: build indexes ==========
function toById<T extends { id: string }>(arr: T[]): Record<string, T> {
  const map: Record<string, T> = {};
  for (const item of arr) map[item.id] = item;
  return map;
}

function buildSlugIndex(items: { id: string; slug: string; workspaceId: string }[]): Record<string, Record<string, string>> {
  const idx: Record<string, Record<string, string>> = {};
  for (const item of items) {
    if (!idx[item.workspaceId]) idx[item.workspaceId] = {};
    idx[item.workspaceId][item.slug] = item.id;
  }
  return idx;
}

function buildOrderIndex(items: { id: string; workspaceId: string; sortOrder: number }[]): Record<string, string[]> {
  const groups: Record<string, typeof items> = {};
  for (const item of items) {
    if (!groups[item.workspaceId]) groups[item.workspaceId] = [];
    groups[item.workspaceId].push(item);
  }
  const idx: Record<string, string[]> = {};
  for (const [wsId, group] of Object.entries(groups)) {
    idx[wsId] = group.sort((a, b) => a.sortOrder - b.sortOrder).map(i => i.id);
  }
  return idx;
}

// ========== Export seed ==========
export const SEED_DB_V1: AppDatabase = {
  version: 1,

  workspaces: { byId: toById(workspaces) },
  users: { byId: toById(users) },
  roles: { byId: toById(roles) },
  userWorkspaceRoles,

  content: {
    byId: toById(contentItems),
    slugIndex: buildSlugIndex(contentItems),
  },
  videos: {
    byId: toById(videoItems),
    slugIndex: buildSlugIndex(videoItems),
  },
  courses: {
    byId: toById(courses),
    slugIndex: buildSlugIndex(courses),
  },
  modules: { byId: toById(modules) },
  lessons: { byId: toById(lessons) },
  categories: {
    byId: toById(categories),
    slugIndex: buildSlugIndex(categories),
    orderByWorkspaceId: buildOrderIndex(categories),
  },
  homeSections: {
    byId: toById(homeSections),
    orderByWorkspaceId: buildOrderIndex(homeSections),
  },
  plans: { byId: toById(plans) },
  subscriptions: { byId: {}, idsByUserId: {} },
  events: [],
  progress: [],
  session: null,
};

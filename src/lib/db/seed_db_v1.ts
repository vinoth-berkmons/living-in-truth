import type { AppDatabase } from '@/types/db';
import type {
  Workspace, User, Role, UserWorkspaceRole,
  Category, ContentItem, VideoItem, Course, Module, Lesson,
  HomeSection, Plan, UserSubscription, WorkspaceDomain,
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
  { id: WS_GLOBAL, name: 'Global', slug: 'global', status: 'active', enabledLanguages: ['en', 'ar', 'ta'], defaultLanguage: 'en', themeOverride: { accentColor: '175 46% 44%' }, createdAt: now, updatedAt: now },
  { id: WS_KIDS, name: 'Kids', slug: 'kids', status: 'active', enabledLanguages: ['en', 'ar'], defaultLanguage: 'en', themeOverride: { accentColor: '37 90% 55%' }, createdAt: now, updatedAt: now },
  { id: WS_YOUTH, name: 'Youth', slug: 'youth', status: 'active', enabledLanguages: ['en'], defaultLanguage: 'en', hideLanguageSwitcher: true, themeOverride: { accentColor: '262 52% 55%' }, createdAt: now, updatedAt: now },
  { id: WS_SINGLES, name: 'Singles', slug: 'singles', status: 'active', enabledLanguages: ['en'], defaultLanguage: 'en', hideLanguageSwitcher: true, themeOverride: { accentColor: '346 77% 55%' }, createdAt: now, updatedAt: now },
  { id: WS_COUPLES, name: 'Couples', slug: 'couples', status: 'active', enabledLanguages: ['en', 'ar'], defaultLanguage: 'en', themeOverride: { accentColor: '0 72% 55%' }, createdAt: now, updatedAt: now },
  { id: WS_HANDMADES, name: 'Handmades', slug: 'handmades', status: 'active', enabledLanguages: ['en'], defaultLanguage: 'en', hideLanguageSwitcher: true, themeOverride: { accentColor: '25 70% 50%' }, createdAt: now, updatedAt: now },
  { id: WS_SERVANTS, name: 'Servants', slug: 'servants', status: 'active', enabledLanguages: ['en', 'ar'], defaultLanguage: 'en', themeOverride: { accentColor: '210 60% 50%' }, createdAt: now, updatedAt: now },
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
  ...allWsIds.map(wsId => ({ userId: USER_SUPER, workspaceId: wsId, roleId: ROLE_SUPER_ADMIN, status: 'active' as const })),
  ...allWsIds.map(wsId => ({ userId: USER_ADMIN, workspaceId: wsId, roleId: ROLE_ADMIN, status: 'active' as const })),
  { userId: USER_EDITOR, workspaceId: WS_GLOBAL, roleId: ROLE_EDITOR, status: 'active' },
  { userId: USER_EDITOR, workspaceId: WS_KIDS, roleId: ROLE_EDITOR, status: 'active' },
  { userId: USER_EDITOR, workspaceId: WS_YOUTH, roleId: ROLE_EDITOR, status: 'active' },
  { userId: USER_NORMAL, workspaceId: WS_GLOBAL, roleId: ROLE_USER, status: 'active' },
];

// ========== Categories ==========
const categories: Category[] = [
  { id: 'cat-global-faith', slug: 'faith', workspaceId: WS_GLOBAL, parentId: null, sortOrder: 0, translations: { en: { title: 'Faith', description: 'Articles and resources on faith' } }, createdAt: now, updatedAt: now },
  { id: 'cat-global-life', slug: 'life', workspaceId: WS_GLOBAL, parentId: null, sortOrder: 1, translations: { en: { title: 'Life', description: 'Practical Christian living' } }, createdAt: now, updatedAt: now },
  { id: 'cat-global-worship', slug: 'worship', workspaceId: WS_GLOBAL, parentId: null, sortOrder: 2, translations: { en: { title: 'Worship', description: 'Worship and praise' } }, createdAt: now, updatedAt: now },
  { id: 'cat-global-sermons', slug: 'sermons', workspaceId: WS_GLOBAL, parentId: null, sortOrder: 3, translations: { en: { title: 'Sermons', description: 'Sunday sermons and teaching' } }, createdAt: now, updatedAt: now },
  { id: 'cat-kids-stories', slug: 'stories', workspaceId: WS_KIDS, parentId: null, sortOrder: 0, translations: { en: { title: 'Bible Stories', description: 'Stories for kids' } }, createdAt: now, updatedAt: now },
  { id: 'cat-kids-songs', slug: 'songs', workspaceId: WS_KIDS, parentId: null, sortOrder: 1, translations: { en: { title: 'Songs', description: 'Worship songs for kids' } }, createdAt: now, updatedAt: now },
  { id: 'cat-kids-crafts', slug: 'crafts', workspaceId: WS_KIDS, parentId: null, sortOrder: 2, translations: { en: { title: 'Crafts', description: 'Creative activities' } }, createdAt: now, updatedAt: now },
  { id: 'cat-youth-devotion', slug: 'devotions', workspaceId: WS_YOUTH, parentId: null, sortOrder: 0, translations: { en: { title: 'Devotions', description: 'Daily youth devotions' } }, createdAt: now, updatedAt: now },
  { id: 'cat-youth-talks', slug: 'talks', workspaceId: WS_YOUTH, parentId: null, sortOrder: 1, translations: { en: { title: 'Talks', description: 'Youth talks and discussions' } }, createdAt: now, updatedAt: now },
];

// ========== Content Items ==========
const contentItems: ContentItem[] = [
  {
    id: 'content-global-001', type: 'article', slug: 'walking-in-faith', workspaceId: WS_GLOBAL,
    status: 'published', publishedAt: now, createdAt: now, updatedAt: now,
    createdByUserId: USER_ADMIN, updatedByUserId: USER_ADMIN,
    categoryIds: ['cat-global-faith'], access: 'free',
    coverImageUrl: 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=800&q=80',
    authorName: 'Admin User',
    translations: { en: { title: 'Walking in Faith', excerpt: 'Discover what it means to walk by faith every single day of your life.', bodyHtml: '<p>Faith is not just belief — it is a daily walk. Every morning we choose to trust God with our plans, our fears, and our hopes.</p><h2>What Does Walking in Faith Look Like?</h2><p>Walking in faith means stepping forward even when you cannot see the full path ahead. It is trusting that God is faithful even when circumstances say otherwise.</p>', seoTitle: 'Walking in Faith', seoDescription: 'Learn about daily faith practices' } },
  },
  {
    id: 'content-global-002', type: 'blog', slug: 'grace-in-action', workspaceId: WS_GLOBAL,
    status: 'published', publishedAt: now, createdAt: now, updatedAt: now,
    createdByUserId: USER_EDITOR, updatedByUserId: USER_EDITOR,
    categoryIds: ['cat-global-life'], access: 'premium',
    coverImageUrl: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800&q=80',
    authorName: 'Editor User',
    translations: { en: { title: 'Grace in Action', excerpt: 'How grace transforms our everyday lives and relationships with those around us.', bodyHtml: '<p>Grace is more than a concept — it is a lifestyle that transforms every interaction.</p>', seoTitle: 'Grace in Action', seoDescription: 'How grace transforms everyday life' } },
  },
  {
    id: 'content-global-003', type: 'article', slug: 'power-of-prayer', workspaceId: WS_GLOBAL,
    status: 'published', publishedAt: now, createdAt: now, updatedAt: now,
    createdByUserId: USER_ADMIN, updatedByUserId: USER_ADMIN,
    categoryIds: ['cat-global-worship'], access: 'free',
    coverImageUrl: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?w=800&q=80',
    authorName: 'Admin User',
    translations: { en: { title: 'The Power of Prayer', excerpt: 'Understanding the transformative power of consistent, heartfelt prayer.', bodyHtml: '<p>Prayer is the foundation of our relationship with God.</p>' } },
  },
  {
    id: 'content-global-004', type: 'blog', slug: 'community-matters', workspaceId: WS_GLOBAL,
    status: 'published', publishedAt: now, createdAt: now, updatedAt: now,
    createdByUserId: USER_EDITOR, updatedByUserId: USER_EDITOR,
    categoryIds: ['cat-global-life'], access: 'free',
    coverImageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80',
    authorName: 'Editor User',
    translations: { en: { title: 'Why Community Matters', excerpt: 'The biblical case for living in authentic community with fellow believers.', bodyHtml: '<p>We were never meant to walk alone.</p>' } },
  },
  {
    id: 'content-global-005', type: 'article', slug: 'finding-purpose', workspaceId: WS_GLOBAL,
    status: 'published', publishedAt: now, createdAt: now, updatedAt: now,
    createdByUserId: USER_ADMIN, updatedByUserId: USER_ADMIN,
    categoryIds: ['cat-global-faith'], access: 'premium',
    coverImageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80',
    authorName: 'Admin User',
    translations: { en: { title: 'Finding Your Purpose', excerpt: 'A deep dive into discovering God\'s unique calling for your life.', bodyHtml: '<p>God has a purpose for every single person.</p>' } },
  },
  {
    id: 'content-kids-001', type: 'article', slug: 'david-and-goliath', workspaceId: WS_KIDS,
    status: 'published', publishedAt: now, createdAt: now, updatedAt: now,
    createdByUserId: USER_ADMIN, updatedByUserId: USER_ADMIN,
    categoryIds: ['cat-kids-stories'], access: 'free',
    coverImageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80',
    authorName: 'Admin User',
    translations: { en: { title: 'David and Goliath', excerpt: 'The amazing story of a brave boy who trusted God against a giant.', bodyHtml: '<p>Long ago, a shepherd boy named David faced a giant named Goliath...</p>' } },
  },
  {
    id: 'content-kids-002', type: 'article', slug: 'noahs-adventure', workspaceId: WS_KIDS,
    status: 'published', publishedAt: now, createdAt: now, updatedAt: now,
    createdByUserId: USER_ADMIN, updatedByUserId: USER_ADMIN,
    categoryIds: ['cat-kids-stories'], access: 'free',
    coverImageUrl: 'https://images.unsplash.com/photo-1535930749574-1399327ce78f?w=800&q=80',
    authorName: 'Admin User',
    translations: { en: { title: "Noah's Great Adventure", excerpt: 'How Noah built a big boat and saved all the animals.', bodyHtml: '<p>God told Noah to build a really big boat...</p>' } },
  },
];

// ========== Video Items ==========
const videoItems: VideoItem[] = [
  {
    id: 'video-global-001', slug: 'sunday-sermon-intro', workspaceId: WS_GLOBAL,
    status: 'published', publishedAt: now, createdAt: now, updatedAt: now,
    createdByUserId: USER_ADMIN, updatedByUserId: USER_ADMIN,
    categoryIds: ['cat-global-sermons'], access: 'free', format: 'long',
    source: { provider: 'youtube', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', youtubeId: 'dQw4w9WgXcQ' },
    translations: { en: { title: 'Sunday Sermon: New Beginnings', description: 'Pastor opens the new sermon series about fresh starts and new perspectives in faith.' } },
    coverImageUrl: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=800&q=80',
    durationSeconds: 1800,
  },
  {
    id: 'video-global-002', slug: 'faith-moment', workspaceId: WS_GLOBAL,
    status: 'published', publishedAt: now, createdAt: now, updatedAt: now,
    createdByUserId: USER_EDITOR, updatedByUserId: USER_EDITOR,
    categoryIds: ['cat-global-faith'], access: 'free', format: 'short',
    source: { provider: 'youtube', url: 'https://www.youtube.com/shorts/abc123', youtubeId: 'dQw4w9WgXcQ' },
    translations: { en: { title: 'Faith Moment: Trust God', description: 'A quick 60-second faith inspiration for your day.' } },
    coverImageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
    durationSeconds: 58,
  },
  {
    id: 'video-global-003', slug: 'worship-night-highlights', workspaceId: WS_GLOBAL,
    status: 'published', publishedAt: now, createdAt: now, updatedAt: now,
    createdByUserId: USER_ADMIN, updatedByUserId: USER_ADMIN,
    categoryIds: ['cat-global-worship'], access: 'free', format: 'long',
    source: { provider: 'youtube', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', youtubeId: 'dQw4w9WgXcQ' },
    translations: { en: { title: 'Worship Night Highlights', description: 'Best moments from our latest worship night event.' } },
    coverImageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80',
    durationSeconds: 2400,
  },
  {
    id: 'video-global-004', slug: 'daily-devotional-peace', workspaceId: WS_GLOBAL,
    status: 'published', publishedAt: now, createdAt: now, updatedAt: now,
    createdByUserId: USER_EDITOR, updatedByUserId: USER_EDITOR,
    categoryIds: ['cat-global-life'], access: 'premium', format: 'long',
    source: { provider: 'youtube', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', youtubeId: 'dQw4w9WgXcQ' },
    translations: { en: { title: 'Finding Peace in Chaos', description: 'A deep devotional on finding God\'s peace during turbulent times.' } },
    coverImageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    durationSeconds: 1200,
  },
  {
    id: 'video-global-005', slug: 'praise-moment-short', workspaceId: WS_GLOBAL,
    status: 'published', publishedAt: now, createdAt: now, updatedAt: now,
    createdByUserId: USER_ADMIN, updatedByUserId: USER_ADMIN,
    categoryIds: ['cat-global-worship'], access: 'free', format: 'short',
    source: { provider: 'youtube', url: 'https://www.youtube.com/shorts/xyz', youtubeId: 'dQw4w9WgXcQ' },
    translations: { en: { title: 'Praise Moment', description: 'A short praise clip to brighten your day.' } },
    coverImageUrl: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800&q=80',
    durationSeconds: 45,
  },
  {
    id: 'video-global-006', slug: 'bible-study-genesis', workspaceId: WS_GLOBAL,
    status: 'published', publishedAt: now, createdAt: now, updatedAt: now,
    createdByUserId: USER_ADMIN, updatedByUserId: USER_ADMIN,
    categoryIds: ['cat-global-faith'], access: 'free', format: 'long',
    source: { provider: 'youtube', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', youtubeId: 'dQw4w9WgXcQ' },
    translations: { en: { title: 'Bible Study: Genesis Chapter 1', description: 'An in-depth look at the creation story and what it means for us today.' } },
    coverImageUrl: 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=800&q=80',
    durationSeconds: 2700,
  },
  {
    id: 'video-kids-001', slug: 'noahs-ark-song', workspaceId: WS_KIDS,
    status: 'published', publishedAt: now, createdAt: now, updatedAt: now,
    createdByUserId: USER_ADMIN, updatedByUserId: USER_ADMIN,
    categoryIds: ['cat-kids-songs'], access: 'free', format: 'long',
    source: { provider: 'youtube', url: 'https://www.youtube.com/watch?v=xyz789', youtubeId: 'dQw4w9WgXcQ' },
    translations: { en: { title: "Noah's Ark Song", description: 'A fun, colorful song about Noah and all the animals on the ark!' } },
    coverImageUrl: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&q=80',
    durationSeconds: 240,
  },
  {
    id: 'video-kids-002', slug: 'creation-story-animated', workspaceId: WS_KIDS,
    status: 'published', publishedAt: now, createdAt: now, updatedAt: now,
    createdByUserId: USER_ADMIN, updatedByUserId: USER_ADMIN,
    categoryIds: ['cat-kids-stories'], access: 'free', format: 'long',
    source: { provider: 'youtube', url: 'https://www.youtube.com/watch?v=xyz789', youtubeId: 'dQw4w9WgXcQ' },
    translations: { en: { title: 'The Creation Story (Animated)', description: 'Watch the amazing story of how God created the world in this colorful animation.' } },
    coverImageUrl: 'https://images.unsplash.com/photo-1535930749574-1399327ce78f?w=800&q=80',
    durationSeconds: 480,
  },
  {
    id: 'video-kids-003', slug: 'praise-dance-kids', workspaceId: WS_KIDS,
    status: 'published', publishedAt: now, createdAt: now, updatedAt: now,
    createdByUserId: USER_ADMIN, updatedByUserId: USER_ADMIN,
    categoryIds: ['cat-kids-songs'], access: 'free', format: 'short',
    source: { provider: 'youtube', url: 'https://www.youtube.com/shorts/kid1', youtubeId: 'dQw4w9WgXcQ' },
    translations: { en: { title: 'Praise Dance!', description: 'Dance along to this fun praise song!' } },
    coverImageUrl: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&q=80',
    durationSeconds: 55,
  },
];

// ========== Courses, Modules, Lessons ==========
const courses: Course[] = [
  {
    id: 'course-global-001', slug: 'foundations-of-faith', workspaceId: WS_GLOBAL,
    status: 'published', publishedAt: now, createdAt: now, updatedAt: now,
    createdByUserId: USER_ADMIN, updatedByUserId: USER_ADMIN,
    categoryIds: ['cat-global-faith'], access: 'free',
    moduleIds: ['mod-global-001', 'mod-global-002'],
    translations: { en: { title: 'Foundations of Faith', description: 'A comprehensive beginner course on the fundamentals of Christian faith, covering prayer, scripture, and community.' } },
  },
  {
    id: 'course-global-002', slug: 'prayer-masterclass', workspaceId: WS_GLOBAL,
    status: 'published', publishedAt: now, createdAt: now, updatedAt: now,
    createdByUserId: USER_ADMIN, updatedByUserId: USER_ADMIN,
    categoryIds: ['cat-global-worship'], access: 'premium',
    moduleIds: ['mod-global-003'],
    translations: { en: { title: 'Prayer Masterclass', description: 'Deepen your prayer life with practical techniques and spiritual insights from experienced leaders.' } },
  },
];

const modules: Module[] = [
  {
    id: 'mod-global-001', courseId: 'course-global-001', workspaceId: WS_GLOBAL,
    sortOrder: 0, translations: { en: { title: 'Getting Started' } },
    lessonIds: ['lesson-global-001', 'lesson-global-002'],
  },
  {
    id: 'mod-global-002', courseId: 'course-global-001', workspaceId: WS_GLOBAL,
    sortOrder: 1, translations: { en: { title: 'Going Deeper' } },
    lessonIds: ['lesson-global-003'],
  },
  {
    id: 'mod-global-003', courseId: 'course-global-002', workspaceId: WS_GLOBAL,
    sortOrder: 0, translations: { en: { title: 'Prayer Foundations' } },
    lessonIds: ['lesson-global-004'],
  },
];

const lessons: Lesson[] = [
  {
    id: 'lesson-global-001', courseId: 'course-global-001', moduleId: 'mod-global-001', workspaceId: WS_GLOBAL,
    sortOrder: 0, type: 'video', videoId: 'video-global-001',
    translations: { en: { title: 'What is Faith?', summary: 'An introduction to the concept of faith and why it matters.' } },
    createdAt: now, updatedAt: now,
  },
  {
    id: 'lesson-global-002', courseId: 'course-global-001', moduleId: 'mod-global-001', workspaceId: WS_GLOBAL,
    sortOrder: 1, type: 'text', contentId: 'content-global-001',
    translations: { en: { title: 'Walking Daily', summary: 'Practical steps for daily faith practice.' } },
    createdAt: now, updatedAt: now,
  },
  {
    id: 'lesson-global-003', courseId: 'course-global-001', moduleId: 'mod-global-002', workspaceId: WS_GLOBAL,
    sortOrder: 0, type: 'video', videoId: 'video-global-003',
    translations: { en: { title: 'Worship as a Lifestyle', summary: 'Making worship part of your everyday routine.' } },
    createdAt: now, updatedAt: now,
  },
  {
    id: 'lesson-global-004', courseId: 'course-global-002', moduleId: 'mod-global-003', workspaceId: WS_GLOBAL,
    sortOrder: 0, type: 'text', contentId: 'content-global-003',
    translations: { en: { title: 'The Foundation of Prayer', summary: 'Understanding why prayer is essential.' } },
    createdAt: now, updatedAt: now,
  },
];

// ========== Home Sections ==========
const homeSections: HomeSection[] = [
  // Global workspace
  { id: 'hs-global-hero', workspaceId: WS_GLOBAL, type: 'hero_slider', sortOrder: 0,
    itemRefs: [
      { entityType: 'video', id: 'video-global-001' },
      { entityType: 'content', id: 'content-global-001' },
      { entityType: 'course', id: 'course-global-001' },
      { entityType: 'video', id: 'video-global-003' },
    ],
    createdAt: now, updatedAt: now },
  { id: 'hs-global-featured', workspaceId: WS_GLOBAL, type: 'rail', sortOrder: 1,
    titleTranslations: { en: 'Featured' }, filter: {}, createdAt: now, updatedAt: now },
  { id: 'hs-global-latest', workspaceId: WS_GLOBAL, type: 'rail', sortOrder: 2,
    titleTranslations: { en: 'Latest Articles' }, filter: { type: 'article' }, createdAt: now, updatedAt: now },
  { id: 'hs-global-shorts', workspaceId: WS_GLOBAL, type: 'rail', sortOrder: 3,
    titleTranslations: { en: 'Shorts' }, filter: { format: 'short' }, createdAt: now, updatedAt: now },
  { id: 'hs-global-sermons', workspaceId: WS_GLOBAL, type: 'rail', sortOrder: 4,
    titleTranslations: { en: 'Sermons' }, filter: { categoryId: 'cat-global-sermons' }, createdAt: now, updatedAt: now },
  { id: 'hs-global-courses', workspaceId: WS_GLOBAL, type: 'rail', sortOrder: 5,
    titleTranslations: { en: 'Courses' }, filter: {}, createdAt: now, updatedAt: now },

  // Kids workspace
  { id: 'hs-kids-hero', workspaceId: WS_KIDS, type: 'hero_slider', sortOrder: 0,
    itemRefs: [
      { entityType: 'video', id: 'video-kids-001' },
      { entityType: 'content', id: 'content-kids-001' },
      { entityType: 'video', id: 'video-kids-002' },
    ],
    createdAt: now, updatedAt: now },
  { id: 'hs-kids-songs', workspaceId: WS_KIDS, type: 'rail', sortOrder: 1,
    titleTranslations: { en: 'Songs' }, filter: { categoryId: 'cat-kids-songs' }, createdAt: now, updatedAt: now },
  { id: 'hs-kids-stories', workspaceId: WS_KIDS, type: 'rail', sortOrder: 2,
    titleTranslations: { en: 'Bible Stories' }, filter: { categoryId: 'cat-kids-stories' }, createdAt: now, updatedAt: now },
  { id: 'hs-kids-shorts', workspaceId: WS_KIDS, type: 'rail', sortOrder: 3,
    titleTranslations: { en: 'Quick Fun' }, filter: { format: 'short' }, createdAt: now, updatedAt: now },
];

// ========== Plans ==========
const plans: Plan[] = [
  { id: 'plan-all-access', name: 'All Access', scope: 'global', workspaceId: null, price: 9.99, interval: 'monthly', currency: 'USD', features: { premiumAccess: true }, status: 'active', createdAt: now, updatedAt: now },
  { id: 'plan-kids-premium', name: 'Kids Premium', scope: 'workspace', workspaceId: WS_KIDS, price: 4.99, interval: 'monthly', currency: 'USD', features: { premiumAccess: true }, status: 'active', createdAt: now, updatedAt: now },
  { id: 'plan-youth-premium', name: 'Youth Premium', scope: 'workspace', workspaceId: WS_YOUTH, price: 4.99, interval: 'monthly', currency: 'USD', features: { premiumAccess: true }, status: 'active', createdAt: now, updatedAt: now },
];

// ========== Helpers ==========
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

// ========== Workspace Domains ==========
const workspaceDomains: WorkspaceDomain[] = [
  { id: 'domain-global', hostname: 'globallivingtruth.com', workspaceId: WS_GLOBAL, isPrimary: true, createdAt: now, updatedAt: now },
  { id: 'domain-kids', hostname: 'kidslivingtruth.com', workspaceId: WS_KIDS, isPrimary: true, createdAt: now, updatedAt: now },
  { id: 'domain-youth', hostname: 'youthlivingtruth.com', workspaceId: WS_YOUTH, isPrimary: true, createdAt: now, updatedAt: now },
  { id: 'domain-singles', hostname: 'singleslivingtruth.com', workspaceId: WS_SINGLES, isPrimary: true, createdAt: now, updatedAt: now },
  { id: 'domain-couples', hostname: 'coupleslivingtruth.com', workspaceId: WS_COUPLES, isPrimary: true, createdAt: now, updatedAt: now },
  { id: 'domain-handmades', hostname: 'handmadeslivingtruth.com', workspaceId: WS_HANDMADES, isPrimary: true, createdAt: now, updatedAt: now },
  { id: 'domain-servants', hostname: 'servantslivingtruth.com', workspaceId: WS_SERVANTS, isPrimary: true, createdAt: now, updatedAt: now },
];

function buildHostnameIndex(domains: WorkspaceDomain[]): Record<string, string> {
  const idx: Record<string, string> = {};
  for (const d of domains) idx[d.hostname] = d.workspaceId;
  return idx;
}

// ========== Export ==========
export const SEED_DB_V1: AppDatabase = {
  version: 3,

  workspaces: { byId: toById(workspaces) },
  users: { byId: toById(users) },
  roles: { byId: toById(roles) },
  userWorkspaceRoles,

  content: { byId: toById(contentItems), slugIndex: buildSlugIndex(contentItems) },
  videos: { byId: toById(videoItems), slugIndex: buildSlugIndex(videoItems) },
  courses: { byId: toById(courses), slugIndex: buildSlugIndex(courses) },
  modules: { byId: toById(modules) },
  lessons: { byId: toById(lessons) },
  categories: { byId: toById(categories), slugIndex: buildSlugIndex(categories), orderByWorkspaceId: buildOrderIndex(categories) },
  homeSections: { byId: toById(homeSections), orderByWorkspaceId: buildOrderIndex(homeSections) },
  plans: { byId: toById(plans) },
  subscriptions: { byId: {}, idsByUserId: {} },
  workspaceDomains: { byId: toById(workspaceDomains), byHostname: buildHostnameIndex(workspaceDomains) },
  events: [],
  progress: [],
  session: null,
};

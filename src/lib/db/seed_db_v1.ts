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

// ========== Content Items (from Missionary Families of Christ) ==========
const contentItems: ContentItem[] = [
  {
    id: 'content-global-001', type: 'article', slug: 'a-time-of-transition', workspaceId: WS_GLOBAL,
    status: 'published', publishedAt: now, createdAt: now, updatedAt: now,
    createdByUserId: USER_ADMIN, updatedByUserId: USER_ADMIN,
    categoryIds: ['cat-global-faith'], access: 'free',
    coverImageUrl: 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=800&q=80',
    authorName: 'Missionary Families of Christ',
    translations: { en: { title: 'A Time of Transition', excerpt: 'As we move forward in our mission, we embrace a time of transition rooted in faith, obedience, and the call to holiness.', bodyHtml: '<p>We are in a time of transition. The Lord is doing something new in our midst, and we must be ready to respond with faith and obedience.</p><h2>Embracing Change</h2><p>Transition is not something to fear but to embrace. God calls us to step out of our comfort zones and into His plan for our lives. As missionary families, we are called to be instruments of His peace and love in a world that desperately needs it.</p><h2>Moving Forward Together</h2><p>We move forward not as individuals but as a community bound together by our shared faith and mission. Let us support one another, pray for one another, and encourage one another as we navigate this season of change.</p>', seoTitle: 'A Time of Transition - MFC', seoDescription: 'Embracing transition with faith and obedience in our missionary calling.' } },
  },
  {
    id: 'content-global-002', type: 'article', slug: 'the-lords-prayer', workspaceId: WS_GLOBAL,
    status: 'published', publishedAt: now, createdAt: now, updatedAt: now,
    createdByUserId: USER_ADMIN, updatedByUserId: USER_ADMIN,
    categoryIds: ['cat-global-worship'], access: 'free',
    coverImageUrl: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?w=800&q=80',
    authorName: 'Missionary Families of Christ',
    translations: { en: { title: "The Way Forward in Christ: The Lord's Prayer", excerpt: "A deep reflection on how the Lord's Prayer guides our daily walk with God and shapes our community life.", bodyHtml: "<p>The Lord's Prayer is not merely a formula to recite but a blueprint for our entire Christian life. When Jesus taught His disciples to pray, He gave us the model for how we are to relate to God and to one another.</p><h2>Our Father</h2><p>We begin by acknowledging God as our Father — not just my Father, but our Father. This immediately places us in community. We pray not as isolated individuals but as members of one family.</p><h2>Thy Kingdom Come</h2><p>We pray for God's kingdom to come on earth as it is in heaven. This is our mission: to bring the values of God's kingdom into every aspect of our lives — our families, our workplaces, our communities.</p><h2>Give Us This Day</h2><p>We trust in God's daily provision. Not tomorrow's bread, but today's. This teaches us to live in the present moment, trusting God for what we need right now.</p>", seoTitle: "The Lord's Prayer - MFC", seoDescription: "Reflecting on the Lord's Prayer as a guide for Christian living." } },
  },
  {
    id: 'content-global-003', type: 'article', slug: 'in-the-footsteps-of-jesus', workspaceId: WS_GLOBAL,
    status: 'published', publishedAt: now, createdAt: now, updatedAt: now,
    createdByUserId: USER_ADMIN, updatedByUserId: USER_ADMIN,
    categoryIds: ['cat-global-faith'], access: 'free',
    coverImageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80',
    authorName: 'Missionary Families of Christ',
    translations: { en: { title: 'In the Footsteps of Jesus', excerpt: 'Following Christ means walking as He walked — in service, humility, and radical love for all people.', bodyHtml: '<p>To walk in the footsteps of Jesus is to embrace a life of service, sacrifice, and unconditional love. Jesus did not come to be served but to serve, and He calls us to do the same.</p><h2>The New Evangelization</h2><p>Pope Francis calls us to a new evangelization — one that goes to the peripheries, that reaches out to those who are forgotten, marginalized, and in need of God\'s mercy. As missionary families, we are on the front lines of this new evangelization.</p><h2>Living the Gospel</h2><p>We evangelize not primarily through words but through the witness of our lives. When our families reflect the love of Christ, we become living gospels for all to see.</p>', seoTitle: 'In the Footsteps of Jesus - MFC', seoDescription: 'Walking in service and love as missionary families.' } },
  },
  {
    id: 'content-global-004', type: 'blog', slug: 'jesus-mission-our-mission', workspaceId: WS_GLOBAL,
    status: 'published', publishedAt: now, createdAt: now, updatedAt: now,
    createdByUserId: USER_EDITOR, updatedByUserId: USER_EDITOR,
    categoryIds: ['cat-global-sermons'], access: 'free',
    coverImageUrl: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=800&q=80',
    authorName: 'Missionary Families of Christ',
    translations: { en: { title: "Jesus' Mission, Our Mission", excerpt: "Understanding how Jesus' mission of salvation becomes our own mission as families dedicated to Christ.", bodyHtml: "<p>Jesus came with a clear mission: to seek and save the lost, to proclaim the Good News, and to establish God's kingdom on earth. This mission did not end with His ascension — it was entrusted to us, His followers.</p><h2>Called as Families</h2><p>We are called not just as individuals but as families. The family is the domestic church, the first place where faith is lived and transmitted. When we embrace Jesus' mission as families, we become powerful instruments of God's grace.</p><h2>Going to the Nations</h2><p>Our mission extends beyond our homes and parishes. We are called to go to the nations, to bring the light of Christ to every corner of the world. This is the heart of what it means to be missionary families.</p>" } },
  },
  {
    id: 'content-global-005', type: 'article', slug: 'pilgrims-of-hope-2025', workspaceId: WS_GLOBAL,
    status: 'published', publishedAt: now, createdAt: now, updatedAt: now,
    createdByUserId: USER_ADMIN, updatedByUserId: USER_ADMIN,
    categoryIds: ['cat-global-faith'], access: 'premium',
    coverImageUrl: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800&q=80',
    authorName: 'Missionary Families of Christ',
    translations: { en: { title: 'Pilgrims of Hope: Our Theme for 2025', excerpt: 'As pilgrims of hope, we journey together in faith toward the promises God has prepared for us in this Jubilee year.', bodyHtml: '<p>The year 2025 marks a special Jubilee year, and our theme "Pilgrims of Hope" calls us to renew our journey of faith with fresh eyes and open hearts.</p><h2>What Does It Mean to Be Pilgrims?</h2><p>A pilgrim is not a tourist. A pilgrim travels with purpose, with intention, and with faith. We are pilgrims on this earth, journeying toward our heavenly home. Every step we take is guided by hope — the hope that comes from knowing that God is faithful.</p><h2>Hope in Action</h2><p>Our hope is not passive. It moves us to action — to serve, to love, to forgive, to reconcile. As pilgrims of hope, we bring God\'s light into the darkness and His peace into places of conflict.</p>', seoTitle: 'Pilgrims of Hope 2025 - MFC', seoDescription: 'Our theme for the Jubilee year 2025 as missionary families.' } },
  },
  {
    id: 'content-global-006', type: 'blog', slug: 'defending-faith-family-life', workspaceId: WS_GLOBAL,
    status: 'published', publishedAt: now, createdAt: now, updatedAt: now,
    createdByUserId: USER_EDITOR, updatedByUserId: USER_EDITOR,
    categoryIds: ['cat-global-life'], access: 'free',
    coverImageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80',
    authorName: 'Missionary Families of Christ',
    translations: { en: { title: 'Defending Faith, Family and Life', excerpt: 'In a world that challenges traditional values, we stand firm in defending faith, the sanctity of family, and the dignity of every human life.', bodyHtml: '<p>We live in times when faith, family, and life itself are under attack from many directions. As Catholic families, we are called to be courageous defenders of these fundamental gifts from God.</p><h2>Faith Under Siege</h2><p>Secularism, relativism, and indifference threaten to erode the foundations of our faith. But we do not despair. We hold fast to the truth that has been handed down to us through the centuries.</p><h2>The Family as Fortress</h2><p>The family is both the target and the fortress. When our families are strong in faith, they become beacons of hope for the world around us.</p>' } },
  },
  {
    id: 'content-global-007', type: 'blog', slug: 'missionary-families-identity', workspaceId: WS_GLOBAL,
    status: 'published', publishedAt: now, createdAt: now, updatedAt: now,
    createdByUserId: USER_EDITOR, updatedByUserId: USER_EDITOR,
    categoryIds: ['cat-global-life'], access: 'premium',
    coverImageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    authorName: 'Missionary Families of Christ',
    translations: { en: { title: 'Our True Identity as Missionary Families', excerpt: 'Discovering and living out our true identity as families called to mission — rooted in Christ and sent to the world.', bodyHtml: '<p>Who are we? We are missionary families of Christ. This is not just a name or a label — it is our identity, our calling, and our purpose.</p><h2>Rooted in Christ</h2><p>Our identity begins with Christ. We are first and foremost His disciples, called by name and sent into the world. Everything we do flows from this relationship with Jesus.</p><h2>Sent to the World</h2><p>We are not called to keep our faith to ourselves. We are sent — to our neighborhoods, our workplaces, our schools, and to the ends of the earth. The mission field is everywhere.</p><h2>Living Our Identity</h2><p>Living as missionary families means making our homes places of prayer, our meals occasions of fellowship, and our daily lives witnesses to the Gospel.</p>' } },
  },
];

// ========== Video Items (from Unapologetic Catholic YouTube channel) ==========
const videoItems: VideoItem[] = [
  // --- Long-format videos ---
  {
    id: 'video-global-001', slug: 'catholic-dating-qa', workspaceId: WS_GLOBAL,
    status: 'published', publishedAt: now, createdAt: now, updatedAt: now,
    createdByUserId: USER_ADMIN, updatedByUserId: USER_ADMIN,
    categoryIds: ['cat-global-faith'], access: 'free', format: 'long',
    source: { provider: 'youtube', url: 'https://www.youtube.com/watch?v=jAuYOD2kB_Y', youtubeId: 'jAuYOD2kB_Y' },
    translations: { en: { title: 'How Catholics (Should) Date - Catholic Dating Q&A', description: 'A candid Q&A about Catholic dating — navigating relationships with faith, intentionality, and virtue.' } },
    coverImageUrl: 'https://i.ytimg.com/vi/jAuYOD2kB_Y/hqdefault.jpg',
    durationSeconds: 834,
  },
  {
    id: 'video-global-002', slug: 'conversion-to-catholicism-victor', workspaceId: WS_GLOBAL,
    status: 'published', publishedAt: now, createdAt: now, updatedAt: now,
    createdByUserId: USER_ADMIN, updatedByUserId: USER_ADMIN,
    categoryIds: ['cat-global-faith'], access: 'free', format: 'long',
    source: { provider: 'youtube', url: 'https://www.youtube.com/watch?v=Si4VpyAIDpo', youtubeId: 'Si4VpyAIDpo' },
    translations: { en: { title: "My Conversion to Catholicism w/ Victor D'souza - Walk by Faith", description: "Victor D'souza shares his powerful conversion story and journey into the Catholic faith." } },
    coverImageUrl: 'https://i.ytimg.com/vi/Si4VpyAIDpo/hqdefault.jpg',
    durationSeconds: 2141,
  },
  {
    id: 'video-global-003', slug: 'raising-kids-autism-walk-by-faith', workspaceId: WS_GLOBAL,
    status: 'published', publishedAt: now, createdAt: now, updatedAt: now,
    createdByUserId: USER_ADMIN, updatedByUserId: USER_ADMIN,
    categoryIds: ['cat-global-life'], access: 'free', format: 'long',
    source: { provider: 'youtube', url: 'https://www.youtube.com/watch?v=HjPkBZp5aDw', youtubeId: 'HjPkBZp5aDw' },
    translations: { en: { title: "Raising 3 Kids on Autism Spectrum Disorder: A Father's Story", description: "A touching Walk by Faith episode featuring a father's journey raising three children on the autism spectrum." } },
    coverImageUrl: 'https://i.ytimg.com/vi/HjPkBZp5aDw/hqdefault.jpg',
    durationSeconds: 2195,
  },
  {
    id: 'video-global-004', slug: 'evil-spirits-physical-illness', workspaceId: WS_GLOBAL,
    status: 'published', publishedAt: now, createdAt: now, updatedAt: now,
    createdByUserId: USER_ADMIN, updatedByUserId: USER_ADMIN,
    categoryIds: ['cat-global-faith'], access: 'free', format: 'long',
    source: { provider: 'youtube', url: 'https://www.youtube.com/watch?v=5wQqv2PdZpc', youtubeId: '5wQqv2PdZpc' },
    translations: { en: { title: 'Can Evil Spirits Cause Physical Illness?', description: 'Exploring the Catholic understanding of spiritual warfare and its connection to physical health.' } },
    coverImageUrl: 'https://i.ytimg.com/vi/5wQqv2PdZpc/hqdefault.jpg',
    durationSeconds: 379,
  },
  {
    id: 'video-global-005', slug: 'how-to-tithe-as-christians', workspaceId: WS_GLOBAL,
    status: 'published', publishedAt: now, createdAt: now, updatedAt: now,
    createdByUserId: USER_EDITOR, updatedByUserId: USER_EDITOR,
    categoryIds: ['cat-global-life'], access: 'free', format: 'long',
    source: { provider: 'youtube', url: 'https://www.youtube.com/watch?v=yk1jZxbk3N4', youtubeId: 'yk1jZxbk3N4' },
    translations: { en: { title: 'How to Tithe as Christians? Giving 10% to God', description: 'Practical guidance on tithing and Christian stewardship — what does giving 10% really mean?' } },
    coverImageUrl: 'https://i.ytimg.com/vi/yk1jZxbk3N4/hqdefault.jpg',
    durationSeconds: 281,
  },
  {
    id: 'video-global-006', slug: 'grieving-loss-children', workspaceId: WS_GLOBAL,
    status: 'published', publishedAt: now, createdAt: now, updatedAt: now,
    createdByUserId: USER_ADMIN, updatedByUserId: USER_ADMIN,
    categoryIds: ['cat-global-life'], access: 'premium', format: 'long',
    source: { provider: 'youtube', url: 'https://www.youtube.com/watch?v=FnS293ykrlQ', youtubeId: 'FnS293ykrlQ' },
    translations: { en: { title: 'Grieving the Loss of Children w/ Kelvin and Amulya Castelino', description: 'A deeply moving conversation about grief, loss, and finding hope through faith with Kelvin and Amulya Castelino.' } },
    coverImageUrl: 'https://i.ytimg.com/vi/FnS293ykrlQ/hqdefault.jpg',
    durationSeconds: 3674,
  },
  {
    id: 'video-global-007', slug: 'protestants-removed-bible-books', workspaceId: WS_GLOBAL,
    status: 'published', publishedAt: now, createdAt: now, updatedAt: now,
    createdByUserId: USER_ADMIN, updatedByUserId: USER_ADMIN,
    categoryIds: ['cat-global-sermons'], access: 'free', format: 'long',
    source: { provider: 'youtube', url: 'https://www.youtube.com/watch?v=ArUuakk3Wtg', youtubeId: 'ArUuakk3Wtg' },
    translations: { en: { title: 'Why Did Protestants Remove Books From the Bible?', description: 'An exploration of the historical reasons behind the Protestant removal of deuterocanonical books from the Bible.' } },
    coverImageUrl: 'https://i.ytimg.com/vi/ArUuakk3Wtg/hqdefault.jpg',
    durationSeconds: 635,
  },
  {
    id: 'video-global-008', slug: 'catholic-purgatory-explained', workspaceId: WS_GLOBAL,
    status: 'published', publishedAt: now, createdAt: now, updatedAt: now,
    createdByUserId: USER_ADMIN, updatedByUserId: USER_ADMIN,
    categoryIds: ['cat-global-faith'], access: 'premium', format: 'long',
    source: { provider: 'youtube', url: 'https://www.youtube.com/watch?v=hJ-CRczKCtY', youtubeId: 'hJ-CRczKCtY' },
    translations: { en: { title: 'Catholic Purgatory Is Not In The Bible? Purgatory vs Hell?', description: 'Addressing common objections about purgatory and explaining the Catholic doctrine with biblical references.' } },
    coverImageUrl: 'https://i.ytimg.com/vi/hJ-CRczKCtY/hqdefault.jpg',
    durationSeconds: 658,
  },
  // --- Short-format videos ---
  {
    id: 'video-global-s01', slug: 'sacraments-bible-short', workspaceId: WS_GLOBAL,
    status: 'published', publishedAt: now, createdAt: now, updatedAt: now,
    createdByUserId: USER_ADMIN, updatedByUserId: USER_ADMIN,
    categoryIds: ['cat-global-faith'], access: 'free', format: 'short',
    source: { provider: 'youtube', url: 'https://www.youtube.com/watch?v=lR0909VjwUo', youtubeId: 'lR0909VjwUo' },
    translations: { en: { title: 'Are Catholic Sacraments Based On The Bible?', description: 'A quick look at the biblical foundations of Catholic sacraments.' } },
    coverImageUrl: 'https://i.ytimg.com/vi/lR0909VjwUo/hqdefault.jpg',
    durationSeconds: 408,
  },
  {
    id: 'video-global-s02', slug: 'indulgences-short', workspaceId: WS_GLOBAL,
    status: 'published', publishedAt: now, createdAt: now, updatedAt: now,
    createdByUserId: USER_EDITOR, updatedByUserId: USER_EDITOR,
    categoryIds: ['cat-global-faith'], access: 'free', format: 'short',
    source: { provider: 'youtube', url: 'https://www.youtube.com/watch?v=zIp7CwCJk0E', youtubeId: 'zIp7CwCJk0E' },
    translations: { en: { title: 'Does the Catholic Church Sell Indulgences?', description: 'Debunking the myth that the Catholic Church sells indulgences.' } },
    coverImageUrl: 'https://i.ytimg.com/vi/zIp7CwCJk0E/hqdefault.jpg',
    durationSeconds: 552,
  },
  {
    id: 'video-global-s03', slug: 'catholics-read-bible-short', workspaceId: WS_GLOBAL,
    status: 'published', publishedAt: now, createdAt: now, updatedAt: now,
    createdByUserId: USER_ADMIN, updatedByUserId: USER_ADMIN,
    categoryIds: ['cat-global-worship'], access: 'free', format: 'short',
    source: { provider: 'youtube', url: 'https://www.youtube.com/watch?v=KlWKMgUG9vo', youtubeId: 'KlWKMgUG9vo' },
    translations: { en: { title: 'Do Catholics Read The Bible?', description: 'Addressing the common misconception that Catholics don\'t read the Bible.' } },
    coverImageUrl: 'https://i.ytimg.com/vi/KlWKMgUG9vo/hqdefault.jpg',
    durationSeconds: 810,
  },
  {
    id: 'video-global-s04', slug: 'who-treaty-short', workspaceId: WS_GLOBAL,
    status: 'published', publishedAt: now, createdAt: now, updatedAt: now,
    createdByUserId: USER_EDITOR, updatedByUserId: USER_EDITOR,
    categoryIds: ['cat-global-life'], access: 'free', format: 'short',
    source: { provider: 'youtube', url: 'https://www.youtube.com/watch?v=OtCrk2cNr4I', youtubeId: 'OtCrk2cNr4I' },
    translations: { en: { title: 'WHO Treaty: Who Will Control Governments?', description: 'Examining the implications of the WHO treaty on global governance.' } },
    coverImageUrl: 'https://i.ytimg.com/vi/OtCrk2cNr4I/hqdefault.jpg',
    durationSeconds: 219,
  },
  {
    id: 'video-global-s05', slug: 'netflix-cleopatra-short', workspaceId: WS_GLOBAL,
    status: 'published', publishedAt: now, createdAt: now, updatedAt: now,
    createdByUserId: USER_ADMIN, updatedByUserId: USER_ADMIN,
    categoryIds: ['cat-global-life'], access: 'free', format: 'short',
    source: { provider: 'youtube', url: 'https://www.youtube.com/watch?v=OnbMfwDDyn8', youtubeId: 'OnbMfwDDyn8' },
    translations: { en: { title: 'Netflix Cleopatra: Woke History Or Harmful Rewrite?', description: 'Discussing the controversy around Netflix\'s Cleopatra documentary.' } },
    coverImageUrl: 'https://i.ytimg.com/vi/OnbMfwDDyn8/hqdefault.jpg',
    durationSeconds: 312,
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

  // Kids workspace (empty — no kids-specific content)
  { id: 'hs-kids-hero', workspaceId: WS_KIDS, type: 'hero_slider', sortOrder: 0,
    itemRefs: [],
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
  version: 4,

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

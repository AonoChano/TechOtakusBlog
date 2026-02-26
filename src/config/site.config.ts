/**
 * 渡辺灰音的博客 - 全局配置文件
 * Watanabe Haione's Blog - Global Configuration
 */

// ==================== 站点基本信息 ====================
export const SITE_CONFIG = {
  name: '渡辺灰音の部屋',
  nameEn: 'Haione\'s Room',
  description: '一个技术宅的个人博客，分享编程、动漫与生活',
  descriptionEn: 'A tech otaku\'s personal blog sharing code, anime and life',
  url: 'https://haione.blog',
  logo: '/favicon.ico',
  favicon: '/favicon.ico',
  
  // 角色设定
  character: {
    name: '渡辺灰音',
    nameEn: 'Watanabe Haione',
    description: '白发异瞳的哥特萝莉少女',
    descriptionEn: 'White-haired heterochromia gothic lolita girl',
  },
  
  // 博主信息
  author: {
    name: '渡辺暁',
    nameEn: 'Watanabe Akatsuki',
    bio: '技术宅 / 动漫爱好者 / 全栈开发者',
    bioEn: 'Tech Otaku / Anime Lover / Full Stack Developer',
    avatar: '/avatars/admin.png',
  },
} as const;

// ==================== 社交媒体链接 ====================
export const SOCIAL_LINKS = {
  twitter: {
    url: 'https://x.com/CYchano',
    label: 'Twitter / X',
    icon: 'twitter',
    show: true,
  },
  github: {
    url: 'https://github.com/AonoChano',
    label: 'GitHub',
    icon: 'github',
    show: true,
  },
  email: {
    url: 'mailto:CYChano@outlook.com',
    label: 'Email',
    icon: 'mail',
    show: true,
  },
  rss: {
    url: '/rss.xml',
    label: 'RSS Feed',
    icon: 'rss',
    show: true,
  },
} as const;

// ==================== 导航菜单 ====================
export const NAVIGATION = {
  main: [
    { label: '首页', labelEn: 'Home', href: '/', icon: 'home' },
    { label: '文章', labelEn: 'Articles', href: '/articles', icon: 'file-text' },
    { label: '分类', labelEn: 'Categories', href: '/categories', icon: 'folder' },
    { label: '资源', labelEn: 'Resources', href: '/resources', icon: 'download' },
    { label: '留言', labelEn: 'Messages', href: '/messages', icon: 'message-square' },
    { label: '关于', labelEn: 'About', href: '/about', icon: 'user' },
  ],
  
  footer: [
    { label: '友情链接', labelEn: 'Friends', href: '/friends' },
    { label: '隐私政策', labelEn: 'Privacy', href: '/privacy' },
  ],
} as const;

// ==================== 路径配置 ====================
export const PATHS = {
  // API 路径
  api: {
    base: '/api',
    auth: '/api/auth',
    articles: '/api/articles',
    categories: '/api/categories',
    comments: '/api/comments',
    messages: '/api/messages',
    resources: '/api/resources',
    uploads: '/api/uploads',
    users: '/api/users',
  },
  
  // 静态资源路径
  assets: {
    images: '/images',
    avatars: '/avatars',
    covers: '/media/covers',
    files: '/media/files',
    live2d: '/live2d',
  },
  
  // 页面路径
  pages: {
    home: '/',
    articles: '/articles',
    articleDetail: '/articles/:slug',
    categories: '/categories',
    categoryDetail: '/category/:slug',
    resources: '/resources',
    messages: '/messages',
    about: '/about',
    friends: '/friends',
    privacy: '/privacy',
    login: '/login',
    register: '/register',
    profile: '/profile',
    admin: '/admin',
    editor: '/editor',
  },
} as const;

// ==================== 功能开关 ====================
export const FEATURES = {
  // 用户功能
  registration: true,
  comments: true,
  messages: true,
  
  // 资源功能
  resourceDownload: true,
  resourceUpload: true,
  
  // 文章功能
  articleEditor: true,
  markdownSupport: true,
  codeHighlight: true,
  
  // 看板娘
  mascot: {
    enabled: true,
    showOnPages: ['home', 'articles', 'article', 'categories', 'resources', 'messages'],
    interactive: true,
  },
  
  // 头像上传
  avatarUpload: {
    enabled: true,
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    cropEnabled: true,
  },
} as const;

// ==================== 安全配置 ====================
export const SECURITY = {
  // 密码策略
  password: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSymbols: false,
  },
  
  // 防爆破
  rateLimit: {
    login: {
      windowMs: 15 * 60 * 1000, // 15分钟
      maxAttempts: 5,
    },
    register: {
      windowMs: 60 * 60 * 1000, // 1小时
      maxAttempts: 3,
    },
  },
  
  // JWT 配置
  jwt: {
    accessTokenExpiry: '15m',
    refreshTokenExpiry: '7d',
  },
} as const;

// ==================== 分页配置 ====================
export const PAGINATION = {
  articles: {
    defaultLimit: 9,
    maxLimit: 50,
  },
  comments: {
    defaultLimit: 10,
    maxLimit: 100,
  },
  messages: {
    defaultLimit: 10,
    maxLimit: 50,
  },
  resources: {
    defaultLimit: 12,
    maxLimit: 50,
  },
} as const;

// ==================== 主题配置 ====================
export const THEME = {
  colors: {
    primary: '#dc2626', // red-600
    primaryDark: '#991b1b', // red-800
    background: '#0a0a0a',
    surface: '#141414',
    surfaceLight: '#1a1a1a',
    text: '#e5e5e5',
    textMuted: '#737373',
    border: '#262626',
  },
  
  fonts: {
    sans: 'Inter, system-ui, sans-serif',
    mono: 'JetBrains Mono, Fira Code, monospace',
  },
} as const;

// ==================== 默认数据 ====================
export const DEFAULTS = {
  // 默认分类
  categories: [
    { name: '技术', slug: 'tech', color: '#3b82f6', description: '编程技术与开发经验' },
    { name: '动漫', slug: 'anime', color: '#ec4899', description: '动漫推荐与观后感' },
    { name: '游戏', slug: 'game', color: '#22c55e', description: '游戏心得与评测' },
    { name: '生活', slug: 'life', color: '#f59e0b', description: '日常随笔与感悟' },
  ],
  
  // 默认头像
  avatar: '/avatars/default.png',
  
  // 默认文章封面
  cover: '/media/covers/default.jpg',
} as const;

// ==================== 导出类型 ====================
export type SiteConfig = typeof SITE_CONFIG;
export type SocialLinks = typeof SOCIAL_LINKS;
export type Navigation = typeof NAVIGATION;
export type Paths = typeof PATHS;
export type Features = typeof FEATURES;
export type Security = typeof SECURITY;
export type Pagination = typeof PAGINATION;
export type Theme = typeof THEME;

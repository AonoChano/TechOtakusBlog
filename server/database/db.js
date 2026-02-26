import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbDir = path.join(__dirname, '../../data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

let db;

// 初始化数据库表
async function initDatabase() {
  db = await open({
    filename: path.join(dbDir, 'blog.db'),
    driver: sqlite3.Database
  });

  // 启用外键约束和日志模式
  await db.exec('PRAGMA journal_mode = WAL');
  await db.exec('PRAGMA foreign_keys = ON');

  // 用户表
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      avatar TEXT DEFAULT '/uploads/avatars/default.png',
      bio TEXT DEFAULT '',
      role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'user')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 文章分类表
  await db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT,
      color TEXT DEFAULT '#6366f1',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 文章表
  await db.exec(`
    CREATE TABLE IF NOT EXISTS articles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      content TEXT NOT NULL,
      excerpt TEXT,
      cover_image TEXT,
      author_id INTEGER NOT NULL,
      category_id INTEGER,
      tags TEXT,
      views INTEGER DEFAULT 0,
      likes INTEGER DEFAULT 0,
      is_published BOOLEAN DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
    )
  `);

  // 评论表
  await db.exec(`
    CREATE TABLE IF NOT EXISTS comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      article_id INTEGER NOT NULL,
      user_id INTEGER,
      parent_id INTEGER DEFAULT NULL,
      content TEXT NOT NULL,
      guest_name TEXT,
      guest_email TEXT,
      is_approved BOOLEAN DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
      FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE CASCADE
    )
  `);

  // 留言表
  await db.exec(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      content TEXT NOT NULL,
      guest_name TEXT,
      guest_email TEXT,
      is_approved BOOLEAN DEFAULT 1,
      reply TEXT,
      replied_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    )
  `);

  // 资源表
  await db.exec(`
    CREATE TABLE IF NOT EXISTS resources (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      file_path TEXT NOT NULL,
      file_size INTEGER,
      file_type TEXT,
      download_count INTEGER DEFAULT 0,
      category TEXT,
      tags TEXT,
      is_public BOOLEAN DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 下载记录表
  await db.exec(`
    CREATE TABLE IF NOT EXISTS download_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      resource_id INTEGER NOT NULL,
      user_id INTEGER,
      ip_address TEXT,
      downloaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (resource_id) REFERENCES resources(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    )
  `);

  // 创建默认管理员账户
  const adminExists = await db.get('SELECT id FROM users WHERE role = ?', 'admin');
  if (!adminExists) {
    const hashedPassword = bcrypt.hashSync('admin123', 10);
    await db.run(`
      INSERT INTO users (username, email, password, role, bio)
      VALUES (?, ?, ?, ?, ?)
    `, 'admin', 'admin@techotaku.blog', hashedPassword, 'admin', '技术宅博主，热爱动漫和编程');
    console.log('Default admin created: admin / admin123');
  }

  // 创建默认分类
  const defaultCategories = [
    { name: '技术分享', slug: 'tech', description: '编程技术、开发经验分享', color: '#6366f1' },
    { name: '动漫推荐', slug: 'anime', description: '动漫评测、推荐与讨论', color: '#ec4899' },
    { name: '游戏心得', slug: 'game', description: '游戏评测、攻略分享', color: '#8b5cf6' },
    { name: '生活随笔', slug: 'life', description: '日常生活、心情随笔', color: '#10b981' },
    { name: '资源分享', slug: 'resource', description: '软件、工具、素材分享', color: '#f59e0b' }
  ];

  for (const cat of defaultCategories) {
    await db.run('INSERT OR IGNORE INTO categories (name, slug, description, color) VALUES (?, ?, ?, ?)', 
      cat.name, cat.slug, cat.description, cat.color);
  }

  console.log('Database initialized successfully');
}

// 導出一個代理對象或包裝函數，因為 db 現在是異步初始化的
export const getDb = () => db;
export { initDatabase };

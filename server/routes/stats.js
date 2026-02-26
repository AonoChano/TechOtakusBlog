import express from 'express';
import { getDb } from '../database/db.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// 获取网站统计
router.get('/', async (req, res) => {
  try {
    const db = getDb();
    const { total: articleCount } = await db.get('SELECT COUNT(*) as total FROM articles WHERE is_published = 1');
    const { total: userCount } = await db.get('SELECT COUNT(*) as total FROM users');
    const { total: commentCount } = await db.get('SELECT COUNT(*) as total FROM comments WHERE is_approved = 1');
    const { total: messageCount } = await db.get('SELECT COUNT(*) as total FROM messages WHERE is_approved = 1');
    const { total: resourceCount } = await db.get('SELECT COUNT(*) as total FROM resources WHERE is_public = 1');
    const { total: downloadCount } = await db.get('SELECT SUM(download_count) as total FROM resources');

    // 获取最新文章
    const latestArticles = await db.all(`
      SELECT a.id, a.title, a.slug, a.cover_image, a.created_at,
             u.username as author_name
      FROM articles a
      LEFT JOIN users u ON a.author_id = u.id
      WHERE a.is_published = 1
      ORDER BY a.created_at DESC
      LIMIT 5
    `);

    // 获取热门文章
    const popularArticles = await db.all(`
      SELECT id, title, slug, cover_image, views, likes
      FROM articles
      WHERE is_published = 1
      ORDER BY views DESC
      LIMIT 5
    `);

    res.json({
      stats: {
        articleCount,
        userCount,
        commentCount,
        messageCount,
        resourceCount,
        downloadCount: downloadCount || 0
      },
      latestArticles,
      popularArticles
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to get stats' });
  }
});

// 获取管理员仪表盘数据
router.get('/dashboard', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const db = getDb();
    // 基础统计
    const { total: totalArticles } = await db.get('SELECT COUNT(*) as total FROM articles');
    const { total: publishedArticles } = await db.get('SELECT COUNT(*) as total FROM articles WHERE is_published = 1');
    const { total: draftArticles } = await db.get('SELECT COUNT(*) as total FROM articles WHERE is_published = 0');
    const { total: totalUsers } = await db.get('SELECT COUNT(*) as total FROM users');
    const { total: totalComments } = await db.get('SELECT COUNT(*) as total FROM comments');
    const { total: pendingComments } = await db.get('SELECT COUNT(*) as total FROM comments WHERE is_approved = 0');
    const { total: totalMessages } = await db.get('SELECT COUNT(*) as total FROM messages');
    const { total: pendingMessages } = await db.get('SELECT COUNT(*) as total FROM messages WHERE is_approved = 0');
    const { total: totalResources } = await db.get('SELECT COUNT(*) as total FROM resources');
    const { total: totalDownloads } = await db.get('SELECT SUM(download_count) as total FROM resources');

    // 最近7天的文章发布统计
    const articleStats = await db.all(`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as count
      FROM articles
      WHERE created_at >= DATE('now', '-7 days')
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `);

    // 最近注册用户
    const recentUsers = await db.all(`
      SELECT id, username, email, created_at
      FROM users
      ORDER BY created_at DESC
      LIMIT 5
    `);

    // 最近评论
    const recentComments = await db.all(`
      SELECT c.id, c.content, c.created_at, c.is_approved,
             u.username, a.title as article_title, a.slug as article_slug
      FROM comments c
      LEFT JOIN users u ON c.user_id = u.id
      LEFT JOIN articles a ON c.article_id = a.id
      ORDER BY c.created_at DESC
      LIMIT 10
    `);

    res.json({
      overview: {
        articles: { total: totalArticles, published: publishedArticles, draft: draftArticles },
        users: { total: totalUsers },
        comments: { total: totalComments, pending: pendingComments },
        messages: { total: totalMessages, pending: pendingMessages },
        resources: { total: totalResources },
        downloads: { total: totalDownloads || 0 }
      },
      articleStats,
      recentUsers,
      recentComments
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to get dashboard stats' });
  }
});

export default router;

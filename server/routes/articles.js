import express from 'express';
import { getDb } from '../database/db.js';
import { authenticateToken, requireAdmin, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// 获取文章列表
router.get('/', optionalAuth, async (req, res) => {
  try {
    const db = getDb();
    const { page = 1, limit = 10, category, search, tag } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT 
        a.id, a.title, a.slug, a.excerpt, a.cover_image, 
        a.views, a.likes, a.created_at, a.updated_at,
        u.username as author_name, u.avatar as author_avatar,
        c.name as category_name, c.slug as category_slug, c.color as category_color,
        (SELECT COUNT(*) FROM comments WHERE article_id = a.id AND is_approved = 1) as comment_count
      FROM articles a
      LEFT JOIN users u ON a.author_id = u.id
      LEFT JOIN categories c ON a.category_id = c.id
      WHERE a.is_published = 1
    `;
    
    const params = [];

    if (category) {
      query += ' AND c.slug = ?';
      params.push(category);
    }

    if (search) {
      query += ' AND (a.title LIKE ? OR a.excerpt LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    if (tag) {
      query += ' AND a.tags LIKE ?';
      params.push(`%${tag}%`);
    }

    query += ' ORDER BY a.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const articles = await db.all(query, ...params);

    // 获取总数
    let countQuery = 'SELECT COUNT(*) as total FROM articles a LEFT JOIN categories c ON a.category_id = c.id WHERE a.is_published = 1';
    const countParams = [];
    
    if (category) {
      countQuery += ' AND c.slug = ?';
      countParams.push(category);
    }
    if (search) {
      countQuery += ' AND (a.title LIKE ? OR a.excerpt LIKE ?)';
      countParams.push(`%${search}%`, `%${search}%`);
    }
    if (tag) {
      countQuery += ' AND a.tags LIKE ?';
      countParams.push(`%${tag}%`);
    }

    const { total } = await db.get(countQuery, ...countParams);

    res.json({
      articles,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get articles error:', error);
    res.status(500).json({ error: 'Failed to get articles' });
  }
});

// 获取单篇文章
router.get('/:slug', optionalAuth, async (req, res) => {
  try {
    const db = getDb();
    const { slug } = req.params;

    const article = await db.get(`
      SELECT 
        a.*,
        u.username as author_name, u.avatar as author_avatar, u.bio as author_bio,
        c.name as category_name, c.slug as category_slug, c.color as category_color
      FROM articles a
      LEFT JOIN users u ON a.author_id = u.id
      LEFT JOIN categories c ON a.category_id = c.id
      WHERE a.slug = ? AND a.is_published = 1
    `, slug);

    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    // 增加浏览量
    await db.run('UPDATE articles SET views = views + 1 WHERE id = ?', article.id);
    article.views += 1;

    // 获取相关文章
    const relatedArticles = await db.all(`
      SELECT id, title, slug, cover_image, created_at
      FROM articles
      WHERE category_id = ? AND id != ? AND is_published = 1
      ORDER BY created_at DESC LIMIT 3
    `, article.category_id, article.id);

    res.json({ article, relatedArticles });
  } catch (error) {
    console.error('Get article error:', error);
    res.status(500).json({ error: 'Failed to get article' });
  }
});

// 创建文章（需要管理员权限）
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const db = getDb();
    const { title, content, excerpt, cover_image, category_id, tags } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    // 生成slug
    const slug = title.toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 100) + '-' + Date.now();

    const result = await db.run(`
      INSERT INTO articles (title, slug, content, excerpt, cover_image, author_id, category_id, tags)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `,
      title,
      slug,
      content,
      excerpt || content.substring(0, 200) + '...',
      cover_image || '',
      req.userId,
      category_id || null,
      tags || ''
    );

    res.status(201).json({
      message: 'Article created successfully',
      article: { id: result.lastID, title, slug }
    });
  } catch (error) {
    console.error('Create article error:', error);
    res.status(500).json({ error: 'Failed to create article' });
  }
});

// 更新文章（需要管理员权限）
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const db = getDb();
    const { id } = req.params;
    const { title, content, excerpt, cover_image, category_id, tags, is_published } = req.body;

    const article = await db.get('SELECT id FROM articles WHERE id = ?', id);
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    await db.run(`
      UPDATE articles SET
        title = COALESCE(?, title),
        content = COALESCE(?, content),
        excerpt = COALESCE(?, excerpt),
        cover_image = COALESCE(?, cover_image),
        category_id = COALESCE(?, category_id),
        tags = COALESCE(?, tags),
        is_published = COALESCE(?, is_published),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, title, content, excerpt, cover_image, category_id, tags, is_published, id);

    res.json({ message: 'Article updated successfully' });
  } catch (error) {
    console.error('Update article error:', error);
    res.status(500).json({ error: 'Failed to update article' });
  }
});

// 删除文章（需要管理员权限）
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const db = getDb();
    const { id } = req.params;

    const article = await db.get('SELECT id FROM articles WHERE id = ?', id);
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    await db.run('DELETE FROM articles WHERE id = ?', id);

    res.json({ message: 'Article deleted successfully' });
  } catch (error) {
    console.error('Delete article error:', error);
    res.status(500).json({ error: 'Failed to delete article' });
  }
});

// 点赞文章
router.post('/:id/like', async (req, res) => {
  try {
    const db = getDb();
    const { id } = req.params;
    await db.run('UPDATE articles SET likes = likes + 1 WHERE id = ?', id);
    res.json({ message: 'Article liked' });
  } catch (error) {
    console.error('Like article error:', error);
    res.status(500).json({ error: 'Failed to like article' });
  }
});

export default router;

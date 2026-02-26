import express from 'express';
import { getDb } from '../database/db.js';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// 获取文章评论
router.get('/article/:articleId', async (req, res) => {
  try {
    const db = getDb();
    const { articleId } = req.params;

    const comments = await db.all(`
      SELECT 
        c.id, c.content, c.guest_name, c.created_at,
        u.username, u.avatar,
        c.parent_id
      FROM comments c
      LEFT JOIN users u ON c.user_id = u.id
      WHERE c.article_id = ? AND c.is_approved = 1 AND c.parent_id IS NULL
      ORDER BY c.created_at DESC
    `, articleId);

    // 获取回复
    const replies = await db.all(`
      SELECT 
        c.id, c.content, c.guest_name, c.created_at,
        u.username, u.avatar,
        c.parent_id
      FROM comments c
      LEFT JOIN users u ON c.user_id = u.id
      WHERE c.article_id = ? AND c.is_approved = 1 AND c.parent_id IS NOT NULL
      ORDER BY c.created_at ASC
    `, articleId);

    // 构建评论树
    const commentTree = comments.map(comment => ({
      ...comment,
      author: comment.username || comment.guest_name || '匿名用户',
      avatar: comment.avatar || '/uploads/avatars/default.png',
      replies: replies.filter(r => r.parent_id === comment.id).map(r => ({
        ...r,
        author: r.username || r.guest_name || '匿名用户',
        avatar: r.avatar || '/uploads/avatars/default.png'
      }))
    }));

    res.json({ comments: commentTree });
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({ error: 'Failed to get comments' });
  }
});

// 发表评论
router.post('/', optionalAuth, async (req, res) => {
  try {
    const db = getDb();
    const { article_id, content, parent_id, guest_name, guest_email } = req.body;

    if (!article_id || !content) {
      return res.status(400).json({ error: 'Article ID and content are required' });
    }

    // 检查文章是否存在
    const article = await db.get('SELECT id FROM articles WHERE id = ?', article_id);
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    let userId = req.userId || null;
    let finalGuestName = guest_name;
    let finalGuestEmail = guest_email;

    // 如果用户已登录，使用用户信息
    if (userId) {
      const user = await db.get('SELECT username, email FROM users WHERE id = ?', userId);
      if (user) {
        finalGuestName = user.username;
        finalGuestEmail = user.email;
      }
    } else {
      // 游客评论需要名称
      if (!finalGuestName) {
        return res.status(400).json({ error: 'Name is required for guest comments' });
      }
    }

    const result = await db.run(`
      INSERT INTO comments (article_id, user_id, parent_id, content, guest_name, guest_email)
      VALUES (?, ?, ?, ?, ?, ?)
    `, article_id, userId, parent_id || null, content, finalGuestName, finalGuestEmail || null);

    res.status(201).json({
      message: 'Comment posted successfully',
      comment: {
        id: result.lastID,
        content,
        author: finalGuestName,
        created_at: new Date().toISOString(),
        replies: []
      }
    });
  } catch (error) {
    console.error('Post comment error:', error);
    res.status(500).json({ error: 'Failed to post comment' });
  }
});

// 删除评论（需要登录，只能删除自己的评论或管理员可以删除所有）
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const db = getDb();
    const { id } = req.params;

    const comment = await db.get('SELECT user_id FROM comments WHERE id = ?', id);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    // 只能删除自己的评论，管理员可以删除所有
    if (comment.user_id !== req.userId && req.userRole !== 'admin') {
      return res.status(403).json({ error: 'Permission denied' });
    }

    await db.run('DELETE FROM comments WHERE id = ?', id);

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({ error: 'Failed to delete comment' });
  }
});

// 获取所有评论（管理员用）
router.get('/admin/all', authenticateToken, async (req, res) => {
  try {
    const db = getDb();
    if (req.userRole !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const comments = await db.all(`
      SELECT 
        c.*,
        a.title as article_title, a.slug as article_slug,
        u.username
      FROM comments c
      LEFT JOIN articles a ON c.article_id = a.id
      LEFT JOIN users u ON c.user_id = u.id
      ORDER BY c.created_at DESC
      LIMIT ? OFFSET ?
    `, parseInt(limit), parseInt(offset));

    const { total } = await db.get('SELECT COUNT(*) as total FROM comments');

    res.json({
      comments,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get all comments error:', error);
    res.status(500).json({ error: 'Failed to get comments' });
  }
});

// 审核评论
router.put('/:id/approve', authenticateToken, async (req, res) => {
  try {
    const db = getDb();
    if (req.userRole !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { id } = req.params;
    const { is_approved } = req.body;

    await db.run('UPDATE comments SET is_approved = ? WHERE id = ?', is_approved ? 1 : 0, id);

    res.json({ message: 'Comment approval status updated' });
  } catch (error) {
    console.error('Approve comment error:', error);
    res.status(500).json({ error: 'Failed to update comment' });
  }
});

export default router;

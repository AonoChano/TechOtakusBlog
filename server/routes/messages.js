import express from 'express';
import { getDb } from '../database/db.js';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// 获取留言列表
router.get('/', async (req, res) => {
  try {
    const db = getDb();
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const messages = await db.all(`
      SELECT 
        m.id, m.content, m.reply, m.replied_at, m.created_at,
        u.username, u.avatar,
        m.guest_name
      FROM messages m
      LEFT JOIN users u ON m.user_id = u.id
      WHERE m.is_approved = 1
      ORDER BY m.created_at DESC
      LIMIT ? OFFSET ?
    `, parseInt(limit), parseInt(offset));

    const formattedMessages = messages.map(m => ({
      ...m,
      author: m.username || m.guest_name || '匿名访客',
      avatar: m.avatar || '/uploads/avatars/default.png'
    }));

    const { total } = await db.get('SELECT COUNT(*) as total FROM messages WHERE is_approved = 1');

    res.json({
      messages: formattedMessages,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Failed to get messages' });
  }
});

// 发表留言
router.post('/', optionalAuth, async (req, res) => {
  try {
    const db = getDb();
    const { content, guest_name, guest_email } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: 'Content is required' });
    }

    let userId = req.userId || null;
    let finalGuestName = guest_name;
    let finalGuestEmail = guest_email;

    // 如果用户已登录
    if (userId) {
      const user = await db.get('SELECT username, email FROM users WHERE id = ?', userId);
      if (user) {
        finalGuestName = user.username;
        finalGuestEmail = user.email;
      }
    } else {
      if (!finalGuestName) {
        finalGuestName = '匿名访客';
      }
    }

    const result = await db.run(`
      INSERT INTO messages (user_id, content, guest_name, guest_email)
      VALUES (?, ?, ?, ?)
    `, userId, content, finalGuestName, finalGuestEmail || null);

    res.status(201).json({
      message: 'Message posted successfully',
      data: {
        id: result.lastID,
        content,
        author: finalGuestName,
        created_at: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Post message error:', error);
    res.status(500).json({ error: 'Failed to post message' });
  }
});

// 回复留言（管理员）
router.put('/:id/reply', authenticateToken, async (req, res) => {
  try {
    const db = getDb();
    if (req.userRole !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { id } = req.params;
    const { reply } = req.body;

    if (!reply || reply.trim().length === 0) {
      return res.status(400).json({ error: 'Reply content is required' });
    }

    await db.run(`
      UPDATE messages SET reply = ?, replied_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, reply, id);

    res.json({ message: 'Reply posted successfully' });
  } catch (error) {
    console.error('Reply message error:', error);
    res.status(500).json({ error: 'Failed to post reply' });
  }
});

// 删除留言（管理员）
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const db = getDb();
    if (req.userRole !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { id } = req.params;
    await db.run('DELETE FROM messages WHERE id = ?', id);

    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({ error: 'Failed to delete message' });
  }
});

// 获取所有留言（管理员用）
router.get('/admin/all', authenticateToken, async (req, res) => {
  try {
    const db = getDb();
    if (req.userRole !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const messages = await db.all(`
      SELECT 
        m.*,
        u.username, u.email as user_email
      FROM messages m
      LEFT JOIN users u ON m.user_id = u.id
      ORDER BY m.created_at DESC
      LIMIT ? OFFSET ?
    `, parseInt(limit), parseInt(offset));

    const { total } = await db.get('SELECT COUNT(*) as total FROM messages');

    res.json({
      messages,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get all messages error:', error);
    res.status(500).json({ error: 'Failed to get messages' });
  }
});

export default router;

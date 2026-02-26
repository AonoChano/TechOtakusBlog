import express from 'express';
import { getDb } from '../database/db.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// 获取用户列表（管理员）
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const db = getDb();
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const users = await db.all(`
      SELECT id, username, email, avatar, bio, role, created_at
      FROM users
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `, parseInt(limit), parseInt(offset));

    const { total } = await db.get('SELECT COUNT(*) as total FROM users');

    res.json({
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to get users' });
  }
});

// 获取单个用户
router.get('/:id', async (req, res) => {
  try {
    const db = getDb();
    const { id } = req.params;

    const user = await db.get(`
      SELECT id, username, avatar, bio, created_at
      FROM users
      WHERE id = ?
    `, id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // 获取用户的文章数
    const { articleCount } = await db.get(`
      SELECT COUNT(*) as articleCount FROM articles WHERE author_id = ? AND is_published = 1
    `, id);

    // 获取用户的评论数
    const { commentCount } = await db.get(`
      SELECT COUNT(*) as commentCount FROM comments WHERE user_id = ?
    `, id);

    res.json({
      user: {
        ...user,
        articleCount,
        commentCount
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

// 更新用户角色（管理员）
router.put('/:id/role', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const db = getDb();
    const { id } = req.params;
    const { role } = req.body;

    if (!role || !['admin', 'user'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const user = await db.get('SELECT id FROM users WHERE id = ?', id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await db.run('UPDATE users SET role = ? WHERE id = ?', role, id);

    res.json({ message: 'User role updated successfully' });
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({ error: 'Failed to update user role' });
  }
});

// 删除用户（管理员）
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const db = getDb();
    const { id } = req.params;

    // 不能删除自己
    if (parseInt(id) === req.userId) {
      return res.status(400).json({ error: 'Cannot delete yourself' });
    }

    const user = await db.get('SELECT id FROM users WHERE id = ?', id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await db.run('DELETE FROM users WHERE id = ?', id);

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

export default router;

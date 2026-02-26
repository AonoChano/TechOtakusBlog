const express = require('express');
const { db } = require('../database/db');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// 获取所有分类
router.get('/', (req, res) => {
  try {
    const categories = db.prepare(`
      SELECT 
        c.*,
        (SELECT COUNT(*) FROM articles WHERE category_id = c.id AND is_published = 1) as article_count
      FROM categories c
      ORDER BY c.created_at ASC
    `).all();

    res.json({ categories });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Failed to get categories' });
  }
});

// 获取单个分类
router.get('/:slug', (req, res) => {
  try {
    const { slug } = req.params;

    const category = db.prepare('SELECT * FROM categories WHERE slug = ?').get(slug);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    const { article_count } = db.prepare(`
      SELECT COUNT(*) as article_count FROM articles 
      WHERE category_id = ? AND is_published = 1
    `).get(category.id);

    res.json({ category: { ...category, article_count } });
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({ error: 'Failed to get category' });
  }
});

// 创建分类（管理员）
router.post('/', authenticateToken, requireAdmin, (req, res) => {
  try {
    const { name, slug, description, color } = req.body;

    if (!name || !slug) {
      return res.status(400).json({ error: 'Name and slug are required' });
    }

    const result = db.prepare(`
      INSERT INTO categories (name, slug, description, color)
      VALUES (?, ?, ?, ?)
    `).run(name, slug, description || '', color || '#6366f1');

    res.status(201).json({
      message: 'Category created successfully',
      category: { id: result.lastInsertRowid, name, slug }
    });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ error: 'Failed to create category' });
  }
});

// 更新分类（管理员）
router.put('/:id', authenticateToken, requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, description, color } = req.body;

    const category = db.prepare('SELECT id FROM categories WHERE id = ?').get(id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    db.prepare(`
      UPDATE categories SET
        name = COALESCE(?, name),
        slug = COALESCE(?, slug),
        description = COALESCE(?, description),
        color = COALESCE(?, color)
      WHERE id = ?
    `).run(name, slug, description, color, id);

    res.json({ message: 'Category updated successfully' });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({ error: 'Failed to update category' });
  }
});

// 删除分类（管理员）
router.delete('/:id', authenticateToken, requireAdmin, (req, res) => {
  try {
    const { id } = req.params;

    const category = db.prepare('SELECT id FROM categories WHERE id = ?').get(id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    db.prepare('DELETE FROM categories WHERE id = ?').run(id);

    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

module.exports = router;

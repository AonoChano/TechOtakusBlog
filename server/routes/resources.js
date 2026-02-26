import express from 'express';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import { getDb } from '../database/db.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// 配置multer存储
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../public/uploads/resources');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB限制
});

// 获取资源列表
router.get('/', async (req, res) => {
  try {
    const db = getDb();
    const { page = 1, limit = 12, category } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT 
        id, title, description, file_size, file_type, 
        download_count, category, tags, created_at
      FROM resources
      WHERE is_public = 1
    `;
    const params = [];

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const resources = await db.all(query, ...params);

    // 获取总数
    let countQuery = 'SELECT COUNT(*) as total FROM resources WHERE is_public = 1';
    const countParams = [];
    if (category) {
      countQuery += ' AND category = ?';
      countParams.push(category);
    }
    const { total } = await db.get(countQuery, ...countParams);

    // 格式化文件大小
    const formattedResources = resources.map(r => ({
      ...r,
      file_size_formatted: formatFileSize(r.file_size)
    }));

    res.json({
      resources: formattedResources,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get resources error:', error);
    res.status(500).json({ error: 'Failed to get resources' });
  }
});

// 获取单个资源
router.get('/:id', async (req, res) => {
  try {
    const db = getDb();
    const { id } = req.params;

    const resource = await db.get(`
      SELECT 
        id, title, description, file_size, file_type,
        download_count, category, tags, created_at
      FROM resources
      WHERE id = ? AND is_public = 1
    `, id);

    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    resource.file_size_formatted = formatFileSize(resource.file_size);

    res.json({ resource });
  } catch (error) {
    console.error('Get resource error:', error);
    res.status(500).json({ error: 'Failed to get resource' });
  }
});

// 下载资源
router.get('/:id/download', async (req, res) => {
  try {
    const db = getDb();
    const { id } = req.params;
    const userId = req.userId || null;
    const ipAddress = req.ip;

    const resource = await db.get('SELECT * FROM resources WHERE id = ? AND is_public = 1', id);
    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    const filePath = path.join(__dirname, '../..', resource.file_path);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found on server' });
    }

    // 记录下载
    await db.run('INSERT INTO download_logs (resource_id, user_id, ip_address) VALUES (?, ?, ?)',
      id, userId, ipAddress);
    
    // 更新下载计数
    await db.run('UPDATE resources SET download_count = download_count + 1 WHERE id = ?', id);

    // 发送文件
    res.download(filePath, path.basename(resource.file_path));
  } catch (error) {
    console.error('Download resource error:', error);
    res.status(500).json({ error: 'Failed to download resource' });
  }
});

// 上传资源（管理员）
router.post('/', authenticateToken, requireAdmin, upload.single('file'), async (req, res) => {
  try {
    const db = getDb();
    const { title, description, category, tags } = req.body;

    if (!title || !req.file) {
      return res.status(400).json({ error: 'Title and file are required' });
    }

    const relativePath = '/uploads/resources/' + req.file.filename;

    const result = await db.run(`
      INSERT INTO resources (title, description, file_path, file_size, file_type, category, tags)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
      title,
      description || '',
      relativePath,
      req.file.size,
      req.file.mimetype,
      category || 'other',
      tags || ''
    );

    res.status(201).json({
      message: 'Resource uploaded successfully',
      resource: {
        id: result.lastID,
        title,
        file_size: req.file.size,
        file_size_formatted: formatFileSize(req.file.size)
      }
    });
  } catch (error) {
    console.error('Upload resource error:', error);
    res.status(500).json({ error: 'Failed to upload resource' });
  }
});

// 更新资源（管理员）
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const db = getDb();
    const { id } = req.params;
    const { title, description, category, tags, is_public } = req.body;

    const resource = await db.get('SELECT id FROM resources WHERE id = ?', id);
    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    await db.run(`
      UPDATE resources SET
        title = COALESCE(?, title),
        description = COALESCE(?, description),
        category = COALESCE(?, category),
        tags = COALESCE(?, tags),
        is_public = COALESCE(?, is_public),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, title, description, category, tags, is_public, id);

    res.json({ message: 'Resource updated successfully' });
  } catch (error) {
    console.error('Update resource error:', error);
    res.status(500).json({ error: 'Failed to update resource' });
  }
});

// 删除资源（管理员）
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const db = getDb();
    const { id } = req.params;

    const resource = await db.get('SELECT file_path FROM resources WHERE id = ?', id);
    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    // 删除文件
    const filePath = path.join(__dirname, '../..', resource.file_path);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // 删除数据库记录
    await db.run('DELETE FROM resources WHERE id = ?', id);

    res.json({ message: 'Resource deleted successfully' });
  } catch (error) {
    console.error('Delete resource error:', error);
    res.status(500).json({ error: 'Failed to delete resource' });
  }
});

// 获取资源分类
router.get('/categories/list', async (req, res) => {
  try {
    const db = getDb();
    const categories = await db.all(`
      SELECT category, COUNT(*) as count
      FROM resources
      WHERE is_public = 1
      GROUP BY category
    `);

    res.json({ categories });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Failed to get categories' });
  }
});

// 辅助函数：格式化文件大小
function formatFileSize(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export default router;

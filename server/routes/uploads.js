const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// 确保上传目录存在
const uploadsDir = path.join(__dirname, '../../public/uploads');
const coversDir = path.join(uploadsDir, 'covers');
const avatarsDir = path.join(uploadsDir, 'avatars');
const articlesDir = path.join(uploadsDir, 'articles');

[uploadsDir, coversDir, avatarsDir, articlesDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// 配置存储
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const type = req.body.type || 'general';
    let dest = uploadsDir;
    
    switch (type) {
      case 'cover':
        dest = coversDir;
        break;
      case 'avatar':
        dest = avatarsDir;
        break;
      case 'article':
        dest = articlesDir;
        break;
      default:
        dest = uploadsDir;
    }
    
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// 文件过滤器
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('只支持 JPG, PNG, GIF, WebP 格式的图片'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

// 上传图片（需要登录）
router.post('/', authenticateToken, upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const type = req.body.type || 'general';
    let relativePath = '/uploads/';
    
    switch (type) {
      case 'cover':
        relativePath += 'covers/';
        break;
      case 'avatar':
        relativePath += 'avatars/';
        break;
      case 'article':
        relativePath += 'articles/';
        break;
    }
    
    relativePath += req.file.filename;

    res.json({
      message: 'File uploaded successfully',
      url: relativePath,
      filename: req.file.filename,
      size: req.file.size
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

// 上传文章封面（需要管理员权限）
router.post('/cover', authenticateToken, requireAdmin, upload.single('cover'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No cover image uploaded' });
    }

    res.json({
      message: 'Cover uploaded successfully',
      url: '/uploads/covers/' + req.file.filename,
      filename: req.file.filename
    });
  } catch (error) {
    console.error('Cover upload error:', error);
    res.status(500).json({ error: 'Failed to upload cover' });
  }
});

// 上传头像
router.post('/avatar', authenticateToken, upload.single('avatar'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No avatar uploaded' });
    }

    res.json({
      message: 'Avatar uploaded successfully',
      url: '/uploads/avatars/' + req.file.filename,
      filename: req.file.filename
    });
  } catch (error) {
    console.error('Avatar upload error:', error);
    res.status(500).json({ error: 'Failed to upload avatar' });
  }
});

// 错误处理
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File size too large (max 5MB)' });
    }
  }
  res.status(500).json({ error: error.message || 'Upload failed' });
});

module.exports = router;

# 渡辺灰音の部屋 - 动漫二次元技术博客

一个功能完善的动漫二次元风格个人技术博客系统，由白发异瞳少女 **渡辺灰音 (Watanabe Haione)** 守护。

![Blog Screenshot](https://uykeggxv6mbgi.ok.kimi.link)

## ✨ 功能特性

### 前端功能
- 🎨 动漫二次元风格UI设计，白发异瞳少女主题
- 📱 响应式布局，完美支持移动端
- 📝 文章浏览、搜索、分类筛选
- 👤 用户注册、登录、个人中心
- 💬 评论系统（支持游客评论）
- 📋 留言板功能
- 📦 资源下载中心
- 🎭 Live2D看板娘互动
- 🔗 友情链接管理

### 后端功能
- 🚀 RESTful API 设计
- 🔐 JWT 用户认证
- 💾 SQLite 数据库
- 📝 文章 CRUD 管理（支持Markdown）
- 💬 评论审核机制
- 📤 文件上传下载
- 👑 管理员后台
- 🛡️ 防爆破保护

## 🛠️ 技术栈

### 前端
- React 19 + TypeScript
- Vite 6 构建工具
- Tailwind CSS 4.0
- shadcn/ui 组件库
- React Router DOM
- Lucide React 图标

### 后端
- Node.js + Express
- SQLite3 数据库（跨平台兼容）
- JWT 认证
- bcryptjs 密码加密
- Multer 文件上传

## 🚀 快速开始

### 环境要求
- Node.js 18+
- npm 或 yarn

### 1. 安装依赖

```bash
npm install
```

### 2. 启动后端服务器

```bash
npm run server
```

服务器将在 http://localhost:3001 启动

### 3. 启动前端开发服务器

```bash
npm run dev
```

前端将在 http://localhost:5173 启动

### 4. 构建生产版本

```bash
npm run build
```

构建后的文件在 `dist/` 目录

## 🖥️ 跨平台兼容性说明

### Windows 环境
本项目已针对 Windows 环境进行优化：
- 使用 `sqlite3` 替代 `better-sqlite3`，避免原生模块编译问题
- 所有数据库操作已改为异步模式
- 路径处理使用 Node.js 标准 `path` 模块

如果遇到 `better-sqlite3` 相关错误，请确保：
```bash
npm uninstall better-sqlite3
npm install sqlite3
```

### Docker 部署（推荐）
```bash
docker-compose up -d
```

## 👤 默认账号

首次启动会自动创建默认管理员账号：
- 用户名: `admin`
- 密码: `admin123`

**⚠️ 重要提示**: 请在首次登录后立即修改默认密码！

## 📁 项目结构

```
app/
├── data/                      # 数据库文件
│   └── blog.db
├── public/                    # 静态资源
│   ├── images/               # 网站图片
│   ├── avatars/              # 用户头像
│   ├── media/                # 媒体文件
│   │   ├── covers/          # 文章封面
│   │   └── files/           # 资源文件
│   ├── live2d/              # Live2D组件
│   │   └── haione/          # 灰音角色
│   │       ├── body/        # 身体部件
│   │       ├── head/        # 头部
│   │       ├── face/        # 面部表情
│   │       ├── hair/        # 头发
│   │       ├── accessories/ # 配饰
│   │       └── expressions/ # 完整表情
│   └── favicon.ico          # 网站图标
├── server/                    # 后端代码
│   ├── database/             # 数据库配置
│   ├── middleware/           # 中间件
│   ├── routes/               # API路由
│   └── index.js              # 服务器入口
├── src/                       # 前端代码
│   ├── components/           # 公共组件
│   ├── config/               # 配置文件
│   ├── hooks/                # 自定义Hooks
│   ├── pages/                # 页面组件
│   ├── types/                # TypeScript类型
│   └── App.tsx               # 应用入口
├── dist/                      # 构建输出
├── package.json
├── vite.config.ts
└── README.md
```

## ⚙️ 全局配置

所有站点配置集中在 `src/config/site.config.ts`：

```typescript
export const SITE_CONFIG = {
  name: '渡辺灰音の部屋',
  description: '一个技术宅的个人博客',
  character: {
    name: '渡辺灰音',
    description: '白发异瞳的哥特萝莉少女',
  },
  author: {
    name: '渡辺暁',
    bio: '技术宅 / 动漫爱好者',
  },
  // ...更多配置
};
```

修改此文件即可自定义站点信息。

## 🎨 Live2D 组件

项目包含完整的 **渡辺灰音** Live2D 立绘拆解组件：

| 组件类型 | 文件 |
|---------|------|
| 身体部件 | torso, arm_left/right, leg_left/right |
| 头部 | face_base, head_full |
| 头发 | hair_front, hair_back |
| 眼睛 | eye_left_blue, eye_right_red |
| 眉毛 | normal, happy, sad, angry, surprised |
| 嘴巴 | normal, happy, sad, surprised, angry |
| 配饰 | bow, choker |
| 完整表情 | neutral, happy, sad, angry, surprised, love |

所有组件位于 `public/live2d/haione/` 目录，可用于制作 Live2D 动画。

## 🔌 API 接口

### 认证
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `GET /api/auth/me` - 获取当前用户
- `PUT /api/auth/profile` - 更新个人资料
- `PUT /api/auth/password` - 修改密码

### 文章
- `GET /api/articles` - 获取文章列表
- `GET /api/articles/:slug` - 获取单篇文章
- `POST /api/articles` - 创建文章（管理员）
- `PUT /api/articles/:id` - 更新文章（管理员）
- `DELETE /api/articles/:id` - 删除文章（管理员）

### 评论
- `GET /api/comments/article/:articleId` - 获取文章评论
- `POST /api/comments` - 发表评论
- `DELETE /api/comments/:id` - 删除评论

### 留言
- `GET /api/messages` - 获取留言列表
- `POST /api/messages` - 发表留言
- `PUT /api/messages/:id/reply` - 回复留言（管理员）

### 资源
- `GET /api/resources` - 获取资源列表
- `GET /api/resources/:id/download` - 下载资源
- `POST /api/resources` - 上传资源（管理员）

### 上传
- `POST /api/uploads` - 上传图片（支持封面、头像）

### 分类
- `GET /api/categories` - 获取分类列表

### 统计
- `GET /api/stats` - 获取网站统计
- `GET /api/stats/dashboard` - 获取仪表盘数据（管理员）

## 🗄️ 数据库表结构

### users - 用户表
- id, username, email, password, avatar, bio, role, created_at

### articles - 文章表
- id, title, slug, content, excerpt, cover_image, author_id, category_id, tags, views, likes, is_published, created_at

### categories - 分类表
- id, name, slug, description, color, created_at

### comments - 评论表
- id, article_id, user_id, parent_id, content, guest_name, guest_email, is_approved, created_at

### messages - 留言表
- id, user_id, content, guest_name, guest_email, is_approved, reply, replied_at, created_at

### resources - 资源表
- id, title, description, file_path, file_size, file_type, download_count, category, tags, is_public, created_at

## 📝 编辑器快捷键

| 快捷键 | 功能 |
|--------|------|
| Ctrl+B | 粗体 |
| Ctrl+I | 斜体 |
| Ctrl+K | 插入链接 |
| Ctrl+Z | 撤销 |
| Ctrl+Shift+Z | 重做 |

## 🔧 自定义配置

### 修改端口
编辑 `server/index.js` 中的 `PORT` 变量

### 修改主题颜色
编辑 `src/config/site.config.ts` 中的 `THEME.colors`

### 添加新分类
通过管理员后台或调用 API 添加

## ⚠️ 注意事项

1. **首次启动**会自动创建数据库和默认管理员账号
2. **数据库文件**存储在 `data/blog.db`
3. **上传的文件**存储在 `public/uploads/` 目录
4. **生产环境**建议修改 JWT 密钥和默认密码
5. **Windows 用户**如遇数据库问题，请使用 `sqlite3` 而非 `better-sqlite3`

## 📄 许可证

MIT License

---

Made with ❤️ by 渡辺暁 & 渡辺灰音

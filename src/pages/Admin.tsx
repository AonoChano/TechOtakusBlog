import { useEffect, useState } from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { useAuth, apiRequest } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import {
  LayoutDashboard,
  FileText,
  Users,
  MessageSquare,
  Download,
  Plus,
  Edit,
  Trash2,
  Eye,
  Check
} from 'lucide-react';

// 仪表盘
function Dashboard() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await apiRequest('/stats/dashboard');
      setStats(response);
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    }
  };

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: '文章', value: stats.overview.articles.total, icon: FileText },
          { label: '用户', value: stats.overview.users.total, icon: Users },
          { label: '评论', value: stats.overview.comments.total, icon: MessageSquare },
          { label: '资源', value: stats.overview.resources.total, icon: Download },
        ].map((stat, index) => (
          <Card key={index} className="anime-card">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <stat.icon className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-slate-400">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="anime-card">
          <CardHeader>
            <CardTitle className="text-white text-lg">最近注册</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.recentUsers.map((user: any) => (
                <div key={user.id} className="flex items-center justify-between py-2 border-b border-purple-500/10 last:border-0">
                  <div>
                    <p className="text-white font-medium">{user.username}</p>
                    <p className="text-sm text-slate-400">{user.email}</p>
                  </div>
                  <span className="text-xs text-slate-500">
                    {new Date(user.created_at).toLocaleDateString('zh-CN')}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="anime-card">
          <CardHeader>
            <CardTitle className="text-white text-lg">待审核评论</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.recentComments.filter((c: any) => !c.is_approved).slice(0, 5).map((comment: any) => (
                <div key={comment.id} className="py-2 border-b border-purple-500/10 last:border-0">
                  <p className="text-white text-sm line-clamp-2">{comment.content}</p>
                  <p className="text-xs text-slate-400 mt-1">
                    {comment.username || '匿名'} · {comment.article_title}
                  </p>
                </div>
              ))}
              {stats.recentComments.filter((c: any) => !c.is_approved).length === 0 && (
                <p className="text-slate-400 text-center py-4">没有待审核评论</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// 文章管理
function ArticlesManager() {
  const [articles, setArticles] = useState<any[]>([]);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await apiRequest('/articles?limit=100');
      setArticles(response.articles);
    } catch (error) {
      console.error('Failed to fetch articles:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除这篇文章吗？')) return;
    try {
      await apiRequest(`/articles/${id}`, { method: 'DELETE' });
      toast.success('文章已删除');
      fetchArticles();
    } catch (error) {
      toast.error('删除失败');
    }
  };

  return (
    <Card className="anime-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-white">文章管理</CardTitle>
        <Button className="bg-purple-600 hover:bg-purple-700">
          <Plus className="w-4 h-4 mr-2" />
          新建文章
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-purple-500/20">
                <th className="text-left py-3 px-4 text-slate-300">标题</th>
                <th className="text-left py-3 px-4 text-slate-300">分类</th>
                <th className="text-left py-3 px-4 text-slate-300">浏览</th>
                <th className="text-left py-3 px-4 text-slate-300">状态</th>
                <th className="text-left py-3 px-4 text-slate-300">操作</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((article) => (
                <tr key={article.id} className="border-b border-purple-500/10">
                  <td className="py-3 px-4">
                    <p className="text-white font-medium">{article.title}</p>
                    <p className="text-xs text-slate-400">{new Date(article.created_at).toLocaleDateString('zh-CN')}</p>
                  </td>
                  <td className="py-3 px-4 text-slate-300">{article.category_name}</td>
                  <td className="py-3 px-4 text-slate-300">{article.views}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs ${article.is_published ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                      {article.is_published ? '已发布' : '草稿'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <Link to={`/articles/${article.slug}`} target="_blank">
                        <Button size="sm" variant="ghost">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button size="sm" variant="ghost">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleDelete(article.id)}>
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

// 评论管理
function CommentsManager() {
  const [comments, setComments] = useState<any[]>([]);

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const response = await apiRequest('/comments/admin/all?limit=100');
      setComments(response.comments);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    }
  };

  const handleApprove = async (id: number, approved: boolean) => {
    try {
      await apiRequest(`/comments/${id}/approve`, {
        method: 'PUT',
        body: JSON.stringify({ is_approved: approved })
      });
      toast.success(approved ? '评论已通过' : '评论已拒绝');
      fetchComments();
    } catch (error) {
      toast.error('操作失败');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除这条评论吗？')) return;
    try {
      await apiRequest(`/comments/${id}`, { method: 'DELETE' });
      toast.success('评论已删除');
      fetchComments();
    } catch (error) {
      toast.error('删除失败');
    }
  };

  return (
    <Card className="anime-card">
      <CardHeader>
        <CardTitle className="text-white">评论管理</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="p-4 bg-slate-900/50 rounded-lg border border-purple-500/10">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-white font-medium">{comment.username || comment.guest_name || '匿名'}</p>
                  <p className="text-sm text-slate-400">文章: {comment.article_title}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs ${comment.is_approved ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                  {comment.is_approved ? '已通过' : '待审核'}
                </span>
              </div>
              <p className="text-slate-300 mb-3">{comment.content}</p>
              <div className="flex gap-2">
                {!comment.is_approved && (
                  <Button size="sm" onClick={() => handleApprove(comment.id, true)}>
                    <Check className="w-4 h-4 mr-1" />
                    通过
                  </Button>
                )}
                <Button size="sm" variant="ghost" onClick={() => handleDelete(comment.id)}>
                  <Trash2 className="w-4 h-4 text-red-400" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// 主管理页面
export default function Admin() {
  const { isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="anime-card p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">权限不足</h2>
          <p className="text-slate-400">只有管理员可以访问此页面</p>
        </Card>
      </div>
    );
  }

  const navItems = [
    { path: '/admin', label: '仪表盘', icon: LayoutDashboard },
    { path: '/admin/articles', label: '文章', icon: FileText },
    { path: '/admin/comments', label: '评论', icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64">
            <Card className="anime-card sticky top-24">
              <CardContent className="p-4">
                <h2 className="text-lg font-bold text-white mb-4 px-2">管理后台</h2>
                <nav className="space-y-1">
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                        location.pathname === item.path
                          ? 'bg-purple-600 text-white'
                          : 'text-slate-300 hover:bg-white/5'
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Content */}
          <div className="flex-1">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/articles" element={<ArticlesManager />} />
              <Route path="/comments" element={<CommentsManager />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
}

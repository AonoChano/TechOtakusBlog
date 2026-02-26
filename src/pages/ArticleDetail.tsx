import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiRequest, useAuth } from '@/hooks/useAuth';
import type { Article, Comment } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Eye,
  Heart,
  Calendar,
  FolderOpen,
  MessageCircle,
  Send,
  Share2,
  Bookmark
} from 'lucide-react';

export default function ArticleDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { isAuthenticated } = useAuth();
  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentContent, setCommentContent] = useState('');
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchArticle();
    }
  }, [slug]);

  const fetchArticle = async () => {
    try {
      setIsLoading(true);
      const response = await apiRequest(`/articles/${slug}`);
      setArticle(response.article);
      setRelatedArticles(response.relatedArticles || []);
      
      // 获取评论
      const commentsRes = await apiRequest(`/comments/article/${response.article.id}`);
      setComments(commentsRes.comments || []);
    } catch (error) {
      console.error('Failed to fetch article:', error);
      toast.error('文章加载失败');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = async () => {
    if (!article) return;
    try {
      await apiRequest(`/articles/${article.id}/like`, { method: 'POST' });
      setArticle({ ...article, likes: article.likes + 1 });
      toast.success('点赞成功！少女很开心~');
    } catch (error) {
      toast.error('点赞失败');
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!article) return;
    if (!commentContent.trim()) {
      toast.error('请输入评论内容');
      return;
    }

    try {
      setIsSubmitting(true);
      await apiRequest('/comments', {
        method: 'POST',
        body: JSON.stringify({
          article_id: article.id,
          content: commentContent,
          guest_name: isAuthenticated ? undefined : guestName,
          guest_email: isAuthenticated ? undefined : guestEmail
        })
      });
      
      toast.success('评论发表成功！');
      setCommentContent('');
      setGuestName('');
      setGuestEmail('');
      
      // 刷新评论
      const commentsRes = await apiRequest(`/comments/article/${article.id}`);
      setComments(commentsRes.comments || []);
    } catch (error: any) {
      toast.error(error.message || '评论发表失败');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="dark-card p-8 text-center">
          <div className="flex justify-center mb-4">
            <img src="/uploads/girl-confused.png" alt="困惑少女" className="w-24 h-24 object-contain" />
          </div>
          <h2 className="text-2xl font-bold text-gray-200 mb-2">文章不存在</h2>
          <p className="text-gray-500 mb-4">该文章可能已被删除或不存在</p>
          <Link to="/articles">
            <Button className="bg-red-900/80 hover:bg-red-800">
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回文章列表
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 relative">
      {/* 装饰少女 */}
      <div className="absolute right-0 top-20 opacity-10 pointer-events-none">
        <img src="/uploads/girl-read.png" alt="装饰" className="w-32 h-40 object-contain" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link to="/articles" className="inline-flex items-center text-gray-500 hover:text-red-500 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          返回文章列表
        </Link>

        {/* Article Header */}
        <article className="mb-12">
          {/* Cover Image */}
          <div className="aspect-video rounded-2xl overflow-hidden mb-8 dark-card">
            <img
              src={article.cover_image || '/uploads/articles/default.jpg'}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Title & Meta */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Badge
                variant="secondary"
                style={{ backgroundColor: `${article.category_color}15`, color: article.category_color }}
              >
                <FolderOpen className="w-3 h-3 mr-1" />
                {article.category_name}
              </Badge>
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-200 mb-6">
              {article.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <img
                  src={article.author_avatar || '/uploads/avatars/default.png'}
                  alt={article.author_name}
                  className="w-8 h-8 rounded-full object-cover border border-gray-700"
                />
                <span className="text-gray-300">{article.author_name}</span>
              </div>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(article.created_at).toLocaleDateString('zh-CN')}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {article.views} 阅读
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle className="w-4 h-4" />
                {comments.length} 评论
              </span>
            </div>
          </div>

          {/* Content */}
          <Card className="dark-card mb-8">
            <CardContent className="p-8">
              <div 
                className="article-content prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={handleLike}
                className="border-red-900/40 hover:bg-red-900/20 hover:text-red-400"
              >
                <Heart className="w-5 h-5 mr-2" />
                {article.likes} 点赞
              </Button>
              <Button
                variant="outline"
                className="border-gray-800 hover:bg-gray-800/50"
              >
                <Share2 className="w-5 h-5 mr-2" />
                分享
              </Button>
            </div>
            <Button
              variant="outline"
              className="border-gray-800 hover:bg-gray-800/50"
            >
              <Bookmark className="w-5 h-5 mr-2" />
              收藏
            </Button>
          </div>
        </article>

        {/* Comments Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-200 mb-6 flex items-center gap-2">
            <MessageCircle className="w-6 h-6 text-red-500" />
            评论 ({comments.length})
          </h2>

          {/* Comment Form */}
          <Card className="dark-card mb-8">
            <CardContent className="p-6">
              <form onSubmit={handleSubmitComment}>
                {!isAuthenticated && (
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <Input
                      placeholder="你的名字"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      className="bg-[#141414] border-gray-800"
                    />
                    <Input
                      type="email"
                      placeholder="你的邮箱（可选）"
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      className="bg-[#141414] border-gray-800"
                    />
                  </div>
                )}
                <Textarea
                  placeholder="写下你的评论..."
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  className="bg-[#141414] border-gray-800 min-h-[100px] mb-4"
                />
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-red-900/80 hover:bg-red-800"
                >
                  <Send className="w-4 h-4 mr-2" />
                  {isSubmitting ? '发送中...' : '发表评论'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Comments List */}
          <div className="space-y-4">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <CommentItem key={comment.id} comment={comment} />
              ))
            ) : (
              <Card className="dark-card py-8 text-center">
                <CardContent>
                  <div className="flex justify-center mb-4">
                    <img src="/uploads/girl-confused.png" alt="困惑少女" className="w-16 h-16 object-contain opacity-60" />
                  </div>
                  <p className="text-gray-500">暂无评论，来发表第一条评论吧~</p>
                </CardContent>
              </Card>
            )}
          </div>
        </section>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-gray-200 mb-6">相关文章</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {relatedArticles.map((article) => (
                <Link key={article.id} to={`/articles/${article.slug}`}>
                  <Card className="dark-card hover:border-red-900/40 transition-all hover:scale-[1.02]">
                    <CardContent className="p-4">
                      <div className="aspect-video rounded-lg overflow-hidden mb-3">
                        <img
                          src={article.cover_image || '/uploads/articles/default.jpg'}
                          alt={article.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h3 className="font-medium text-gray-300 line-clamp-2">{article.title}</h3>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

// 评论项组件
function CommentItem({ comment }: { comment: Comment }) {
  return (
    <Card className="dark-card">
      <CardContent className="p-5">
        <div className="flex gap-4">
          <img
            src={comment.avatar || '/uploads/avatars/default.png'}
            alt={comment.author}
            className="w-10 h-10 rounded-full object-cover border border-gray-700"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-medium text-gray-300">{comment.author}</span>
              <span className="text-xs text-gray-600">
                {new Date(comment.created_at).toLocaleDateString('zh-CN')}
              </span>
            </div>
            <p className="text-gray-400">{comment.content}</p>
            
            {/* Replies */}
            {comment.replies && comment.replies.length > 0 && (
              <div className="mt-4 space-y-3 pl-4 border-l-2 border-red-900/30">
                {comment.replies.map((reply) => (
                  <div key={reply.id} className="flex gap-3">
                    <img
                      src={reply.avatar || '/uploads/avatars/default.png'}
                      alt={reply.author}
                      className="w-8 h-8 rounded-full object-cover border border-gray-700"
                    />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-400 text-sm">{reply.author}</span>
                        <span className="text-xs text-gray-600">
                          {new Date(reply.created_at).toLocaleDateString('zh-CN')}
                        </span>
                      </div>
                      <p className="text-gray-500 text-sm">{reply.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

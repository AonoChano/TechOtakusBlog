import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiRequest } from '@/hooks/useAuth';
import type { Article, Category } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Sparkles,
  ArrowRight,
  FileText,
  Users,
  MessageSquare,
  Eye,
  Heart,
  Calendar,
  ChevronRight,
  FolderOpen
} from 'lucide-react';
import InteractiveBackground from '@/components/InteractiveBackground';

interface Stats {
  articleCount: number;
  userCount: number;
  commentCount: number;
  messageCount: number;
  resourceCount: number;
  downloadCount: number;
}

export default function Home() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [latestArticles, setLatestArticles] = useState<Article[]>([]);
  const [popularArticles, setPopularArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, categoriesRes] = await Promise.all([
        apiRequest('/stats'),
        apiRequest('/categories')
      ]);
      
      setStats(statsRes.stats);
      setLatestArticles(statsRes.latestArticles || []);
      setPopularArticles(statsRes.popularArticles || []);
      setCategories(categoriesRes.categories || []);
    } catch (error) {
      console.error('Failed to fetch home data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      {/* 交互式背景 */}
      <InteractiveBackground />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* 左侧：少女大图 */}
            <div className="relative flex justify-center lg:justify-start order-2 lg:order-1">
              <div className="relative">
                {/* 光环效果 */}
                <div className="absolute inset-0 bg-gradient-radial from-red-900/20 via-transparent to-transparent rounded-full blur-3xl scale-150" />
                
                {/* 少女主图 */}
                <div className="relative z-10 animate-float-gentle">
                  <img 
                    src="/uploads/girl-read.png" 
                    alt="白发异瞳少女"
                    className="w-full max-w-md h-auto drop-shadow-2xl"
                  />
                </div>
              </div>
            </div>

            {/* 右侧：文字内容 */}
            <div className="text-center lg:text-left order-1 lg:order-2">
              {/* 徽章 */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-900/20 border border-red-900/40 mb-6">
                <Sparkles className="w-4 h-4 text-red-500" />
                <span className="text-sm text-red-400">白发异瞳少女的二次元世界</span>
              </div>

              {/* 标题 */}
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                <span className="bg-gradient-to-r from-gray-200 via-gray-400 to-red-500 bg-clip-text text-transparent">
                  TechOtaku
                </span>
              </h1>
              <h2 className="text-2xl md:text-3xl text-gray-400 mb-6">
                技术宅的异瞳少女博客
              </h2>

              {/* 描述 */}
              <p className="text-lg text-gray-500 max-w-lg mx-auto lg:mx-0 mb-8">
                欢迎来到我的小小世界~ 这里分享编程技术、动漫推荐、游戏心得。
                让白发异瞳少女陪你一起探索二次元和代码的奇妙世界！
              </p>

              {/* CTA按钮 */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/articles">
                  <Button
                    size="lg"
                    className="bg-red-900/80 hover:bg-red-800 text-white px-8 border border-red-700/50"
                  >
                    浏览文章
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link to="/messages">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-gray-700 hover:bg-gray-800/50 text-gray-300"
                  >
                    <MessageSquare className="w-5 h-5 mr-2" />
                    给我留言
                  </Button>
                </Link>
              </div>

              {/* 统计 */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-6 mt-10">
                {[
                  { label: '文章', value: stats?.articleCount || 0, icon: FileText },
                  { label: '用户', value: stats?.userCount || 0, icon: Users },
                  { label: '评论', value: stats?.commentCount || 0, icon: MessageSquare },
                ].map((stat, index) => (
                  <div key={index} className="flex items-center gap-2 text-gray-400">
                    <stat.icon className="w-4 h-4 text-red-600/60" />
                    <span className="font-semibold text-gray-300">{stat.value}</span>
                    <span className="text-sm">{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 滚动提示 */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-gray-700 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-red-600/60 rounded-full" />
          </div>
        </div>
      </section>

      {/* 分类区域 */}
      <section className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-200">文章分类</h2>
              <p className="text-gray-500 mt-1">找到你感兴趣的内容~</p>
            </div>
            <Link to="/categories" className="text-red-500 hover:text-red-400 flex items-center gap-1 text-sm">
              查看全部 <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((category) => (
              <Link key={category.id} to={`/category/${category.slug}`}>
                <Card className="dark-card hover:border-red-900/40 transition-all hover:scale-105 h-full">
                  <CardContent className="p-5 text-center">
                    <div
                      className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center"
                      style={{ backgroundColor: `${category.color}15` }}
                    >
                      <FolderOpen className="w-6 h-6" style={{ color: category.color }} />
                    </div>
                    <h3 className="font-medium text-gray-300 mb-1">{category.name}</h3>
                    <p className="text-xs text-gray-500">{category.article_count} 篇文章</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 最新文章 */}
      <section className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-200">最新文章</h2>
              <p className="text-gray-500 mt-1">看看我最近写了什么~</p>
            </div>
            <Link to="/articles" className="text-red-500 hover:text-red-400 flex items-center gap-1 text-sm">
              查看全部 <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      </section>

      {/* 热门文章 */}
      <section className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-200">热门文章</h2>
              <p className="text-gray-500 mt-1">大家最喜欢看这些~</p>
            </div>
            <Link to="/articles" className="text-red-500 hover:text-red-400 flex items-center gap-1 text-sm">
              查看全部 <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA区域 */}
      <section className="py-20 relative overflow-hidden z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="dark-card relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-red-900/10 to-transparent" />
            <CardContent className="p-8 md:p-12 relative z-10">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-200 mb-4">
                    加入我们的讨论
                  </h2>
                  <p className="text-gray-500 mb-6">
                    在留言板分享你的想法，和其他技术宅、动漫爱好者一起交流。
                    白发异瞳少女会认真阅读每一条留言哦~
                  </p>
                  <Link to="/messages">
                    <Button className="bg-red-900/80 hover:bg-red-800 text-white">
                      <MessageSquare className="w-5 h-5 mr-2" />
                      去留言
                    </Button>
                  </Link>
                </div>
                <div className="flex justify-center">
                  <img 
                    src="/images/cta-discussion-new.png" 
                    alt="灰音"
                    className="w-56 h-56 object-contain animate-float-gentle drop-shadow-2xl"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 特殊场景展示区域 */}
      <section className="py-20 relative overflow-hidden z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-200 mb-2">异瞳少女的世界</h2>
            <p className="text-gray-500">一起探索这个充满幻想的二次元空间~</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* 月亮场景 */}
            <div className="relative rounded-2xl overflow-hidden group">
              <img 
                src="/uploads/scene-moon.jpg" 
                alt="月亮上的少女"
                className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-4 left-4">
                <p className="text-white font-medium">星空下的梦想</p>
                <p className="text-gray-300 text-sm">在月亮上数星星~</p>
              </div>
            </div>
            
            {/* 樱花场景 */}
            <div className="relative rounded-2xl overflow-hidden group">
              <img 
                src="/uploads/scene-sakura.jpg" 
                alt="樱花树下的少女"
                className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-4 left-4">
                <p className="text-white font-medium">樱花飞舞的季节</p>
                <p className="text-gray-300 text-sm">花瓣飘落的美~</p>
              </div>
            </div>
            
            {/* 雨天场景 */}
            <div className="relative rounded-2xl overflow-hidden group">
              <img 
                src="/uploads/scene-rain.jpg" 
                alt="窗边听雨的少女"
                className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-4 left-4">
                <p className="text-white font-medium">雨天的宁静</p>
                <p className="text-gray-300 text-sm">听雨声，读好书~</p>
              </div>
            </div>
            
            {/* 花海场景 */}
            <div className="relative rounded-2xl overflow-hidden group">
              <img 
                src="/uploads/scene-flower.jpg" 
                alt="花海中的少女"
                className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-4 left-4">
                <p className="text-white font-medium">花海漫步</p>
                <p className="text-gray-300 text-sm">在花海中自由奔跑~</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Q版少女画廊 */}
      <section className="py-20 relative overflow-hidden bg-gradient-to-b from-transparent to-red-900/5 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-200 mb-2">Q版少女表情包</h2>
            <p className="text-gray-500">各种可爱表情，陪你度过每一天~</p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { src: '/uploads/girl-q-happy.png', name: '开心' },
              { src: '/uploads/girl-q-shy.png', name: '害羞' },
              { src: '/uploads/girl-q-love.png', name: '喜欢' },
              { src: '/uploads/girl-q-surprised.png', name: '惊讶' },
              { src: '/uploads/girl-q-thinking.png', name: '思考' },
              { src: '/uploads/girl-q-sleepy.png', name: '困倦' },
              { src: '/uploads/girl-q-proud.png', name: '得意' },
              { src: '/uploads/girl-q-wave.png', name: '挥手' },
            ].map((item, index) => (
              <div 
                key={index} 
                className="w-20 h-20 rounded-xl bg-[#1a1a1a] border border-gray-800 flex flex-col items-center justify-center hover:border-red-900/40 transition-all hover:scale-110 cursor-pointer"
              >
                <img src={item.src} alt={item.name} className="w-14 h-14 object-contain" />
                <span className="text-xs text-gray-500 mt-1">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// 文章卡片组件
function ArticleCard({ article }: { article: Article }) {
  return (
    <Link to={`/articles/${article.slug}`}>
      <Card className="dark-card overflow-hidden hover:border-red-900/40 transition-all hover:scale-[1.02] h-full flex flex-col">
        <div className="aspect-video overflow-hidden">
          <img
            src={article.cover_image || '/uploads/articles/default.jpg'}
            alt={article.title}
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
          />
        </div>
        <CardContent className="p-5 flex-1 flex flex-col">
          <div className="flex items-center gap-2 mb-3">
            <Badge
              variant="secondary"
              className="text-xs"
              style={{ backgroundColor: `${article.category_color}15`, color: article.category_color, borderColor: `${article.category_color}30` }}
            >
              {article.category_name}
            </Badge>
          </div>
          <h3 className="font-medium text-gray-300 mb-2 line-clamp-2 flex-1">
            {article.title}
          </h3>
          <div className="flex items-center justify-between text-sm text-gray-500 mt-4">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4" /> {article.views}
              </span>
              <span className="flex items-center gap-1">
                <Heart className="w-4 h-4" /> {article.likes}
              </span>
            </div>
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {new Date(article.created_at).toLocaleDateString('zh-CN')}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

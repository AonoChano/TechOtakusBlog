import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { apiRequest } from '@/hooks/useAuth';
import type { Article, Pagination } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Mascot, { EmptyBoxMascot } from '@/components/Mascot';
import {
  Search,
  Eye,
  Heart,
  Calendar,
  ChevronLeft,
  ChevronRight,
  FolderOpen,
  User
} from 'lucide-react';

export default function Articles() {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [articles, setArticles] = useState<Article[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 9,
    total: 0,
    totalPages: 0
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [categoryName, setCategoryName] = useState('');

  const page = parseInt(searchParams.get('page') || '1');
  const search = searchParams.get('search') || '';

  useEffect(() => {
    fetchArticles();
  }, [page, search, slug]);

  const fetchArticles = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      params.set('page', page.toString());
      params.set('limit', '9');
      if (search) params.set('search', search);
      if (slug) params.set('category', slug);

      const response = await apiRequest(`/articles?${params.toString()}`);
      setArticles(response.articles);
      setPagination(response.pagination);

      if (slug && response.articles.length > 0) {
        setCategoryName(response.articles[0].category_name);
      }
    } catch (error) {
      console.error('Failed to fetch articles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    if (searchQuery) {
      newParams.set('search', searchQuery);
    } else {
      newParams.delete('search');
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handlePageChange = (newPage: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', newPage.toString());
    setSearchParams(newParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 relative">
      {/* 装饰少女 */}
      <div className="absolute right-0 top-20 opacity-10 pointer-events-none">
        <img src="/uploads/girl-read.png" alt="装饰" className="w-40 h-52 object-contain" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-red-900/20 flex items-center justify-center">
              <FolderOpen className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-200">
                {slug ? categoryName || '分类文章' : search ? `搜索: ${search}` : '全部文章'}
              </h1>
              <p className="text-gray-500 mt-1">
                {slug 
                  ? `浏览 ${categoryName} 分类下的所有文章`
                  : search 
                    ? `找到 ${pagination.total} 篇相关文章`
                    : `共 ${pagination.total} 篇文章，让白发少女陪你一起阅读~`
                }
              </p>
            </div>
          </div>
        </div>

        {/* Search */}
        {!slug && (
          <form onSubmit={handleSearch} className="mb-8">
            <div className="flex gap-3 max-w-lg">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <Input
                  type="text"
                  placeholder="搜索文章..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-[#141414] border-gray-800 focus:border-red-900/60"
                />
              </div>
              <Button type="submit" className="bg-red-900/80 hover:bg-red-800">
                搜索
              </Button>
            </div>
          </form>
        )}

        {/* Articles Grid */}
        {articles.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <Card className="dark-card py-16 text-center">
            <CardContent>
              <EmptyBoxMascot message={search ? '没有找到匹配的文章，试试其他关键词~' : '该分类下暂时没有文章呢~'} />
            </CardContent>
          </Card>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="border-gray-800 hover:bg-gray-800/50"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pageNum) => (
              <Button
                key={pageNum}
                variant={pageNum === page ? 'default' : 'outline'}
                size="sm"
                onClick={() => handlePageChange(pageNum)}
                className={pageNum === page 
                  ? 'bg-red-900/80 hover:bg-red-800' 
                  : 'border-gray-800 hover:bg-gray-800/50'
                }
              >
                {pageNum}
              </Button>
            ))}
            
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(page + 1)}
              disabled={page === pagination.totalPages}
              className="border-gray-800 hover:bg-gray-800/50"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        )}
      </div>

      {/* 看板娘 */}
      <Mascot page="articles" />
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
              style={{ backgroundColor: `${article.category_color}15`, color: article.category_color }}
            >
              {article.category_name}
            </Badge>
          </div>
          <h3 className="font-medium text-gray-300 mb-2 line-clamp-2 flex-1">
            {article.title}
          </h3>
          <p className="text-sm text-gray-500 line-clamp-2 mb-4">
            {article.excerpt}
          </p>
          <div className="flex items-center justify-between text-sm text-gray-500 mt-auto">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <User className="w-4 h-4" /> {article.author_name}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4" /> {article.views}
              </span>
              <span className="flex items-center gap-1">
                <Heart className="w-4 h-4" /> {article.likes}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-600 mt-2">
            <Calendar className="w-3 h-3" />
            {new Date(article.created_at).toLocaleDateString('zh-CN')}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

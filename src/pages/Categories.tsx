import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiRequest } from '@/hooks/useAuth';
import type { Category } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { FolderOpen, FileText, ChevronRight } from 'lucide-react';
import Mascot, { EmptyBoxMascot } from '@/components/Mascot';

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await apiRequest('/categories');
      setCategories(response.categories);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
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
    <div className="min-h-screen py-12 relative">
      {/* 装饰少女 */}
      <div className="absolute left-0 bottom-0 opacity-10 pointer-events-none">
        <img src="/uploads/girl-sit.png" alt="装饰" className="w-40 h-52 object-contain" />
      </div>
      <div className="absolute right-10 top-10 opacity-10 pointer-events-none">
        <img src="/uploads/girl-wink.png" alt="装饰" className="w-32 h-32 object-contain" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <img 
              src="/uploads/girl-stand.png" 
              alt="分类少女" 
              className="w-24 h-32 object-contain animate-float-gentle"
            />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-200 mb-2">文章分类</h1>
          <p className="text-gray-500">找到你感兴趣的内容，和白发少女一起探索~</p>
        </div>

        {/* Categories Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link key={category.id} to={`/category/${category.slug}`}>
              <Card className="dark-card hover:border-red-900/40 transition-all hover:scale-[1.02] h-full group">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                      style={{ backgroundColor: `${category.color}15` }}
                    >
                      <FolderOpen className="w-7 h-7" style={{ color: category.color }} />
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-red-500 transition-colors" />
                  </div>
                  
                  <h3 className="text-xl font-medium text-gray-200 mb-2">
                    {category.name}
                  </h3>
                  
                  <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                    {category.description || '暂无描述'}
                  </p>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <FileText className="w-4 h-4" style={{ color: category.color }} />
                    <span style={{ color: category.color }}>
                      {category.article_count} 篇文章
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {categories.length === 0 && (
          <Card className="dark-card py-16 text-center">
            <CardContent>
              <EmptyBoxMascot message="分类正在整理中，敬请期待~" />
            </CardContent>
          </Card>
        )}
      </div>

      {/* 看板娘 */}
      <Mascot page="categories" />
    </div>
  );
}

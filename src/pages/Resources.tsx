import { useEffect, useState } from 'react';
import { apiRequest } from '@/hooks/useAuth';
import type { Resource, Pagination } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import Mascot, { EmptyBoxMascot } from '@/components/Mascot';
import {
  Download,
  FileArchive,
  FileCode,
  FileImage,
  FileText,
  FileVideo,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const fileTypeIcons: Record<string, React.ElementType> = {
  'application/zip': FileArchive,
  'application/x-zip-compressed': FileArchive,
  'application/x-rar-compressed': FileArchive,
  'text/plain': FileText,
  'text/markdown': FileText,
  'text/html': FileCode,
  'application/json': FileCode,
  'image/jpeg': FileImage,
  'image/png': FileImage,
  'image/gif': FileImage,
  'video/mp4': FileVideo,
  'default': FileText
};

export default function Resources() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchResources();
  }, [pagination.page]);

  const fetchResources = async () => {
    try {
      setIsLoading(true);
      const response = await apiRequest(`/resources?page=${pagination.page}&limit=12`);
      setResources(response.resources);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Failed to fetch resources:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (resource: Resource) => {
    try {
      const response = await fetch(`http://localhost:3001/api/resources/${resource.id}/download`);
      if (!response.ok) throw new Error('Download failed');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = resource.title;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success('下载已开始~');
      fetchResources(); // 刷新下载计数
    } catch (error) {
      toast.error('下载失败');
    }
  };

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getFileIcon = (fileType: string) => {
    return fileTypeIcons[fileType] || fileTypeIcons['default'];
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
        <img src="/uploads/girl-like.png" alt="装饰" className="w-32 h-32 object-contain" />
      </div>
      <div className="absolute left-0 bottom-20 opacity-10 pointer-events-none">
        <img src="/uploads/girl-sleep.png" alt="装饰" className="w-36 h-48 object-contain" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-red-900/20 flex items-center justify-center">
              <Download className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-200">资源下载</h1>
              <p className="text-gray-500 mt-1">
                共 {pagination.total} 个资源文件，免费下载使用~
              </p>
            </div>
          </div>
        </div>

        {/* Resources Grid */}
        {resources.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-10">
            {resources.map((resource) => {
              const FileIcon = getFileIcon(resource.file_type);
              return (
                <Card key={resource.id} className="dark-card hover:border-red-900/40 transition-all hover:scale-[1.02] h-full flex flex-col">
                  <CardContent className="p-5 flex-1 flex flex-col">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-red-900/10 flex items-center justify-center">
                        <FileIcon className="w-6 h-6 text-red-500" />
                      </div>
                      <Badge variant="secondary" className="bg-[#1a1a1a] text-gray-400 border border-gray-800">
                        {resource.file_size_formatted}
                      </Badge>
                    </div>
                    
                    <h3 className="font-medium text-gray-300 mb-2 line-clamp-2">
                      {resource.title}
                    </h3>
                    
                    <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">
                      {resource.description || '暂无描述'}
                    </p>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                      <span className="text-sm text-gray-600 flex items-center gap-1">
                        <Download className="w-4 h-4" />
                        {resource.download_count}
                      </span>
                      <Button
                        size="sm"
                        onClick={() => handleDownload(resource)}
                        className="bg-red-900/80 hover:bg-red-800"
                      >
                        下载
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="dark-card py-16 text-center">
            <CardContent>
              <EmptyBoxMascot message="资源正在整理中，敬请期待~" />
            </CardContent>
          </Card>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="border-gray-800 hover:bg-gray-800/50"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pageNum) => (
              <Button
                key={pageNum}
                variant={pageNum === pagination.page ? 'default' : 'outline'}
                size="sm"
                onClick={() => handlePageChange(pageNum)}
                className={pageNum === pagination.page 
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
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              className="border-gray-800 hover:bg-gray-800/50"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        )}
      </div>

      {/* 看板娘 */}
      <Mascot page="resources" />
    </div>
  );
}

import { useEffect, useState } from 'react';
import { apiRequest, useAuth } from '@/hooks/useAuth';
import type { Message, Pagination } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import Mascot, { EmptyBoxMascot } from '@/components/Mascot';
import { toast } from 'sonner';
import {
  MessageSquare,
  Send,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Reply,
  Heart
} from 'lucide-react';

export default function Messages() {
  const { isAuthenticated } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  const [content, setContent] = useState('');
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, [pagination.page]);

  const fetchMessages = async () => {
    try {
      setIsLoading(true);
      const response = await apiRequest(`/messages?page=${pagination.page}&limit=10`);
      setMessages(response.messages);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      toast.error('请输入留言内容');
      return;
    }

    try {
      setIsSubmitting(true);
      await apiRequest('/messages', {
        method: 'POST',
        body: JSON.stringify({
          content,
          guest_name: isAuthenticated ? undefined : guestName,
          guest_email: isAuthenticated ? undefined : guestEmail
        })
      });
      
      toast.success('留言发表成功！少女会认真看的~');
      setContent('');
      setGuestName('');
      setGuestEmail('');
      fetchMessages();
    } catch (error: any) {
      toast.error(error.message || '留言发表失败');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
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
      <div className="absolute left-0 top-20 opacity-10 pointer-events-none">
        <img src="/uploads/girl-sit.png" alt="装饰" className="w-40 h-52 object-contain" />
      </div>
      <div className="absolute right-0 bottom-20 opacity-10 pointer-events-none">
        <img src="/uploads/girl-wink.png" alt="装饰" className="w-32 h-32 object-contain" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <img 
              src="/uploads/girl-stand.png" 
              alt="留言少女" 
              className="w-24 h-32 object-contain animate-float-gentle"
            />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-200 mb-2">留言板</h1>
          <p className="text-gray-500">
            留下你的想法和建议，白发少女会认真阅读每一条留言~
          </p>
        </div>

        {/* Message Form */}
        <Card className="dark-card mb-10">
          <CardContent className="p-6">
            <h2 className="text-lg font-medium text-gray-300 mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-red-500" />
              发表留言
            </h2>
            <form onSubmit={handleSubmit}>
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
                placeholder="写下你的留言... 少女会认真看的~"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="bg-[#141414] border-gray-800 min-h-[120px] mb-4"
              />
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-red-900/80 hover:bg-red-800"
              >
                <Send className="w-4 h-4 mr-2" />
                {isSubmitting ? '发送中...' : '发表留言'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Messages List */}
        <div className="space-y-4 mb-8">
          <h2 className="text-lg font-medium text-gray-300 mb-4 flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500" />
            全部留言 ({pagination.total})
          </h2>
          
          {messages.length > 0 ? (
            messages.map((message) => (
              <MessageItem key={message.id} message={message} />
            ))
          ) : (
            <Card className="dark-card py-12 text-center">
              <CardContent>
                <EmptyBoxMascot message="暂无留言，来发表第一条留言吧~" />
              </CardContent>
            </Card>
          )}
        </div>

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
      <Mascot page="messages" />
    </div>
  );
}

// 留言项组件
function MessageItem({ message }: { message: Message }) {
  return (
    <Card className="dark-card">
      <CardContent className="p-5">
        <div className="flex gap-4">
          <img
            src={message.avatar || '/uploads/avatars/default.png'}
            alt={message.author}
            className="w-12 h-12 rounded-full object-cover border border-gray-700"
          />
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="font-medium text-gray-300">{message.author}</span>
              <span className="text-xs text-gray-600 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(message.created_at).toLocaleDateString('zh-CN')}
              </span>
            </div>
            <p className="text-gray-400 whitespace-pre-wrap">{message.content}</p>
            
            {/* Reply */}
            {message.reply && (
              <div className="mt-4 p-4 bg-red-900/10 rounded-lg border-l-4 border-red-900/40">
                <div className="flex items-center gap-2 mb-2">
                  <Reply className="w-4 h-4 text-red-500" />
                  <span className="text-sm font-medium text-red-400">博主回复</span>
                  {message.replied_at && (
                    <span className="text-xs text-gray-600">
                      {new Date(message.replied_at).toLocaleDateString('zh-CN')}
                    </span>
                  )}
                </div>
                <p className="text-gray-400 text-sm">{message.reply}</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

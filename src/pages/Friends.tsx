import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ExternalLink, Plus, Globe, Github, Twitter } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { SITE_CONFIG } from '@/config/site.config';

// 默认友情链接数据（可自行编辑）
const defaultFriends = [
  {
    id: 1,
    name: '示例站点',
    description: '这是一个示例友情链接，请编辑此页面添加你的朋友们~',
    url: 'https://example.com',
    avatar: '/avatars/default.png',
    tags: ['示例'],
  },
];

interface Friend {
  id: number;
  name: string;
  description: string;
  url: string;
  avatar: string;
  tags: string[];
}

export default function Friends() {
  const { isAdmin } = useAuth();
  const [friends, setFriends] = useState<Friend[]>(defaultFriends);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newFriend, setNewFriend] = useState({
    name: '',
    description: '',
    url: '',
    avatar: '',
    tags: '',
  });

  const handleAddFriend = () => {
    if (!newFriend.name || !newFriend.url) {
      toast.error('请填写名称和链接');
      return;
    }

    const friend: Friend = {
      id: Date.now(),
      name: newFriend.name,
      description: newFriend.description,
      url: newFriend.url,
      avatar: newFriend.avatar || '/avatars/default.png',
      tags: newFriend.tags.split(',').map(t => t.trim()).filter(Boolean),
    };

    setFriends([...friends, friend]);
    setNewFriend({ name: '', description: '', url: '', avatar: '', tags: '' });
    setIsDialogOpen(false);
    toast.success('友情链接添加成功！');
  };

  const handleDeleteFriend = (id: number) => {
    setFriends(friends.filter(f => f.id !== id));
    toast.success('已删除友情链接');
  };

  return (
    <div className="min-h-screen py-12 relative">
      {/* 装饰背景 */}
      <div className="absolute left-0 top-20 opacity-10 pointer-events-none">
        <img src="/live2d/haione/expressions/face_happy.png" alt="装饰" className="w-32 h-32 object-contain" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-200 mb-4">友情链接</h1>
          <p className="text-gray-500 max-w-lg mx-auto">
            这里收藏着 {SITE_CONFIG.character.name} 的好朋友们~ 欢迎交换友链！
          </p>
          
          {/* 交换友链信息 */}
          <div className="mt-6 p-4 bg-[#1a1a1a] rounded-xl border border-gray-800 inline-block">
            <p className="text-sm text-gray-400 mb-2">想要交换友链？请提供以下信息：</p>
            <div className="text-xs text-gray-500 space-y-1 text-left">
              <p>• 站点名称：{SITE_CONFIG.name}</p>
              <p>• 站点链接：{SITE_CONFIG.url}</p>
              <p>• 站点描述：{SITE_CONFIG.description}</p>
              <p>• 头像链接：{SITE_CONFIG.url}/favicon.png</p>
            </div>
          </div>
        </div>

        {/* Admin: Add Friend Button */}
        {isAdmin && (
          <div className="flex justify-center mb-8">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-red-900/80 hover:bg-red-800 gap-2">
                  <Plus className="w-4 h-4" />
                  添加友链
                </Button>
              </DialogTrigger>
              <DialogContent className="dark-card border-gray-800 max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-gray-200">添加友情链接</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div>
                    <label className="text-sm text-gray-400 block mb-1">站点名称 *</label>
                    <Input
                      value={newFriend.name}
                      onChange={(e) => setNewFriend({ ...newFriend, name: e.target.value })}
                      placeholder="例如：渡辺灰音の部屋"
                      className="bg-[#141414] border-gray-800"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 block mb-1">站点链接 *</label>
                    <Input
                      value={newFriend.url}
                      onChange={(e) => setNewFriend({ ...newFriend, url: e.target.value })}
                      placeholder="https://example.com"
                      className="bg-[#141414] border-gray-800"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 block mb-1">站点描述</label>
                    <Textarea
                      value={newFriend.description}
                      onChange={(e) => setNewFriend({ ...newFriend, description: e.target.value })}
                      placeholder="简短描述这个站点..."
                      className="bg-[#141414] border-gray-800"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 block mb-1">头像链接</label>
                    <Input
                      value={newFriend.avatar}
                      onChange={(e) => setNewFriend({ ...newFriend, avatar: e.target.value })}
                      placeholder="https://example.com/avatar.png"
                      className="bg-[#141414] border-gray-800"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 block mb-1">标签（用逗号分隔）</label>
                    <Input
                      value={newFriend.tags}
                      onChange={(e) => setNewFriend({ ...newFriend, tags: e.target.value })}
                      placeholder="技术, 动漫, 生活"
                      className="bg-[#141414] border-gray-800"
                    />
                  </div>
                  <Button onClick={handleAddFriend} className="w-full bg-red-900/80 hover:bg-red-800">
                    添加
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}

        {/* Friends Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {friends.map((friend) => (
            <Card key={friend.id} className="dark-card hover:border-red-900/40 transition-all group">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <img
                    src={friend.avatar}
                    alt={friend.name}
                    className="w-14 h-14 rounded-xl object-cover border border-gray-700"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-gray-200 truncate">{friend.name}</h3>
                      <a
                        href={friend.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-500 hover:text-red-400 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{friend.description}</p>
                    
                    {friend.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {friend.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="text-xs px-2 py-0.5 bg-red-900/20 text-red-400 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                {isAdmin && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteFriend(friend.id)}
                    className="mt-4 w-full text-red-400 hover:text-red-300 hover:bg-red-900/20"
                  >
                    删除
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {friends.length === 0 && (
          <div className="text-center py-16">
            <img
              src="/live2d/haione/expressions/face_sad.png"
              alt="暂无友链"
              className="w-24 h-24 mx-auto opacity-50"
            />
            <p className="text-gray-500 mt-4">还没有友情链接，快来成为第一个吧~</p>
          </div>
        )}

        {/* Social Links */}
        <div className="mt-16 text-center">
          <h2 className="text-xl font-medium text-gray-300 mb-6">也可以在这里找到我</h2>
          <div className="flex justify-center gap-4">
            <a
              href="https://x.com/CYchano"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-xl bg-[#1a1a1a] border border-gray-800 flex items-center justify-center text-gray-400 hover:text-blue-400 hover:border-blue-900/50 transition-all"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a
              href="https://github.com/AonoChano"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-xl bg-[#1a1a1a] border border-gray-800 flex items-center justify-center text-gray-400 hover:text-gray-200 hover:border-gray-600 transition-all"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="mailto:CYChano@outlook.com"
              className="w-12 h-12 rounded-xl bg-[#1a1a1a] border border-gray-800 flex items-center justify-center text-gray-400 hover:text-red-400 hover:border-red-900/50 transition-all"
            >
              <Globe className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState, useRef } from 'react';
import { useAuth, apiRequest } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import {
  User,
  Mail,
  Calendar,
  Shield,
  Save,
  Lock,
  Camera,
  X,
} from 'lucide-react';

export default function Profile() {
  const { user, updateUser, token } = useAuth();
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  
  const [profileData, setProfileData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    bio: user?.bio || '',
    avatar: user?.avatar || ''
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [isUpdating, setIsUpdating] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // 上传头像
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 验证文件类型
    if (!file.type.startsWith('image/')) {
      toast.error('请上传图片文件');
      return;
    }

    // 验证文件大小 (最大 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('图片大小不能超过 5MB');
      return;
    }

    setIsUploadingAvatar(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'avatar');

    try {
      const response = await fetch('/api/uploads', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (data.url) {
        setProfileData(prev => ({ ...prev, avatar: data.url }));
        toast.success('头像上传成功，记得保存修改哦');
      } else {
        toast.error(data.error || '上传失败');
      }
    } catch (error) {
      toast.error('上传失败');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profileData.username.trim()) {
      toast.error('用户名不能为空');
      return;
    }
    
    if (!profileData.email.trim()) {
      toast.error('邮箱不能为空');
      return;
    }
    
    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(profileData.email)) {
      toast.error('请输入有效的邮箱地址');
      return;
    }

    try {
      setIsUpdating(true);
      await apiRequest('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(profileData)
      });
      updateUser(profileData);
      toast.success('个人资料更新成功');
    } catch (error: any) {
      toast.error(error.message || '更新失败');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('两次输入的新密码不一致');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('新密码至少需要6个字符');
      return;
    }

    try {
      setIsChangingPassword(true);
      await apiRequest('/auth/password', {
        method: 'PUT',
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });
      toast.success('密码修改成功');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error: any) {
      toast.error(error.message || '密码修改失败');
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="dark-card p-8 text-center">
          <h2 className="text-xl font-bold text-gray-200 mb-2">请先登录</h2>
          <p className="text-gray-500">需要登录才能查看个人中心</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-200 mb-2">个人中心</h1>
          <p className="text-gray-500">管理你的个人信息和账号设置</p>
        </div>

        {/* Profile Info Card */}
        <Card className="dark-card mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* 头像上传区域 */}
              <div className="relative">
                <img
                  src={profileData.avatar || '/uploads/avatars/default.png'}
                  alt={user.username}
                  className="w-24 h-24 rounded-full object-cover border-4 border-red-900/30"
                />
                <button
                  onClick={() => avatarInputRef.current?.click()}
                  disabled={isUploadingAvatar}
                  className="absolute bottom-0 right-0 w-8 h-8 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center transition-colors"
                >
                  {isUploadingAvatar ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Camera className="w-4 h-4 text-white" />
                  )}
                </button>
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </div>
              
              <div className="text-center md:text-left">
                <h2 className="text-2xl font-bold text-gray-200">{user.username}</h2>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-2 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    {user.email}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    注册于 {new Date(user.created_at).toLocaleDateString('zh-CN')}
                  </span>
                  <span className="flex items-center gap-1">
                    <Shield className="w-4 h-4" />
                    {user.role === 'admin' ? '管理员' : '普通用户'}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="bg-[#1a1a1a] border border-gray-800">
            <TabsTrigger value="profile" className="data-[state=active]:bg-red-900/80">
              <User className="w-4 h-4 mr-2" />
              个人资料
            </TabsTrigger>
            <TabsTrigger value="password" className="data-[state=active]:bg-red-900/80">
              <Lock className="w-4 h-4 mr-2" />
              修改密码
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card className="dark-card">
              <CardHeader>
                <CardTitle className="text-gray-200">编辑资料</CardTitle>
                <CardDescription className="text-gray-500">
                  更新你的个人信息和头像
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  {/* 用户名 */}
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-gray-400">用户名</Label>
                    <Input
                      id="username"
                      placeholder="输入用户名"
                      value={profileData.username}
                      onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                      className="bg-[#141414] border-gray-800"
                    />
                  </div>
                  
                  {/* 邮箱 */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-400">邮箱</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="输入邮箱地址"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      className="bg-[#141414] border-gray-800"
                    />
                  </div>
                  
                  {/* 头像链接（可选，也可以直接上传） */}
                  <div className="space-y-2">
                    <Label htmlFor="avatar" className="text-gray-400 flex items-center gap-2">
                      头像链接
                      <span className="text-xs text-gray-600">（或直接点击上方头像上传）</span>
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="avatar"
                        type="url"
                        placeholder="输入头像图片链接"
                        value={profileData.avatar}
                        onChange={(e) => setProfileData({ ...profileData, avatar: e.target.value })}
                        className="bg-[#141414] border-gray-800 flex-1"
                      />
                      {profileData.avatar && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => setProfileData({ ...profileData, avatar: '' })}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {/* 个人简介 */}
                  <div className="space-y-2">
                    <Label htmlFor="bio" className="text-gray-400">个人简介</Label>
                    <Textarea
                      id="bio"
                      placeholder="介绍一下自己..."
                      value={profileData.bio}
                      onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                      className="bg-[#141414] border-gray-800 min-h-[120px] resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isUpdating}
                    className="bg-red-900/80 hover:bg-red-800"
                  >
                    {isUpdating ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        保存修改
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="password">
            <Card className="dark-card">
              <CardHeader>
                <CardTitle className="text-gray-200">修改密码</CardTitle>
                <CardDescription className="text-gray-500">
                  定期更换密码可以保护账号安全
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword" className="text-gray-400">当前密码</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      placeholder="输入当前密码"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      className="bg-[#141414] border-gray-800"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="newPassword" className="text-gray-400">新密码</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      placeholder="设置新密码（至少6位）"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      className="bg-[#141414] border-gray-800"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-gray-400">确认新密码</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="再次输入新密码"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      className="bg-[#141414] border-gray-800"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isChangingPassword}
                    className="bg-red-900/80 hover:bg-red-800"
                  >
                    {isChangingPassword ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                    ) : (
                      <>
                        <Lock className="w-4 h-4 mr-2" />
                        修改密码
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiRequest, useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Eye, EyeOff, LogIn } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.username || !formData.password) {
      toast.error('请填写所有字段');
      return;
    }

    try {
      setIsLoading(true);
      const response = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      
      login(response.token, response.user);
      toast.success('欢迎回来~');
      navigate('/');
    } catch (error: any) {
      toast.error(error.message || '登录失败');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 relative">
      {/* 装饰少女 */}
      <div className="absolute left-10 bottom-10 opacity-20 pointer-events-none hidden lg:block">
        <img src="/uploads/girl-sit.png" alt="装饰" className="w-48 h-64 object-contain" />
      </div>
      <div className="absolute right-10 top-10 opacity-20 pointer-events-none hidden lg:block">
        <img src="/uploads/girl-wink.png" alt="装饰" className="w-32 h-32 object-contain" />
      </div>

      <div className="w-full max-w-md">
        {/* 顶部少女 */}
        <div className="flex justify-center mb-6">
          <img 
            src="/uploads/girl-stand.png" 
            alt="欢迎少女" 
            className="w-32 h-44 object-contain animate-float-gentle"
          />
        </div>

        <Card className="dark-card">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-200">欢迎回来~</CardTitle>
            <CardDescription className="text-gray-500">
              登录你的账号，继续和白发少女一起探索
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-gray-400">用户名或邮箱</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="输入用户名或邮箱"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="bg-[#141414] border-gray-800 focus:border-red-900/60"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-400">密码</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="输入密码"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="bg-[#141414] border-gray-800 focus:border-red-900/60 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-red-900/80 hover:bg-red-800"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                ) : (
                  <>
                    <LogIn className="w-5 h-5 mr-2" />
                    登录
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-500">
                还没有账号？{' '}
                <Link to="/register" className="text-red-500 hover:text-red-400">
                  立即注册
                </Link>
              </p>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-800">
              <p className="text-center text-xs text-gray-600 mb-3">默认管理员账号</p>
              <div className="bg-[#141414] rounded-lg p-3 text-sm text-gray-500">
                <p>用户名: admin</p>
                <p>密码: admin123</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

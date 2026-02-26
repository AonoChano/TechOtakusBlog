import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiRequest, useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Eye, EyeOff, UserPlus, ArrowLeft } from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.username || !formData.email || !formData.password) {
      toast.error('请填写所有字段');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('密码至少需要6个字符');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('两次输入的密码不一致');
      return;
    }

    if (!agreeTerms) {
      toast.error('请同意服务条款');
      return;
    }

    try {
      setIsLoading(true);
      const response = await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password
        })
      });
      
      login(response.token, response.user);
      toast.success('注册成功！欢迎加入~');
      navigate('/');
    } catch (error: any) {
      toast.error(error.message || '注册失败');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 relative">
      {/* 装饰少女 */}
      <div className="absolute right-10 bottom-10 opacity-20 pointer-events-none hidden lg:block">
        <img src="/uploads/girl-like.png" alt="装饰" className="w-40 h-40 object-contain" />
      </div>
      <div className="absolute left-10 top-10 opacity-20 pointer-events-none hidden lg:block">
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
            <CardTitle className="text-2xl font-bold text-gray-200">创建账号</CardTitle>
            <CardDescription className="text-gray-500">
              加入白发少女的二次元世界
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-gray-400">用户名</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="设置用户名"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="bg-[#141414] border-gray-800 focus:border-red-900/60"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-400">邮箱</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="输入邮箱地址"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-[#141414] border-gray-800 focus:border-red-900/60"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-400">密码</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="设置密码（至少6位）"
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

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-400">确认密码</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="再次输入密码"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="bg-[#141414] border-gray-800 focus:border-red-900/60"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={agreeTerms}
                  onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
                />
                <label
                  htmlFor="terms"
                  className="text-sm text-gray-500 cursor-pointer"
                >
                  我同意{' '}
                  <Link to="#" className="text-red-500 hover:text-red-400">
                    服务条款
                  </Link>{' '}
                  和{' '}
                  <Link to="#" className="text-red-500 hover:text-red-400">
                    隐私政策
                  </Link>
                </label>
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
                    <UserPlus className="w-5 h-5 mr-2" />
                    注册
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-500">
                已有账号？{' '}
                <Link to="/login" className="text-red-500 hover:text-red-400">
                  立即登录
                </Link>
              </p>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-800">
              <Link to="/" className="flex items-center justify-center text-gray-500 hover:text-gray-300">
                <ArrowLeft className="w-4 h-4 mr-2" />
                返回首页
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

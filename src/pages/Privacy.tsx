import { Card, CardContent } from '@/components/ui/card';
import { Shield, Lock, Eye, Database, Cookie, Mail } from 'lucide-react';
import { SITE_CONFIG } from '@/config/site.config';

export default function Privacy() {
  const sections = [
    {
      icon: Eye,
      title: '信息收集',
      content: [
        '我们收集的信息包括：',
        '• 账户信息：用户名、邮箱地址（用于注册和登录）',
        '• 用户生成内容：文章、评论、留言等',
        '• 使用数据：访问日志、IP地址（用于安全防护）',
        '• 可选信息：头像、个人简介等',
      ],
    },
    {
      icon: Database,
      title: '信息使用',
      content: [
        '我们使用收集的信息用于：',
        '• 提供、维护和改进网站服务',
        '• 保护网站安全，防止恶意攻击',
        '• 发送重要通知（如安全警报）',
        '• 分析使用情况以优化用户体验',
        '• 我们不会将您的个人信息出售给第三方',
      ],
    },
    {
      icon: Lock,
      title: '数据安全',
      content: [
        '我们采取以下措施保护您的数据：',
        '• 密码使用 bcrypt 加密存储',
        '• 使用 HTTPS 加密传输数据',
        '• 实施防爆破和速率限制',
        '• 定期备份数据防止丢失',
        '• 严格的访问控制和权限管理',
      ],
    },
    {
      icon: Cookie,
      title: 'Cookie 政策',
      content: [
        '我们使用 Cookie 来：',
        '• 保持您的登录状态',
        '• 记住您的偏好设置',
        '• 分析网站流量和使用模式',
        '• 您可以在浏览器设置中禁用 Cookie，但可能影响某些功能',
      ],
    },
    {
      icon: Shield,
      title: '用户权利',
      content: [
        '您拥有以下权利：',
        '• 访问您的个人数据',
        '• 更正不准确的信息',
        '• 删除您的账户和相关数据',
        '• 导出您的数据',
        '• 撤回同意（如邮件订阅）',
        '如需行使这些权利，请通过下方联系方式联系我们。',
      ],
    },
  ];

  return (
    <div className="min-h-screen py-12 relative">
      {/* 装饰背景 */}
      <div className="absolute right-0 top-20 opacity-10 pointer-events-none">
        <img src="/live2d/haione/expressions/face_neutral.png" alt="装饰" className="w-32 h-32 object-contain" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-900/20 mb-6">
            <Shield className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-200 mb-4">隐私政策</h1>
          <p className="text-gray-500">
            最后更新日期：2025年2月26日
          </p>
        </div>

        {/* Introduction */}
        <Card className="dark-card mb-8">
          <CardContent className="p-6">
            <p className="text-gray-400 leading-relaxed">
              欢迎来到 {SITE_CONFIG.name}（以下简称"本站"）。我们非常重视您的隐私和个人信息保护。
              本隐私政策说明了我们如何收集、使用、存储和保护您的个人信息。
              使用本站即表示您同意本隐私政策的条款。
            </p>
          </CardContent>
        </Card>

        {/* Sections */}
        <div className="space-y-6">
          {sections.map((section, index) => (
            <Card key={index} className="dark-card">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-red-900/20 flex items-center justify-center flex-shrink-0">
                    <section.icon className="w-5 h-5 text-red-500" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-medium text-gray-200 mb-3">{section.title}</h2>
                    <div className="space-y-2">
                      {section.content.map((line, idx) => (
                        <p key={idx} className={`text-gray-400 ${line.startsWith('•') ? 'pl-4' : ''}`}>
                          {line}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Contact */}
        <Card className="dark-card mt-8">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-red-900/20 flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-red-500" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-medium text-gray-200 mb-3">联系我们</h2>
                <p className="text-gray-400 mb-4">
                  如果您对本隐私政策有任何疑问或建议，请通过以下方式联系我们：
                </p>
                <div className="space-y-2 text-gray-400">
                  <p>• 邮箱：<a href="mailto:CYChano@outlook.com" className="text-red-400 hover:underline">CYChano@outlook.com</a></p>
                  <p>• Twitter：<a href="https://x.com/CYchano" target="_blank" rel="noopener noreferrer" className="text-red-400 hover:underline">@CYchano</a></p>
                  <p>• GitHub：<a href="https://github.com/AonoChano" target="_blank" rel="noopener noreferrer" className="text-red-400 hover:underline">AonoChano</a></p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer Note */}
        <div className="text-center mt-12 text-gray-500 text-sm">
          <p>本隐私政策可能会不时更新，请定期查看。</p>
          <p className="mt-2">© 2025 {SITE_CONFIG.name}. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Github, 
  Twitter, 
  Mail, 
  Code, 
  Gamepad2, 
  Film, 
  Coffee,
  Heart,
  MapPin,
} from 'lucide-react';
import { SITE_CONFIG } from '@/config/site.config';

// ==================== 可自定义区域开始 ====================
// 博主信息 - 请在这里编辑你的个人信息
const AUTHOR_INFO = {
  // 基本信息
  name: '渡辺暁',
  nameEn: 'Watanabe Akatsuki',
  title: '全栈开发者 / 技术宅 / 动漫爱好者',
  
  // 头像
  avatar: '/avatars/admin.png',
  
  // 个人简介（支持多段落）
  bio: [
    '你好！我是渡辺暁，一个热爱技术与动漫的全栈开发者。',
    '这个博客是我和灰音（渡辺灰音）的小天地，在这里分享编程技术、动漫推荐、游戏心得，以及生活中的点点滴滴。',
    '欢迎常来坐坐，留下你的想法和建议~',
  ],
  
  // 位置
  location: '中国',
  
  // 技能标签
  skills: [
    'React', 'TypeScript', 'Node.js', 'Python',
    'Go', 'Docker', 'Kubernetes', 'Linux',
    'PostgreSQL', 'MongoDB', 'Redis',
  ],
  
  // 兴趣爱好
  hobbies: [
    { icon: Code, label: '编程', description: '热爱开源，享受创造的乐趣' },
    { icon: Film, label: '动漫', description: '二次元是心灵的避风港' },
    { icon: Gamepad2, label: '游戏', description: '主机玩家，RPG爱好者' },
    { icon: Coffee, label: '咖啡', description: '代码与咖啡是最佳搭档' },
  ],
  
  // 社交链接
  social: {
    github: 'https://github.com/AonoChano',
    twitter: 'https://x.com/CYchano',
    email: 'mailto:CYChano@outlook.com',
  },
  
  // 数据统计（可自行修改）
  stats: {
    articles: 0,      // 文章数量
    projects: 0,      // 项目数量
    years: 0,         // 编程年限
    coffee: '∞',      // 咖啡消耗量
  },
  
  // 时间线（可自行添加/修改）
  timeline: [
    {
      year: '2025',
      title: '创建渡辺灰音の部屋',
      description: '搭建了这个博客，开始记录技术与生活',
    },
    // 添加更多时间线事件...
  ],
  
  // 推荐内容
  recommendations: {
    anime: [
      { name: '请编辑添加你喜欢的动漫', comment: '在这里写下推荐语' },
    ],
    games: [
      { name: '请编辑添加你喜欢的游戏', comment: '在这里写下推荐语' },
    ],
    music: [
      { name: '请编辑添加你喜欢的音乐', comment: '在这里写下推荐语' },
    ],
  },
};
// ==================== 可自定义区域结束 ====================

export default function About() {
  return (
    <div className="min-h-screen py-12 relative">
      {/* 装饰背景 */}
      <div className="absolute right-0 top-20 opacity-10 pointer-events-none">
        <img src="/live2d/haione/expressions/face_happy.png" alt="装饰" className="w-40 h-40 object-contain" />
      </div>
      <div className="absolute left-0 bottom-20 opacity-10 pointer-events-none">
        <img src="/live2d/haione/expressions/face_love.png" alt="装饰" className="w-32 h-32 object-contain" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="relative inline-block">
            <img
              src={AUTHOR_INFO.avatar}
              alt={AUTHOR_INFO.name}
              className="w-32 h-32 rounded-2xl object-cover border-4 border-gray-800 mx-auto"
            />
            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-red-900/80 rounded-full flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-gray-200 mt-6 mb-2">
            {AUTHOR_INFO.name}
          </h1>
          <p className="text-gray-500 text-sm mb-2">{AUTHOR_INFO.nameEn}</p>
          <p className="text-red-400">{AUTHOR_INFO.title}</p>
          
          <div className="flex items-center justify-center gap-2 text-gray-500 mt-4">
            <MapPin className="w-4 h-4" />
            <span>{AUTHOR_INFO.location}</span>
          </div>
          
          {/* Social Links */}
          <div className="flex justify-center gap-3 mt-6">
            <a
              href={AUTHOR_INFO.social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-xl bg-[#1a1a1a] border border-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:border-gray-600 transition-all"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href={AUTHOR_INFO.social.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-xl bg-[#1a1a1a] border border-gray-800 flex items-center justify-center text-gray-400 hover:text-blue-400 hover:border-blue-900/50 transition-all"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a
              href={AUTHOR_INFO.social.email}
              className="w-10 h-10 rounded-xl bg-[#1a1a1a] border border-gray-800 flex items-center justify-center text-gray-400 hover:text-red-400 hover:border-red-900/50 transition-all"
            >
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Bio */}
        <Card className="dark-card mb-8">
          <CardContent className="p-6">
            <h2 className="text-xl font-medium text-gray-200 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-red-900/20 flex items-center justify-center">
                <span className="text-red-400 text-sm">01</span>
              </span>
              关于我
            </h2>
            <div className="space-y-3 text-gray-400 leading-relaxed">
              {AUTHOR_INFO.bio.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: '文章', value: AUTHOR_INFO.stats.articles },
            { label: '项目', value: AUTHOR_INFO.stats.projects },
            { label: '编程年限', value: AUTHOR_INFO.stats.years },
            { label: '咖啡消耗', value: AUTHOR_INFO.stats.coffee },
          ].map((stat, idx) => (
            <Card key={idx} className="dark-card text-center">
              <CardContent className="p-4">
                <p className="text-2xl font-bold text-red-400">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Skills */}
        <Card className="dark-card mb-8">
          <CardContent className="p-6">
            <h2 className="text-xl font-medium text-gray-200 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-red-900/20 flex items-center justify-center">
                <span className="text-red-400 text-sm">02</span>
              </span>
              技术栈
            </h2>
            <div className="flex flex-wrap gap-2">
              {AUTHOR_INFO.skills.map((skill, idx) => (
                <Badge
                  key={idx}
                  variant="secondary"
                  className="bg-red-900/20 text-red-400 border border-red-900/30 hover:bg-red-900/30"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Hobbies */}
        <Card className="dark-card mb-8">
          <CardContent className="p-6">
            <h2 className="text-xl font-medium text-gray-200 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-red-900/20 flex items-center justify-center">
                <span className="text-red-400 text-sm">03</span>
              </span>
              兴趣爱好
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {AUTHOR_INFO.hobbies.map((hobby, idx) => (
                <div key={idx} className="flex items-start gap-3 p-4 bg-[#141414] rounded-xl">
                  <div className="w-10 h-10 rounded-lg bg-red-900/20 flex items-center justify-center flex-shrink-0">
                    <hobby.icon className="w-5 h-5 text-red-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-200">{hobby.label}</h3>
                    <p className="text-sm text-gray-500">{hobby.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Character Intro */}
        <Card className="dark-card mb-8">
          <CardContent className="p-6">
            <h2 className="text-xl font-medium text-gray-200 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-red-900/20 flex items-center justify-center">
                <span className="text-red-400 text-sm">04</span>
              </span>
              关于 {SITE_CONFIG.character.name}
            </h2>
            <div className="flex flex-col md:flex-row items-center gap-6">
              <img
                src="/live2d/haione/head/head_full.png"
                alt={SITE_CONFIG.character.name}
                className="w-32 h-32 object-contain"
              />
              <div className="flex-1 text-center md:text-left">
                <p className="text-gray-400 leading-relaxed">
                  {SITE_CONFIG.character.name}（{SITE_CONFIG.character.nameEn}）是这个博客的看板娘，
                  一个拥有{SITE_CONFIG.character.description}。
                  她会陪伴你浏览博客的每一个角落，记得常来和她打招呼哦~
                </p>
                <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
                  <Badge className="bg-blue-900/30 text-blue-400 border-blue-900/50">左眼蓝色</Badge>
                  <Badge className="bg-red-900/30 text-red-400 border-red-900/50">右眼红色</Badge>
                  <Badge className="bg-gray-800 text-gray-400 border-gray-700">哥特萝莉</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Timeline */}
        {AUTHOR_INFO.timeline.length > 0 && (
          <Card className="dark-card mb-8">
            <CardContent className="p-6">
              <h2 className="text-xl font-medium text-gray-200 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-red-900/20 flex items-center justify-center">
                  <span className="text-red-400 text-sm">05</span>
                </span>
                时间线
              </h2>
              <div className="space-y-4">
                {AUTHOR_INFO.timeline.map((event, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex-shrink-0 w-16 text-right">
                      <span className="text-red-400 font-medium">{event.year}</span>
                    </div>
                    <div className="flex-shrink-0 relative">
                      <div className="w-3 h-3 rounded-full bg-red-500 mt-1.5" />
                      {idx < AUTHOR_INFO.timeline.length - 1 && (
                        <div className="absolute top-5 left-1.5 w-0.5 h-full bg-gray-800 -translate-x-1/2" />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <h3 className="font-medium text-gray-200">{event.title}</h3>
                      <p className="text-sm text-gray-500">{event.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recommendations */}
        <Card className="dark-card">
          <CardContent className="p-6">
            <h2 className="text-xl font-medium text-gray-200 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-red-900/20 flex items-center justify-center">
                <span className="text-red-400 text-sm">06</span>
              </span>
              推荐内容
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              {/* Anime */}
              <div>
                <h3 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
                  <Film className="w-4 h-4 text-pink-400" />
                  动漫
                </h3>
                <ul className="space-y-2">
                  {AUTHOR_INFO.recommendations.anime.map((item, idx) => (
                    <li key={idx} className="text-sm text-gray-500">
                      <span className="text-gray-300">{item.name}</span>
                      <span className="text-gray-600"> - {item.comment}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Games */}
              <div>
                <h3 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
                  <Gamepad2 className="w-4 h-4 text-green-400" />
                  游戏
                </h3>
                <ul className="space-y-2">
                  {AUTHOR_INFO.recommendations.games.map((item, idx) => (
                    <li key={idx} className="text-sm text-gray-500">
                      <span className="text-gray-300">{item.name}</span>
                      <span className="text-gray-600"> - {item.comment}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Music */}
              <div>
                <h3 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
                  <Heart className="w-4 h-4 text-red-400" />
                  音乐
                </h3>
                <ul className="space-y-2">
                  {AUTHOR_INFO.recommendations.music.map((item, idx) => (
                    <li key={idx} className="text-sm text-gray-500">
                      <span className="text-gray-300">{item.name}</span>
                      <span className="text-gray-600"> - {item.comment}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500 text-sm">
          <p>感谢你的访问！</p>
          <p className="mt-2 flex items-center justify-center gap-1">
            Made with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> by {AUTHOR_INFO.name}
          </p>
        </div>
      </div>
    </div>
  );
}

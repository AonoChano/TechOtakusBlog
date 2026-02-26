import { useState, useEffect } from 'react';
import { X, Sparkles } from 'lucide-react';

interface MascotProps {
  page?: 'home' | 'articles' | 'article' | 'categories' | 'resources' | 'messages' | 'login' | 'register' | 'profile';
  mood?: 'normal' | 'happy' | 'sad' | 'surprised' | 'love' | 'sleepy' | 'thinking';
}

const mascotMessages: Record<string, string[]> = {
  home: [
    "欢迎来到我的博客~",
    "今天也要元气满满哦！",
    "要看看我的文章吗？",
    "异瞳少女为你服务~",
    "主人，有什么可以帮你的吗？"
  ],
  articles: [
    "这里有好多文章呢~",
    "找到感兴趣的内容了吗？",
    "慢慢看，不着急~",
    "知识就是力量哦！"
  ],
  article: [
    "这篇文章写得不错吧？",
    "记得点赞评论哦~",
    "有什么想法可以告诉我~",
    "学习使人进步！"
  ],
  categories: [
    "分类很清楚对吧？",
    "想找什么类型的文章？",
    "各种类型应有尽有~"
  ],
  resources: [
    "这里有好多资源~",
    "免费下载哦~",
    "技术宅必备！",
    "好东西要分享~"
  ],
  messages: [
    "留下你的足迹吧~",
    "想对我说什么吗？",
    "我会认真看每一条留言的~",
    "期待你的留言哦！"
  ],
  login: [
    "欢迎回来~",
    "登录后继续探索吧~",
    "主人，我等你好久了~"
  ],
  register: [
    "新用户欢迎~",
    "加入我们吧~",
    "一起开启二次元之旅！"
  ],
  profile: [
    "这是你的个人中心~",
    "管理你的账号信息~",
    "主人最棒了！"
  ]
};

// Q版表情图片映射
const qMascotImages: Record<string, string> = {
  normal: '/uploads/girl-q-happy.png',
  happy: '/uploads/girl-q-happy.png',
  sad: '/uploads/girl-q-cry.png',
  surprised: '/uploads/girl-q-surprised.png',
  love: '/uploads/girl-q-love.png',
  sleepy: '/uploads/girl-q-sleepy.png',
  thinking: '/uploads/girl-q-thinking.png'
};

export default function Mascot({ page = 'home', mood = 'normal' }: MascotProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [message, setMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [currentMood, setCurrentMood] = useState(mood);

  useEffect(() => {
    const messages = mascotMessages[page] || mascotMessages.home;
    setMessage(messages[Math.floor(Math.random() * messages.length)]);
    
    // 1秒后显示气泡
    const timer = setTimeout(() => {
      setShowMessage(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, [page]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-end gap-2">
      {/* 对话气泡 */}
      {showMessage && (
        <div 
          className="relative mb-4 animate-in fade-in slide-in-from-right-4 duration-300"
          onClick={() => setShowMessage(false)}
        >
          <div className="bg-[#1a1a1a] border border-red-900/40 rounded-2xl rounded-br-sm px-4 py-3 max-w-[200px] shadow-lg">
            <p className="text-sm text-gray-200">{message}</p>
          </div>
          <button 
            onClick={() => setShowMessage(false)}
            className="absolute -top-2 -right-2 w-5 h-5 bg-red-900/60 rounded-full flex items-center justify-center hover:bg-red-800/80"
          >
            <X className="w-3 h-3 text-white" />
          </button>
        </div>
      )}

      {/* 看板娘 */}
      <div 
        className="relative group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* 光环效果 */}
        <div className={`absolute inset-0 rounded-full transition-all duration-500 ${isHovered ? 'bg-red-900/20 scale-110' : 'bg-transparent'}`} />
        
        {/* Q版少女图片 */}
        <div 
          className="w-24 h-24 relative cursor-pointer transition-transform duration-300 hover:scale-110"
          onClick={() => {
            const messages = mascotMessages[page] || mascotMessages.home;
            setMessage(messages[Math.floor(Math.random() * messages.length)]);
            setShowMessage(true);
            // 随机切换表情
            const moods: ('normal' | 'happy' | 'love' | 'surprised')[] = ['normal', 'happy', 'love', 'surprised'];
            setCurrentMood(moods[Math.floor(Math.random() * moods.length)]);
          }}
        >
          <img 
            src={qMascotImages[currentMood]} 
            alt="看板娘"
            className="w-full h-full object-contain drop-shadow-2xl"
          />
          
          {/* 互动提示 */}
          {isHovered && (
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex items-center gap-1 text-xs text-red-400 whitespace-nowrap animate-bounce">
              <Sparkles className="w-3 h-3" />
              点我点我~
            </div>
          )}
        </div>

        {/* 关闭按钮 */}
        <button
          onClick={() => setIsVisible(false)}
          className="absolute -top-2 -right-2 w-6 h-6 bg-[#1a1a1a] border border-gray-700 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:border-red-900/60"
        >
          <X className="w-3 h-3 text-gray-400" />
        </button>
      </div>
    </div>
  );
}

// 装饰性小少女组件 - 使用Q版
export function MiniMascot({ position = 'left', emotion = 'normal' }: { position?: 'left' | 'right', emotion?: 'normal' | 'happy' | 'shy' | 'surprised' | 'love' | 'sleepy' | 'thinking' }) {
  const images: Record<string, string> = {
    normal: '/uploads/girl-q-happy.png',
    happy: '/uploads/girl-q-happy.png',
    shy: '/uploads/girl-q-shy.png',
    surprised: '/uploads/girl-q-surprised.png',
    love: '/uploads/girl-q-love.png',
    sleepy: '/uploads/girl-q-sleepy.png',
    thinking: '/uploads/girl-q-thinking.png'
  };

  return (
    <div className={`absolute ${position}-0 bottom-0 w-20 h-20 opacity-40 pointer-events-none`}>
      <img 
        src={images[emotion]} 
        alt="装饰少女"
        className="w-full h-full object-contain"
      />
    </div>
  );
}

// 页面角落装饰少女 - Q版
export function CornerMascot({ className = '', emotion = 'normal' }: { className?: string, emotion?: 'normal' | 'happy' | 'sleepy' | 'love' }) {
  const images: Record<string, string> = {
    normal: '/uploads/girl-q-happy.png',
    happy: '/uploads/girl-q-happy.png',
    sleepy: '/uploads/girl-q-nap.png',
    love: '/uploads/girl-q-love.png'
  };

  return (
    <div className={`fixed pointer-events-none z-0 ${className}`}>
      <img 
        src={images[emotion]} 
        alt="装饰少女"
        className="w-24 h-24 object-contain opacity-30"
      />
    </div>
  );
}

// 空状态看板娘 - 使用打开空箱子的图片
export function EmptyBoxMascot({ message = "这里什么都没有呢..." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center">
      <img 
        src="/uploads/girl-empty-box.png" 
        alt="空状态"
        className="w-48 h-48 object-contain"
      />
      <p className="text-gray-500 mt-4 text-center">{message}</p>
    </div>
  );
}

// 表情切换看板娘 - 可以显示不同Q版表情
export function QMascotGallery({ className = '' }: { className?: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const qImages = [
    { src: '/uploads/girl-q-happy.png', name: '开心' },
    { src: '/uploads/girl-q-shy.png', name: '害羞' },
    { src: '/uploads/girl-q-love.png', name: '喜欢' },
    { src: '/uploads/girl-q-surprised.png', name: '惊讶' },
    { src: '/uploads/girl-q-thinking.png', name: '思考' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % qImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`relative w-20 h-20 ${className}`}>
      <img 
        src={qImages[currentIndex].src}
        alt={qImages[currentIndex].name}
        className="w-full h-full object-contain transition-all duration-500"
      />
    </div>
  );
}

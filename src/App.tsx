import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from '@/hooks/useAuth';
import { Toaster } from '@/components/ui/sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Home from '@/pages/Home';
import Articles from '@/pages/Articles';
import ArticleDetail from '@/pages/ArticleDetail';
import Categories from '@/pages/Categories';
import Resources from '@/pages/Resources';
import Messages from '@/pages/Messages';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Profile from '@/pages/Profile';
import Admin from '@/pages/Admin';
import About from '@/pages/About';
import Friends from '@/pages/Friends';
import Privacy from '@/pages/Privacy';
import Editor from '@/pages/Editor';
import NotFound from '@/pages/NotFound';
import Mascot from '@/components/Mascot';

// 看板娘包装组件
function MascotWrapper() {
  const location = useLocation();
  
  const getPage = () => {
    const path = location.pathname;
    if (path === '/') return 'home';
    if (path.startsWith('/articles/')) return 'article';
    if (path.startsWith('/articles')) return 'articles';
    if (path.startsWith('/category')) return 'articles';
    if (path.startsWith('/categories')) return 'categories';
    if (path.startsWith('/resources')) return 'resources';
    if (path.startsWith('/messages')) return 'messages';
    if (path.startsWith('/login')) return 'login';
    if (path.startsWith('/register')) return 'register';
    if (path.startsWith('/profile')) return 'profile';
    return 'home';
  };

  return <Mascot page={getPage()} />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-[#0d0d0d] relative overflow-x-hidden">
          {/* 飘落花瓣装饰 */}
          <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            <div className="petal" style={{ left: '5%', animationDelay: '0s', animationDuration: '12s' }} />
            <div className="petal" style={{ left: '15%', animationDelay: '3s', animationDuration: '14s' }} />
            <div className="petal" style={{ left: '25%', animationDelay: '1s', animationDuration: '11s' }} />
            <div className="petal" style={{ left: '35%', animationDelay: '5s', animationDuration: '13s' }} />
            <div className="petal" style={{ left: '45%', animationDelay: '2s', animationDuration: '10s' }} />
            <div className="petal" style={{ left: '55%', animationDelay: '4s', animationDuration: '15s' }} />
            <div className="petal" style={{ left: '65%', animationDelay: '6s', animationDuration: '12s' }} />
            <div className="petal" style={{ left: '75%', animationDelay: '2s', animationDuration: '11s' }} />
            <div className="petal" style={{ left: '85%', animationDelay: '7s', animationDuration: '13s' }} />
            <div className="petal" style={{ left: '95%', animationDelay: '4s', animationDuration: '14s' }} />
          </div>

          {/* 暗系渐变背景 */}
          <div className="fixed inset-0 pointer-events-none z-0">
            <div className="absolute inset-0" style={{
              background: 'linear-gradient(180deg, #0d0d0d 0%, #141414 50%, #0a0a0a 100%)'
            }} />
            
            {/* 红色光晕 */}
            <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-red-900/5 rounded-full blur-[150px]" />
            <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-gray-800/10 rounded-full blur-[120px]" />
          </div>

          {/* 主内容 */}
          <div className="relative z-10">
            <Navbar />
            <main className="min-h-screen">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/articles" element={<Articles />} />
                <Route path="/articles/:slug" element={<ArticleDetail />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/category/:slug" element={<Articles />} />
                <Route path="/resources" element={<Resources />} />
                <Route path="/messages" element={<Messages />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/admin/*" element={<Admin />} />
                <Route path="/editor" element={<Editor />} />
                <Route path="/editor/:slug" element={<Editor />} />
                <Route path="/about" element={<About />} />
                <Route path="/friends" element={<Friends />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>

          {/* 看板娘 */}
          <MascotWrapper />
        </div>
        <Toaster 
          toastOptions={{
            style: {
              background: '#1a1a1a',
              border: '1px solid rgba(127, 29, 29, 0.4)',
              color: '#e5e5e5',
            },
          }}
        />
      </Router>
    </AuthProvider>
  );
}

export default App;

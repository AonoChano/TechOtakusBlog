import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Menu,
  X,
  Home,
  FileText,
  FolderOpen,
  Download,
  MessageSquare,
  User,
  LogOut,
  Settings,
  Plus,
  Edit3,
} from 'lucide-react';
import { SITE_CONFIG, NAVIGATION } from '@/config/site.config';

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = NAVIGATION.main.map(item => ({
    path: item.href,
    label: item.label,
    icon: {
      home: Home,
      'file-text': FileText,
      folder: FolderOpen,
      download: Download,
      'message-square': MessageSquare,
      user: User,
    }[item.icon] || FileText,
  }));

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="sticky top-0 z-50 dark-card border-b border-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-red-900/30 border border-red-900/50 flex items-center justify-center group-hover:bg-red-900/50 transition-colors">
              <img 
                src={SITE_CONFIG.favicon}
                alt={SITE_CONFIG.character.name}
                className="w-8 h-8 object-contain"
              />
            </div>
            <div className="hidden sm:block">
              <span className="text-lg font-bold bg-gradient-to-r from-gray-200 to-red-400 bg-clip-text text-transparent">
                {SITE_CONFIG.name}
              </span>
              <span className="text-xs text-gray-500 block -mt-1">{SITE_CONFIG.description}</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                  isActive(item.path)
                    ? 'bg-red-900/30 text-red-400 border border-red-900/40'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            ))}
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            {/* Admin: New Article Button */}
            {isAdmin && (
              <Link to="/editor" className="hidden md:flex">
                <Button
                  size="sm"
                  className="bg-red-900/80 hover:bg-red-800 text-white gap-2"
                >
                  <Plus className="w-4 h-4" />
                  写文章
                </Button>
              </Link>
            )}

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full p-0 border-2 border-gray-700 hover:border-red-900/60"
                  >
                    <img
                      src={user?.avatar || '/avatars/default.png'}
                      alt={user?.username}
                      className="h-full w-full rounded-full object-cover"
                    />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 dark-card border-gray-800">
                  <div className="flex items-center gap-3 p-3 border-b border-gray-800">
                    <img
                      src={user?.avatar || '/avatars/default.png'}
                      alt={user?.username}
                      className="h-10 w-10 rounded-full object-cover border border-gray-700"
                    />
                    <div>
                      <p className="font-medium text-gray-200">{user?.username}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                  </div>
                  
                  {/* Admin Menu Items */}
                  {isAdmin && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link to="/editor" className="flex items-center gap-2 cursor-pointer text-red-400">
                          <Edit3 className="w-4 h-4" />
                          写文章
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-gray-800" />
                    </>
                  )}
                  
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center gap-2 cursor-pointer text-gray-300">
                      <User className="w-4 h-4" />
                      个人中心
                    </Link>
                  </DropdownMenuItem>
                  
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="flex items-center gap-2 cursor-pointer text-gray-300">
                        <Settings className="w-4 h-4" />
                        管理后台
                      </Link>
                    </DropdownMenuItem>
                  )}
                  
                  <DropdownMenuSeparator className="bg-gray-800" />
                  <DropdownMenuItem
                    onClick={logout}
                    className="flex items-center gap-2 cursor-pointer text-red-400"
                  >
                    <LogOut className="w-4 h-4" />
                    退出登录
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login">
                  <Button
                    variant="ghost"
                    className="text-gray-400 hover:text-gray-200 hover:bg-gray-800/50"
                  >
                    登录
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-red-900/80 hover:bg-red-800 text-white">
                    注册
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-gray-400"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-800">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-3 ${
                    isActive(item.path)
                      ? 'bg-red-900/30 text-red-400 border border-red-900/40'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              ))}
              
              {/* Admin: New Article (Mobile) */}
              {isAdmin && (
                <Link
                  to="/editor"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-4 py-3 rounded-lg text-sm font-medium bg-red-900/30 text-red-400 border border-red-900/40 flex items-center gap-3"
                >
                  <Edit3 className="w-5 h-5" />
                  写文章
                </Link>
              )}
              
              {!isAuthenticated && (
                <div className="flex gap-2 mt-4 pt-4 border-t border-gray-800">
                  <Link to="/login" className="flex-1" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full border-gray-700">
                      登录
                    </Button>
                  </Link>
                  <Link to="/register" className="flex-1" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button className="w-full bg-red-900/80 hover:bg-red-800">
                      注册
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

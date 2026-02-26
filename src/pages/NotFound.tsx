import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md dark-card text-center">
        <CardContent className="p-8">
          {/* 困惑少女 */}
          <div className="relative mb-6">
            <img 
              src="/uploads/girl-confused.png" 
              alt="困惑少女" 
              className="w-32 h-32 mx-auto object-contain animate-float-gentle"
            />
            <div className="absolute -top-2 -right-2 w-12 h-12 rounded-full bg-red-900/60 flex items-center justify-center text-white font-bold text-lg">
              ?
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-200 mb-2">
            页面走丢了
          </h1>
          <p className="text-gray-500 mb-8">
            哎呀！这个页面好像被二次元黑洞吞噬了...<br/>
            白发少女也找不到它呢~
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/">
              <Button className="w-full sm:w-auto bg-red-900/80 hover:bg-red-800">
                <Home className="w-4 h-4 mr-2" />
                返回首页
              </Button>
            </Link>
            <Link to="/articles">
              <Button variant="outline" className="w-full sm:w-auto border-gray-800 hover:bg-gray-800/50">
                <Search className="w-4 h-4 mr-2" />
                浏览文章
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

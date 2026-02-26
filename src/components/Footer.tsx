import { Link } from 'react-router-dom';
import { Heart, Github, Twitter, Mail, Rss } from 'lucide-react';
import { SITE_CONFIG, SOCIAL_LINKS, NAVIGATION } from '@/config/site.config';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    导航: NAVIGATION.main.map(item => ({ label: item.label, href: item.href })),
    关于: [
      { label: '关于博主', href: '/about' },
      { label: '友情链接', href: '/friends' },
      { label: '隐私政策', href: '/privacy' },
    ],
  };

  const socialLinks = [
    { icon: Github, href: SOCIAL_LINKS.github.url, label: 'GitHub', show: SOCIAL_LINKS.github.show },
    { icon: Twitter, href: SOCIAL_LINKS.twitter.url, label: 'Twitter', show: SOCIAL_LINKS.twitter.show },
    { icon: Mail, href: SOCIAL_LINKS.email.url, label: 'Email', show: SOCIAL_LINKS.email.show },
    { icon: Rss, href: SOCIAL_LINKS.rss.url, label: 'RSS', show: SOCIAL_LINKS.rss.show },
  ].filter(link => link.show);

  return (
    <footer className="border-t border-gray-800/50 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-900/30 border border-red-900/50 flex items-center justify-center">
                <img 
                  src={SITE_CONFIG.favicon}
                  alt={SITE_CONFIG.character.name}
                  className="w-8 h-8 object-contain"
                />
              </div>
              <div>
                <span className="text-lg font-bold bg-gradient-to-r from-gray-200 to-red-400 bg-clip-text text-transparent">
                  {SITE_CONFIG.name}
                </span>
                <span className="text-xs text-gray-600 block -mt-1">{SITE_CONFIG.description}</span>
              </div>
            </Link>
            <p className="text-gray-500 mb-6 max-w-sm">
              一个热爱技术与动漫的个人博客，由{SITE_CONFIG.character.name}守护。<br/>
              分享编程经验、动漫推荐、游戏心得与生活随笔。
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-[#141414] border border-gray-800 flex items-center justify-center text-gray-500 hover:text-red-400 hover:border-red-900/40 transition-all"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-gray-300 font-medium mb-4">{title}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-gray-500 hover:text-red-400 transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-sm flex items-center gap-1">
            Made with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> by {SITE_CONFIG.author.name} & {SITE_CONFIG.character.name}
          </p>
          <p className="text-gray-600 text-sm">
            &copy; {currentYear} {SITE_CONFIG.name}. All rights reserved.
          </p>
        </div>


      </div>
    </footer>
  );
}

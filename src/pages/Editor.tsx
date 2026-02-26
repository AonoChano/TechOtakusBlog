import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import {
  Save,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Tag,
  FolderOpen,
  Upload,
  FileText,
  X,
  Link as LinkIcon,
  Code,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Undo,
  Redo,
  Minus,
  CheckSquare,
  Plus,
} from 'lucide-react';
import { SITE_CONFIG } from '@/config/site.config';

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface Resource {
  id: number;
  title: string;
  file_path: string;
  file_type: string;
  file_size?: number;
}

// 历史记录管理
interface HistoryState {
  content: string;
  cursorPosition: number;
}

export default function Editor() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const { isAdmin, token } = useAuth();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const resourceFileInputRef = useRef<HTMLInputElement>(null);
  
  // 文章数据
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [isPublished, setIsPublished] = useState(false);
  
  // UI 状态
  const [categories, setCategories] = useState<Category[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [isPreview, setIsPreview] = useState(false);
  const [isResourceDialogOpen, setIsResourceDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  
  // 资源上传
  const [resourceTitle, setResourceTitle] = useState('');
  const [resourceDescription, setResourceDescription] = useState('');
  const [selectedResourceFile, setSelectedResourceFile] = useState<File | null>(null);
  
  // 历史记录
  const [history, setHistory] = useState<HistoryState[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // 检查权限
  useEffect(() => {
    if (!isAdmin) {
      toast.error('只有管理员可以访问编辑器');
      navigate('/');
    }
  }, [isAdmin, navigate]);

  // 加载分类和资源
  useEffect(() => {
    fetchCategories();
    fetchResources();
  }, []);

  // 如果是编辑模式，加载文章数据
  useEffect(() => {
    if (slug) {
      fetchArticle(slug);
    }
  }, [slug]);

  // 保存历史记录
  const saveToHistory = useCallback((newContent: string) => {
    const textarea = textareaRef.current;
    const cursorPosition = textarea ? textarea.selectionStart : 0;
    
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push({ content: newContent, cursorPosition });
      if (newHistory.length > 50) newHistory.shift();
      return newHistory;
    });
    setHistoryIndex(prev => Math.min(prev + 1, 49));
  }, [historyIndex]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      setCategories(data.categories || []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchResources = async () => {
    try {
      const response = await fetch('/api/resources?limit=100');
      const data = await response.json();
      setResources(data.resources || []);
    } catch (error) {
      console.error('Failed to fetch resources:', error);
    }
  };

  const fetchArticle = async (articleSlug: string) => {
    try {
      const response = await fetch(`/api/articles/${articleSlug}`);
      const data = await response.json();
      if (data.article) {
        setTitle(data.article.title);
        setContent(data.article.content);
        setExcerpt(data.article.excerpt || '');
        setCategoryId(data.article.category_id?.toString() || '');
        setTags(data.article.tags ? data.article.tags.split(',').filter(Boolean) : []);
        setCoverImage(data.article.cover_image || '');
        setIsPublished(data.article.is_published === 1);
      }
    } catch (error) {
      toast.error('加载文章失败');
    }
  };

  // 撤销
  const undo = () => {
    if (historyIndex > 0) {
      const prevState = history[historyIndex - 1];
      setContent(prevState.content);
      setHistoryIndex(historyIndex - 1);
    }
  };

  // 重做
  const redo = () => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      setContent(nextState.content);
      setHistoryIndex(historyIndex + 1);
    }
  };

  // 获取选中的文本
  const getSelection = () => {
    const textarea = textareaRef.current;
    if (!textarea) return { start: 0, end: 0, text: '' };
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = content.substring(start, end);
    
    return { start, end, text };
  };

  // 替换选中的文本
  const replaceSelection = (replacement: string, selectReplacement: boolean = false) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const { start, end } = getSelection();
    const newContent = content.substring(0, start) + replacement + content.substring(end);
    
    setContent(newContent);
    saveToHistory(newContent);

    setTimeout(() => {
      textarea.focus();
      if (selectReplacement) {
        const newCursorPos = start + replacement.length;
        textarea.setSelectionRange(start, newCursorPos);
      } else {
        const newCursorPos = start + replacement.length;
        textarea.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 0);
  };

  // 在光标处插入文本
  const insertAtCursor = (text: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newContent = content.substring(0, start) + text + content.substring(end);
    
    setContent(newContent);
    saveToHistory(newContent);

    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + text.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  // 格式化工具函数
  const wrapSelection = (before: string, after: string = before) => {
    const { text } = getSelection();
    const placeholder = '文本';
    const replacement = before + (text || placeholder) + after;
    replaceSelection(replacement, !text);
  };

  // 工具栏操作
  const toolbarActions = {
    bold: () => wrapSelection('**'),
    italic: () => wrapSelection('*'),
    underline: () => wrapSelection('<u>', '</u>'),
    strikethrough: () => wrapSelection('~~'),
    heading1: () => insertAtCursor('\n# '),
    heading2: () => insertAtCursor('\n## '),
    heading3: () => insertAtCursor('\n### '),
    bulletList: () => insertAtCursor('\n- '),
    numberedList: () => insertAtCursor('\n1. '),
    quote: () => insertAtCursor('\n> '),
    code: () => wrapSelection('`'),
    codeBlock: () => insertAtCursor('\n```\n\n```'),
    horizontalRule: () => insertAtCursor('\n---\n'),
    checkbox: () => insertAtCursor('\n- [ ] '),
  };

  // 上传封面
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'cover');

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
        setCoverImage(data.url);
        toast.success('封面上传成功');
      } else {
        toast.error(data.error || '上传失败');
      }
    } catch (error) {
      toast.error('上传失败');
    } finally {
      setIsUploading(false);
    }
  };

  // 插入链接
  const insertLink = () => {
    if (!linkUrl) {
      toast.error('请输入链接地址');
      return;
    }
    const text = linkText || linkUrl;
    insertAtCursor(`[${text}](${linkUrl})`);
    setLinkUrl('');
    setLinkText('');
    setIsLinkDialogOpen(false);
  };

  // 插入资源链接
  const insertResource = (resource: Resource) => {
    insertAtCursor(`[${resource.title}](/api/resources/${resource.id}/download)`);
    setIsResourceDialogOpen(false);
    toast.success('已插入资源链接');
  };

  // 上传资源文件
  const handleResourceFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedResourceFile(file);
      if (!resourceTitle) {
        setResourceTitle(file.name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  const uploadResource = async () => {
    if (!selectedResourceFile) {
      toast.error('请选择要上传的文件');
      return;
    }
    if (!resourceTitle.trim()) {
      toast.error('请输入资源标题');
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', selectedResourceFile);
    formData.append('title', resourceTitle);
    formData.append('description', resourceDescription);

    try {
      const response = await fetch('/api/resources', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        toast.success('资源上传成功');
        setResourceTitle('');
        setResourceDescription('');
        setSelectedResourceFile(null);
        fetchResources(); // 刷新资源列表
      } else {
        toast.error(data.error || '上传失败');
      }
    } catch (error) {
      toast.error('上传失败');
    } finally {
      setIsUploading(false);
    }
  };

  // 添加标签
  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  // 移除标签
  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  // 保存文章
  const saveArticle = async (publish: boolean = isPublished) => {
    if (!title.trim()) {
      toast.error('请输入文章标题');
      return;
    }

    if (!content.trim()) {
      toast.error('请输入文章内容');
      return;
    }

    setIsSaving(true);

    const articleData = {
      title: title.trim(),
      content: content.trim(),
      excerpt: excerpt.trim() || content.trim().slice(0, 200) + '...',
      category_id: categoryId ? parseInt(categoryId) : null,
      tags: tags.join(','),
      cover_image: coverImage,
      is_published: publish ? 1 : 0,
    };

    try {
      const url = slug ? `/api/articles/${slug}` : '/api/articles';
      const method = slug ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(articleData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(publish ? '文章发布成功！' : '草稿保存成功！');
        navigate(`/articles/${data.article.slug}`);
      } else {
        toast.error(data.error || data.message || '保存失败');
      }
    } catch (error) {
      toast.error('保存失败');
    } finally {
      setIsSaving(false);
    }
  };

  // Markdown 预览
  const renderPreview = useCallback(() => {
    let html = content
      .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mb-4 text-gray-100">$1</h1>')
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mb-3 mt-6 text-gray-100">$1</h2>')
      .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mb-2 mt-4 text-gray-200">$1</h3>')
      .replace(/~~(.*?)~~/g, '<del class="text-gray-500">$1</del>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-gray-100">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="text-gray-300">$1</em>')
      .replace(/<u>(.*?)<\/u>/g, '<u class="underline decoration-red-500">$1</u>')
      .replace(/`([^`]+)`/g, '<code class="bg-gray-800 px-1.5 py-0.5 rounded text-red-400 font-mono text-sm">$1</code>')
      .replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-800 p-4 rounded-lg overflow-x-auto mb-4"><code class="font-mono text-sm text-gray-300">$1</code></pre>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-red-400 hover:underline" target="_blank" rel="noopener noreferrer">$1</a>')
      .replace(/^- \[ \] (.*$)/gim, '<div class="flex items-center gap-2 mb-2"><input type="checkbox" disabled class="w-4 h-4 rounded border-gray-600"><span class="text-gray-300">$1</span></div>')
      .replace(/^- \[x\] (.*$)/gim, '<div class="flex items-center gap-2 mb-2"><input type="checkbox" checked disabled class="w-4 h-4 rounded border-gray-600"><span class="text-gray-500 line-through">$1</span></div>')
      .replace(/^- (.*$)/gim, '<li class="ml-4 text-gray-300 mb-1">$1</li>')
      .replace(/^\d+\. (.*$)/gim, '<li class="ml-4 text-gray-300 mb-1 list-decimal">$1</li>')
      .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-red-500 pl-4 py-2 my-4 bg-gray-800/50 text-gray-300 italic">$1</blockquote>')
      .replace(/^---$/gim, '<hr class="border-gray-700 my-6">')
      .replace(/\n/g, '<br>');
    
    return html;
  }, [content]);

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-200">
              {slug ? '编辑文章' : '写文章'}
            </h1>
            <p className="text-gray-500 text-sm">
              {SITE_CONFIG.character.name} 正在期待你的创作~
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsPreview(!isPreview)}
              className="gap-2"
            >
              {isPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {isPreview ? '编辑' : '预览'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => saveArticle(false)}
              disabled={isSaving}
              className="gap-2"
            >
              <Save className="w-4 h-4" />
              存草稿
            </Button>
            <Button
              size="sm"
              onClick={() => saveArticle(true)}
              disabled={isSaving}
              className="bg-red-900/80 hover:bg-red-800 gap-2"
            >
              <FileText className="w-4 h-4" />
              {isSaving ? '保存中...' : '发布'}
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Editor */}
          <div className="lg:col-span-2 space-y-4">
            {/* Title */}
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="输入文章标题..."
              className="text-xl font-bold bg-[#141414] border-gray-800 h-12"
            />

            {/* Rich Toolbar */}
            {!isPreview && (
              <div className="flex flex-wrap items-center gap-1 p-2 bg-[#1a1a1a] rounded-lg border border-gray-800">
                {/* 历史记录 */}
                <Button variant="ghost" size="sm" onClick={undo} className="h-8 w-8 p-0" title="撤销">
                  <Undo className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={redo} className="h-8 w-8 p-0" title="重做">
                  <Redo className="w-4 h-4" />
                </Button>
                <div className="w-px h-6 bg-gray-800 mx-1" />
                
                {/* 字体样式 */}
                <Button variant="ghost" size="sm" onClick={toolbarActions.bold} className="h-8 w-8 p-0 font-bold" title="粗体">
                  <Bold className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={toolbarActions.italic} className="h-8 w-8 p-0 italic" title="斜体">
                  <Italic className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={toolbarActions.underline} className="h-8 w-8 p-0 underline" title="下划线">
                  <Underline className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={toolbarActions.strikethrough} className="h-8 w-8 p-0" title="删除线">
                  <Strikethrough className="w-4 h-4" />
                </Button>
                <div className="w-px h-6 bg-gray-800 mx-1" />
                
                {/* 标题 */}
                <Button variant="ghost" size="sm" onClick={toolbarActions.heading1} className="h-8 w-8 p-0" title="标题1">
                  <Heading1 className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={toolbarActions.heading2} className="h-8 w-8 p-0" title="标题2">
                  <Heading2 className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={toolbarActions.heading3} className="h-8 w-8 p-0" title="标题3">
                  <Heading3 className="w-4 h-4" />
                </Button>
                <div className="w-px h-6 bg-gray-800 mx-1" />
                
                {/* 列表 */}
                <Button variant="ghost" size="sm" onClick={toolbarActions.bulletList} className="h-8 w-8 p-0" title="无序列表">
                  <List className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={toolbarActions.numberedList} className="h-8 w-8 p-0" title="有序列表">
                  <ListOrdered className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={toolbarActions.checkbox} className="h-8 w-8 p-0" title="任务列表">
                  <CheckSquare className="w-4 h-4" />
                </Button>
                <div className="w-px h-6 bg-gray-800 mx-1" />
                
                {/* 其他 */}
                <Button variant="ghost" size="sm" onClick={toolbarActions.quote} className="h-8 w-8 p-0" title="引用">
                  <Quote className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={toolbarActions.code} className="h-8 w-8 p-0" title="行内代码">
                  <Code className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setIsLinkDialogOpen(true)} className="h-8 w-8 p-0" title="链接">
                  <LinkIcon className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setIsResourceDialogOpen(true)} className="h-8 px-2 gap-1" title="插入资源">
                  <Upload className="w-4 h-4" />
                  资源
                </Button>
                <Button variant="ghost" size="sm" onClick={toolbarActions.horizontalRule} className="h-8 w-8 p-0" title="分割线">
                  <Minus className="w-4 h-4" />
                </Button>
              </div>
            )}

            {/* Content Editor / Preview */}
            {isPreview ? (
              <Card className="dark-card min-h-[600px]">
                <CardContent className="p-6">
                  <div 
                    className="prose prose-invert max-w-none prose-headings:text-gray-100 prose-p:text-gray-300"
                    dangerouslySetInnerHTML={{ __html: renderPreview() }}
                  />
                </CardContent>
              </Card>
            ) : (
              <Textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => {
                  setContent(e.target.value);
                  saveToHistory(e.target.value);
                }}
                placeholder="在这里开始写作... 支持 Markdown 语法&#10;&#10;快捷键：&#10;- Ctrl+B 粗体&#10;- Ctrl+I 斜体&#10;- Ctrl+K 链接"
                className="min-h-[600px] bg-[#141414] border-gray-800 font-mono text-sm resize-none leading-relaxed"
                onKeyDown={(e) => {
                  if (e.ctrlKey || e.metaKey) {
                    switch (e.key) {
                      case 'b':
                        e.preventDefault();
                        toolbarActions.bold();
                        break;
                      case 'i':
                        e.preventDefault();
                        toolbarActions.italic();
                        break;
                      case 'k':
                        e.preventDefault();
                        setIsLinkDialogOpen(true);
                        break;
                      case 'z':
                        e.preventDefault();
                        if (e.shiftKey) {
                          redo();
                        } else {
                          undo();
                        }
                        break;
                    }
                  }
                }}
              />
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Publish Status */}
            <Card className="dark-card">
              <CardContent className="p-4">
                <h3 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-red-400" />
                  发布状态
                </h3>
                <div className="flex gap-2">
                  <Button
                    variant={!isPublished ? 'default' : 'outline'}
                    onClick={() => setIsPublished(false)}
                    className={`flex-1 ${!isPublished ? 'bg-yellow-900/80 hover:bg-yellow-800' : ''}`}
                    size="sm"
                  >
                    草稿
                  </Button>
                  <Button
                    variant={isPublished ? 'default' : 'outline'}
                    onClick={() => setIsPublished(true)}
                    className={`flex-1 ${isPublished ? 'bg-green-900/80 hover:bg-green-800' : ''}`}
                    size="sm"
                  >
                    发布
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Cover Image */}
            <Card className="dark-card">
              <CardContent className="p-4">
                <h3 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-red-400" />
                  封面图片
                </h3>
                {coverImage ? (
                  <div className="relative">
                    <img
                      src={coverImage}
                      alt="封面"
                      className="w-full h-40 object-cover rounded-lg"
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setCoverImage('')}
                      className="absolute top-2 right-2 h-8 w-8 p-0"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-700 rounded-lg cursor-pointer hover:border-red-900/50 transition-colors">
                    <Upload className="w-8 h-8 text-gray-500 mb-2" />
                    <span className="text-sm text-gray-500">点击上传封面</span>
                    <span className="text-xs text-gray-600 mt-1">支持 JPG, PNG, WebP</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverUpload}
                      className="hidden"
                      disabled={isUploading}
                    />
                  </label>
                )}
              </CardContent>
            </Card>

            {/* Category */}
            <Card className="dark-card">
              <CardContent className="p-4">
                <h3 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
                  <FolderOpen className="w-4 h-4 text-red-400" />
                  分类
                </h3>
                <Select value={categoryId} onValueChange={setCategoryId}>
                  <SelectTrigger className="bg-[#141414] border-gray-800">
                    <SelectValue placeholder="选择分类" />
                  </SelectTrigger>
                  <SelectContent className="dark-card border-gray-800">
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id.toString()}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Tags */}
            <Card className="dark-card">
              <CardContent className="p-4">
                <h3 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-red-400" />
                  标签
                </h3>
                <div className="flex gap-2 mb-3">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    placeholder="输入标签按回车"
                    className="bg-[#141414] border-gray-800"
                  />
                  <Button onClick={addTag} variant="outline" className="px-3">
                    添加
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="bg-red-900/20 text-red-400 border border-red-900/30 cursor-pointer hover:bg-red-900/30"
                      onClick={() => removeTag(tag)}
                    >
                      {tag} <X className="w-3 h-3 ml-1" />
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Excerpt */}
            <Card className="dark-card">
              <CardContent className="p-4">
                <h3 className="text-sm font-medium text-gray-300 mb-3">摘要</h3>
                <Textarea
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="文章摘要（可选，不填写将自动提取前200字）"
                  className="bg-[#141414] border-gray-800 h-24 resize-none"
                />
              </CardContent>
            </Card>

            {/* Word Count */}
            <Card className="dark-card">
              <CardContent className="p-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-red-400">{content.length}</p>
                    <p className="text-xs text-gray-500">字符</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-red-400">{content.split(/\s+/).filter(Boolean).length}</p>
                    <p className="text-xs text-gray-500">单词</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-red-400">{Math.ceil(content.length / 500)}</p>
                    <p className="text-xs text-gray-500">分钟</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Link Dialog */}
      <Dialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
        <DialogContent className="dark-card border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-gray-200">插入链接</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <label className="text-sm text-gray-400 block mb-1">链接文字</label>
              <Input
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
                placeholder="显示的文字"
                className="bg-[#141414] border-gray-800"
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 block mb-1">链接地址 *</label>
              <Input
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://example.com"
                className="bg-[#141414] border-gray-800"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsLinkDialogOpen(false)} className="flex-1">
                取消
              </Button>
              <Button onClick={insertLink} className="flex-1 bg-red-900/80 hover:bg-red-800">
                插入
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Resource Dialog - 带上传功能 */}
      <Dialog open={isResourceDialogOpen} onOpenChange={setIsResourceDialogOpen}>
        <DialogContent className="dark-card border-gray-800 max-w-2xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="text-gray-200">插入资源</DialogTitle>
          </DialogHeader>
          
          <Tabs defaultValue="list" className="mt-4">
            <TabsList className="bg-[#1a1a1a] border border-gray-800">
              <TabsTrigger value="list">资源列表</TabsTrigger>
              <TabsTrigger value="upload">上传新资源</TabsTrigger>
            </TabsList>
            
            <TabsContent value="list">
              <div className="grid gap-3 max-h-[400px] overflow-auto">
                {resources.map((resource) => (
                  <div
                    key={resource.id}
                    className="flex items-center justify-between p-3 bg-[#141414] rounded-lg hover:bg-[#1a1a1a] cursor-pointer border border-transparent hover:border-red-900/30 transition-all"
                    onClick={() => insertResource(resource)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-red-900/20 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-red-400" />
                      </div>
                      <div>
                        <p className="text-gray-200 text-sm">{resource.title}</p>
                        <p className="text-gray-500 text-xs">{resource.file_type} · {(resource.file_size ? (resource.file_size / 1024 / 1024).toFixed(2) : '0')} MB</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); insertResource(resource); }}>
                      插入
                    </Button>
                  </div>
                ))}
                {resources.length === 0 && (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-500">暂无资源</p>
                    <p className="text-gray-600 text-sm">切换到"上传新资源"标签上传文件</p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="upload">
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400 block mb-1">资源标题 *</label>
                  <Input
                    value={resourceTitle}
                    onChange={(e) => setResourceTitle(e.target.value)}
                    placeholder="输入资源名称"
                    className="bg-[#141414] border-gray-800"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 block mb-1">资源描述</label>
                  <Textarea
                    value={resourceDescription}
                    onChange={(e) => setResourceDescription(e.target.value)}
                    placeholder="简单描述这个资源..."
                    className="bg-[#141414] border-gray-800 h-20 resize-none"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 block mb-1">选择文件 *</label>
                  <div className="flex gap-2">
                    <input
                      ref={resourceFileInputRef}
                      type="file"
                      onChange={handleResourceFileSelect}
                      className="hidden"
                    />
                    <Button
                      variant="outline"
                      onClick={() => resourceFileInputRef.current?.click()}
                      className="flex-1"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      {selectedResourceFile ? selectedResourceFile.name : '选择文件'}
                    </Button>
                  </div>
                  {selectedResourceFile && (
                    <p className="text-xs text-gray-500 mt-2">
                      文件大小: {(selectedResourceFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  )}
                </div>
                <Button
                  onClick={uploadResource}
                  disabled={isUploading || !selectedResourceFile || !resourceTitle.trim()}
                  className="w-full bg-red-900/80 hover:bg-red-800"
                >
                  {isUploading ? '上传中...' : '上传并插入'}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export interface User {
  id: number;
  username: string;
  email: string;
  avatar: string;
  bio: string;
  role: 'admin' | 'user';
  created_at: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  color: string;
  article_count?: number;
}

export interface Article {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  cover_image: string;
  author_id: number;
  author_name: string;
  author_avatar: string;
  author_bio?: string;
  category_id: number;
  category_name: string;
  category_slug: string;
  category_color: string;
  tags: string;
  views: number;
  likes: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  comment_count?: number;
}

export interface Comment {
  id: number;
  article_id: number;
  user_id: number | null;
  parent_id: number | null;
  content: string;
  guest_name: string;
  guest_email: string;
  username: string;
  avatar: string;
  author: string;
  is_approved: boolean;
  created_at: string;
  replies?: Comment[];
}

export interface Message {
  id: number;
  user_id: number | null;
  content: string;
  guest_name: string;
  username: string;
  avatar: string;
  author: string;
  reply: string;
  replied_at: string;
  is_approved: boolean;
  created_at: string;
}

export interface Resource {
  id: number;
  title: string;
  description: string;
  file_path: string;
  file_size: number;
  file_size_formatted: string;
  file_type: string;
  download_count: number;
  category: string;
  tags: string;
  is_public: boolean;
  created_at: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

// ===== Enums =====
export type NoticeCategory = 'GENERAL' | 'ACADEMIC' | 'EXAM' | 'SPORTS' | 'CULTURAL' | 'HOLIDAY' | 'ADMISSION' | 'RESULT';
export type NoticeStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
export type EventCategory = 'GENERAL' | 'ACADEMIC' | 'SPORTS' | 'CULTURAL' | 'HOLIDAY' | 'EXAMINATION' | 'ADMISSION';
export type EventStatus = 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
export type AchievementCategory = 'ACADEMIC' | 'SPORTS' | 'CULTURAL' | 'AWARD' | 'RECOGNITION';
export type MessageStatus = 'UNREAD' | 'READ' | 'REPLIED' | 'ARCHIVED';

// ===== Models =====
export interface Admin {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Faculty {
  id: string;
  name: string;
  designation: string;
  department: string;
  qualification: string;
  experience: number;
  email?: string | null;
  phone?: string | null;
  bio?: string | null;
  image?: string | null;
  imagePublicId?: string | null;
  isActive: boolean;
  isFeatured: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  category: NoticeCategory;
  status: NoticeStatus;
  isPinned: boolean;
  pdfUrl?: string | null;
  pdfPublicId?: string | null;
  publishedAt?: Date | null;
  expiresAt?: Date | null;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  category: EventCategory;
  startDate: Date;
  endDate?: Date | null;
  venue?: string | null;
  image?: string | null;
  imagePublicId?: string | null;
  status: EventStatus;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Album {
  id: string;
  name: string;
  description?: string | null;
  coverImage?: string | null;
  coverImagePublicId?: string | null;
  category: string;
  isPublished: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
  images?: GalleryImage[];
  _count?: { images: number };
}

export interface GalleryImage {
  id: string;
  url: string;
  publicId: string;
  caption?: string | null;
  albumId: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: AchievementCategory;
  year: number;
  studentName?: string | null;
  image?: string | null;
  imagePublicId?: string | null;
  isFeatured: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Setting {
  id: string;
  key: string;
  value: string;
  type: string;
  group: string;
  label: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  subject: string;
  message: string;
  status: MessageStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuditLog {
  id: string;
  adminId: string;
  admin?: Pick<Admin, 'name' | 'email'>;
  action: string;
  entity: string;
  entityId?: string | null;
  details?: string | null;
  ipAddress?: string | null;
  createdAt: Date;
}

// ===== Settings Map =====
export type SettingsMap = Record<string, string>;

// ===== API Response Types =====
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ===== Form Types =====
export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface NoticeFormData {
  title: string;
  content: string;
  category: NoticeCategory;
  status: NoticeStatus;
  isPinned: boolean;
  publishedAt?: string;
  expiresAt?: string;
}

export interface FacultyFormData {
  name: string;
  designation: string;
  department: string;
  qualification: string;
  experience: number;
  email?: string;
  phone?: string;
  bio?: string;
  isActive: boolean;
  isFeatured: boolean;
  order: number;
}

export interface EventFormData {
  title: string;
  description: string;
  category: EventCategory;
  startDate: string;
  endDate?: string;
  venue?: string;
  status: EventStatus;
  isFeatured: boolean;
}

// ===== NextAuth Session Extension =====
declare module 'next-auth' {
  interface User {
    id: string;
    role: string;
  }
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
      image?: string;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: string;
  }
}

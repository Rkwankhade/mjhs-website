import { z } from 'zod';

export const noticeSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(200),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  category: z.enum(['GENERAL', 'ACADEMIC', 'EXAM', 'SPORTS', 'CULTURAL', 'HOLIDAY', 'ADMISSION', 'RESULT']),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']),
  isPinned: z.boolean().default(false),
  pdfUrl: z.string().url().optional().or(z.literal('')),
  pdfPublicId: z.string().optional(),
  publishedAt: z.string().optional(),
  expiresAt: z.string().optional(),
});

export const facultySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  designation: z.string().min(2).max(100),
  department: z.string().min(2).max(100),
  qualification: z.string().min(2).max(200),
  experience: z.coerce.number().int().min(0).max(60),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
  bio: z.string().max(2000).optional().or(z.literal('')),
  image: z.string().optional(),
  imagePublicId: z.string().optional(),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  order: z.coerce.number().int().default(0),
});

export const eventSchema = z.object({
  title: z.string().min(5).max(200),
  description: z.string().min(10),
  category: z.enum(['GENERAL', 'ACADEMIC', 'SPORTS', 'CULTURAL', 'HOLIDAY', 'EXAMINATION', 'ADMISSION']),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional().or(z.literal('')),
  venue: z.string().optional().or(z.literal('')),
  image: z.string().optional(),
  imagePublicId: z.string().optional(),
  status: z.enum(['UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED']),
  isFeatured: z.boolean().default(false),
});

export const achievementSchema = z.object({
  title: z.string().min(5).max(200),
  description: z.string().min(10),
  category: z.enum(['ACADEMIC', 'SPORTS', 'CULTURAL', 'AWARD', 'RECOGNITION']),
  year: z.coerce.number().int().min(1965).max(2100),
  studentName: z.string().optional().or(z.literal('')),
  image: z.string().optional(),
  imagePublicId: z.string().optional(),
  isFeatured: z.boolean().default(false),
  order: z.coerce.number().int().default(0),
});

export const albumSchema = z.object({
  name: z.string().min(2).max(150),
  description: z.string().optional().or(z.literal('')),
  category: z.string().min(2),
  isPublished: z.boolean().default(true),
  order: z.coerce.number().int().default(0),
});

export const settingSchema = z.object({
  key: z.string().min(1),
  value: z.string(),
});

export const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().max(20).optional().or(z.literal('')),
  subject: z.string().min(3, 'Subject must be at least 3 characters').max(200),
  message: z.string().min(10, 'Message must be at least 10 characters').max(5000),
});

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type NoticeInput = z.infer<typeof noticeSchema>;
export type FacultyInput = z.infer<typeof facultySchema>;
export type EventInput = z.infer<typeof eventSchema>;
export type AchievementInput = z.infer<typeof achievementSchema>;
export type AlbumInput = z.infer<typeof albumSchema>;
export type ContactFormInput = z.infer<typeof contactFormSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

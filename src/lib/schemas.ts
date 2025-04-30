import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const taskSchema = z.object({
  projectId: z.string().uuid('Invalid project ID'),
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  duration: z.number().int().positive('Duration must be a positive integer'),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  dependencyIds: z.array(z.string().uuid('Invalid dependency ID')).optional(),
});
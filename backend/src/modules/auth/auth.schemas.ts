import { z } from 'zod'

export const registerSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().toLowerCase(),
  phone: z.string().trim().regex(/^\+?[0-9\s()-]{7,20}$/),
  password: z.string().min(8).max(128),
  confirmPassword: z.string().min(1),
}).refine((value) => value.password === value.confirmPassword, {
  path: ['confirmPassword'],
  message: 'Passwords do not match.',
})

export const loginSchema = z.object({
  email: z.string().trim().email().toLowerCase(),
  password: z.string().min(1).max(128),
})

export const passwordResetRequestSchema = z.object({
  email: z.string().trim().email().toLowerCase(),
})

export const passwordUpdateSchema = z.object({
  password: z.string().min(8).max(128),
})

export const refreshSchema = z.object({
  refreshToken: z.string().min(1).optional(),
}).optional()

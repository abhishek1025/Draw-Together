import { z } from 'zod';

export const CreateUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(3).max(20),
  photo: z.string().url().optional(),
  password: z.string().min(1, 'Password is required'),
});

export const SignInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, 'Password is required'),
});

export const CreateRoomSchema = z.object({
  slug: z.string().min(3).max(20),
});


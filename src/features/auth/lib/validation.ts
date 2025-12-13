import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(1, { message: 'Password is required' }),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const signupSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
  organizationName: z.string().optional(),
});

export type SignupInput = z.infer<typeof signupSchema>;

export const adminSignupSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
  projectName: z.string().min(2, { message: 'Project name must be at least 2 characters' }),
});

export type AdminSignupInput = z.infer<typeof adminSignupSchema>;

export const memberSignupSchema = z.object({
  inviteCode: z.string().min(1, { message: 'Invite code is required' }),
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
  role: z.enum(['developer', 'ba', 'pm', 'designer'], {
    required_error: 'Please select a role',
  }),
});

export type MemberSignupInput = z.infer<typeof memberSignupSchema>;

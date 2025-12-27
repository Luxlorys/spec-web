import { z } from 'zod';

// Strong password validation matching API requirements:
// - Min 8, max 128 characters
// - At least one uppercase letter (A-Z)
// - At least one lowercase letter (a-z)
// - At least one number (0-9)
// - At least one special character
const passwordSchema = z
  .string()
  .min(8, { message: 'Password must be at least 8 characters' })
  .max(128, { message: 'Password must be at most 128 characters' })
  .regex(/[A-Z]/, {
    message: 'Password must contain at least one uppercase letter',
  })
  .regex(/[a-z]/, {
    message: 'Password must contain at least one lowercase letter',
  })
  .regex(/[0-9]/, { message: 'Password must contain at least one number' })
  .regex(/[!@#$%^&*(),.?":{}|<>]/, {
    message: 'Password must contain at least one special character',
  });

// Login schema (password only needs to be present, not validated for strength)
export const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(1, { message: 'Password is required' }),
});

export type LoginInput = z.infer<typeof loginSchema>;

// Founder registration (creates organization)
export const founderSignupSchema = z.object({
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().min(1, { message: 'Last name is required' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: passwordSchema,
  organizationName: z
    .string()
    .min(2, { message: 'Organization name must be at least 2 characters' }),
});

export type FounderSignupInput = z.infer<typeof founderSignupSchema>;

// Member registration with invite code (role comes from invite, not user input)
export const memberSignupSchema = z.object({
  inviteCode: z.string().min(1, { message: 'Invite code is required' }),
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().min(1, { message: 'Last name is required' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: passwordSchema,
});

export type MemberSignupInput = z.infer<typeof memberSignupSchema>;

// Forgot password
export const forgotPasswordSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

// Reset password with confirmation
export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

// Resend verification email
export const resendVerificationSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
});

export type ResendVerificationInput = z.infer<typeof resendVerificationSchema>;

// Password requirements helper text
export const PASSWORD_REQUIREMENTS =
  'Min 8 characters with uppercase, lowercase, number, and special character';

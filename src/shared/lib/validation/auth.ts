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

// Password requirements helper text
export const PASSWORD_REQUIREMENTS =
  'Min 8 characters with uppercase, lowercase, number, and special character';

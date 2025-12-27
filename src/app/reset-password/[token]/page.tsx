'use client';

import { useState } from 'react';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, CheckCircle2, KeyRound } from 'lucide-react';
import { useForm } from 'react-hook-form';

import { authApi } from 'shared/api';
import {
  PASSWORD_REQUIREMENTS,
  ResetPasswordInput,
  resetPasswordSchema,
  showApiError,
} from 'shared/lib';
import { Button, Input } from 'shared/ui';

export default function ResetPasswordPage() {
  const router = useRouter();
  const params = useParams();
  const token = params.token as string;

  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values: ResetPasswordInput) => {
    try {
      await authApi.resetPassword(token, values.password);
      setSuccess(true);
      // Redirect to login with success message
      setTimeout(() => router.push('/login?reset=success'), 2000);
    } catch (err) {
      showApiError(err);
    }
  };

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
            <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <h1 className="mb-2 text-2xl font-bold text-foreground">
            Invalid reset link
          </h1>
          <p className="mb-6 text-muted-foreground">
            This password reset link is invalid or has expired.
          </p>
          <Link
            href="/forgot-password"
            className="inline-flex w-full items-center justify-center rounded-lg bg-primary px-4 py-2 text-base font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Request new reset link
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
            <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="mb-2 text-2xl font-bold text-foreground">
            Password reset!
          </h1>
          <p className="mb-4 text-muted-foreground">
            Your password has been reset successfully. Redirecting to login...
          </p>
          <Link
            href="/login"
            className="inline-flex w-full items-center justify-center rounded-lg bg-primary px-4 py-2 text-base font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Sign in now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <KeyRound className="h-8 w-8 text-primary" />
        </div>

        <h1 className="mb-2 text-center text-2xl font-bold text-foreground">
          Set new password
        </h1>

        <p className="mb-6 text-center text-muted-foreground">
          Please enter your new password below.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Input
              {...register('password')}
              type="password"
              label="New Password"
              placeholder="••••••••"
              error={errors.password?.message}
              helperText={PASSWORD_REQUIREMENTS}
              autoComplete="new-password"
            />
          </div>

          <div>
            <Input
              {...register('confirmPassword')}
              type="password"
              label="Confirm Password"
              placeholder="••••••••"
              error={errors.confirmPassword?.message}
              autoComplete="new-password"
            />
          </div>

          <Button type="submit" className="w-full" isLoading={isSubmitting}>
            Reset password
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            <Link
              href="/login"
              className="font-medium text-primary hover:text-primary/80"
            >
              Back to login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

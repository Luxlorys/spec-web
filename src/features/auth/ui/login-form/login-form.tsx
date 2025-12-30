'use client';

import { FC } from 'react';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { authApi } from 'shared/api';
import { isEmailNotVerifiedError, showApiError } from 'shared/lib';
import { useAuthStore } from 'shared/store';
import { Button, Input } from 'shared/ui';

import { LoginInput, loginSchema } from '../../lib';

export const LoginForm: FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAuth } = useAuthStore();

  // Check for password reset success message
  const resetSuccess = searchParams.get('reset') === 'success';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: LoginInput) => {
    try {
      const response = await authApi.login(values);

      setAuth(response.user, response.accessToken, response.refreshToken);

      // Redirect to requested page or dashboard
      const redirect = searchParams.get('redirect') || '/features/new';

      router.push(redirect);
    } catch (err) {
      if (isEmailNotVerifiedError(err)) {
        router.push(`/verify-email?email=${encodeURIComponent(values.email)}`);
      } else {
        showApiError(err);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {resetSuccess && (
        <div className="rounded-lg bg-green-50 p-3 text-sm text-green-800 dark:bg-green-900/20 dark:text-green-400">
          Your password has been reset successfully. Please log in with your new
          password.
        </div>
      )}

      <div>
        <Input
          {...register('email')}
          type="email"
          label="Email"
          placeholder="you@example.com"
          error={errors.email?.message}
          autoComplete="email"
        />
      </div>

      <div>
        <Input
          {...register('password')}
          type="password"
          label="Password"
          placeholder="••••••••"
          error={errors.password?.message}
          autoComplete="current-password"
        />
      </div>

      <div className="flex justify-end">
        <Link
          href="/forgot-password"
          className="text-sm text-primary hover:text-primary/80"
        >
          Forgot password?
        </Link>
      </div>

      <Button type="submit" className="w-full" isLoading={isSubmitting}>
        Sign In
      </Button>

      <div className="text-center text-sm text-gray-600 dark:text-gray-400">
        Don&apos;t have an account?{' '}
        <Link
          href="/signup"
          className="font-medium text-primary hover:text-primary/80"
        >
          Sign up
        </Link>
      </div>
    </form>
  );
};

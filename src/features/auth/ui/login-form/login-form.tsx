'use client';

import { FC, useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { authApi } from 'shared/api/auth';
import { useAuthStore } from 'shared/store';
import { Button, Input } from 'shared/ui';

import { LoginInput, loginSchema } from '../../lib';

export const LoginForm: FC = () => {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [error, setError] = useState<string>('');

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
      setError('');
      const response = await authApi.login(values);

      setAuth(response.user, response.token);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="text-sm text-gray-600 dark:text-gray-400">
        Demo credentials: <strong>sarah.founder@example.com</strong> /{' '}
        <strong>password</strong>
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

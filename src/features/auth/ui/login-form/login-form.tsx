'use client';

import { FC } from 'react';

import Link from 'next/link';

import { Button, Input } from 'shared/ui';

import { useLoginForm } from '../../hooks';

export const LoginForm: FC = () => {
  const { form, onSubmit, resetSuccess, isSubmitting } = useLoginForm();

  const {
    register,
    formState: { errors },
  } = form;

  return (
    <form onSubmit={onSubmit} className="space-y-4">
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

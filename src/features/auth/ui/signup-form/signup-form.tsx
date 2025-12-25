'use client';

import { FC, useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { authApi } from 'shared/api/auth';
import { useAuthStore } from 'shared/store';
import { Button, Input } from 'shared/ui';

import { SignupInput, signupSchema } from '../../lib';

export const SignupForm: FC = () => {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [error, setError] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      organizationName: '',
    },
  });

  const onSubmit = async (values: SignupInput) => {
    try {
      setError('');
      const response = await authApi.signup(values);

      setAuth(response.user, response.token);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Input
          {...register('name')}
          type="text"
          label="Full Name"
          placeholder="John Doe"
          error={errors.name?.message}
          autoComplete="name"
        />
      </div>

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
          helperText="Minimum 8 characters"
          autoComplete="new-password"
        />
      </div>

      <div>
        <Input
          {...register('organizationName')}
          type="text"
          label="Organization Name (Optional)"
          placeholder="Your Company"
          error={errors.organizationName?.message}
          helperText="Create a new organization or join an existing one later"
        />
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      <Button type="submit" className="w-full" isLoading={isSubmitting}>
        Create Account
      </Button>

      <div className="text-center text-sm text-gray-600 dark:text-gray-400">
        Already have an account?{' '}
        <Link
          href="/login"
          className="font-medium text-primary hover:text-primary/80"
        >
          Sign in
        </Link>
      </div>
    </form>
  );
};

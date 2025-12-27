'use client';

import { useState } from 'react';

import Link from 'next/link';

import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, CheckCircle2, Mail } from 'lucide-react';
import { useForm } from 'react-hook-form';

import { authApi } from 'shared/api';
import {
  ForgotPasswordInput,
  forgotPasswordSchema,
  showApiError,
} from 'shared/lib';
import { Button, Input } from 'shared/ui';

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (values: ForgotPasswordInput) => {
    try {
      await authApi.forgotPassword(values.email);
      setSubmittedEmail(values.email);
      setSubmitted(true);
    } catch (err) {
      showApiError(err);
    }
  };

  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
            <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>

          <h1 className="mb-2 text-2xl font-bold text-foreground">
            Check your email
          </h1>

          <p className="mb-6 text-muted-foreground">
            If an account exists for{' '}
            <strong className="text-foreground">{submittedEmail}</strong>, we
            &apos;ve sent password reset instructions.
          </p>

          <Link
            href="/login"
            className="inline-flex w-full items-center justify-center rounded-lg bg-primary px-4 py-2 text-base font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Back to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <Link
          href="/login"
          className="mb-6 flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to login
        </Link>

        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Mail className="h-8 w-8 text-primary" />
        </div>

        <h1 className="mb-2 text-center text-2xl font-bold text-foreground">
          Forgot password?
        </h1>

        <p className="mb-6 text-center text-muted-foreground">
          No worries, we&apos;ll send you reset instructions.
        </p>

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

          <Button type="submit" className="w-full" isLoading={isSubmitting}>
            Send reset link
          </Button>
        </form>
      </div>
    </div>
  );
}

'use client';

import { useRouter, useSearchParams } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { authApi } from 'shared/api';
import { isEmailNotVerifiedError, showApiError } from 'shared/lib';
import { useAuthStore } from 'shared/store';

import { LoginInput, loginSchema } from '../lib';

export const useLoginForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAuth } = useAuthStore();

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = form.handleSubmit(async (values: LoginInput) => {
    try {
      const response = await authApi.login(values);

      setAuth(response.user, response.accessToken, response.refreshToken);

      // Check if founder needs onboarding
      const needsOnboarding =
        response.user.isFounder && response.user.onboardingCompletedAt === null;

      if (needsOnboarding) {
        router.push('/onboarding');
      } else {
        // Redirect to requested page or dashboard
        const redirect = searchParams.get('redirect') || '/features/new';

        router.push(redirect);
      }
    } catch (err) {
      if (isEmailNotVerifiedError(err)) {
        router.push(`/verify-email?email=${encodeURIComponent(values.email)}`);
      } else {
        showApiError(err);
      }
    }
  });

  // Check for password reset success message
  const resetSuccess = searchParams.get('reset') === 'success';

  return {
    form,
    onSubmit,
    resetSuccess,
    isSubmitting: form.formState.isSubmitting,
  };
};

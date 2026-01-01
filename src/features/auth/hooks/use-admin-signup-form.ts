import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { authApi } from 'shared/api';
import { showApiError } from 'shared/lib';

import { FounderSignupInput, founderSignupSchema } from '../lib';

export const useAdminSignupForm = () => {
  const router = useRouter();

  const form = useForm<FounderSignupInput>({
    resolver: zodResolver(founderSignupSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      organizationName: '',
    },
  });

  const onSubmit = form.handleSubmit(async (values: FounderSignupInput) => {
    try {
      await authApi.register(values);
      // Redirect to verification page - user must verify email before logging in
      router.push(`/verify-email?email=${encodeURIComponent(values.email)}`);
    } catch (err) {
      showApiError(err);
    }
  });

  return {
    form,
    onSubmit,
    isSubmitting: form.formState.isSubmitting,
  };
};

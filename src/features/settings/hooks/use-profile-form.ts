import { useEffect } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { useAuthStore } from 'shared/store';

import { useUpdateProfile } from '../api';

const trimmedString = z.string().transform(val => val.trim());

const profileSchema = z.object({
  firstName: trimmedString.pipe(
    z.string().min(1, { message: 'First name is required' }),
  ),
  lastName: trimmedString.pipe(
    z.string().min(1, { message: 'Last name is required' }),
  ),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

export const useProfileForm = () => {
  const { user } = useAuthStore();
  const updateProfileMutation = useUpdateProfile();

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName ?? '',
      lastName: user?.lastName ?? '',
    },
  });

  // Sync form state with user data when user changes
  useEffect(() => {
    if (user) {
      form.reset({
        firstName: user.firstName,
        lastName: user.lastName,
      });
    }
  }, [user, form]);

  const onSubmit = form.handleSubmit(async (data: ProfileFormData) => {
    await updateProfileMutation.mutateAsync(data);
    form.reset(data);
  });

  return {
    form,
    onSubmit,
    isLoading: updateProfileMutation.isPending,
    isSuccess: updateProfileMutation.isSuccess,
    error: updateProfileMutation.error as Error | null,
  };
};

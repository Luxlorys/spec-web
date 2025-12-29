import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { useAuthStore } from 'shared/store';

import {
  useChangePassword,
  useDeleteAccount,
  useDeleteOrganization,
} from '../api';

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(
        /[^A-Za-z0-9]/,
        'Password must contain at least one special character',
      ),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type PasswordFormData = z.infer<typeof passwordSchema>;

export const usePasswordForm = () => {
  const { user } = useAuthStore();
  const changePasswordMutation = useChangePassword();
  const deleteAccountMutation = useDeleteAccount();
  const deleteOrganizationMutation = useDeleteOrganization();

  const isFounder = user?.isFounder ?? false;

  const form = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    mode: 'onChange',
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = form.handleSubmit(async (data: PasswordFormData) => {
    await changePasswordMutation.mutateAsync({
      oldPassword: data.currentPassword,
      newPassword: data.newPassword,
      confirmPassword: data.confirmPassword,
    });
    form.reset();
  });

  const handleDeleteAccount = async () => {
    if (isFounder) {
      await deleteOrganizationMutation.mutateAsync();
    } else {
      await deleteAccountMutation.mutateAsync();
    }
  };

  return {
    form,
    onSubmit,
    handleDeleteAccount,
    isFounder,
    isLoading: changePasswordMutation.isPending,
    isSuccess: changePasswordMutation.isSuccess,
    error: changePasswordMutation.error as Error | null,
    isDeleting:
      deleteAccountMutation.isPending || deleteOrganizationMutation.isPending,
    deleteError: (deleteAccountMutation.error ||
      deleteOrganizationMutation.error) as Error | null,
  };
};

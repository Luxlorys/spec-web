'use client';

import { useMutation } from '@tanstack/react-query';

import { authApi, ICompleteOnboardingRequest } from 'shared/api';
import { QueryKeys } from 'shared/constants';
import { queryClient } from 'shared/lib';
import { useAuthStore } from 'shared/store';

/**
 * Hook to complete onboarding and save product context
 */
export const useCompleteOnboarding = () => {
  const { updateUser } = useAuthStore();

  return useMutation({
    mutationFn: (data: ICompleteOnboardingRequest) =>
      authApi.completeOnboarding(data),
    onSuccess: updatedUser => {
      updateUser(updatedUser);
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.CURRENT_USER],
      });
    },
  });
};

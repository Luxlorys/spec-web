import { useMutation } from '@tanstack/react-query';

import { QueryKeys } from 'shared/constants';
import { queryClient } from 'shared/lib';

// ============================================================================
// Legacy hooks - kept for backward compatibility with unused components
// These will be removed/updated when the corresponding features are implemented
// ============================================================================

/**
 * @deprecated Legacy hook - will be updated when open questions feature is implemented
 */
export const useCreateOpenQuestion = () => {
  return useMutation({
    mutationFn: (_data: {
      specId: string;
      data: { question: string };
    }): Promise<void> => {
      return Promise.reject(
        new Error('Open questions feature not yet implemented'),
      );
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: [QueryKeys.SPEC_BY_FEATURE],
        type: 'active',
      });
    },
  });
};

/**
 * @deprecated Legacy hook - will be updated when open questions feature is implemented
 */
export const useUpdateOpenQuestion = () => {
  return useMutation({
    mutationFn: (_data: {
      specId: string;
      questionId: string;
      data: { question?: string; answer?: string; resolved?: boolean };
    }): Promise<void> => {
      return Promise.reject(
        new Error('Open questions feature not yet implemented'),
      );
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: [QueryKeys.SPEC_BY_FEATURE],
        type: 'active',
      });
    },
  });
};

/**
 * @deprecated Legacy hook - will be updated when open questions feature is implemented
 */
export const useDeleteOpenQuestion = () => {
  return useMutation({
    mutationFn: (_data: {
      specId: string;
      questionId: string;
    }): Promise<void> => {
      return Promise.reject(
        new Error('Open questions feature not yet implemented'),
      );
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: [QueryKeys.SPEC_BY_FEATURE],
        type: 'active',
      });
    },
  });
};

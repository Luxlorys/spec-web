import { useMutation } from '@tanstack/react-query';

import { specificationsApi } from 'shared/api';
import { QueryKeys } from 'shared/constants';
import { queryClient } from 'shared/lib';

/**
 * Hook to fetch regeneration preview
 * Uses mutation because the preview endpoint is a POST request
 */
export const useRegenerationPreview = () => {
  return useMutation({
    mutationFn: (specificationId: number) =>
      specificationsApi.regeneratePreview(specificationId),
  });
};

/**
 * Hook to apply regeneration and create a new specification version
 * Invalidates specification and feature activities queries on success
 */
export const useApplyRegeneration = () => {
  return useMutation({
    mutationFn: (specificationId: number) =>
      specificationsApi.regenerateApply(specificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: query =>
          query.queryKey[0] === QueryKeys.SPECIFICATION_BY_FEATURE ||
          query.queryKey[0] === QueryKeys.FEATURE_ACTIVITIES,
      });
    },
  });
};

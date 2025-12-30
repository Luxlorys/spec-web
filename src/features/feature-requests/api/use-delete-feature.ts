import { useMutation, useQueryClient } from '@tanstack/react-query';

import { featureRequestsApi } from 'shared/api';
import { QueryKeys } from 'shared/constants';

/**
 * Hook to delete a feature
 * Invalidates feature requests list after successful deletion
 */
export const useDeleteFeature = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => featureRequestsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.FEATURE_REQUESTS],
      });
    },
  });
};

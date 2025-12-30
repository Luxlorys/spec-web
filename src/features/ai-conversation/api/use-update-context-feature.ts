import { useMutation } from '@tanstack/react-query';

import { featureRequestsApi } from 'shared/api';
import { QueryKeys } from 'shared/constants';
import { queryClient } from 'shared/lib';

/**
 * Hook to update the context feature for a feature request
 */
export const useUpdateContextFeature = (featureId: number) => {
  return useMutation({
    mutationFn: (contextFeatureId: number | null) =>
      featureRequestsApi.updateContextFeature(featureId, { contextFeatureId }),
    onSuccess: (_data, contextFeatureId) => {
      // Invalidate feature request to get updated contextFeatureId
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.FEATURE_REQUEST_BY_ID, featureId],
      });
      // Invalidate the new context feature query if set
      if (contextFeatureId !== null) {
        queryClient.invalidateQueries({
          queryKey: [QueryKeys.FEATURE_REQUEST_BY_ID, contextFeatureId],
        });
      }
      // Invalidate feature list for dashboard updates
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.FEATURE_REQUESTS],
      });
    },
  });
};

import { useQuery } from '@tanstack/react-query';

import { featureRequestsApi } from 'shared/api';
import { QueryKeys } from 'shared/constants';

/**
 * Hook to fetch a context feature by ID
 * Used to display the attached context feature title in the chat interface
 */
export const useContextFeature = (contextFeatureId: number | null) => {
  return useQuery({
    queryKey: [QueryKeys.FEATURE_REQUEST_BY_ID, contextFeatureId],
    queryFn: () => featureRequestsApi.getById(contextFeatureId!),
    enabled: contextFeatureId !== null,
  });
};

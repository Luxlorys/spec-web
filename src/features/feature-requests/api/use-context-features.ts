import { useQuery } from '@tanstack/react-query';

import { featureRequestsApi, IFeatureRequest } from 'shared/api';
import { QueryKeys } from 'shared/constants';

const ELIGIBLE_STATUSES = ['SPEC_GENERATED', 'READY_TO_BUILD', 'COMPLETED'];

/**
 * Hook to fetch features eligible to be used as context
 * Returns features that have a generated spec (SPEC_GENERATED, READY_TO_BUILD, or COMPLETED)
 * and excludes the current feature being edited
 */
export const useContextFeatures = (excludeFeatureId?: number) => {
  return useQuery({
    queryKey: [
      QueryKeys.FEATURE_REQUESTS,
      'context-eligible',
      excludeFeatureId,
    ],
    queryFn: () => featureRequestsApi.getAll({ limit: 100 }),
    select: data =>
      data.features.filter(
        (feature: IFeatureRequest) =>
          ELIGIBLE_STATUSES.includes(feature.status) &&
          feature.id !== excludeFeatureId &&
          feature.isActive,
      ),
  });
};

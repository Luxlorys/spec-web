import { useMutation, useQuery } from '@tanstack/react-query';

import { documentationApi } from 'shared/api';
import { QueryKeys } from 'shared/constants';
import { queryClient } from 'shared/lib';

const POLLING_INTERVAL = 5000; // 5 seconds

/**
 * Hook to fetch documentation for the current organization
 * Automatically polls when documentation generation is in progress
 */
export const useGetDocumentation = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: [QueryKeys.DOCUMENTATION],
    queryFn: () => documentationApi.get(),
    enabled: options?.enabled ?? true,
    refetchInterval: query => {
      // Poll every 5 seconds while generation is pending
      return query.state.data?.isPending ? POLLING_INTERVAL : false;
    },
  });
};

/**
 * Hook to regenerate documentation (founders only)
 */
export const useRegenerateDocumentation = () => {
  return useMutation({
    mutationFn: () => documentationApi.regenerate(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.DOCUMENTATION],
      });
    },
  });
};

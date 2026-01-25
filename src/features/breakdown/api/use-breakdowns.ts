import { useMutation } from '@tanstack/react-query';

import {
  featureRequestsApi,
  IAnalyzeFeatureTextRequest,
  IBatchCreateFeaturesRequest,
  IGenerateBreakdownRequest,
} from 'shared/api';
import { QueryKeys } from 'shared/constants';
import { queryClient } from 'shared/lib';

/**
 * Hook to analyze text for multiple features
 */
export const useAnalyzeFeatureText = () => {
  return useMutation({
    mutationFn: (request: IAnalyzeFeatureTextRequest) =>
      featureRequestsApi.analyzeText(request),
  });
};

/**
 * Hook to generate feature breakdown from vision
 */
export const useGenerateBreakdown = () => {
  return useMutation({
    mutationFn: (request: IGenerateBreakdownRequest) =>
      featureRequestsApi.generateBreakdown(request),
  });
};

/**
 * Hook to batch create features
 */
export const useBatchCreateFeatures = () => {
  return useMutation({
    mutationFn: (request: IBatchCreateFeaturesRequest) =>
      featureRequestsApi.batchCreate(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.FEATURE_REQUESTS] });
    },
  });
};

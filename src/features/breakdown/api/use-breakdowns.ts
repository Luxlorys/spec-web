import { useMutation, useQuery } from '@tanstack/react-query';

import {
  breakdownsApi,
  IBreakdownFeature,
  IBreakdownFilters,
  ICreateBreakdownRequest,
  ICreateFeaturesFromBreakdownRequest,
  IUpdateBreakdownFeaturesRequest,
} from 'shared/api';
import { QueryKeys } from 'shared/constants';
import { queryClient } from 'shared/lib';

/**
 * Hook to get all breakdowns with filtering
 */
export const useBreakdowns = (filters?: IBreakdownFilters) => {
  return useQuery({
    queryKey: [QueryKeys.BREAKDOWNS, filters],
    queryFn: () => breakdownsApi.getAll(filters),
  });
};

/**
 * Hook to get a single breakdown by ID
 */
export const useBreakdown = (id: number) => {
  return useQuery({
    queryKey: [QueryKeys.BREAKDOWN_BY_ID, id],
    queryFn: () => breakdownsApi.getById(id),
    enabled: !!id,
  });
};

/**
 * Hook to create a new breakdown
 */
export const useCreateBreakdown = () => {
  return useMutation({
    mutationFn: (request: ICreateBreakdownRequest) =>
      breakdownsApi.create(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.BREAKDOWNS] });
    },
  });
};

/**
 * Hook to generate features for a breakdown
 */
export const useGenerateBreakdownFeatures = () => {
  return useMutation({
    mutationFn: (breakdownId: number) =>
      breakdownsApi.generateFeatures(breakdownId),
    onSuccess: (_, breakdownId) => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.BREAKDOWN_BY_ID, breakdownId],
      });
    },
  });
};

/**
 * Hook to update breakdown features
 */
export const useUpdateBreakdownFeatures = () => {
  return useMutation({
    mutationFn: ({
      breakdownId,
      ...request
    }: IUpdateBreakdownFeaturesRequest & { breakdownId: number }) =>
      breakdownsApi.updateFeatures(breakdownId, request),
    onSuccess: breakdown => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.BREAKDOWN_BY_ID, breakdown.id],
      });
    },
  });
};

/**
 * Hook to create features from breakdown
 */
export const useCreateFeaturesFromBreakdown = () => {
  return useMutation({
    mutationFn: ({
      breakdownId,
      ...request
    }: ICreateFeaturesFromBreakdownRequest & { breakdownId: number }) =>
      breakdownsApi.createFeatures(breakdownId, request),
    onSuccess: result => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.BREAKDOWN_BY_ID, result.breakdown.id],
      });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.BREAKDOWNS] });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.FEATURE_REQUESTS] });
    },
  });
};

/**
 * Hook to add a feature to breakdown
 */
export const useAddBreakdownFeature = () => {
  return useMutation({
    mutationFn: ({
      breakdownId,
      feature,
    }: {
      breakdownId: number;
      feature: Omit<IBreakdownFeature, 'id'>;
    }) => breakdownsApi.addFeature(breakdownId, feature),
    onSuccess: breakdown => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.BREAKDOWN_BY_ID, breakdown.id],
      });
    },
  });
};

/**
 * Hook to remove a feature from breakdown
 */
export const useRemoveBreakdownFeature = () => {
  return useMutation({
    mutationFn: ({
      breakdownId,
      featureId,
    }: {
      breakdownId: number;
      featureId: string;
    }) => breakdownsApi.removeFeature(breakdownId, featureId),
    onSuccess: breakdown => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.BREAKDOWN_BY_ID, breakdown.id],
      });
    },
  });
};

/**
 * Hook to delete a breakdown
 */
export const useDeleteBreakdown = () => {
  return useMutation({
    mutationFn: (id: number) => breakdownsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.BREAKDOWNS] });
    },
  });
};

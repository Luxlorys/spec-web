import { useMutation, useQuery } from '@tanstack/react-query';

import {
  specDocumentsApi,
  ICreateOpenQuestionRequest,
  IUpdateOpenQuestionRequest,
} from 'shared/api';
import { QueryKeys } from 'shared/constants';
import { queryClient } from 'shared/lib';

/**
 * Hook to fetch spec document by feature ID
 */
export const useGetSpecByFeature = (featureId: string) => {
  return useQuery({
    queryKey: [QueryKeys.SPEC_BY_FEATURE, featureId],
    queryFn: () => specDocumentsApi.getByFeatureId(featureId),
    enabled: !!featureId,
  });
};

/**
 * Hook to create a new open question
 */
export const useCreateOpenQuestion = () => {
  return useMutation({
    mutationFn: ({ specId, data }: { specId: string; data: ICreateOpenQuestionRequest }) =>
      specDocumentsApi.createOpenQuestion(specId, data),
    onSuccess: async () => {
      // Force refetch all active spec queries
      await queryClient.refetchQueries({
        queryKey: [QueryKeys.SPEC_BY_FEATURE],
        type: 'active',
      });
    },
  });
};

/**
 * Hook to update an open question
 */
export const useUpdateOpenQuestion = () => {
  return useMutation({
    mutationFn: ({
      specId,
      questionId,
      data,
    }: {
      specId: string;
      questionId: string;
      data: IUpdateOpenQuestionRequest;
    }) => specDocumentsApi.updateOpenQuestion(specId, questionId, data),
    onSuccess: async () => {
      // Force refetch all active spec queries
      await queryClient.refetchQueries({
        queryKey: [QueryKeys.SPEC_BY_FEATURE],
        type: 'active',
      });
    },
  });
};

/**
 * Hook to delete an open question
 */
export const useDeleteOpenQuestion = () => {
  return useMutation({
    mutationFn: ({ specId, questionId }: { specId: string; questionId: string }) =>
      specDocumentsApi.deleteOpenQuestion(specId, questionId),
    onSuccess: async () => {
      // Force refetch all active spec queries
      await queryClient.refetchQueries({
        queryKey: [QueryKeys.SPEC_BY_FEATURE],
        type: 'active',
      });
    },
  });
};

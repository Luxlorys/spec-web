import { useMutation, useQuery } from '@tanstack/react-query';

import {
  ICreateOpenQuestionRequest,
  IUpdateOpenQuestionRequest,
  specDocumentsApi,
} from 'shared/api';
import { QueryKeys } from 'shared/constants';
import { queryClient } from 'shared/lib';
import { ISpecDocument, IUpdateSpecSection } from 'shared/types';

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
    mutationFn: ({
      specId,
      data,
    }: {
      specId: string;
      data: ICreateOpenQuestionRequest;
    }) => specDocumentsApi.createOpenQuestion(specId, data),
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
    mutationFn: ({
      specId,
      questionId,
    }: {
      specId: string;
      questionId: string;
    }) => specDocumentsApi.deleteOpenQuestion(specId, questionId),
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
 * Hook to update a spec section
 */
export const useUpdateSpecSection = () => {
  return useMutation({
    mutationFn: ({
      specId,
      update,
    }: {
      specId: string;
      update: IUpdateSpecSection;
    }) => specDocumentsApi.updateSection(specId, update),
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
 * Hook to preview spec regeneration from discussions
 * Manual trigger only - not automatically fetched
 */
export const usePreviewRegeneration = (specId: string) => {
  return useQuery({
    queryKey: [QueryKeys.SPEC_REGENERATION_PREVIEW, specId],
    queryFn: () => specDocumentsApi.previewRegeneration(specId),
    enabled: false, // Manual trigger only
    staleTime: 0, // Always fresh
  });
};

/**
 * Hook to commit regenerated spec and create new version
 */
export const useCommitRegeneration = () => {
  return useMutation({
    mutationFn: ({
      specId,
      proposedSpec,
    }: {
      specId: string;
      proposedSpec: ISpecDocument;
    }) => specDocumentsApi.commitRegeneration(specId, proposedSpec),
    onSuccess: async () => {
      // Refetch the spec to show new version
      await queryClient.refetchQueries({
        queryKey: [QueryKeys.SPEC_BY_FEATURE],
        type: 'active',
      });
      // Invalidate version history to refresh it
      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.SPEC_VERSION_HISTORY],
      });
      // Invalidate comments as resolved ones may have changed
      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.COMMENTS_BY_SPEC],
      });
    },
  });
};

/**
 * Hook to fetch version history for a spec
 */
export const useGetVersionHistory = (specId: string) => {
  return useQuery({
    queryKey: [QueryKeys.SPEC_VERSION_HISTORY, specId],
    queryFn: () => specDocumentsApi.getVersionHistory(specId),
    enabled: !!specId,
  });
};

/**
 * Hook to rollback spec to a previous version
 */
export const useRollbackSpec = () => {
  return useMutation({
    mutationFn: ({
      specId,
      targetVersion,
    }: {
      specId: string;
      targetVersion: number;
    }) => specDocumentsApi.rollbackToVersion(specId, targetVersion),
    onSuccess: async () => {
      // Refetch the spec to show rolled back version
      await queryClient.refetchQueries({
        queryKey: [QueryKeys.SPEC_BY_FEATURE],
        type: 'active',
      });
      // Invalidate version history to refresh it
      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.SPEC_VERSION_HISTORY],
      });
    },
  });
};

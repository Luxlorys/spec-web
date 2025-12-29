import { useMutation, useQuery } from '@tanstack/react-query';

import { specificationsApi } from 'shared/api';
import { QueryKeys } from 'shared/constants';
import { queryClient } from 'shared/lib';
import {
  ICreateAnswerRequest,
  ICreateQuestionRequest,
  IEditAnswerRequest,
  IEditQuestionRequest,
  IResolveQuestionRequest,
} from 'shared/types';

/**
 * Hook to fetch specification with open questions for a feature
 * Polls every 15 seconds to check for AI answers on open questions
 */
export const useGetSpecification = (
  featureId: number,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: [QueryKeys.SPECIFICATION_BY_FEATURE, featureId],
    queryFn: () => specificationsApi.getByFeatureId(featureId),
    enabled:
      !Number.isNaN(featureId) && featureId > 0 && (options?.enabled ?? true),
    refetchInterval: 15000, // Poll every 15 seconds for AI answers
    refetchIntervalInBackground: false, // Only poll when tab is focused
  });
};

/**
 * Hook to create a new open question
 */
export const useCreateOpenQuestion = () => {
  return useMutation({
    mutationFn: ({
      specificationId,
      data,
    }: {
      specificationId: number;
      data: ICreateQuestionRequest;
    }) => specificationsApi.createQuestion(specificationId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: query =>
          query.queryKey[0] === QueryKeys.SPECIFICATION_BY_FEATURE,
      });
    },
  });
};

/**
 * Hook to edit an open question and/or its answers
 */
export const useEditOpenQuestion = () => {
  return useMutation({
    mutationFn: ({
      specificationId,
      questionId,
      data,
    }: {
      specificationId: number;
      questionId: number;
      data: IEditQuestionRequest;
    }) => specificationsApi.editQuestion(specificationId, questionId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: query =>
          query.queryKey[0] === QueryKeys.SPECIFICATION_BY_FEATURE,
      });
    },
  });
};

/**
 * Hook to resolve an open question with an accepted answer
 */
export const useResolveOpenQuestion = () => {
  return useMutation({
    mutationFn: ({
      specificationId,
      questionId,
      data,
    }: {
      specificationId: number;
      questionId: number;
      data: IResolveQuestionRequest;
    }) => specificationsApi.resolveQuestion(specificationId, questionId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: query =>
          query.queryKey[0] === QueryKeys.SPECIFICATION_BY_FEATURE,
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
      specificationId,
      questionId,
    }: {
      specificationId: number;
      questionId: number;
    }) => specificationsApi.deleteQuestion(specificationId, questionId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: query =>
          query.queryKey[0] === QueryKeys.SPECIFICATION_BY_FEATURE,
      });
    },
  });
};

/**
 * Hook to create a new answer
 */
export const useCreateAnswer = () => {
  return useMutation({
    mutationFn: ({
      specificationId,
      questionId,
      data,
    }: {
      specificationId: number;
      questionId: number;
      data: ICreateAnswerRequest;
    }) => specificationsApi.createAnswer(specificationId, questionId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: query =>
          query.queryKey[0] === QueryKeys.SPECIFICATION_BY_FEATURE,
      });
    },
  });
};

/**
 * Hook to edit an answer
 */
export const useEditAnswer = () => {
  return useMutation({
    mutationFn: (params: {
      specificationId: number;
      questionId: number;
      answerId: number;
      data: IEditAnswerRequest;
    }) => specificationsApi.editAnswer(params),
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: query =>
          query.queryKey[0] === QueryKeys.SPECIFICATION_BY_FEATURE,
      });
    },
  });
};

/**
 * Hook to delete an answer
 */
export const useDeleteAnswer = () => {
  return useMutation({
    mutationFn: ({
      specificationId,
      questionId,
      answerId,
    }: {
      specificationId: number;
      questionId: number;
      answerId: number;
    }) => specificationsApi.deleteAnswer(specificationId, questionId, answerId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: query =>
          query.queryKey[0] === QueryKeys.SPECIFICATION_BY_FEATURE,
      });
    },
  });
};

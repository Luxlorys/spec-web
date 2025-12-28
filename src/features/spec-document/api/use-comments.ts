import { useMutation, useQuery } from '@tanstack/react-query';

import {
  commentsApi,
  ICreateCommentRequest,
  IEditCommentRequest,
  SectionType,
} from 'shared/api';
import { QueryKeys } from 'shared/constants';
import { queryClient } from 'shared/lib';

/**
 * Hook to fetch all comments for a specification grouped by section
 */
export const useGetComments = (
  specificationId: number,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: [QueryKeys.COMMENTS_BY_SPEC, specificationId],
    queryFn: () => commentsApi.getBySpecificationId(specificationId),
    enabled:
      !Number.isNaN(specificationId) &&
      specificationId > 0 &&
      (options?.enabled ?? true),
  });
};

/**
 * Hook to fetch comments for a specific section
 * Uses the grouped comments query and selects the section array
 */
export const useGetCommentsBySection = (
  specificationId: number,
  sectionType: SectionType,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: [QueryKeys.COMMENTS_BY_SPEC, specificationId],
    queryFn: () => commentsApi.getBySpecificationId(specificationId),
    enabled:
      !Number.isNaN(specificationId) &&
      specificationId > 0 &&
      (options?.enabled ?? true),
    select: data => data[sectionType],
  });
};

/**
 * Hook to create a new comment
 */
export const useCreateComment = () => {
  return useMutation({
    mutationFn: ({
      specificationId,
      data,
    }: {
      specificationId: number;
      data: ICreateCommentRequest;
    }) => commentsApi.create(specificationId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.COMMENTS_BY_SPEC, variables.specificationId],
      });
    },
  });
};

/**
 * Hook to update a comment
 */
export const useUpdateComment = () => {
  return useMutation({
    mutationFn: ({
      specificationId,
      commentId,
      data,
    }: {
      specificationId: number;
      commentId: number;
      data: IEditCommentRequest;
    }) => commentsApi.edit(specificationId, commentId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.COMMENTS_BY_SPEC, variables.specificationId],
      });
    },
  });
};

/**
 * Hook to delete a comment
 */
export const useDeleteComment = () => {
  return useMutation({
    mutationFn: ({
      specificationId,
      commentId,
    }: {
      specificationId: number;
      commentId: number;
    }) => commentsApi.delete(specificationId, commentId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.COMMENTS_BY_SPEC, variables.specificationId],
      });
    },
  });
};

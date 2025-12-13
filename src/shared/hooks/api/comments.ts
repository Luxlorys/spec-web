import { useMutation, useQuery } from '@tanstack/react-query';

import { commentsApi } from 'shared/api';
import { QueryKeys } from 'shared/constants';
import { queryClient } from 'shared/lib';
import { ICreateCommentRequest, IUpdateCommentRequest } from 'shared/types';

/**
 * Hook to fetch comments for a specific section
 */
export const useGetCommentsBySection = (specDocumentId: string, section: string) => {
  return useQuery({
    queryKey: [QueryKeys.COMMENTS_BY_SPEC, specDocumentId, section],
    queryFn: () => commentsApi.getCommentsBySection(specDocumentId, section),
    enabled: !!specDocumentId && !!section, // Only run if both provided
  });
};

/**
 * Hook to fetch comment counts for all sections in a spec
 */
export const useGetCommentCounts = (specDocumentId: string) => {
  return useQuery({
    queryKey: [QueryKeys.COMMENTS_BY_SPEC, specDocumentId, 'counts'],
    queryFn: () => commentsApi.getCommentCountsBySpec(specDocumentId),
    enabled: !!specDocumentId,
  });
};

/**
 * Hook to create a new comment
 */
export const useCreateComment = () => {
  return useMutation({
    mutationFn: ({
      specDocumentId,
      data,
    }: {
      specDocumentId: string;
      data: ICreateCommentRequest;
    }) => commentsApi.createComment(specDocumentId, data),
    onSuccess: newComment => {
      // Invalidate the specific section's comments
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.COMMENTS_BY_SPEC, newComment.specDocumentId, newComment.section],
      });

      // Invalidate comment counts to update badges
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.COMMENTS_BY_SPEC, newComment.specDocumentId, 'counts'],
      });
    },
  });
};

/**
 * Hook to update a comment
 */
export const useUpdateComment = () => {
  return useMutation({
    mutationFn: ({ commentId, data }: { commentId: string; data: IUpdateCommentRequest }) =>
      commentsApi.updateComment(commentId, data),
    onSuccess: updatedComment => {
      // Invalidate the specific section's comments
      queryClient.invalidateQueries({
        queryKey: [
          QueryKeys.COMMENTS_BY_SPEC,
          updatedComment.specDocumentId,
          updatedComment.section,
        ],
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
      commentId,
      specDocumentId,
      section,
    }: {
      commentId: string;
      specDocumentId: string;
      section: string;
    }) => commentsApi.deleteComment(commentId),
    onSuccess: (_, variables) => {
      // Invalidate the specific section's comments
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.COMMENTS_BY_SPEC, variables.specDocumentId, variables.section],
      });

      // Invalidate comment counts to update badges
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.COMMENTS_BY_SPEC, variables.specDocumentId, 'counts'],
      });
    },
  });
};

import { useMutation, useQuery } from '@tanstack/react-query';

import {
  conversationsApi,
  IConversationWithProgress,
  IGenerateSpecificationRequest,
  ISendMessageRequest,
} from 'shared/api';
import { QueryKeys } from 'shared/constants';
import { queryClient } from 'shared/lib';

/**
 * Hook to fetch conversation for a feature
 */
export const useGetConversation = (
  featureId: number,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: [QueryKeys.CONVERSATION_BY_FEATURE, featureId],
    queryFn: () => conversationsApi.getByFeatureId(featureId),
    enabled:
      !Number.isNaN(featureId) && featureId > 0 && (options?.enabled ?? true),
  });
};

/**
 * Hook to send a message to the conversation with optimistic updates
 */
export const useSendMessage = (featureId: number) => {
  return useMutation({
    mutationFn: (data: ISendMessageRequest) =>
      conversationsApi.sendMessage(featureId, data),
    onMutate: async variables => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: [QueryKeys.CONVERSATION_BY_FEATURE, featureId],
      });

      // Snapshot previous value
      const previousConversation =
        queryClient.getQueryData<IConversationWithProgress>([
          QueryKeys.CONVERSATION_BY_FEATURE,
          featureId,
        ]);

      // Optimistically add user message
      if (previousConversation) {
        queryClient.setQueryData<IConversationWithProgress>(
          [QueryKeys.CONVERSATION_BY_FEATURE, featureId],
          {
            ...previousConversation,
            messages: [
              ...previousConversation.messages,
              {
                id: Date.now(), // Temporary ID
                role: 'USER',
                content: variables.content,
                createdAt: new Date().toISOString(),
              },
            ],
          },
        );
      }

      return { previousConversation };
    },
    onError: (_err, _variables, context) => {
      // Rollback on error
      if (context?.previousConversation) {
        queryClient.setQueryData(
          [QueryKeys.CONVERSATION_BY_FEATURE, featureId],
          context.previousConversation,
        );
      }
    },
    onSuccess: () => {
      // Invalidate conversation to get real data with AI response
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.CONVERSATION_BY_FEATURE, featureId],
      });
      // Invalidate feature request in case status changed to spec_generated
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.FEATURE_REQUEST_BY_ID, featureId],
      });
      // Invalidate feature list for dashboard updates
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.FEATURE_REQUESTS],
      });
    },
  });
};

/**
 * Hook to force generate specification from conversation
 */
export const useGenerateSpecification = (featureId: number) => {
  return useMutation({
    mutationFn: (data?: IGenerateSpecificationRequest) =>
      conversationsApi.generateSpecification(featureId, data),
    onSuccess: () => {
      // Invalidate conversation
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.CONVERSATION_BY_FEATURE, featureId],
      });
      // Invalidate feature request
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.FEATURE_REQUEST_BY_ID, featureId],
      });
      // Invalidate specification
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.SPECIFICATION_BY_FEATURE, featureId],
      });
      // Invalidate feature list
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.FEATURE_REQUESTS],
      });
    },
  });
};

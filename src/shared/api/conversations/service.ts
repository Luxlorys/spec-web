import { api } from 'shared/lib';

import {
  IConversationWithProgress,
  IGenerateSpecificationRequest,
  IGenerateSpecificationResponse,
  IGetConversationResponse,
  ISendMessageRequest,
  ISendMessageResponse,
} from './types';

export const conversationsApi = {
  /**
   * Get conversation for a feature
   * GET /api/features/:featureId/conversation
   */
  getByFeatureId: async (
    featureId: number,
  ): Promise<IConversationWithProgress | null> => {
    try {
      const { data } = await api.get<IGetConversationResponse>(
        `/features/${featureId}/conversation`,
      );

      return data.conversation;
    } catch (error) {
      // Return null if conversation not found
      if (
        error &&
        typeof error === 'object' &&
        'response' in error &&
        (error as { response?: { status?: number } }).response?.status === 404
      ) {
        return null;
      }
      throw error;
    }
  },

  /**
   * Send a message to the conversation and get AI response
   * POST /api/features/:featureId/conversation/messages
   */
  sendMessage: async (
    featureId: number,
    data: ISendMessageRequest,
  ): Promise<ISendMessageResponse> => {
    const { data: response } = await api.post<ISendMessageResponse>(
      `/features/${featureId}/conversation/messages`,
      data,
    );

    return response;
  },

  /**
   * Force generate specification from conversation
   * POST /api/features/:featureId/conversation/generate
   */
  generateSpecification: async (
    featureId: number,
    data?: IGenerateSpecificationRequest,
  ): Promise<IGenerateSpecificationResponse> => {
    const { data: response } = await api.post<IGenerateSpecificationResponse>(
      `/features/${featureId}/conversation/generate`,
      data ?? {},
    );

    return response;
  },
};

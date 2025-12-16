import { IAIConversation, IConversationMessage, ISendMessageRequest } from 'shared/types';
import { delay, generateId } from 'shared/lib';
import { mockConversations, mockFeatureRequests } from 'shared/lib/mock-data';
import { aiQuestionFlow, generateEdgeCaseQuestions, generateSummary } from 'shared/lib/mock-data/ai-responses';

export const conversationsApi = {
  getByFeatureId: async (featureId: string): Promise<IAIConversation | null> => {
    await delay(300);

    const conversation = mockConversations.find(c => c.featureRequestId === featureId);
    return conversation || null;
  },

  createConversation: async (featureId: string): Promise<IAIConversation> => {
    await delay(400);

    const feature = mockFeatureRequests.find(f => f.id === featureId);
    if (!feature) throw new Error('Feature not found');

    const conversationId = generateId();

    const initialMessage: IConversationMessage = {
      id: generateId(),
      role: 'assistant',
      content: `Hi! I'll help you define the "${feature.title}" feature. ${aiQuestionFlow[0].question}`,
      timestamp: new Date(),
    };

    const newConversation: IAIConversation = {
      id: conversationId,
      featureRequestId: featureId,
      messages: [initialMessage],
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockConversations.push(newConversation);

    // Update feature request (stays in draft during conversation)
    const featureIndex = mockFeatureRequests.findIndex(f => f.id === featureId);
    if (featureIndex !== -1) {
      mockFeatureRequests[featureIndex] = {
        ...mockFeatureRequests[featureIndex],
        conversationId,
        updatedAt: new Date(),
        lastActivityAt: new Date(),
      };
    }

    return newConversation;
  },

  sendMessage: async (
    conversationId: string,
    message: ISendMessageRequest,
  ): Promise<IConversationMessage[]> => {
    await delay(800);

    const conversation = mockConversations.find(c => c.id === conversationId);
    if (!conversation) throw new Error('Conversation not found');

    const feature = mockFeatureRequests.find(f => f.id === conversation.featureRequestId);
    if (!feature) throw new Error('Feature not found');

    // Add user message
    const userMessage: IConversationMessage = {
      id: generateId(),
      role: 'user',
      content: message.content,
      timestamp: new Date(),
    };

    conversation.messages.push(userMessage);

    // Generate AI response
    await delay(1200); // Simulate AI "thinking"

    const messageCount = conversation.messages.filter(m => m.role === 'user').length;
    let aiResponse: string;

    if (messageCount < aiQuestionFlow.length) {
      // Continue with question flow
      aiResponse = aiQuestionFlow[messageCount].question;
    } else if (messageCount === aiQuestionFlow.length) {
      // Ask edge case questions
      const edgeCases = generateEdgeCaseQuestions(feature.title);
      aiResponse = `Great! A few edge cases to consider:\n\n${edgeCases.map((q, i) => `${i + 1}. ${q}`).join('\n')}`;
    } else if (messageCount === aiQuestionFlow.length + 1) {
      // Generate summary
      const userResponses = conversation.messages
        .filter(m => m.role === 'user')
        .map(m => m.content);
      aiResponse = generateSummary(userResponses);
    } else {
      // Conversation complete - generate spec
      aiResponse = "Perfect! I'll generate a comprehensive specification document now. This will take a moment...";

      // Mark conversation as completed
      conversation.status = 'completed';

      // Update feature status
      const featureIndex = mockFeatureRequests.findIndex(f => f.id === feature.id);
      if (featureIndex !== -1) {
        mockFeatureRequests[featureIndex] = {
          ...mockFeatureRequests[featureIndex],
          status: 'spec_generated',
          updatedAt: new Date(),
          lastActivityAt: new Date(),
        };
      }
    }

    const aiMessage: IConversationMessage = {
      id: generateId(),
      role: 'assistant',
      content: aiResponse,
      timestamp: new Date(),
    };

    conversation.messages.push(aiMessage);
    conversation.updatedAt = new Date();

    // Update feature last activity
    const featureIndex = mockFeatureRequests.findIndex(f => f.id === feature.id);
    if (featureIndex !== -1) {
      mockFeatureRequests[featureIndex].lastActivityAt = new Date();
    }

    return [userMessage, aiMessage];
  },
};

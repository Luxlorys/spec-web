export type MessageRole = 'user' | 'assistant';

export interface IConversationMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
}

export interface IAIConversation {
  id: string;
  featureRequestId: string;
  messages: IConversationMessage[];
  status: 'active' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

export interface ISendMessageRequest {
  content: string;
}

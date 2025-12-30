/**
 * Message role enum matching API (uppercase)
 */
export type MessageRole = 'USER' | 'ASSISTANT';

/**
 * Conversation phase types
 */
export type ConversationPhase =
  | 'greeting'
  | 'problem_discovery'
  | 'user_stories'
  | 'acceptance_criteria'
  | 'scope_definition'
  | 'technical_considerations'
  | 'review'
  | 'complete';

/**
 * Topic status for progress tracking
 */
export type TopicStatus = 'not_started' | 'in_progress' | 'complete';

/**
 * Conversation message from API
 */
export interface IConversationMessage {
  id: number;
  role: MessageRole;
  content: string;
  createdAt: string;
}

/**
 * Message metadata for assistant messages
 */
export interface IMessageMetadata {
  phase?: ConversationPhase;
  inputTokens?: number;
  outputTokens?: number;
}

/**
 * Assistant message with metadata
 */
export interface IMessageWithMetadata extends IConversationMessage {
  metadata: IMessageMetadata | null;
}

/**
 * Topic progress tracking
 */
export interface ITopicProgress {
  topic: string;
  status: TopicStatus;
}

/**
 * Conversation entity from API
 */
export interface IConversation {
  id: number;
  featureId: number;
  isCompleted: boolean;
  currentPhase: ConversationPhase;
  messages: IConversationMessage[];
}

/**
 * Conversation with progress information
 */
export interface IConversationWithProgress extends IConversation {
  topicsProgress: ITopicProgress[];
}

/**
 * Request body for sending a message
 * POST /api/features/:featureId/conversation/messages
 */
export interface ISendMessageRequest {
  content: string;
}

/**
 * Request body for force generating specification
 * POST /api/features/:featureId/conversation/generate
 */
export interface IGenerateSpecificationRequest {
  force?: boolean;
}

/**
 * Open question in generated specification (simplified format from generate endpoint)
 */
export interface IGeneratedOpenQuestion {
  id: number;
  question: string;
  isResolved: boolean;
}

/**
 * Generated specification from conversation
 */
export interface IGeneratedSpecification {
  id: number;
  featureId: number;
  version: number;
  overview: string;
  problemStatement: string;
  userStories: string[];
  acceptanceCriteria: string[];
  scopeIncluded: string[];
  scopeExcluded: string[];
  technicalConsiderations: string[];
  openQuestions: IGeneratedOpenQuestion[];
  generatedAt: string;
}

// ============================================================================
// Response types
// ============================================================================

/**
 * Response for GET /api/features/:featureId/conversation
 */
export interface IGetConversationResponse {
  conversation: IConversationWithProgress;
}

/**
 * Specification reference in send message response
 */
export interface ISpecificationRef {
  id: number;
  featureId: number;
  version: number;
}

/**
 * Response for POST /api/features/:featureId/conversation/messages
 */
export interface ISendMessageResponse {
  userMessage: IConversationMessage;
  assistantMessage: IMessageWithMetadata;
  conversation: {
    isCompleted: boolean;
    currentPhase: ConversationPhase;
  };
  specification: ISpecificationRef | null;
}

/**
 * Response for POST /api/features/:featureId/conversation/generate
 */
export interface IGenerateSpecificationResponse {
  specification: IGeneratedSpecification;
  featureStatus: 'SPEC_GENERATED';
}

// ============================================================================
// Streaming types
// ============================================================================

/**
 * SSE event types for streaming conversation
 */
export type SSEEventType =
  | 'message_start'
  | 'text_delta'
  | 'metadata'
  | 'message_complete'
  | 'error';

/**
 * Metadata received during streaming
 */
export interface IStreamMetadata {
  phase: ConversationPhase;
  isCompleted: boolean;
  assistantMessageId: number | null;
  userMessageId: number | null;
  specification: ISpecificationRef | null;
}

/**
 * Final result when stream completes
 */
export interface IStreamCompleteResult {
  userMessage: IConversationMessage;
  assistantMessage: IMessageWithMetadata;
  conversation: {
    isCompleted: boolean;
    currentPhase: ConversationPhase;
  };
  specification: ISpecificationRef | null;
}

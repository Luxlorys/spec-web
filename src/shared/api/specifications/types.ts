/**
 * Specification document returned from API
 * GET /features/:id/specification
 */
export interface ISpecDocument {
  id: number;
  featureId: number;
  version: number;
  isLatest: boolean;
  overview: string;
  problemStatement: string;
  userStories: string[];
  acceptanceCriteria: string[];
  scopeIncluded: string[];
  scopeExcluded: string[];
  technicalConsiderations: string[];
  regeneratedFromVersion: number | null;
  regenerationReason: string | null;
  generatedAt: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Section keys that can be updated
 */
export type SpecSectionKey =
  | 'overview'
  | 'problemStatement'
  | 'userStories'
  | 'acceptanceCriteria'
  | 'scopeIncluded'
  | 'scopeExcluded'
  | 'technicalConsiderations';

/**
 * Request type for updating a spec section
 */
export interface IUpdateSpecSection {
  section: SpecSectionKey;
  value: string | string[];
}

/**
 * Author type for questions and answers
 */
export interface IQuestionAuthor {
  id: number;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
}

/**
 * Answer to an open question
 */
export interface IQuestionAnswer {
  id: number;
  content: string;
  answeredByAi: boolean;
  authorId: number | null;
  author: IQuestionAuthor | null;
  createdAt: string;
}

/**
 * Open question with answers
 */
export interface IOpenQuestion {
  id: number;
  specificationId: number;
  question: string;
  askedByAi: boolean;
  askedByUserId: number | null;
  askedByUser: IQuestionAuthor | null;
  isResolved: boolean;
  acceptedAnswerId: number | null;
  sequenceNumber: number;
  createdAt: string;
  updatedAt: string;
  answers: IQuestionAnswer[];
}

/**
 * Specification with open questions
 * GET /specifications/:featureId
 */
export interface ISpecificationWithQuestions extends ISpecDocument {
  openQuestions: IOpenQuestion[];
}

// ============================================================================
// Request Types
// ============================================================================

/**
 * Request to create a new question
 * POST /specifications/:specificationId/questions
 */
export interface ICreateQuestionRequest {
  question: string;
}

/**
 * Request to edit a question and/or its answers
 * PUT /specifications/:specificationId/questions/:questionId
 */
export interface IEditQuestionRequest {
  question?: string;
  answers?: Array<{
    id: number;
    content: string;
  }>;
}

/**
 * Request to resolve a question
 * POST /specifications/:specificationId/questions/:questionId/resolve
 */
export interface IResolveQuestionRequest {
  acceptedAnswerId: number;
}

/**
 * Request to create a new answer
 * POST /specifications/:specificationId/questions/:questionId/answers
 */
export interface ICreateAnswerRequest {
  content: string;
}

/**
 * Request to edit an answer
 * POST /specifications/:specificationId/questions/:questionId/answers/:answerId
 */
export interface IEditAnswerRequest {
  content: string;
}

// ============================================================================
// Response Types
// ============================================================================

/**
 * Response from GET /specifications/:featureId
 */
export interface IGetSpecificationResponse {
  specification: ISpecificationWithQuestions;
}

/**
 * Response from POST /specifications/:specificationId/questions
 */
export interface ICreateQuestionResponse {
  question: IOpenQuestion;
}

/**
 * Response from PUT /specifications/:specificationId/questions/:questionId
 */
export interface IEditQuestionResponse {
  question: IOpenQuestion;
}

/**
 * Response from POST /specifications/:specificationId/questions/:questionId/resolve
 */
export interface IResolveQuestionResponse {
  question: IOpenQuestion;
}

/**
 * Response from DELETE /specifications/:specificationId/questions/:questionId
 */
export interface IDeleteQuestionResponse {
  success: boolean;
}

/**
 * Response from POST /specifications/:specificationId/questions/:questionId/answers
 */
export interface ICreateAnswerResponse {
  answer: IQuestionAnswer;
}

/**
 * Response from POST /specifications/:specificationId/questions/:questionId/answers/:answerId
 */
export interface IEditAnswerResponse {
  answer: IQuestionAnswer;
}

/**
 * Response from DELETE /specifications/:specificationId/questions/:questionId/answers/:answerId
 */
export interface IDeleteAnswerResponse {
  success: boolean;
}

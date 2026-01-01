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
 * Note: When isResolved=true, the question and its accepted answer cannot be edited, only deleted
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

// ============================================================================
// Regeneration Types
// ============================================================================

/**
 * Change types for regeneration preview
 */
export type ChangeType = 'modified' | 'added' | 'removed' | 'unchanged';

/**
 * Section change object from API
 * Contains old and new values for a specific section
 */
export interface ISectionChange<T = string | string[]> {
  old: T;
  new: T;
}

/**
 * Changes object from regeneration preview API
 * Only contains sections that would change
 */
export interface IRegenerationChanges {
  overview?: ISectionChange<string>;
  problemStatement?: ISectionChange<string>;
  userStories?: ISectionChange<string[]>;
  acceptanceCriteria?: ISectionChange<string[]>;
  scopeIncluded?: ISectionChange<string[]>;
  scopeExcluded?: ISectionChange<string[]>;
  technicalConsiderations?: ISectionChange<string[]>;
}

/**
 * Response from POST /specifications/:specificationId/regenerate/preview
 */
export interface IRegenerationPreviewResponse {
  changes: IRegenerationChanges;
  unresolvedQuestionCount: number;
  resolvedQuestionCount: number;
  commentCount: number;
  newOpenQuestions: string[];
  regenerationSummary: string;
}

/**
 * Response from POST /specifications/:specificationId/regenerate/apply
 */
export interface IRegenerationApplyResponse {
  specification: ISpecDocument;
  copiedQuestionCount: number;
  newQuestionCount: number;
}

/**
 * UI type for proposed changes in regeneration modal
 */
export interface IProposedChange {
  section: string;
  currentValue: string | string[] | null;
  proposedValue: string | string[] | null;
  changeType: ChangeType;
  reason: string;
}

/**
 * UI type for regeneration preview data used by modal components
 */
export interface IRegenerationPreview {
  currentVersion: number;
  nextVersion: number;
  contextSummary: {
    resolvedCommentsCount: number;
    answeredQuestionsCount: number;
    sectionsWithFeedback: string[];
  };
  proposedChanges: IProposedChange[];
  fullProposedSpec: ISpecDocument;
  regenerationSummary: string;
  newOpenQuestions: string[];
}

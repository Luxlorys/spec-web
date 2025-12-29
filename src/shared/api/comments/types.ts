/**
 * Section types for comments
 */
export type SectionType =
  | 'overview'
  | 'problemStatement'
  | 'userStories'
  | 'acceptanceCriteria'
  | 'scopeIncluded'
  | 'scopeExcluded'
  | 'technicalConsiderations';

/**
 * Comment author information
 */
export interface ICommentAuthor {
  id: number;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
}

/**
 * Comment entity from API
 */
export interface IComment {
  id: number;
  specificationId: number;
  sectionType: SectionType;
  content: string;
  authorId: number;
  author: ICommentAuthor;
  createdAt: string;
  updatedAt: string;
}

/**
 * Comments grouped by section type
 */
export interface ICommentsBySection {
  overview: IComment[];
  problemStatement: IComment[];
  userStories: IComment[];
  acceptanceCriteria: IComment[];
  scopeIncluded: IComment[];
  scopeExcluded: IComment[];
  technicalConsiderations: IComment[];
}

// ============================================================================
// Request Types
// ============================================================================

/**
 * Request to create a new comment
 * POST /api/comments/:specificationId
 */
export interface ICreateCommentRequest {
  sectionType: SectionType;
  content: string;
}

/**
 * Request to edit a comment
 * POST /api/comments/:specificationId/:commentId
 */
export interface IEditCommentRequest {
  content: string;
}

// ============================================================================
// Response Types
// ============================================================================

/**
 * Response from GET /api/comments/:specificationId
 */
export interface IGetCommentsResponse {
  comments: ICommentsBySection;
}

/**
 * Response from POST /api/comments/:specificationId (create)
 * Response from POST /api/comments/:specificationId/:commentId (edit)
 */
export interface ICommentResponse {
  comment: IComment;
}

/**
 * Response from DELETE /api/comments/:specificationId/:commentId
 */
export interface IDeleteCommentResponse {
  success: boolean;
}

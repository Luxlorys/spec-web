/**
 * Feature status enum matching API
 */
export type FeatureStatus =
  | 'DRAFT'
  | 'SPEC_GENERATED'
  | 'READY_TO_BUILD'
  | 'COMPLETED'
  | 'ARCHIVED';

/**
 * User reference in feature responses
 */
export interface ICreatedBy {
  id: number;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
}

/**
 * Feature request entity from API
 */
export interface IFeatureRequest {
  id: number;
  title: string;
  initialContext: string | null;
  contextFeatureId: number | null;
  status: FeatureStatus;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: ICreatedBy;
}

/**
 * Simplified feature for context reference
 */
export interface IContextFeature {
  id: number;
  title: string;
  status: FeatureStatus;
}

/**
 * Request body for creating a feature
 * POST /features
 */
export interface ICreateFeatureRequest {
  idea: string;
  contextFeatureId?: number;
}

/**
 * Request body for updating feature status
 * PATCH /features/:id/status
 */
export interface IUpdateFeatureStatusRequest {
  status: FeatureStatus;
}

/**
 * Filters for fetching features
 * GET /features?status=...&search=...&page=...&limit=...
 */
export interface IFeatureRequestFilters {
  status?: FeatureStatus;
  search?: string;
  page?: number;
  limit?: number;
}

/**
 * Paginated response for feature list
 */
export interface IFeatureListResponse {
  features: IFeatureRequest[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Response for single feature
 */
export interface IGetFeatureResponse {
  feature: IFeatureRequest;
}

/**
 * Response for create feature
 */
export interface ICreateFeatureResponse {
  feature: IFeatureRequest;
}

/**
 * Response for update feature status
 */
export interface IUpdateFeatureStatusResponse {
  feature: IFeatureRequest;
}

/**
 * Response for delete feature
 */
export interface IDeleteFeatureResponse {
  success: boolean;
}

/**
 * Request body for updating context feature
 * PATCH /features/:id/context-feature
 */
export interface IUpdateContextFeatureRequest {
  contextFeatureId: number | null;
}

/**
 * Response for update context feature
 */
export interface IUpdateContextFeatureResponse {
  feature: IFeatureRequest;
}

// ============================================================================
// Activity types
// ============================================================================

/**
 * Activity event types
 */
export type SpecificationEventType =
  | 'SPEC_CREATED'
  | 'SPEC_REGENERATED'
  | 'COMMENT_ADDED'
  | 'COMMENT_RESOLVED'
  | 'OPEN_QUESTION_ASKED'
  | 'OPEN_QUESTION_ANSWERED'
  | 'OPEN_QUESTION_RESOLVED'
  | 'STATUS_CHANGED'
  | 'VERSION_CREATED';

/**
 * Actor who performed the activity
 */
export interface IActivityActor {
  id: number;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
}

/**
 * Metadata for SPEC_CREATED event
 */
export interface ISpecCreatedMetadata {
  featureTitle: string;
}

/**
 * Metadata for SPEC_REGENERATED event
 */
export interface ISpecRegeneratedMetadata {
  reason?: string;
  fromVersion: number;
  toVersion: number;
}

/**
 * Metadata for COMMENT_ADDED event
 */
export interface ICommentAddedMetadata {
  commentId: number;
  sectionType: string;
  commentPreview?: string;
}

/**
 * Metadata for COMMENT_RESOLVED event
 */
export interface ICommentResolvedMetadata {
  commentId: number;
  sectionType: string;
}

/**
 * Metadata for OPEN_QUESTION_ASKED event
 */
export interface IOpenQuestionAskedMetadata {
  questionId: number;
  questionText: string;
}

/**
 * Metadata for OPEN_QUESTION_ANSWERED event
 */
export interface IOpenQuestionAnsweredMetadata {
  questionId: number;
  answerId: number;
  answerPreview?: string;
}

/**
 * Metadata for OPEN_QUESTION_RESOLVED event
 */
export interface IOpenQuestionResolvedMetadata {
  questionId: number;
  acceptedAnswerId: number;
}

/**
 * Metadata for STATUS_CHANGED event
 */
export interface IStatusChangedMetadata {
  previousStatus: FeatureStatus;
  newStatus: FeatureStatus;
}

/**
 * Metadata for VERSION_CREATED event
 */
export interface IVersionCreatedMetadata {
  version: number;
  changeDescription?: string;
}

/**
 * Base activity fields
 */
interface IBaseActivity {
  id: number;
  createdAt: string;
  actor: IActivityActor;
}

/**
 * Discriminated union for all activity types
 */
export type IActivity =
  | (IBaseActivity & {
      eventType: 'SPEC_CREATED';
      metadata: ISpecCreatedMetadata;
    })
  | (IBaseActivity & {
      eventType: 'SPEC_REGENERATED';
      metadata: ISpecRegeneratedMetadata;
    })
  | (IBaseActivity & {
      eventType: 'COMMENT_ADDED';
      metadata: ICommentAddedMetadata;
    })
  | (IBaseActivity & {
      eventType: 'COMMENT_RESOLVED';
      metadata: ICommentResolvedMetadata;
    })
  | (IBaseActivity & {
      eventType: 'OPEN_QUESTION_ASKED';
      metadata: IOpenQuestionAskedMetadata;
    })
  | (IBaseActivity & {
      eventType: 'OPEN_QUESTION_ANSWERED';
      metadata: IOpenQuestionAnsweredMetadata;
    })
  | (IBaseActivity & {
      eventType: 'OPEN_QUESTION_RESOLVED';
      metadata: IOpenQuestionResolvedMetadata;
    })
  | (IBaseActivity & {
      eventType: 'STATUS_CHANGED';
      metadata: IStatusChangedMetadata;
    })
  | (IBaseActivity & {
      eventType: 'VERSION_CREATED';
      metadata: IVersionCreatedMetadata;
    });

/**
 * Response for get activities
 */
export interface IGetActivitiesResponse {
  activities: IActivity[];
}

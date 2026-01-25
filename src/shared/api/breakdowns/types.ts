import { FeatureStatus, ICreatedBy } from '../feature-requests/types';

/**
 * Breakdown status enum
 */
export type BreakdownStatus =
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'PARTIALLY_SPECIFIED'
  | 'FULLY_SPECIFIED';

/**
 * Feature priority in breakdown
 */
export type FeaturePriority = 'P0' | 'P1' | 'P2';

/**
 * Feature complexity estimate
 */
export type FeatureComplexity = 'S' | 'M' | 'L';

/**
 * A proposed feature within a breakdown
 */
export interface IBreakdownFeature {
  id: string; // Temporary ID before creation (uuid)
  title: string;
  description: string;
  priority: FeaturePriority;
  complexity: FeatureComplexity;
  dependencies: string[]; // IDs of features this depends on
  isSelected: boolean; // Whether user wants to create this feature
  hasEnoughContext: boolean; // AI thinks spec can be auto-generated
  contextFeatureId?: number; // Link to existing feature for context
  featureRequestId?: number; // Linked feature after creation
  featureStatus?: FeatureStatus; // Status of linked feature
}

/**
 * Breakdown entity from API
 */
export interface IBreakdown {
  id: number;
  title: string;
  vision: string;
  status: BreakdownStatus;
  features: IBreakdownFeature[];
  createdAt: string;
  updatedAt: string;
  createdBy: ICreatedBy;
}

/**
 * Request body for creating a breakdown
 * POST /breakdowns
 */
export interface ICreateBreakdownRequest {
  vision: string;
}

/**
 * Response for create breakdown
 */
export interface ICreateBreakdownResponse {
  breakdown: IBreakdown;
}

/**
 * Request body for analyzing text to detect if it's multiple features
 * POST /breakdowns/analyze
 */
export interface IAnalyzeTextRequest {
  text: string;
}

/**
 * Response for analyze text
 */
export interface IAnalyzeTextResponse {
  isMultipleFeatures: boolean;
  confidence: number; // 0-1
  suggestedFeatureCount: number;
  reasoning: string;
}

/**
 * Request body for generating breakdown features from vision
 * POST /breakdowns/:id/generate
 */
export interface IGenerateBreakdownRequest {
  vision: string;
}

/**
 * Response for generate breakdown
 */
export interface IGenerateBreakdownResponse {
  features: IBreakdownFeature[];
}

/**
 * Request body for updating breakdown features
 * PATCH /breakdowns/:id/features
 */
export interface IUpdateBreakdownFeaturesRequest {
  features: IBreakdownFeature[];
}

/**
 * Response for update breakdown features
 */
export interface IUpdateBreakdownFeaturesResponse {
  breakdown: IBreakdown;
}

/**
 * Request body for creating features from breakdown
 * POST /breakdowns/:id/create-features
 */
export interface ICreateFeaturesFromBreakdownRequest {
  featureIds: string[]; // IDs of breakdown features to create
}

/**
 * Response for create features from breakdown
 */
export interface ICreateFeaturesFromBreakdownResponse {
  breakdown: IBreakdown;
  createdFeatureIds: number[];
}

/**
 * Filters for fetching breakdowns
 */
export interface IBreakdownFilters {
  status?: BreakdownStatus;
  search?: string;
  page?: number;
  limit?: number;
}

/**
 * Paginated response for breakdown list
 */
export interface IBreakdownListResponse {
  breakdowns: IBreakdown[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Response for single breakdown
 */
export interface IGetBreakdownResponse {
  breakdown: IBreakdown;
}

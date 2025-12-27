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
 * API response wrapper for specification
 */
export interface IGetSpecificationResponse {
  specification: ISpecDocument;
}

// ============================================================================
// Legacy types - kept for backward compatibility with unused components
// These will be removed when the corresponding features are implemented
// ============================================================================

/**
 * @deprecated Legacy type - will be updated when acceptance criteria feature is implemented
 */
export interface IAcceptanceCriteria {
  id: string;
  description: string;
  completed: boolean;
}

/**
 * @deprecated Legacy type - will be updated when open questions feature is implemented
 */
export interface IOpenQuestion {
  id: string;
  question: string;
  answer?: string;
  askedBy: string;
  answeredBy?: string;
  resolved: boolean;
}

/**
 * @deprecated Legacy type - will be updated when edge cases feature is implemented
 */
export interface IEdgeCase {
  scenario: string;
  expectedBehavior: string;
}

/**
 * @deprecated Legacy type - will be updated when version history feature is implemented
 */
export interface ISpecVersion {
  id: string;
  specDocumentId: string;
  version: number;
  snapshot: Record<string, unknown>;
  changeDescription: string;
  createdBy: string;
  createdAt: Date;
}

/**
 * @deprecated Legacy type - will be updated when regeneration feature is implemented
 */
export interface IProposedChange {
  section: string;
  currentValue: unknown;
  proposedValue: unknown;
  changeType: 'modified' | 'added' | 'removed' | 'unchanged';
  reason: string;
}

/**
 * @deprecated Legacy type - will be updated when regeneration feature is implemented
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
}

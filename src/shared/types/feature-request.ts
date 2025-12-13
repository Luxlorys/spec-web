export type FeatureStatus =
  | 'draft'
  | 'intake_in_progress'
  | 'spec_generated'
  | 'under_review'
  | 'ready_to_build'
  | 'in_progress'
  | 'complete';

export interface IFeatureRequest {
  id: string;
  title: string;
  organizationId: string;
  createdBy: string;
  assignedTo?: string;
  status: FeatureStatus;
  initialContext?: string;
  conversationId?: string;
  specDocumentId?: string;
  targetDate?: Date;
  openQuestionsCount: number;
  lastActivityAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateFeatureRequest {
  title: string;
  initialContext?: string;
}

export interface IUpdateFeatureRequest {
  title?: string;
  status?: FeatureStatus;
  assignedTo?: string;
  targetDate?: Date;
}

export interface IFeatureRequestFilters {
  status?: FeatureStatus;
  assignedTo?: string;
  search?: string;
}

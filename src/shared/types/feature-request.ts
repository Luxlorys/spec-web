export type FeatureStatus =
  | 'draft'
  | 'spec_generated'
  | 'ready_to_build'
  | 'in_progress'
  | 'review'
  | 'ready';

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

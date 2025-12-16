export interface IAcceptanceCriteria {
  id: string;
  description: string;
  completed: boolean;
}

export interface IOpenQuestion {
  id: string;
  question: string;
  answer?: string;
  askedBy: string;
  answeredBy?: string;
  resolved: boolean;
}

export interface IEdgeCase {
  scenario: string;
  expectedBehavior: string;
}

export interface ISpecDocument {
  id: string;
  featureRequestId: string;
  overview: string;
  problemStatement: string;
  userStories: string[];
  acceptanceCriteria: IAcceptanceCriteria[];
  scopeIncluded: string[];
  scopeExcluded: string[];
  technicalConsiderations: string[];
  openQuestions: IOpenQuestion[];
  edgeCases: IEdgeCase[];
  assumptions: string[];
  version: number;
  generatedAt: Date;
  updatedAt: Date;
}

export interface IUpdateSpecSection {
  section: keyof Pick<
    ISpecDocument,
    | 'overview'
    | 'problemStatement'
    | 'userStories'
    | 'scopeIncluded'
    | 'scopeExcluded'
    | 'technicalConsiderations'
    | 'assumptions'
  >;
  value: string | string[];
}

// Version history types for spec regeneration
export interface ISpecVersion {
  id: string;
  specDocumentId: string;
  version: number;
  snapshot: Omit<ISpecDocument, 'id' | 'featureRequestId' | 'version'>;
  changeDescription: string;
  createdBy: string;
  createdAt: Date;
}

export interface IProposedChange {
  section: string;
  currentValue: string | string[] | IAcceptanceCriteria[] | IEdgeCase[] | any;
  proposedValue: string | string[] | IAcceptanceCriteria[] | IEdgeCase[] | any;
  changeType: 'modified' | 'added' | 'removed' | 'unchanged';
  reason: string;
}

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

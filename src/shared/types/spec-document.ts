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

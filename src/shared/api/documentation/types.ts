// ============================================================================
// Documentation Entity Types
// ============================================================================

export interface IDocumentationUserPersona {
  name: string;
  description: string;
  goals: string[];
  painPoints: string[];
}

export interface IDocumentationFeature {
  id: number;
  title: string;
  overview: string;
}

export interface IGlossaryTerm {
  term: string;
  definition: string;
  context?: string;
}

export interface IDocumentationContent {
  executiveSummary: {
    productOverview: string;
    valueProposition: string;
    targetAudience: string;
  };
  productContext: {
    vision: string;
    targetMarket: string;
    userPersonas: IDocumentationUserPersona[];
  };
  featureCatalog: IDocumentationFeature[];
  glossary: IGlossaryTerm[];
}

// ============================================================================
// Response Types
// ============================================================================

export interface IGetDocumentationResponse {
  documentation: IDocumentationContent | null;
  updatedAt: string | null;
  completedFeatureCount: number;
  canRegenerate: boolean;
  isPending: boolean;
}

export interface IRegenerateDocumentationResponse {
  documentation: IDocumentationContent;
  updatedAt: string;
  completedFeatureCount: number;
  canRegenerate: boolean;
  isPending: boolean;
}

import {
  ISpecDocument,
  IUpdateSpecSection,
  IOpenQuestion,
  IRegenerationPreview,
  ISpecVersion,
  IProposedChange,
} from 'shared/types';
import { delay, generateId } from 'shared/lib';
import { mockSpecDocuments, mockFeatureRequests, mockSpecVersionHistory } from 'shared/lib/mock-data';
import { mockComments } from 'shared/lib/mock-data/comments';
import { generateRegeneratedSpec } from 'shared/lib/mock-data/ai-responses';

export interface ICreateOpenQuestionRequest {
  question: string;
}

export interface IUpdateOpenQuestionRequest {
  question?: string;
  answer?: string;
  resolved?: boolean;
}

export const specDocumentsApi = {
  getByFeatureId: async (featureId: string): Promise<ISpecDocument | null> => {
    await delay(300);

    const spec = mockSpecDocuments.find(s => s.featureRequestId === featureId);
    return spec || null;
  },

  generateFromConversation: async (featureId: string): Promise<ISpecDocument> => {
    await delay(2000); // Simulate generation time

    const feature = mockFeatureRequests.find(f => f.id === featureId);
    if (!feature) throw new Error('Feature not found');

    const specId = generateId();

    // Mock spec generation - in real app, this would use AI to parse conversation
    const newSpec: ISpecDocument = {
      id: specId,
      featureRequestId: featureId,
      overview: `This feature will ${feature.title.toLowerCase()} for the users.`,
      problemStatement: `Users currently face challenges that this feature will address.`,
      userStories: [
        `As a user, I want to ${feature.title.toLowerCase()} so that I can improve my workflow`,
      ],
      acceptanceCriteria: [
        {
          id: generateId(),
          description: 'Given the feature is implemented, when user interacts, then it should work',
          completed: false,
        },
      ],
      scopeIncluded: ['Core functionality', 'Basic user interface'],
      scopeExcluded: ['Advanced features for v2', 'Third-party integrations'],
      technicalConsiderations: ['API design', 'Database schema', 'Frontend implementation'],
      openQuestions: [],
      edgeCases: [
        {
          scenario: 'User performs unexpected action',
          expectedBehavior: 'System handles gracefully',
        },
      ],
      assumptions: ['Users have necessary permissions', 'System has required dependencies'],
      version: 1,
      generatedAt: new Date(),
      updatedAt: new Date(),
    };

    mockSpecDocuments.push(newSpec);

    // Update feature request
    const featureIndex = mockFeatureRequests.findIndex(f => f.id === featureId);
    if (featureIndex !== -1) {
      mockFeatureRequests[featureIndex] = {
        ...mockFeatureRequests[featureIndex],
        specDocumentId: specId,
        status: 'spec_generated',
        updatedAt: new Date(),
      };
    }

    return newSpec;
  },

  updateSection: async (
    specId: string,
    update: IUpdateSpecSection,
  ): Promise<ISpecDocument> => {
    await delay(400);

    const index = mockSpecDocuments.findIndex(s => s.id === specId);
    if (index === -1) throw new Error('Spec not found');

    const updated = {
      ...mockSpecDocuments[index],
      [update.section]: update.value,
      version: mockSpecDocuments[index].version + 1,
      updatedAt: new Date(),
    };

    mockSpecDocuments[index] = updated;

    return updated;
  },

  createOpenQuestion: async (
    specId: string,
    data: ICreateOpenQuestionRequest,
  ): Promise<IOpenQuestion> => {
    await delay(300);

    const specIndex = mockSpecDocuments.findIndex(s => s.id === specId);
    if (specIndex === -1) throw new Error('Spec not found');

    const newQuestion: IOpenQuestion = {
      id: generateId(),
      question: data.question.trim(),
      askedBy: 'user-1', // Mock current user
      resolved: false,
    };

    mockSpecDocuments[specIndex].openQuestions.push(newQuestion);
    mockSpecDocuments[specIndex].updatedAt = new Date();

    return newQuestion;
  },

  updateOpenQuestion: async (
    specId: string,
    questionId: string,
    data: IUpdateOpenQuestionRequest,
  ): Promise<IOpenQuestion> => {
    await delay(300);

    const specIndex = mockSpecDocuments.findIndex(s => s.id === specId);
    if (specIndex === -1) throw new Error('Spec not found');

    const questionIndex = mockSpecDocuments[specIndex].openQuestions.findIndex(
      q => q.id === questionId,
    );
    if (questionIndex === -1) throw new Error('Question not found');

    const currentQuestion = mockSpecDocuments[specIndex].openQuestions[questionIndex];

    const updatedQuestion: IOpenQuestion = {
      ...currentQuestion,
      ...(data.question !== undefined && { question: data.question.trim() }),
      ...(data.answer !== undefined && {
        answer: data.answer.trim(),
        answeredBy: data.answer.trim() ? 'user-1' : undefined,
      }),
      ...(data.resolved !== undefined && { resolved: data.resolved }),
    };

    mockSpecDocuments[specIndex].openQuestions[questionIndex] = updatedQuestion;
    mockSpecDocuments[specIndex].updatedAt = new Date();

    return updatedQuestion;
  },

  deleteOpenQuestion: async (specId: string, questionId: string): Promise<void> => {
    await delay(300);

    const specIndex = mockSpecDocuments.findIndex(s => s.id === specId);
    if (specIndex === -1) throw new Error('Spec not found');

    const questionIndex = mockSpecDocuments[specIndex].openQuestions.findIndex(
      q => q.id === questionId,
    );
    if (questionIndex === -1) throw new Error('Question not found');

    mockSpecDocuments[specIndex].openQuestions.splice(questionIndex, 1);
    mockSpecDocuments[specIndex].updatedAt = new Date();
  },

  /**
   * Preview what changes would be made if spec is regenerated from discussions
   */
  previewRegeneration: async (specId: string): Promise<IRegenerationPreview> => {
    await delay(1500); // Simulate AI processing

    const spec = mockSpecDocuments.find(s => s.id === specId);
    if (!spec) throw new Error('Spec not found');

    // Gather resolved comments and answered questions
    const resolvedComments = mockComments.filter(
      c => c.specDocumentId === specId && c.resolved
    );

    const answeredQuestions = spec.openQuestions.filter(
      q => q.answer && q.answer.trim().length > 0
    );

    // Get unique sections with feedback
    const sectionsWithFeedback = [...new Set(resolvedComments.map(c => c.section))];

    // Generate proposed changes using mock AI
    const proposedChanges = generateRegeneratedSpec(spec, resolvedComments, answeredQuestions);

    // Build full proposed spec by applying changes
    const fullProposedSpec: ISpecDocument = { ...spec };
    proposedChanges.forEach(change => {
      if (change.changeType !== 'unchanged') {
        (fullProposedSpec as any)[change.section] = change.proposedValue;
      }
    });

    return {
      currentVersion: spec.version,
      nextVersion: spec.version + 1,
      contextSummary: {
        resolvedCommentsCount: resolvedComments.length,
        answeredQuestionsCount: answeredQuestions.length,
        sectionsWithFeedback,
      },
      proposedChanges,
      fullProposedSpec,
    };
  },

  /**
   * Commit the regeneration and create new version
   */
  commitRegeneration: async (
    specId: string,
    proposedSpec: ISpecDocument
  ): Promise<ISpecDocument> => {
    await delay(800);

    const index = mockSpecDocuments.findIndex(s => s.id === specId);
    if (index === -1) throw new Error('Spec not found');

    const currentSpec = mockSpecDocuments[index];

    // Create version snapshot of current state
    const versionSnapshot: ISpecVersion = {
      id: generateId(),
      specDocumentId: specId,
      version: currentSpec.version,
      snapshot: {
        overview: currentSpec.overview,
        problemStatement: currentSpec.problemStatement,
        userStories: currentSpec.userStories,
        acceptanceCriteria: currentSpec.acceptanceCriteria,
        scopeIncluded: currentSpec.scopeIncluded,
        scopeExcluded: currentSpec.scopeExcluded,
        technicalConsiderations: currentSpec.technicalConsiderations,
        openQuestions: currentSpec.openQuestions,
        edgeCases: currentSpec.edgeCases,
        assumptions: currentSpec.assumptions,
        generatedAt: currentSpec.generatedAt,
        updatedAt: currentSpec.updatedAt,
      },
      changeDescription: 'Regenerated from discussions',
      createdBy: 'user-1', // Mock current user
      createdAt: new Date(),
    };

    mockSpecVersionHistory.push(versionSnapshot);

    // Update spec with new content
    const updated: ISpecDocument = {
      ...proposedSpec,
      id: specId,
      featureRequestId: currentSpec.featureRequestId,
      version: currentSpec.version + 1,
      updatedAt: new Date(),
    };

    mockSpecDocuments[index] = updated;

    // Mark answered questions as resolved
    updated.openQuestions.forEach(q => {
      if (q.answer && q.answer.trim().length > 0) {
        q.resolved = true;
      }
    });

    return updated;
  },

  /**
   * Get version history for a spec
   */
  getVersionHistory: async (specId: string): Promise<ISpecVersion[]> => {
    await delay(300);

    return mockSpecVersionHistory
      .filter(v => v.specDocumentId === specId)
      .sort((a, b) => b.version - a.version); // Newest first
  },

  /**
   * Rollback to a previous version
   */
  rollbackToVersion: async (specId: string, targetVersion: number): Promise<ISpecDocument> => {
    await delay(500);

    const index = mockSpecDocuments.findIndex(s => s.id === specId);
    if (index === -1) throw new Error('Spec not found');

    const versionSnapshot = mockSpecVersionHistory.find(
      v => v.specDocumentId === specId && v.version === targetVersion
    );
    if (!versionSnapshot) throw new Error('Version not found');

    const currentSpec = mockSpecDocuments[index];

    // Create snapshot of current state before rollback
    const rollbackSnapshot: ISpecVersion = {
      id: generateId(),
      specDocumentId: specId,
      version: currentSpec.version,
      snapshot: {
        overview: currentSpec.overview,
        problemStatement: currentSpec.problemStatement,
        userStories: currentSpec.userStories,
        acceptanceCriteria: currentSpec.acceptanceCriteria,
        scopeIncluded: currentSpec.scopeIncluded,
        scopeExcluded: currentSpec.scopeExcluded,
        technicalConsiderations: currentSpec.technicalConsiderations,
        openQuestions: currentSpec.openQuestions,
        edgeCases: currentSpec.edgeCases,
        assumptions: currentSpec.assumptions,
        generatedAt: currentSpec.generatedAt,
        updatedAt: currentSpec.updatedAt,
      },
      changeDescription: `Rolled back to v${targetVersion}`,
      createdBy: 'user-1',
      createdAt: new Date(),
    };

    mockSpecVersionHistory.push(rollbackSnapshot);

    // Restore from snapshot with incremented version
    const restored: ISpecDocument = {
      id: specId,
      featureRequestId: currentSpec.featureRequestId,
      ...versionSnapshot.snapshot,
      version: currentSpec.version + 1,
      updatedAt: new Date(),
    };

    mockSpecDocuments[index] = restored;

    return restored;
  },
};

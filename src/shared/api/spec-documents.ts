import { ISpecDocument, IUpdateSpecSection, IOpenQuestion } from 'shared/types';
import { delay, generateId } from 'shared/lib';
import { mockSpecDocuments, mockFeatureRequests } from 'shared/lib/mock-data';

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
};

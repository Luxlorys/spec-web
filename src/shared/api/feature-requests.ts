import { delay, generateId } from 'shared/lib';
import {
  mockConversations,
  mockFeatureRequests,
  mockSpecDocuments,
} from 'shared/lib/mock-data';
import {
  ICreateFeatureRequest,
  IFeatureRequest,
  IFeatureRequestFilters,
  IUpdateFeatureRequest,
} from 'shared/types';

export const featureRequestsApi = {
  getAll: async (
    filters?: IFeatureRequestFilters,
  ): Promise<IFeatureRequest[]> => {
    await delay(300);

    let results = [...mockFeatureRequests];

    // Apply filters
    if (filters?.status) {
      results = results.filter(f => f.status === filters.status);
    }

    if (filters?.assignedTo) {
      results = results.filter(f => f.assignedTo === filters.assignedTo);
    }

    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();

      results = results.filter(
        f =>
          f.title.toLowerCase().includes(searchLower) ||
          f.initialContext?.toLowerCase().includes(searchLower),
      );
    }

    // Sort by last activity (most recent first)
    results.sort(
      (a, b) => b.lastActivityAt.getTime() - a.lastActivityAt.getTime(),
    );

    return results;
  },

  getById: async (id: string): Promise<IFeatureRequest> => {
    await delay(200);

    const feature = mockFeatureRequests.find(f => f.id === id);

    if (!feature) {
      throw new Error('Feature request not found');
    }

    return feature;
  },

  create: async (data: ICreateFeatureRequest): Promise<IFeatureRequest> => {
    await delay(500);

    const newFeature: IFeatureRequest = {
      id: generateId(),
      ...data,
      organizationId: 'org-1', // Mock: Use current user's org
      createdBy: 'user-1', // Mock: Use current user
      status: 'draft',
      openQuestionsCount: 0,
      lastActivityAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockFeatureRequests.unshift(newFeature);

    return newFeature;
  },

  update: async (
    id: string,
    data: IUpdateFeatureRequest,
  ): Promise<IFeatureRequest> => {
    await delay(400);

    const index = mockFeatureRequests.findIndex(f => f.id === id);

    if (index === -1) {
      throw new Error('Feature request not found');
    }

    const updated = {
      ...mockFeatureRequests[index],
      ...data,
      updatedAt: new Date(),
      lastActivityAt: new Date(),
    };

    mockFeatureRequests[index] = updated;

    return updated;
  },

  delete: async (id: string): Promise<void> => {
    await delay(300);

    const index = mockFeatureRequests.findIndex(f => f.id === id);

    if (index === -1) {
      throw new Error('Feature request not found');
    }

    mockFeatureRequests.splice(index, 1);

    // Also remove related conversation and spec
    const convIndex = mockConversations.findIndex(
      c => c.featureRequestId === id,
    );

    if (convIndex !== -1) {
      mockConversations.splice(convIndex, 1);
    }

    const specIndex = mockSpecDocuments.findIndex(
      s => s.featureRequestId === id,
    );

    if (specIndex !== -1) {
      mockSpecDocuments.splice(specIndex, 1);
    }
  },
};

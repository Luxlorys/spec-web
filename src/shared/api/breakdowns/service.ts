import {
  analyzeTextForBreakdown,
  generateId,
  generateMockFeatures,
} from './mock-data';
import {
  IAnalyzeTextRequest,
  IAnalyzeTextResponse,
  IBreakdown,
  IBreakdownFeature,
  IBreakdownFilters,
  IBreakdownListResponse,
  ICreateBreakdownRequest,
  ICreateFeaturesFromBreakdownRequest,
  ICreateFeaturesFromBreakdownResponse,
  IUpdateBreakdownFeaturesRequest,
} from './types';

/**
 * In-memory store for mock breakdowns
 */
const mockBreakdowns: IBreakdown[] = [];
let nextBreakdownId = 1;

/**
 * Simulate API delay
 */
const delay = (ms: number) =>
  new Promise<void>(resolve => {
    setTimeout(resolve, ms);
  });

/**
 * Mock user for created by
 */
const mockUser = {
  id: 1,
  firstName: 'Sarah',
  lastName: 'Chen',
  avatarUrl: null,
};

export const breakdownsApi = {
  /**
   * Analyze text to detect if it should be a breakdown
   * POST /breakdowns/analyze
   */
  analyze: async (
    request: IAnalyzeTextRequest,
  ): Promise<IAnalyzeTextResponse> => {
    await delay(500); // Simulate AI processing

    return analyzeTextForBreakdown(request.text);
  },

  /**
   * Create a new breakdown
   * POST /breakdowns
   */
  create: async (request: ICreateBreakdownRequest): Promise<IBreakdown> => {
    await delay(300);

    nextBreakdownId += 1;

    const breakdown: IBreakdown = {
      id: nextBreakdownId,
      title: extractTitle(request.vision),
      vision: request.vision,
      status: 'IN_PROGRESS',
      features: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: mockUser,
    };

    mockBreakdowns.push(breakdown);

    return breakdown;
  },

  /**
   * Generate features for a breakdown
   * POST /breakdowns/:id/generate
   */
  generateFeatures: async (id: number): Promise<IBreakdownFeature[]> => {
    await delay(1500); // Simulate AI processing

    const breakdown = mockBreakdowns.find(b => b.id === id);

    if (!breakdown) {
      throw new Error('Breakdown not found');
    }

    const features = generateMockFeatures(breakdown.vision);

    breakdown.features = features;
    breakdown.updatedAt = new Date().toISOString();

    return features;
  },

  /**
   * Get breakdown by ID
   * GET /breakdowns/:id
   */
  getById: async (id: number): Promise<IBreakdown> => {
    await delay(200);

    const breakdown = mockBreakdowns.find(b => b.id === id);

    if (!breakdown) {
      throw new Error('Breakdown not found');
    }

    return breakdown;
  },

  /**
   * Get paginated list of breakdowns
   * GET /breakdowns
   */
  getAll: async (
    filters?: IBreakdownFilters,
  ): Promise<IBreakdownListResponse> => {
    await delay(200);

    let filtered = [...mockBreakdowns];

    if (filters?.status) {
      filtered = filtered.filter(b => b.status === filters.status);
    }

    if (filters?.search) {
      const search = filters.search.toLowerCase();

      filtered = filtered.filter(
        b =>
          b.title.toLowerCase().includes(search) ||
          b.vision.toLowerCase().includes(search),
      );
    }

    const page = filters?.page || 1;
    const limit = filters?.limit || 10;
    const start = (page - 1) * limit;
    const end = start + limit;

    return {
      breakdowns: filtered.slice(start, end),
      total: filtered.length,
      page,
      limit,
      totalPages: Math.ceil(filtered.length / limit),
    };
  },

  /**
   * Update breakdown features
   * PATCH /breakdowns/:id/features
   */
  updateFeatures: async (
    id: number,
    request: IUpdateBreakdownFeaturesRequest,
  ): Promise<IBreakdown> => {
    await delay(300);

    const breakdown = mockBreakdowns.find(b => b.id === id);

    if (!breakdown) {
      throw new Error('Breakdown not found');
    }

    breakdown.features = request.features;
    breakdown.updatedAt = new Date().toISOString();

    return breakdown;
  },

  /**
   * Create features from breakdown
   * POST /breakdowns/:id/create-features
   */
  createFeatures: async (
    id: number,
    request: ICreateFeaturesFromBreakdownRequest,
  ): Promise<ICreateFeaturesFromBreakdownResponse> => {
    await delay(800);

    const breakdown = mockBreakdowns.find(b => b.id === id);

    if (!breakdown) {
      throw new Error('Breakdown not found');
    }

    // Simulate creating features and linking them
    const createdFeatureIds: number[] = [];
    let nextFeatureId = 100 + Math.floor(Math.random() * 900);

    breakdown.features = breakdown.features.map(feature => {
      if (request.featureIds.includes(feature.id)) {
        const featureId = nextFeatureId;

        nextFeatureId += 1;

        createdFeatureIds.push(featureId);

        return {
          ...feature,
          featureRequestId: featureId,
          featureStatus: 'DRAFT' as const,
        };
      }

      return feature;
    });

    breakdown.status = 'COMPLETED';
    breakdown.updatedAt = new Date().toISOString();

    return {
      breakdown,
      createdFeatureIds,
    };
  },

  /**
   * Add a new feature to breakdown
   */
  addFeature: async (
    id: number,
    feature: Omit<IBreakdownFeature, 'id'>,
  ): Promise<IBreakdown> => {
    await delay(200);

    const breakdown = mockBreakdowns.find(b => b.id === id);

    if (!breakdown) {
      throw new Error('Breakdown not found');
    }

    const newFeature: IBreakdownFeature = {
      ...feature,
      id: generateId(),
    };

    breakdown.features.push(newFeature);
    breakdown.updatedAt = new Date().toISOString();

    return breakdown;
  },

  /**
   * Remove a feature from breakdown
   */
  removeFeature: async (id: number, featureId: string): Promise<IBreakdown> => {
    await delay(200);

    const breakdown = mockBreakdowns.find(b => b.id === id);

    if (!breakdown) {
      throw new Error('Breakdown not found');
    }

    breakdown.features = breakdown.features.filter(f => f.id !== featureId);
    breakdown.updatedAt = new Date().toISOString();

    return breakdown;
  },

  /**
   * Delete breakdown
   * DELETE /breakdowns/:id
   */
  delete: async (id: number): Promise<boolean> => {
    await delay(200);

    const index = mockBreakdowns.findIndex(b => b.id === id);

    if (index === -1) {
      throw new Error('Breakdown not found');
    }

    mockBreakdowns.splice(index, 1);

    return true;
  },
};

/**
 * Extract a title from the vision text
 */
const extractTitle = (vision: string): string => {
  // Take first line or first sentence
  const firstLine = vision.split('\n')[0].trim();
  const firstSentence = firstLine.split(/[.!?]/)[0].trim();

  // Limit to reasonable length
  if (firstSentence.length > 60) {
    return `${firstSentence.substring(0, 57)}...`;
  }

  return firstSentence || 'Untitled Breakdown';
};

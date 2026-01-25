import { IBreakdown, IBreakdownFeature } from './types';

/**
 * Mock user for created by
 */
const mockUser = {
  id: 1,
  firstName: 'Sarah',
  lastName: 'Chen',
  avatarUrl: null,
};

/**
 * Generate a unique ID
 */
export const generateId = () => Math.random().toString(36).substring(2, 9);

/**
 * Mock breakdown for testing
 */
export const mockBreakdown: IBreakdown = {
  id: 1,
  title: 'Inventory Management Dashboard',
  vision: `I need a complete inventory management system for warehouse managers.

The system should allow users to:
- Track inventory levels in real-time
- Add, edit, and remove inventory items
- Set up low-stock alerts
- Generate inventory reports
- Manage multiple warehouse locations
- Handle user authentication and roles`,
  status: 'IN_PROGRESS',
  features: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  createdBy: mockUser,
};

/**
 * Generate mock features from a vision text
 * This simulates what the AI would return
 */
export const generateMockFeatures = (_vision: string): IBreakdownFeature[] => {
  // Simple mock - in reality this would be AI-generated based on _vision
  const features: IBreakdownFeature[] = [
    {
      id: generateId(),
      title: 'User Authentication',
      description:
        'Login, signup, password reset, and session management for warehouse staff',
      priority: 'P0',
      complexity: 'S',
      dependencies: [],
      isSelected: true,
      hasEnoughContext: false,
    },
    {
      id: generateId(),
      title: 'Dashboard Layout',
      description:
        'Main navigation, header, sidebar, and responsive page structure',
      priority: 'P0',
      complexity: 'S',
      dependencies: [],
      isSelected: true,
      hasEnoughContext: false,
    },
    {
      id: generateId(),
      title: 'Inventory List View',
      description:
        'Display inventory items with search, filtering, sorting, and pagination',
      priority: 'P1',
      complexity: 'M',
      dependencies: [],
      isSelected: true,
      hasEnoughContext: false,
    },
    {
      id: generateId(),
      title: 'Inventory Item CRUD',
      description:
        'Create, read, update, and delete inventory items with validation',
      priority: 'P1',
      complexity: 'M',
      dependencies: [],
      isSelected: true,
      hasEnoughContext: false,
    },
    {
      id: generateId(),
      title: 'Low Stock Alerts',
      description:
        'Configure threshold alerts and notifications when inventory runs low',
      priority: 'P2',
      complexity: 'M',
      dependencies: [],
      isSelected: true,
      hasEnoughContext: false,
    },
    {
      id: generateId(),
      title: 'Inventory Reports',
      description:
        'Generate and export inventory reports with charts and data exports',
      priority: 'P2',
      complexity: 'L',
      dependencies: [],
      isSelected: true,
      hasEnoughContext: false,
    },
  ];

  // Set dependencies after all IDs are created
  features[2].dependencies = [features[1].id]; // Inventory List depends on Dashboard
  features[3].dependencies = [features[2].id]; // CRUD depends on List
  features[4].dependencies = [features[2].id]; // Alerts depend on List
  features[5].dependencies = [features[2].id]; // Reports depend on List

  return features;
};

/**
 * Analyze text to determine if it's multiple features
 * This simulates AI analysis
 */
export const analyzeTextForBreakdown = (
  text: string,
): {
  isMultipleFeatures: boolean;
  confidence: number;
  suggestedFeatureCount: number;
  reasoning: string;
} => {
  const wordCount = text.split(/\s+/).length;
  const hasMultipleItems =
    text.includes('- ') || text.includes('• ') || text.includes('1.');
  const hasMultipleKeywords =
    (text.match(/\b(and|also|plus|additionally|as well as)\b/gi) || []).length >
    2;
  const mentionsMultipleFeatures =
    (
      text.match(
        /\b(authentication|dashboard|reports|settings|admin|user|crud|list|manage)\b/gi,
      ) || []
    ).length > 3;

  const isMultiple =
    wordCount > 80 ||
    hasMultipleItems ||
    hasMultipleKeywords ||
    mentionsMultipleFeatures;

  let suggestedCount = 1;

  if (isMultiple) {
    // Estimate feature count based on bullet points or keywords
    const bulletCount = (text.match(/^[-•*]\s/gm) || []).length;

    if (bulletCount > 0) {
      suggestedCount = Math.min(bulletCount, 8);
    } else {
      suggestedCount = Math.min(Math.ceil(wordCount / 30), 8);
    }
  }

  const confidence = isMultiple ? 0.85 : 0.7;

  return {
    isMultipleFeatures: isMultiple,
    confidence,
    suggestedFeatureCount: suggestedCount,
    reasoning: isMultiple
      ? `This description mentions ${suggestedCount} distinct capabilities that would work better as separate features.`
      : 'This looks like a focused, single feature request.',
  };
};

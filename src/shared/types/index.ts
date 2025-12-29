// Generic types
export * from './api';

// Mock/legacy types (kept for compatibility)
export * from './notification';
export * from './team';

// Re-export types from API services for backward compatibility
export * from '../api/auth/types';
export * from '../api/comments/types';
export * from '../api/conversations/types';
export * from '../api/feature-requests/types';
export * from '../api/specifications/types';

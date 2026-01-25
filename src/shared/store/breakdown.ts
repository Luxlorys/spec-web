import { create } from 'zustand';

import type {
  IAnalyzeFeatureTextResponse,
  IBreakdownFeatureItem,
} from 'shared/types';

/**
 * Extended breakdown feature with local selection state
 */
export interface IBreakdownFeatureWithSelection extends IBreakdownFeatureItem {
  isSelected: boolean;
  contextFeatureId?: number;
}

interface IBreakdownFlowState {
  // Input from the new feature page
  vision: string | null;
  analysisResult: IAnalyzeFeatureTextResponse | null;

  // Generated features with local state
  features: IBreakdownFeatureWithSelection[];

  // Actions
  startBreakdown: (
    vision: string,
    analysis: IAnalyzeFeatureTextResponse,
  ) => void;
  setFeatures: (features: IBreakdownFeatureItem[]) => void;
  updateFeature: (
    id: string,
    updates: Partial<IBreakdownFeatureWithSelection>,
  ) => void;
  toggleFeatureSelection: (id: string) => void;
  addFeature: (feature: Omit<IBreakdownFeatureWithSelection, 'id'>) => void;
  clearBreakdown: () => void;
}

export const useBreakdownStore = create<IBreakdownFlowState>(set => ({
  vision: null,
  analysisResult: null,
  features: [],

  startBreakdown: (vision, analysis) => {
    set({ vision, analysisResult: analysis, features: [] });
  },

  setFeatures: features => {
    // Convert API features to local state with isSelected=true by default
    const featuresWithSelection: IBreakdownFeatureWithSelection[] =
      features.map(f => ({
        ...f,
        isSelected: true,
      }));

    set({ features: featuresWithSelection });
  },

  updateFeature: (id, updates) => {
    set(state => ({
      features: state.features.map(f =>
        f.id === id ? { ...f, ...updates } : f,
      ),
    }));
  },

  toggleFeatureSelection: id => {
    set(state => ({
      features: state.features.map(f =>
        f.id === id ? { ...f, isSelected: !f.isSelected } : f,
      ),
    }));
  },

  addFeature: feature => {
    const id = `custom-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    set(state => ({
      features: [...state.features, { ...feature, id }],
    }));
  },

  clearBreakdown: () => {
    set({ vision: null, analysisResult: null, features: [] });
  },
}));

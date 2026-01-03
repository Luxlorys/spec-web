import { api } from 'shared/lib';

import {
  IGetDocumentationResponse,
  IRegenerateDocumentationResponse,
} from './types';

export const documentationApi = {
  /**
   * Get documentation for the current organization
   * GET /api/documentation
   */
  get: async (): Promise<IGetDocumentationResponse> => {
    const { data } = await api.get<IGetDocumentationResponse>('/documentation');

    return data;
  },

  /**
   * Regenerate documentation (founders only)
   * POST /api/documentation/regenerate
   */
  regenerate: async (): Promise<IRegenerateDocumentationResponse> => {
    const { data } = await api.post<IRegenerateDocumentationResponse>(
      '/documentation/regenerate',
    );

    return data;
  },
};

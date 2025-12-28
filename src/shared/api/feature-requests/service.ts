import { api } from 'shared/lib';

import {
  IActivity,
  ICreateFeatureRequest,
  ICreateFeatureResponse,
  IDeleteFeatureResponse,
  IFeatureListResponse,
  IFeatureRequest,
  IFeatureRequestFilters,
  IGetActivitiesResponse,
  IGetFeatureResponse,
  IUpdateFeatureStatusRequest,
  IUpdateFeatureStatusResponse,
} from './types';

export const featureRequestsApi = {
  /**
   * Get paginated list of features
   * GET /features
   */
  getAll: async (
    filters?: IFeatureRequestFilters,
  ): Promise<IFeatureListResponse> => {
    const { data } = await api.get<IFeatureListResponse>('/features', {
      params: filters,
    });

    return data;
  },

  /**
   * Get feature by ID
   * GET /features/:id
   */
  getById: async (id: number): Promise<IFeatureRequest> => {
    const { data } = await api.get<IGetFeatureResponse>(`/features/${id}`);

    return data.feature;
  },

  /**
   * Create a new feature
   * POST /features
   */
  create: async (
    requestData: ICreateFeatureRequest,
  ): Promise<IFeatureRequest> => {
    const { data } = await api.post<ICreateFeatureResponse>(
      '/features',
      requestData,
    );

    return data.feature;
  },

  /**
   * Update feature status
   * PATCH /features/:id/status
   */
  updateStatus: async (
    id: number,
    requestData: IUpdateFeatureStatusRequest,
  ): Promise<IFeatureRequest> => {
    const { data } = await api.post<IUpdateFeatureStatusResponse>(
      `/features/${id}/status`,
      requestData,
    );

    return data.feature;
  },

  /**
   * Delete feature (soft delete)
   * DELETE /features/:id
   */
  delete: async (id: number): Promise<boolean> => {
    const { data } = await api.delete<IDeleteFeatureResponse>(
      `/features/${id}`,
    );

    return data.success;
  },

  /**
   * Get activities for a feature
   * GET /features/:id/activities
   */
  getActivities: async (featureId: number): Promise<IActivity[]> => {
    const { data } = await api.get<IGetActivitiesResponse>(
      `/features/${featureId}/activities`,
    );

    return data.activities;
  },
};

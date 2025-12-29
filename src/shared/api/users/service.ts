import { api } from 'shared/lib';

import { IOrganization } from '../auth/types';
import {
  IChangePasswordRequest,
  IChangePasswordResponse,
  IDeleteAccountResponse,
  IDeleteOrganizationResponse,
  IGetCurrentUserResponse,
  IGetOrganizationMembersResponse,
  IOrganizationMember,
  IRemoveMemberResponse,
  IUpdateOrganizationRequest,
  IUpdateOrganizationResponse,
  IUpdateProfileRequest,
  IUpdateProfileResponse,
  IUserWithOrganization,
} from './types';

export const usersApi = {
  /**
   * Get current authenticated user with organization details
   * GET /api/user/me
   */
  getCurrentUser: async (): Promise<IUserWithOrganization> => {
    const { data } = await api.get<IGetCurrentUserResponse>('/user/me');

    return data.user;
  },

  /**
   * Get all active members of the user's organization
   * GET /api/user/organization/members
   */
  getOrganizationMembers: async (): Promise<IOrganizationMember[]> => {
    const { data } = await api.get<IGetOrganizationMembersResponse>(
      '/user/organization/members',
    );

    return data.members;
  },

  /**
   * Update user profile (name, role for non-founders)
   * PATCH /api/user/profile
   */
  updateProfile: async (
    requestData: IUpdateProfileRequest,
  ): Promise<IUserWithOrganization> => {
    const { data } = await api.patch<IUpdateProfileResponse>(
      '/user/profile',
      requestData,
    );

    return data.user;
  },

  /**
   * Change user password
   * POST /api/user/change-password
   */
  changePassword: async (
    requestData: IChangePasswordRequest,
  ): Promise<IChangePasswordResponse> => {
    const { data } = await api.post<IChangePasswordResponse>(
      '/user/change-password',
      requestData,
    );

    return data;
  },

  /**
   * Delete user account (non-founders only)
   * DELETE /api/user/account
   */
  deleteAccount: async (): Promise<boolean> => {
    const { data } = await api.delete<IDeleteAccountResponse>('/user/account');

    return data.success;
  },

  /**
   * Update organization details (founder only)
   * PATCH /api/user/organization
   */
  updateOrganization: async (
    requestData: IUpdateOrganizationRequest,
  ): Promise<IOrganization> => {
    const { data } = await api.patch<IUpdateOrganizationResponse>(
      '/user/organization',
      requestData,
    );

    return data.organization;
  },

  /**
   * Remove a member from the organization (founder only)
   * DELETE /api/user/organization/members/:memberId
   */
  removeMember: async (memberId: number): Promise<boolean> => {
    const { data } = await api.delete<IRemoveMemberResponse>(
      `/user/organization/members/${memberId}`,
    );

    return data.success;
  },

  /**
   * Delete organization and all members (founder only)
   * DELETE /api/user/organization
   */
  deleteOrganization: async (): Promise<IDeleteOrganizationResponse> => {
    const { data } =
      await api.delete<IDeleteOrganizationResponse>('/user/organization');

    return data;
  },
};

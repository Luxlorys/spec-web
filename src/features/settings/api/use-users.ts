import { useMutation, useQuery } from '@tanstack/react-query';

import {
  IChangePasswordRequest,
  IUpdateOrganizationRequest,
  IUpdateProfileRequest,
  usersApi,
} from 'shared/api';
import { QueryKeys } from 'shared/constants';
import { queryClient } from 'shared/lib';
import { useAuthStore } from 'shared/store';

/**
 * Hook to fetch current authenticated user
 */
export const useGetCurrentUser = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: [QueryKeys.CURRENT_USER],
    queryFn: () => usersApi.getCurrentUser(),
    enabled: options?.enabled ?? true,
  });
};

/**
 * Hook to fetch organization members
 */
export const useGetOrganizationMembers = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: [QueryKeys.ORGANIZATION_MEMBERS],
    queryFn: () => usersApi.getOrganizationMembers(),
    enabled: options?.enabled ?? true,
  });
};

/**
 * Hook to update user profile
 */
export const useUpdateProfile = () => {
  const { updateUser } = useAuthStore();

  return useMutation({
    mutationFn: (data: IUpdateProfileRequest) => usersApi.updateProfile(data),
    onSuccess: updatedUser => {
      // Update auth store with new user data
      updateUser(updatedUser);
      // Invalidate queries
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.CURRENT_USER],
      });
    },
  });
};

/**
 * Hook to change password
 */
export const useChangePassword = () => {
  return useMutation({
    mutationFn: (data: IChangePasswordRequest) => usersApi.changePassword(data),
  });
};

/**
 * Hook to delete user account (non-founders)
 */
export const useDeleteAccount = () => {
  const { clearAuth } = useAuthStore();

  return useMutation({
    mutationFn: () => usersApi.deleteAccount(),
    onSuccess: () => {
      // Clear auth and redirect to login
      clearAuth();
      window.location.href = '/login';
    },
  });
};

/**
 * Hook to update organization (founder only)
 */
export const useUpdateOrganization = () => {
  const { updateOrganization } = useAuthStore();

  return useMutation({
    mutationFn: (data: IUpdateOrganizationRequest) =>
      usersApi.updateOrganization(data),
    onSuccess: updatedOrganization => {
      updateOrganization(updatedOrganization);
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.CURRENT_USER],
      });
    },
  });
};

/**
 * Hook to remove a member from organization (founder only)
 */
export const useRemoveMember = () => {
  return useMutation({
    mutationFn: (memberId: number) => usersApi.removeMember(memberId),
    onSuccess: () => {
      // Invalidate members list
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.ORGANIZATION_MEMBERS],
      });
    },
  });
};

/**
 * Hook to delete organization (founder only)
 */
export const useDeleteOrganization = () => {
  const { clearAuth } = useAuthStore();

  return useMutation({
    mutationFn: () => usersApi.deleteOrganization(),
    onSuccess: () => {
      // Clear auth and redirect to login
      clearAuth();
      window.location.href = '/login';
    },
  });
};

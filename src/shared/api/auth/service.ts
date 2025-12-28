import { api } from 'shared/lib';
import { useAuthStore } from 'shared/store';

import {
  IAuthResponse,
  IFounderSignupRequest,
  IInviteCodeValidation,
  ILoginRequest,
  IMemberSignupRequest,
  ISuccessResponse,
  ITokenRefreshResponse,
} from './types';

export const authApi = {
  /**
   * Login with email and password
   * May throw 403 with EMAIL_NOT_VERIFIED if email not verified
   */
  login: async (credentials: ILoginRequest): Promise<IAuthResponse> => {
    const { data } = await api.post<IAuthResponse>('/auth/login', credentials);

    return data;
  },

  /**
   * Register a new founder account (creates organization)
   * Returns void - user must verify email before logging in
   */
  register: async (data: IFounderSignupRequest): Promise<void> => {
    await api.post('/auth/register', data);
  },

  /**
   * Register with invite code (joins existing organization)
   * Role is determined by the invite code's defaultRole
   * Returns void - user must verify email before logging in
   */
  registerWithInvite: async (data: IMemberSignupRequest): Promise<void> => {
    await api.post('/auth/register-with-invite', data);
  },

  /**
   * Verify an invite code before showing full registration form
   * Returns organization info and default role
   */
  verifyInviteCode: async (code: string): Promise<IInviteCodeValidation> => {
    const { data } = await api.get<IInviteCodeValidation>(
      `/auth/invite-code/${encodeURIComponent(code)}/verify`,
    );

    return data;
  },

  /**
   * Verify email using 6-character alphanumeric code
   * On success, returns success response
   */
  verifyEmail: async (code: string): Promise<ISuccessResponse> => {
    const { data } = await api.post<ISuccessResponse>('/auth/verify-email', {
      token: code,
    });

    return data;
  },

  /**
   * Resend verification email
   * Always returns success to prevent email enumeration
   */
  resendVerification: async (email: string): Promise<ISuccessResponse> => {
    const { data } = await api.post<ISuccessResponse>(
      '/auth/resend-verification',
      { email },
    );

    return data;
  },

  /**
   * Request password reset email
   * Always returns success to prevent email enumeration
   */
  forgotPassword: async (email: string): Promise<ISuccessResponse> => {
    const { data } = await api.post<ISuccessResponse>('/auth/forgot-password', {
      email,
    });

    return data;
  },

  /**
   * Reset password using token from reset email
   */
  resetPassword: async (
    token: string,
    password: string,
  ): Promise<ISuccessResponse> => {
    const { data } = await api.post<ISuccessResponse>('/auth/reset-password', {
      token,
      password,
    });

    return data;
  },

  /**
   * Refresh access token using refresh token
   */
  refreshToken: async (
    refreshToken: string,
  ): Promise<ITokenRefreshResponse> => {
    const { data } = await api.post<ITokenRefreshResponse>(
      '/auth/refresh-token',
      { refreshToken },
    );

    return data;
  },

  /**
   * Delete the authenticated user's account
   */
  deleteAccount: async (): Promise<ISuccessResponse> => {
    const { data } = await api.delete<ISuccessResponse>('/auth/account');

    return data;
  },

  /**
   * Logout - clears auth state and tokens
   * This is a client-side only operation (JWT tokens are stateless)
   */
  logout: (): void => {
    useAuthStore.getState().clearAuth();
  },
};

/**
 * Format role for display (e.g., "DEVELOPER" -> "Developer")
 */
export const formatRole = (role: string): string => {
  const roleMap: Record<string, string> = {
    FOUNDER: 'Founder',
    ADMIN: 'Admin',
    PM: 'Project Manager',
    BA: 'Business Analyst',
    DEVELOPER: 'Developer',
    DESIGNER: 'Designer',
  };

  return roleMap[role] || role;
};

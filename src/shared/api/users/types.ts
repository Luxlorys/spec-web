import { IOrganization, IUserPersona, UserRole } from '../auth/types';

// Non-founder roles (for profile updates - founders cannot change their role)
export type NonFounderRole = 'PM' | 'BA' | 'DEVELOPER' | 'DESIGNER';

// User with organization details
export interface IUserWithOrganization {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string | null;
  role: UserRole;
  isFounder: boolean;
  onboardingCompletedAt: string | null;
  organization: IOrganization;
}

// Organization member (simplified user for member lists)
export interface IOrganizationMember {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  role: UserRole;
  isFounder: boolean;
  createdAt: string;
  lastLoginAt: string | null;
}

// ============================================================================
// Request Types
// ============================================================================

/**
 * Request to update user profile
 * PATCH /api/user/profile
 */
export interface IUpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  role?: NonFounderRole; // Only non-founders can change role
}

/**
 * Request to change password
 * POST /api/user/change-password
 */
export interface IChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

/**
 * Request to update organization (founder only)
 * PATCH /api/user/organization
 */
export interface IUpdateOrganizationRequest {
  name?: string;
  description?: string | null;
  website?: string | null;
  productVision?: string | null;
  targetMarket?: string | null;
  techStack?: string | null;
  userPersonas?: IUserPersona[] | null;
}

// ============================================================================
// Response Types
// ============================================================================

/**
 * Response from GET /api/user/me
 */
export interface IGetCurrentUserResponse {
  user: IUserWithOrganization;
}

/**
 * Response from GET /api/user/organization/members
 */
export interface IGetOrganizationMembersResponse {
  members: IOrganizationMember[];
}

/**
 * Response from PATCH /api/user/profile
 */
export interface IUpdateProfileResponse {
  user: IUserWithOrganization;
}

/**
 * Response from POST /api/user/change-password
 */
export interface IChangePasswordResponse {
  success: boolean;
  message: string;
}

/**
 * Response from PATCH /api/user/organization
 */
export interface IUpdateOrganizationResponse {
  organization: IOrganization;
}

/**
 * Response from DELETE /api/user/account
 */
export interface IDeleteAccountResponse {
  success: boolean;
}

/**
 * Response from DELETE /api/user/organization/members/:memberId
 */
export interface IRemoveMemberResponse {
  success: boolean;
}

/**
 * Response from DELETE /api/user/organization
 */
export interface IDeleteOrganizationResponse {
  success: boolean;
  deletedMembersCount: number;
}

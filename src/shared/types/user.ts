// User roles matching API format (uppercase)
export type UserRole =
  | 'FOUNDER'
  | 'ADMIN'
  | 'PM'
  | 'BA'
  | 'DEVELOPER'
  | 'DESIGNER';

// Organization summary for memberships
export interface IOrganizationSummary {
  id: number;
  name: string;
  slug: string;
}

// User membership in an organization
export interface IMembership {
  organizationId: number;
  role: UserRole;
  isFounder: boolean;
  organization: IOrganizationSummary;
}

// User interface matching API response
export interface IUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string | null;
  memberships: IMembership[];
}

// Helper to get full name from user
export const getFullName = (user: IUser): string =>
  `${user.firstName} ${user.lastName}`.trim();

// Helper to get primary role from user's first membership
export const getPrimaryRole = (user: IUser): UserRole | null =>
  user.memberships[0]?.role ?? null;

// Helper to get primary organization from user's first membership
export const getPrimaryOrganization = (
  user: IUser,
): IOrganizationSummary | null => user.memberships[0]?.organization ?? null;

// Login request
export interface ILoginRequest {
  email: string;
  password: string;
}

// Founder registration (creates organization)
export interface IFounderSignupRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  organizationName: string;
}

// Member registration with invite code (role comes from invite)
export interface IMemberSignupRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  inviteCode: string;
}

// Forgot password request
export interface IForgotPasswordRequest {
  email: string;
}

// Reset password request
export interface IResetPasswordRequest {
  token: string;
  password: string;
}

// Resend verification request
export interface IResendVerificationRequest {
  email: string;
}

// Invite code validation response
export interface IInviteCodeValidation {
  valid: boolean;
  organization?: IOrganizationSummary;
  defaultRole?: UserRole;
}

// Auth response with dual tokens
export interface IAuthResponse {
  user: IUser;
  accessToken: string;
  refreshToken: string;
}

// Token refresh response
export interface ITokenRefreshResponse {
  accessToken: string;
  refreshToken: string;
}

// Success response for operations without data
export interface ISuccessResponse {
  success: boolean;
  message?: string;
}

// Auth error codes
export const AUTH_ERROR_CODES = {
  EMAIL_NOT_VERIFIED: 'EMAIL_NOT_VERIFIED',
  INVALID_TOKEN: 'INVALID_TOKEN',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  ACCOUNT_LOCKED: 'ACCOUNT_LOCKED',
} as const;

export type UserRole =
  | 'founder'
  | 'developer'
  | 'admin'
  | 'ba'
  | 'pm'
  | 'designer';

export type TeamMemberRole = 'developer' | 'ba' | 'pm' | 'designer';

export interface IUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  organizationId: string;
  avatarUrl?: string;
  createdAt: Date;
  canCreateFeatures: boolean;
}

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface ISignupRequest {
  email: string;
  password: string;
  name: string;
  organizationName?: string;
}

export interface IAdminSignupRequest {
  email: string;
  password: string;
  name: string;
  projectName: string;
  contextFiles?: File[];
}

export interface IMemberSignupRequest {
  email: string;
  password: string;
  name: string;
  inviteCode: string;
  role: TeamMemberRole;
}

export interface IInviteCode {
  code: string;
  organizationId: string;
  organizationName: string;
  createdBy: string;
  expiresAt: Date;
  usedCount: number;
  maxUses: number;
}

export interface IAuthResponse {
  user: IUser;
  token: string;
}

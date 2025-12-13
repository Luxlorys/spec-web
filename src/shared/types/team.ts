import { IUser } from './user';

export interface ITeamMember extends IUser {
  joinedAt: Date;
}

export interface IInviteMemberRequest {
  email: string;
  role: 'developer' | 'founder' | 'admin';
}

export interface ITeamInvite {
  id: string;
  organizationId: string;
  email: string;
  role: 'developer' | 'founder' | 'admin';
  invitedBy: string;
  status: 'pending' | 'accepted' | 'expired';
  expiresAt: Date;
  createdAt: Date;
}

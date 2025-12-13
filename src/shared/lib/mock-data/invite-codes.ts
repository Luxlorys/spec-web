import { IInviteCode } from 'shared/types';

export const mockInviteCodes: IInviteCode[] = [
  {
    code: 'TECHSTART2024',
    organizationId: 'org-1',
    organizationName: 'TechStart Inc.',
    createdBy: 'user-1',
    expiresAt: new Date('2025-12-31'),
    usedCount: 2,
    maxUses: 10,
  },
  {
    code: 'DATAFLOW-DEV',
    organizationId: 'org-2',
    organizationName: 'DataFlow Solutions',
    createdBy: 'user-3',
    expiresAt: new Date('2025-06-30'),
    usedCount: 0,
    maxUses: 5,
  },
  {
    code: 'DEMO123',
    organizationId: 'org-1',
    organizationName: 'TechStart Inc.',
    createdBy: 'user-1',
    expiresAt: new Date('2025-12-31'),
    usedCount: 0,
    maxUses: 100,
  },
];

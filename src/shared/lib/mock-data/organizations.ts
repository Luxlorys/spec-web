import { IOrganization } from 'shared/types';

export const mockOrganizations: IOrganization[] = [
  {
    id: 'org-1',
    name: 'TechStart Inc.',
    description: 'Building the future of team collaboration software',
    createdBy: 'user-1',
    createdAt: new Date('2024-01-15'),
  },
  {
    id: 'org-2',
    name: 'DataFlow Solutions',
    description: 'Analytics platform for modern businesses',
    createdBy: 'user-3',
    createdAt: new Date('2024-02-01'),
  },
];

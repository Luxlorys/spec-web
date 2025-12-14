import { IUser } from 'shared/types';

export const mockUsers: IUser[] = [
  {
    id: 'user-1',
    email: 'sarah.founder@example.com',
    name: 'Sarah Chen',
    role: 'founder',
    organizationId: 'org-1',
    createdAt: new Date('2024-01-15'),
    canCreateFeatures: true,
  },
  {
    id: 'user-2',
    email: 'mike.dev@example.com',
    name: 'Mike Johnson',
    role: 'developer',
    organizationId: 'org-1',
    createdAt: new Date('2024-01-20'),
    canCreateFeatures: false,
  },
  {
    id: 'user-3',
    email: 'alex.founder@example.com',
    name: 'Alex Rivera',
    role: 'founder',
    organizationId: 'org-2',
    createdAt: new Date('2024-02-01'),
    canCreateFeatures: true,
  },
  {
    id: 'user-4',
    email: 'emma.dev@example.com',
    name: 'Emma Davis',
    role: 'developer',
    organizationId: 'org-1',
    createdAt: new Date('2024-02-10'),
    canCreateFeatures: true,
  },
];

// Default login: sarah.founder@example.com / password
export const DEMO_EMAIL = 'sarah.founder@example.com';
export const DEMO_PASSWORD = 'password';

import { IUser } from 'shared/types';

export const mockUsers: IUser[] = [
  {
    id: 1,
    email: 'sarah.founder@example.com',
    firstName: 'Sarah',
    lastName: 'Chen',
    avatarUrl: null,
    isActive: true,
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
    lastLoginAt: '2024-12-27T10:00:00Z',
    role: 'FOUNDER',
    isFounder: true,
    organization: {
      id: 1,
      name: 'SpecFlow Inc',
      slug: 'specflow-inc',
    },
  },
  {
    id: 2,
    email: 'mike.dev@example.com',
    firstName: 'Mike',
    lastName: 'Johnson',
    avatarUrl: null,
    isActive: true,
    createdAt: '2024-01-20T00:00:00Z',
    updatedAt: '2024-01-20T00:00:00Z',
    lastLoginAt: '2024-12-26T14:30:00Z',
    role: 'DEVELOPER',
    isFounder: false,
    organization: {
      id: 1,
      name: 'SpecFlow Inc',
      slug: 'specflow-inc',
    },
  },
  {
    id: 3,
    email: 'alex.founder@example.com',
    firstName: 'Alex',
    lastName: 'Rivera',
    avatarUrl: null,
    isActive: true,
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-02-01T00:00:00Z',
    lastLoginAt: '2024-12-25T09:00:00Z',
    role: 'FOUNDER',
    isFounder: true,
    organization: {
      id: 2,
      name: 'Tech Startup',
      slug: 'tech-startup',
    },
  },
  {
    id: 4,
    email: 'emma.dev@example.com',
    firstName: 'Emma',
    lastName: 'Davis',
    avatarUrl: null,
    isActive: true,
    createdAt: '2024-02-10T00:00:00Z',
    updatedAt: '2024-02-10T00:00:00Z',
    lastLoginAt: '2024-12-27T08:15:00Z',
    role: 'DEVELOPER',
    isFounder: false,
    organization: {
      id: 1,
      name: 'SpecFlow Inc',
      slug: 'specflow-inc',
    },
  },
];

// Default login: sarah.founder@example.com / password
export const DEMO_EMAIL = 'sarah.founder@example.com';
export const DEMO_PASSWORD = 'password';

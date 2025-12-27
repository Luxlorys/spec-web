import { mockUsers } from 'shared/lib/mock-data';
import { getFullName, IUser, UserRole } from 'shared/types';

// Simulate network delay
const delay = (ms: number) =>
  new Promise<void>(resolve => {
    setTimeout(resolve, ms);
  });

// Helper to get user's role
export const getUserRole = (user: IUser): UserRole => {
  return user.role;
};

// Helper to check if user is founder
export const isFounder = (user: IUser): boolean => {
  return user.isFounder;
};

export const usersApi = {
  getById: async (id: number): Promise<IUser> => {
    await delay(200);
    const user = mockUsers.find(u => u.id === id);

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  },

  getByOrganization: async (organizationId: number): Promise<IUser[]> => {
    await delay(200);

    return mockUsers.filter(u => u.organization?.id === organizationId);
  },

  updateRole: async (
    id: number,
    role: UserRole,
    _organizationId: number,
  ): Promise<IUser> => {
    await delay(300);
    const userIndex = mockUsers.findIndex(u => u.id === id);

    if (userIndex === -1) {
      throw new Error('User not found');
    }

    const user = mockUsers[userIndex];

    if (user.isFounder) {
      throw new Error('Cannot change the role of the founder');
    }

    // Update the user role
    mockUsers[userIndex] = {
      ...user,
      role,
    };

    return mockUsers[userIndex];
  },

  remove: async (
    id: number,
    currentUserId: number,
    _organizationId: number,
  ): Promise<void> => {
    await delay(300);
    const userIndex = mockUsers.findIndex(u => u.id === id);

    if (userIndex === -1) {
      throw new Error('User not found');
    }

    const user = mockUsers[userIndex];

    if (user.id === currentUserId) {
      throw new Error('You cannot remove yourself from the team');
    }

    if (user.isFounder) {
      throw new Error('Cannot remove the founder from the team');
    }

    // Remove user from the mock data
    mockUsers.splice(userIndex, 1);
  },

  // Helper re-exports for backward compatibility
  getFullName,
  getUserRole,
  isFounder,
};

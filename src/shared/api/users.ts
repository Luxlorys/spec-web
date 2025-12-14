import { IUser, UserRole } from 'shared/types';
import { mockUsers } from 'shared/lib/mock-data';

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const usersApi = {
  getById: async (id: string): Promise<IUser> => {
    await delay(200);
    const user = mockUsers.find((u) => u.id === id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  },

  getByOrganization: async (organizationId: string): Promise<IUser[]> => {
    await delay(200);
    return mockUsers.filter((u) => u.organizationId === organizationId);
  },

  updateRole: async (id: string, role: UserRole): Promise<IUser> => {
    await delay(300);
    const userIndex = mockUsers.findIndex((u) => u.id === id);
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    const user = mockUsers[userIndex];
    if (user.role === 'founder') {
      throw new Error('Cannot change the role of the founder');
    }

    // Update the mock data
    mockUsers[userIndex] = { ...user, role };
    return mockUsers[userIndex];
  },

  remove: async (id: string, currentUserId: string): Promise<void> => {
    await delay(300);
    const userIndex = mockUsers.findIndex((u) => u.id === id);
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    const user = mockUsers[userIndex];
    if (user.id === currentUserId) {
      throw new Error('You cannot remove yourself from the team');
    }
    if (user.role === 'founder') {
      throw new Error('Cannot remove the founder from the team');
    }

    // Remove from mock data
    mockUsers.splice(userIndex, 1);
  },

  updateCanCreateFeatures: async (id: string, canCreateFeatures: boolean): Promise<IUser> => {
    await delay(300);
    const userIndex = mockUsers.findIndex((u) => u.id === id);
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    const user = mockUsers[userIndex];
    if (user.role === 'founder') {
      throw new Error('Cannot change permissions of the founder');
    }

    // Update the mock data
    mockUsers[userIndex] = { ...user, canCreateFeatures };
    return mockUsers[userIndex];
  },
};

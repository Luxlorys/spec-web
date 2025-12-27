import { mockUsers } from 'shared/lib/mock-data';
import { getFullName, IUser, UserRole } from 'shared/types';

// Simulate network delay
const delay = (ms: number) =>
  new Promise<void>(resolve => {
    setTimeout(resolve, ms);
  });

// Helper to get user's role in a specific organization
export const getUserRole = (
  user: IUser,
  organizationId?: number,
): UserRole | null => {
  if (!organizationId) {
    return user.memberships[0]?.role ?? null;
  }
  const membership = user.memberships.find(
    m => m.organizationId === organizationId,
  );

  return membership?.role ?? null;
};

// Helper to check if user is founder
export const isFounder = (user: IUser, organizationId?: number): boolean => {
  if (!organizationId) {
    return user.memberships[0]?.isFounder ?? false;
  }
  const membership = user.memberships.find(
    m => m.organizationId === organizationId,
  );

  return membership?.isFounder ?? false;
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

    return mockUsers.filter(u =>
      u.memberships.some(m => m.organizationId === organizationId),
    );
  },

  updateRole: async (
    id: number,
    role: UserRole,
    organizationId: number,
  ): Promise<IUser> => {
    await delay(300);
    const userIndex = mockUsers.findIndex(u => u.id === id);

    if (userIndex === -1) {
      throw new Error('User not found');
    }

    const user = mockUsers[userIndex];
    const membershipIndex = user.memberships.findIndex(
      m => m.organizationId === organizationId,
    );

    if (membershipIndex === -1) {
      throw new Error('User is not a member of this organization');
    }

    if (user.memberships[membershipIndex].isFounder) {
      throw new Error('Cannot change the role of the founder');
    }

    // Update the membership role
    user.memberships[membershipIndex] = {
      ...user.memberships[membershipIndex],
      role,
    };

    return user;
  },

  remove: async (
    id: number,
    currentUserId: number,
    organizationId: number,
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

    const membership = user.memberships.find(
      m => m.organizationId === organizationId,
    );

    if (membership?.isFounder) {
      throw new Error('Cannot remove the founder from the team');
    }

    // Remove membership from the organization (not the user entirely)
    user.memberships = user.memberships.filter(
      m => m.organizationId !== organizationId,
    );

    // If user has no memberships left, remove them from the mock data
    if (user.memberships.length === 0) {
      mockUsers.splice(userIndex, 1);
    }
  },

  // Helper re-exports for backward compatibility
  getFullName,
  getUserRole,
  isFounder,
};

import { delay, generateId } from 'shared/lib';
import {
  DEMO_EMAIL,
  DEMO_PASSWORD,
  mockDocumentationData,
  mockInviteCodes,
  mockOrganizations,
  mockUsers,
} from 'shared/lib/mock-data';
import {
  IAdminSignupRequest,
  IAuthResponse,
  IInviteCode,
  ILoginRequest,
  IMemberSignupRequest,
  ISignupRequest,
} from 'shared/types';

export const authApi = {
  login: async (credentials: ILoginRequest): Promise<IAuthResponse> => {
    await delay(800);

    // Demo authentication
    if (
      credentials.email === DEMO_EMAIL &&
      credentials.password === DEMO_PASSWORD
    ) {
      const user = mockUsers[0];

      return {
        user,
        token: `mock-token-${user.id}`,
      };
    }

    // Check against mock users
    const user = mockUsers.find(u => u.email === credentials.email);

    if (user && credentials.password === 'password') {
      return {
        user,
        token: `mock-token-${user.id}`,
      };
    }

    throw new Error('Invalid email or password');
  },

  signup: async (data: ISignupRequest): Promise<IAuthResponse> => {
    await delay(1000);

    // Check if email already exists
    const existingUser = mockUsers.find(u => u.email === data.email);

    if (existingUser) {
      throw new Error('Email already in use');
    }

    // Create new organization if provided
    let organizationId = mockOrganizations[0].id;

    if (data.organizationName) {
      organizationId = generateId();
      mockOrganizations.push({
        id: organizationId,
        name: data.organizationName,
        description: '',
        createdBy: generateId(),
        createdAt: new Date(),
      });
    }

    // Create new user
    const newUser = {
      id: generateId(),
      email: data.email,
      name: data.name,
      role: 'founder' as const,
      organizationId,
      createdAt: new Date(),
      canCreateFeatures: true,
    };

    mockUsers.push(newUser);

    return {
      user: newUser,
      token: `mock-token-${newUser.id}`,
    };
  },

  signupAsAdmin: async (data: IAdminSignupRequest): Promise<IAuthResponse> => {
    await delay(1000);

    // Check if email already exists
    const existingUser = mockUsers.find(u => u.email === data.email);

    if (existingUser) {
      throw new Error('Email already in use');
    }

    // Create new organization
    const userId = generateId();
    const organizationId = generateId();

    mockOrganizations.push({
      id: organizationId,
      name: data.projectName,
      description: '',
      createdBy: userId,
      createdAt: new Date(),
    });

    // Process uploaded context files and create documentation entries
    if (data.contextFiles && data.contextFiles.length > 0) {
      const readFile = (file: File): Promise<string> =>
        new Promise(resolve => {
          const reader = new FileReader();

          reader.onload = e => {
            resolve((e.target?.result as string) || '');
          };
          reader.readAsText(file);
        });

      const fileContents = await Promise.all(
        data.contextFiles.map(file => readFile(file)),
      );

      data.contextFiles.forEach((file, index) => {
        const fileContent = fileContents[index];
        const docId = generateId();

        mockDocumentationData.push({
          id: docId,
          title: file.name.replace(/\.[^/.]+$/, ''), // Remove file extension
          content:
            fileContent ||
            `# ${file.name}\n\nContent of uploaded file: ${file.name}\n\nFile size: ${Math.round(file.size / 1024)} KB`,
          type: 'project-context',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          authorId: userId,
          projectId: organizationId,
        });
      });
    }

    // Create new user as founder
    const newUser = {
      id: userId,
      name: data.name,
      email: data.email,
      role: 'founder' as const,
      organizationId,
      createdAt: new Date(),
      canCreateFeatures: true,
    };

    mockUsers.push(newUser);

    return {
      user: newUser,
      token: `mock-token-${newUser.id}`,
    };
  },

  validateInviteCode: async (code: string): Promise<IInviteCode> => {
    await delay(500);

    const inviteCode = mockInviteCodes.find(
      ic => ic.code.toLowerCase() === code.toLowerCase(),
    );

    if (!inviteCode) {
      throw new Error('Invalid invite code');
    }

    if (new Date() > inviteCode.expiresAt) {
      throw new Error('Invite code has expired');
    }

    if (inviteCode.usedCount >= inviteCode.maxUses) {
      throw new Error('Invite code has reached maximum uses');
    }

    return inviteCode;
  },

  signupWithInvite: async (
    data: IMemberSignupRequest,
  ): Promise<IAuthResponse> => {
    await delay(1000);

    // Validate invite code first
    const inviteCode = await authApi.validateInviteCode(data.inviteCode);

    // Check if email already exists
    const existingUser = mockUsers.find(u => u.email === data.email);

    if (existingUser) {
      throw new Error('Email already in use');
    }

    // Create new user with the specified role
    const newUser = {
      id: generateId(),
      email: data.email,
      name: data.name,
      role: data.role,
      organizationId: inviteCode.organizationId,
      createdAt: new Date(),
      canCreateFeatures: true,
    };

    mockUsers.push(newUser);

    // Increment usage count
    inviteCode.usedCount += 1;

    return {
      user: newUser,
      token: `mock-token-${newUser.id}`,
    };
  },

  logout: async (): Promise<void> => {
    await delay(300);
  },

  getCurrentUser: async (token: string): Promise<IAuthResponse> => {
    await delay(500);

    const userId = token.replace('mock-token-', '');
    const user = mockUsers.find(u => u.id === userId);

    if (!user) {
      throw new Error('Invalid token');
    }

    return {
      user,
      token,
    };
  },
};

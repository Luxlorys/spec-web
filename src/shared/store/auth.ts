import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { IOrganization, IUser } from 'shared/types';

// Cookie configuration
export const ACCESS_TOKEN_COOKIE = 'access-token';
export const REFRESH_TOKEN_COOKIE = 'refresh-token';
const ACCESS_TOKEN_MAX_AGE = 60 * 60 * 24 * 3; // 3 days (matches API)
const REFRESH_TOKEN_MAX_AGE = 60 * 60 * 24 * 5; // 5 days (matches API)

const setCookie = (name: string, value: string, maxAge: number) => {
  if (typeof document !== 'undefined') {
    document.cookie = `${name}=${value}; path=/; max-age=${maxAge}; SameSite=Lax`;
  }
};

const removeCookie = (name: string) => {
  if (typeof document !== 'undefined') {
    document.cookie = `${name}=; path=/; max-age=0`;
  }
};

interface IAuthStore {
  user: IUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;

  // Actions
  setAuth: (user: IUser, accessToken: string, refreshToken: string) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  updateUser: (user: IUser) => void;
  updateOrganization: (organization: IOrganization) => void;
  clearAuth: () => void;

  // Helpers
  getCurrentOrganization: () => IOrganization | null;
}

export const useAuthStore = create<IAuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,

      setAuth: (user, accessToken, refreshToken) => {
        setCookie(ACCESS_TOKEN_COOKIE, accessToken, ACCESS_TOKEN_MAX_AGE);
        setCookie(REFRESH_TOKEN_COOKIE, refreshToken, REFRESH_TOKEN_MAX_AGE);
        set({
          user,
          accessToken,
          refreshToken,
          isAuthenticated: true,
        });
      },

      setTokens: (accessToken, refreshToken) => {
        setCookie(ACCESS_TOKEN_COOKIE, accessToken, ACCESS_TOKEN_MAX_AGE);
        setCookie(REFRESH_TOKEN_COOKIE, refreshToken, REFRESH_TOKEN_MAX_AGE);
        set({
          accessToken,
          refreshToken,
        });
      },

      updateUser: user => {
        set({ user });
      },

      updateOrganization: organization => {
        const { user } = get();

        if (user) {
          set({ user: { ...user, organization } });
        }
      },

      clearAuth: () => {
        removeCookie(ACCESS_TOKEN_COOKIE);
        removeCookie(REFRESH_TOKEN_COOKIE);
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        });
      },

      getCurrentOrganization: () => {
        const { user } = get();

        return user?.organization ?? null;
      },
    }),
    {
      name: 'auth-storage',
      onRehydrateStorage: () => state => {
        // Sync cookies on rehydration if tokens exist
        if (state?.accessToken) {
          setCookie(
            ACCESS_TOKEN_COOKIE,
            state.accessToken,
            ACCESS_TOKEN_MAX_AGE,
          );
        }
        if (state?.refreshToken) {
          setCookie(
            REFRESH_TOKEN_COOKIE,
            state.refreshToken,
            REFRESH_TOKEN_MAX_AGE,
          );
        }
      },
    },
  ),
);

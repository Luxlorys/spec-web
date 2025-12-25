import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { IUser } from 'shared/types';

// Cookie helpers for middleware auth
const AUTH_COOKIE_NAME = 'auth-token';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function setAuthCookie(token: string) {
  if (typeof document !== 'undefined') {
    document.cookie = `${AUTH_COOKIE_NAME}=${token}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
  }
}

function removeAuthCookie() {
  if (typeof document !== 'undefined') {
    document.cookie = `${AUTH_COOKIE_NAME}=; path=/; max-age=0`;
  }
}

interface IAuthStore {
  user: IUser | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: IUser, token: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<IAuthStore>()(
  persist(
    set => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: (user, token) => {
        setAuthCookie(token);
        set({
          user,
          token,
          isAuthenticated: true,
        });
      },
      clearAuth: () => {
        removeAuthCookie();
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: 'auth-storage',
      onRehydrateStorage: () => state => {
        // Sync cookie on rehydration if token exists
        if (state?.token) {
          setAuthCookie(state.token);
        }
      },
    },
  ),
);

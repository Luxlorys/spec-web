import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { env } from 'env';

import { ITokenRefreshResponse } from 'shared/types';

import { useAuthStore } from '../store/auth';

// Extended request config with retry flag
interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  isRetry?: boolean;
}

// Create axios instance
export const api = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Flag to prevent multiple refresh attempts
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: Error) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });
  failedQueue = [];
};

// Request interceptor: attach access token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const { accessToken } = useAuthStore.getState();

    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  error => Promise.reject(error),
);

// Response interceptor: handle 401 and token refresh
api.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as ExtendedAxiosRequestConfig;

    // Skip refresh for auth endpoints to avoid infinite loops
    const isAuthEndpoint =
      originalRequest?.url?.includes('/auth/login') ||
      originalRequest?.url?.includes('/auth/refresh-token') ||
      originalRequest?.url?.includes('/auth/register');

    if (
      error.response?.status === 401 &&
      !originalRequest.isRetry &&
      !isAuthEndpoint
    ) {
      if (isRefreshing) {
        // Queue this request until refresh completes
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(api(originalRequest));
            },
            reject: (err: Error) => {
              reject(err);
            },
          });
        });
      }

      originalRequest.isRetry = true;
      isRefreshing = true;

      const { refreshToken } = useAuthStore.getState();

      if (!refreshToken) {
        isRefreshing = false;
        useAuthStore.getState().clearAuth();
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }

        return Promise.reject(error);
      }

      try {
        // Use a separate axios instance to avoid interceptors
        const { data } = await axios.post<ITokenRefreshResponse>(
          `${env.NEXT_PUBLIC_API_URL}/auth/refresh-token`,
          { refreshToken },
        );

        useAuthStore.getState().setTokens(data.accessToken, data.refreshToken);

        // Update the original request with new token
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;

        // Process queued requests
        processQueue(null, data.accessToken);

        return await api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, clear auth and redirect
        processQueue(refreshError as Error, null);
        useAuthStore.getState().clearAuth();

        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }

        return await Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

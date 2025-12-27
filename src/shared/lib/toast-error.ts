import { AxiosError } from 'axios';
import { toast } from 'sonner';

import { IApiError } from 'shared/types';

/**
 * Display an API error as a toast notification
 * Uses server error message directly when available
 */
export const showApiError = (error: unknown): void => {
  if (error instanceof AxiosError) {
    const data = error.response?.data as IApiError | undefined;

    toast.error(data?.error || 'Something went wrong', {
      description: data?.message || 'Please try again or contact support',
    });

    return;
  }

  toast.error('Something went wrong', {
    description: error instanceof Error ? error.message : 'Please try again',
  });
};

/**
 * Check if error is EMAIL_NOT_VERIFIED (403 with specific code)
 */
export const isEmailNotVerifiedError = (error: unknown): boolean => {
  if (error instanceof AxiosError) {
    const data = error.response?.data as IApiError | undefined;

    return (
      error.response?.status === 403 && data?.code === 'EMAIL_NOT_VERIFIED'
    );
  }

  return false;
};

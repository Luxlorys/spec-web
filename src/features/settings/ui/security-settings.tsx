'use client';

import { useState } from 'react';

import { LogOut, Trash2 } from 'lucide-react';

import { useAuthStore } from 'shared/store';
import { Button, Card, Input } from 'shared/ui';

import { usePasswordForm } from '../hooks';

export const SecuritySettings = () => {
  const { clearAuth } = useAuthStore();
  const {
    form,
    onSubmit,
    handleDeleteAccount,
    isFounder,
    isLoading,
    isSuccess,
    error,
    isDeleting,
    deleteError,
  } = usePasswordForm();

  const {
    register,
    formState: { errors, isDirty, isValid },
  } = form;

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Security Settings</h2>
        <p className="text-sm text-muted-foreground">
          Manage your account security
        </p>
      </div>

      <form onSubmit={onSubmit}>
        <Card className="border" padding="lg">
          <div className="space-y-4">
            <h3 className="font-medium">Change Password</h3>
            <Input
              {...register('currentPassword')}
              type="password"
              label="Current Password"
              placeholder="Enter current password"
              error={errors.currentPassword?.message}
            />
            <Input
              {...register('newPassword')}
              type="password"
              label="New Password"
              placeholder="Enter new password"
              error={errors.newPassword?.message}
              helperText="Minimum 8 characters with uppercase, lowercase, number, and special character"
            />
            <Input
              {...register('confirmPassword')}
              type="password"
              label="Confirm New Password"
              placeholder="Confirm new password"
              error={errors.confirmPassword?.message}
            />

            {error && (
              <p className="text-sm text-red-600 dark:text-red-400">
                {error.message || 'Failed to change password'}
              </p>
            )}

            {isSuccess && (
              <p className="text-sm text-green-600 dark:text-green-400">
                Password changed successfully
              </p>
            )}

            <Button type="submit" disabled={!isDirty || !isValid || isLoading}>
              {isLoading ? 'Updating...' : 'Update Password'}
            </Button>
          </div>
        </Card>
      </form>

      <Card className="border border-red-200 dark:border-red-900" padding="lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-red-600 dark:text-red-400">
              Sign Out
            </h3>
            <p className="text-sm text-muted-foreground">
              Sign out from your account on this device
            </p>
          </div>
          <Button variant="danger" size="sm" onClick={clearAuth}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </Card>

      <Card className="border border-red-200 dark:border-red-900" padding="lg">
        {showDeleteConfirm ? (
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-red-600 dark:text-red-400">
                {isFounder ? 'Delete Organization' : 'Delete Account'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {isFounder
                  ? 'This will permanently delete your organization, all members, and all associated data. This action cannot be undone.'
                  : 'This will permanently delete your account and all associated data. This action cannot be undone.'}
              </p>
            </div>

            {deleteError && (
              <p className="text-sm text-red-600 dark:text-red-400">
                {deleteError.message || 'Failed to delete account'}
              </p>
            )}

            <div className="flex gap-3">
              <Button
                variant="danger"
                onClick={handleDeleteAccount}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Yes, Delete'}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-red-600 dark:text-red-400">
                {isFounder ? 'Delete Organization' : 'Delete Account'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {isFounder
                  ? 'Permanently delete your organization and all associated data'
                  : 'Permanently delete your account and all associated data'}
              </p>
            </div>
            <Button
              variant="danger"
              size="sm"
              onClick={() => setShowDeleteConfirm(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

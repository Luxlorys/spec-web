'use client';

import { useState } from 'react';

import { LogOut, Trash2 } from 'lucide-react';

import { useAuthStore } from 'shared/store';
import { Button, Card, Input } from 'shared/ui';

import {
  useChangePassword,
  useDeleteAccount,
  useDeleteOrganization,
} from '../api';

export const SecuritySettings = () => {
  const { user, clearAuth } = useAuthStore();
  const changePasswordMutation = useChangePassword();
  const deleteAccountMutation = useDeleteAccount();
  const deleteOrganizationMutation = useDeleteOrganization();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const isFounder = user?.isFounder ?? false;

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      return;
    }

    await changePasswordMutation.mutateAsync({
      oldPassword: currentPassword,
      newPassword,
      confirmPassword,
    });
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleDeleteAccount = async () => {
    if (isFounder) {
      await deleteOrganizationMutation.mutateAsync();
    } else {
      await deleteAccountMutation.mutateAsync();
    }
  };

  const passwordsMatch = newPassword === confirmPassword;
  const canChangePassword =
    currentPassword && newPassword && confirmPassword && passwordsMatch;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Security Settings</h2>
        <p className="text-sm text-muted-foreground">
          Manage your account security
        </p>
      </div>

      <Card className="border" padding="lg">
        <div className="space-y-4">
          <h3 className="font-medium">Change Password</h3>
          <Input
            label="Current Password"
            type="password"
            placeholder="Enter current password"
            value={currentPassword}
            onChange={e => setCurrentPassword(e.target.value)}
          />
          <Input
            label="New Password"
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            helperText="Minimum 8 characters with uppercase, lowercase, number, and special character"
          />
          <Input
            label="Confirm New Password"
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            error={
              confirmPassword && !passwordsMatch
                ? 'Passwords do not match'
                : undefined
            }
          />

          {changePasswordMutation.isError && (
            <p className="text-sm text-red-600 dark:text-red-400">
              {(changePasswordMutation.error as Error).message ||
                'Failed to change password'}
            </p>
          )}

          {changePasswordMutation.isSuccess && (
            <p className="text-sm text-green-600 dark:text-green-400">
              Password changed successfully
            </p>
          )}

          <Button
            onClick={handleChangePassword}
            disabled={!canChangePassword || changePasswordMutation.isPending}
          >
            {changePasswordMutation.isPending
              ? 'Updating...'
              : 'Update Password'}
          </Button>
        </div>
      </Card>

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

            {(deleteAccountMutation.isError ||
              deleteOrganizationMutation.isError) && (
              <p className="text-sm text-red-600 dark:text-red-400">
                {(
                  (deleteAccountMutation.error ||
                    deleteOrganizationMutation.error) as Error
                )?.message || 'Failed to delete account'}
              </p>
            )}

            <div className="flex gap-3">
              <Button
                variant="danger"
                onClick={handleDeleteAccount}
                disabled={
                  deleteAccountMutation.isPending ||
                  deleteOrganizationMutation.isPending
                }
              >
                {deleteAccountMutation.isPending ||
                deleteOrganizationMutation.isPending
                  ? 'Deleting...'
                  : 'Yes, Delete'}
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

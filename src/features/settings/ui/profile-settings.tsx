'use client';

import { useEffect, useState } from 'react';

import { useAuthStore } from 'shared/store';
import { getFullName } from 'shared/types';
import { Avatar, Button, Card, Input } from 'shared/ui';

import { useUpdateProfile } from '../api';

export const ProfileSettings = () => {
  const { user } = useAuthStore();
  const updateProfileMutation = useUpdateProfile();

  const [firstName, setFirstName] = useState(user?.firstName ?? '');
  const [lastName, setLastName] = useState(user?.lastName ?? '');

  // Sync form state with user data
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName);
      setLastName(user.lastName);
    }
  }, [user]);

  const userName = user ? getFullName(user) : 'User';
  const userRole = user?.role ?? null;

  const hasChanges =
    firstName !== user?.firstName || lastName !== user?.lastName;

  const handleSave = async () => {
    if (!hasChanges) {
      return;
    }

    await updateProfileMutation.mutateAsync({
      firstName,
      lastName,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Profile Settings</h2>
        <p className="text-sm text-muted-foreground">
          Manage your personal information and preferences
        </p>
      </div>

      <Card className="border" padding="lg">
        <div className="flex items-start gap-6">
          <Avatar alt={userName} size="xl" />
          <div className="flex-1 space-y-4">
            <div>
              <Button variant="outline" size="sm" disabled>
                Change Avatar
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Avatar upload coming soon. JPG, PNG or GIF. Max size 2MB.
            </p>
          </div>
        </div>
      </Card>

      <Card className="border" padding="lg">
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="First Name"
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              placeholder="Your first name"
            />
            <Input
              label="Last Name"
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              placeholder="Your last name"
            />
          </div>
          <Input
            label="Email"
            type="email"
            defaultValue={user?.email}
            placeholder="your@email.com"
            disabled
            helperText="Contact support to change your email"
          />
          <Input
            label="Role"
            defaultValue={userRole ?? ''}
            disabled
            helperText="Your role in the organization"
          />
        </div>
      </Card>

      {updateProfileMutation.isError && (
        <p className="text-sm text-red-600 dark:text-red-400">
          {(updateProfileMutation.error as Error).message ||
            'Failed to update profile'}
        </p>
      )}

      {updateProfileMutation.isSuccess && (
        <p className="text-sm text-green-600 dark:text-green-400">
          Profile updated successfully
        </p>
      )}

      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={!hasChanges || updateProfileMutation.isPending}
        >
          {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
};

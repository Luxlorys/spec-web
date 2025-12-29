'use client';

import { useAuthStore } from 'shared/store';
import { getFullName } from 'shared/types';
import { Avatar, Button, Card, Input } from 'shared/ui';

import { useProfileForm } from '../hooks';

export const ProfileSettings = () => {
  const { user } = useAuthStore();
  const { form, onSubmit, isLoading, isSuccess, error } = useProfileForm();

  const {
    register,
    formState: { errors, isDirty },
  } = form;

  const userName = user ? getFullName(user) : 'User';
  const userRole = user?.role ?? null;

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

      <form onSubmit={onSubmit}>
        <Card className="border" padding="lg">
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                {...register('firstName')}
                label="First Name"
                placeholder="Your first name"
                error={errors.firstName?.message}
              />
              <Input
                {...register('lastName')}
                label="Last Name"
                placeholder="Your last name"
                error={errors.lastName?.message}
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

        {error && (
          <p className="mt-4 text-sm text-red-600 dark:text-red-400">
            {error.message || 'Failed to update profile'}
          </p>
        )}

        {isSuccess && (
          <p className="mt-4 text-sm text-green-600 dark:text-green-400">
            Profile updated successfully
          </p>
        )}

        <div className="mt-6 flex justify-end">
          <Button type="submit" disabled={!isDirty || isLoading}>
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
};

'use client';

import { useAuthStore } from 'shared/store';
import { getFullName } from 'shared/types';
import { Avatar, Button, Card, Input } from 'shared/ui';

export const ProfileSettings = () => {
  const { user } = useAuthStore();
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
              <Button variant="outline" size="sm">
                Change Avatar
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              JPG, PNG or GIF. Max size 2MB.
            </p>
          </div>
        </div>
      </Card>

      <Card className="border" padding="lg">
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Full Name"
              defaultValue={userName}
              placeholder="Your name"
            />
            <Input
              label="Email"
              type="email"
              defaultValue={user?.email}
              placeholder="your@email.com"
              disabled
              helperText="Contact support to change your email"
            />
          </div>
          <Input
            label="Role"
            defaultValue={userRole ?? ''}
            disabled
            helperText="Your role in the organization"
          />
        </div>
      </Card>

      <div className="flex justify-end">
        <Button>Save Changes</Button>
      </div>
    </div>
  );
};

'use client';

import { LogOut, Trash2 } from 'lucide-react';

import { useAuthStore } from 'shared/store';
import { Button, Card, Input } from 'shared/ui';

export const SecuritySettings = () => {
  const { clearAuth } = useAuthStore();

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
          />
          <Input
            label="New Password"
            type="password"
            placeholder="Enter new password"
          />
          <Input
            label="Confirm New Password"
            type="password"
            placeholder="Confirm new password"
          />
          <Button>Update Password</Button>
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
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-red-600 dark:text-red-400">
              Delete Account
            </h3>
            <p className="text-sm text-muted-foreground">
              Permanently delete your account and all associated data
            </p>
          </div>
          <Button variant="danger" size="sm">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </Card>
    </div>
  );
};

'use client';

import { Button, Card } from 'shared/ui';

export const NotificationSettings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Notification Settings</h2>
        <p className="text-sm text-muted-foreground">
          Choose what notifications you want to receive
        </p>
      </div>

      <Card className="border" padding="lg">
        <div className="space-y-4">
          <h3 className="font-medium">Email Notifications</h3>
          {[
            {
              label: 'New feature requests',
              description: 'When a new feature is created',
              defaultChecked: true,
            },
            {
              label: 'Spec generated',
              description: 'When AI generates a spec for your feature',
              defaultChecked: true,
            },
            {
              label: 'Questions & answers',
              description: 'When someone asks or answers a question',
              defaultChecked: false,
            },
            {
              label: 'Status changes',
              description: 'When a feature status is updated',
              defaultChecked: true,
            },
          ].map(item => (
            <div key={item.label} className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium">{item.label}</p>
                <p className="text-xs text-muted-foreground">
                  {item.description}
                </p>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  defaultChecked={item.defaultChecked}
                  className="peer sr-only"
                />
                <div className="h-5 w-9 rounded-full bg-muted after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all peer-checked:bg-primary peer-checked:after:translate-x-4" />
              </label>
            </div>
          ))}
        </div>
      </Card>

      <Card className="border" padding="lg">
        <div className="space-y-4">
          <h3 className="font-medium">In-App Notifications</h3>
          {[
            {
              label: 'Desktop notifications',
              description: 'Show browser notifications',
              defaultChecked: false,
            },
            {
              label: 'Sound alerts',
              description: 'Play sound for new notifications',
              defaultChecked: false,
            },
          ].map(item => (
            <div key={item.label} className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium">{item.label}</p>
                <p className="text-xs text-muted-foreground">
                  {item.description}
                </p>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  defaultChecked={item.defaultChecked}
                  className="peer sr-only"
                />
                <div className="h-5 w-9 rounded-full bg-muted after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all peer-checked:bg-primary peer-checked:after:translate-x-4" />
              </label>
            </div>
          ))}
        </div>
      </Card>

      <div className="flex justify-end">
        <Button>Save Preferences</Button>
      </div>
    </div>
  );
};

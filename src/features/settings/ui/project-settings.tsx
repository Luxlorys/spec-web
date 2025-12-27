'use client';

import { Button, Card, Input } from 'shared/ui';

export const ProjectSettings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Project Settings</h2>
        <p className="text-sm text-muted-foreground">
          Manage your project configuration and details
        </p>
      </div>

      <Card className="border" padding="lg">
        <div className="space-y-4">
          <Input
            label="Project Name"
            defaultValue="TechStart Inc."
            placeholder="Your project name"
          />
          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Description
            </label>
            <textarea
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              rows={3}
              placeholder="Describe your project..."
              defaultValue="Building the next generation of productivity tools"
            />
          </div>
          <Input
            label="Website"
            type="url"
            placeholder="https://yourproject.com"
          />
        </div>
      </Card>

      <Card className="border border-red-200 dark:border-red-900" padding="lg">
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-red-600 dark:text-red-400">
              Danger Zone
            </h3>
            <p className="text-sm text-muted-foreground">
              Irreversible actions for your project
            </p>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-red-200 p-4 dark:border-red-900">
            <div>
              <p className="font-medium">Delete Project</p>
              <p className="text-sm text-muted-foreground">
                Permanently delete this project and all its data
              </p>
            </div>
            <Button variant="danger" size="sm">
              Delete Project
            </Button>
          </div>
        </div>
      </Card>

      <div className="flex justify-end">
        <Button>Save Changes</Button>
      </div>
    </div>
  );
};

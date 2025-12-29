'use client';

import { useEffect, useState } from 'react';

import { useAuthStore } from 'shared/store';
import { Button, Card, Input } from 'shared/ui';

import { useDeleteOrganization, useUpdateOrganization } from '../api';

export const ProjectSettings = () => {
  const { user } = useAuthStore();
  const updateOrganizationMutation = useUpdateOrganization();
  const deleteOrganizationMutation = useDeleteOrganization();

  const organization = user?.organization;

  const [name, setName] = useState(organization?.name ?? '');
  const [description, setDescription] = useState(
    organization?.description ?? '',
  );
  const [website, setWebsite] = useState(organization?.website ?? '');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Sync form state with organization data
  useEffect(() => {
    if (organization) {
      setName(organization.name);
      setDescription(organization.description ?? '');
      setWebsite(organization.website ?? '');
    }
  }, [organization]);

  const hasChanges =
    name !== organization?.name ||
    description !== (organization?.description ?? '') ||
    website !== (organization?.website ?? '');

  const handleSave = async () => {
    if (!hasChanges) {
      return;
    }

    await updateOrganizationMutation.mutateAsync({
      name: name || undefined,
      description: description || null,
      website: website || null,
    });
  };

  const handleDelete = async () => {
    await deleteOrganizationMutation.mutateAsync();
  };

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
            value={name}
            onChange={e => setName(e.target.value)}
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
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>
          <Input
            label="Website"
            type="url"
            placeholder="https://yourproject.com"
            value={website}
            onChange={e => setWebsite(e.target.value)}
          />

          {updateOrganizationMutation.isError && (
            <p className="text-sm text-red-600 dark:text-red-400">
              {(updateOrganizationMutation.error as Error).message ||
                'Failed to update project'}
            </p>
          )}

          {updateOrganizationMutation.isSuccess && (
            <p className="text-sm text-green-600 dark:text-green-400">
              Project settings updated successfully
            </p>
          )}

          <div className="flex justify-end">
            <Button
              onClick={handleSave}
              disabled={!hasChanges || updateOrganizationMutation.isPending}
            >
              {updateOrganizationMutation.isPending
                ? 'Saving...'
                : 'Save Changes'}
            </Button>
          </div>

          {/* Danger Zone */}
          <div className="border-t border-red-200 pt-4 dark:border-red-900">
            <div className="mb-4">
              <h3 className="font-medium text-red-600 dark:text-red-400">
                Danger Zone
              </h3>
              <p className="text-sm text-muted-foreground">
                Irreversible actions for your project
              </p>
            </div>

            {showDeleteConfirm ? (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-900/20">
                <p className="mb-4 text-sm text-muted-foreground">
                  Are you sure you want to delete this project? This will remove
                  all team members and data permanently. This action cannot be
                  undone.
                </p>

                {deleteOrganizationMutation.isError && (
                  <p className="mb-4 text-sm text-red-600 dark:text-red-400">
                    {(deleteOrganizationMutation.error as Error).message ||
                      'Failed to delete project'}
                  </p>
                )}

                <div className="flex gap-3">
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={handleDelete}
                    disabled={deleteOrganizationMutation.isPending}
                  >
                    {deleteOrganizationMutation.isPending
                      ? 'Deleting...'
                      : 'Yes, Delete Project'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowDeleteConfirm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between rounded-lg border border-red-200 p-4 dark:border-red-900">
                <div>
                  <p className="font-medium">Delete Project</p>
                  <p className="text-sm text-muted-foreground">
                    Permanently delete this project and all its data
                  </p>
                </div>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  Delete Project
                </Button>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

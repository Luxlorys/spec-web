'use client';

import { useState } from 'react';

import { Plus, Trash2 } from 'lucide-react';
import { useFieldArray } from 'react-hook-form';

import { Button, Card, Input } from 'shared/ui';

import { useProjectForm } from '../hooks';

export const ProjectSettings = () => {
  const {
    form,
    onSubmit,
    handleDelete,
    isLoading,
    isSuccess,
    error,
    isDeleting,
    deleteError,
  } = useProjectForm();

  const {
    register,
    control,
    formState: { errors, isDirty },
  } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'userPersonas',
  });

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Project Settings</h2>
        <p className="text-sm text-muted-foreground">
          Manage your project configuration and details
        </p>
      </div>

      <form onSubmit={onSubmit}>
        <Card className="border" padding="lg">
          <div className="space-y-4">
            <Input
              {...register('name')}
              label="Project Name"
              placeholder="Your project name"
              error={errors.name?.message}
            />
            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Description
              </label>
              <textarea
                {...register('description')}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                rows={3}
                placeholder="Describe your project..."
              />
              {errors.description?.message && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.description.message}
                </p>
              )}
            </div>
            <Input
              {...register('website')}
              label="Website"
              type="url"
              placeholder="https://yourproject.com"
              error={errors.website?.message}
            />

            {/* Product Context Section */}
            <div className="border-t pt-4">
              <h3 className="mb-4 font-medium">Product Context</h3>
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium">
                    Product Vision
                  </label>
                  <textarea
                    {...register('productVision')}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    rows={3}
                    placeholder="What is the long-term vision for your product?"
                  />
                  {errors.productVision?.message && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.productVision.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium">
                    Target Market
                  </label>
                  <textarea
                    {...register('targetMarket')}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    rows={3}
                    placeholder="Who is your target audience?"
                  />
                  {errors.targetMarket?.message && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.targetMarket.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium">
                    Tech Stack
                  </label>
                  <textarea
                    {...register('techStack')}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    rows={3}
                    placeholder="What technologies does your product use?"
                  />
                  {errors.techStack?.message && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.techStack.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* User Personas Section */}
            <div className="border-t pt-4">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="font-medium">User Personas</h3>
                  <p className="text-sm text-muted-foreground">
                    Define the target users for your product
                  </p>
                </div>
                {fields.length < 20 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => append({ name: '', description: '' })}
                  >
                    <Plus className="mr-1 h-4 w-4" />
                    Add Persona
                  </Button>
                )}
              </div>

              {errors.userPersonas?.message && (
                <p className="mb-4 text-sm text-red-600 dark:text-red-400">
                  {errors.userPersonas.message}
                </p>
              )}

              {fields.length === 0 ? (
                <div className="rounded-lg border border-dashed p-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    No personas defined yet. Add a persona to describe your
                    target users.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="rounded-lg border bg-muted/30 p-4"
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <span className="text-sm font-medium">
                          Persona {index + 1}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => remove(index)}
                        >
                          <Trash2 className="h-4 w-4 text-muted-foreground hover:text-red-500" />
                        </Button>
                      </div>
                      <div className="space-y-3">
                        <Input
                          {...register(`userPersonas.${index}.name`)}
                          label="Name"
                          placeholder="e.g., Power User, Casual Browser"
                          error={errors.userPersonas?.[index]?.name?.message}
                        />
                        <div>
                          <label className="mb-1.5 block text-sm font-medium">
                            Description
                          </label>
                          <textarea
                            {...register(`userPersonas.${index}.description`)}
                            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                            rows={2}
                            placeholder="Describe this persona's goals, needs, and behaviors..."
                          />
                          {errors.userPersonas?.[index]?.description
                            ?.message && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                              {errors.userPersonas[index]?.description?.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {error && (
              <p className="text-sm text-red-600 dark:text-red-400">
                {error.message || 'Failed to update project'}
              </p>
            )}

            {isSuccess && (
              <p className="text-sm text-green-600 dark:text-green-400">
                Project settings updated successfully
              </p>
            )}

            <div className="flex justify-end">
              <Button type="submit" disabled={!isDirty || isLoading}>
                {isLoading ? 'Saving...' : 'Save Changes'}
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
                    Are you sure you want to delete this project? This will
                    remove all team members and data permanently. This action
                    cannot be undone.
                  </p>

                  {deleteError && (
                    <p className="mb-4 text-sm text-red-600 dark:text-red-400">
                      {deleteError.message || 'Failed to delete project'}
                    </p>
                  )}

                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="danger"
                      size="sm"
                      onClick={handleDelete}
                      disabled={isDeleting}
                    >
                      {isDeleting ? 'Deleting...' : 'Yes, Delete Project'}
                    </Button>
                    <Button
                      type="button"
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
                    type="button"
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
      </form>
    </div>
  );
};

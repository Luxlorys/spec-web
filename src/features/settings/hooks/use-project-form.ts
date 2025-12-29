import { useEffect } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { useAuthStore } from 'shared/store';

import { useDeleteOrganization, useUpdateOrganization } from '../api';

const trimmedString = z.string().transform(val => val.trim());

const projectSchema = z.object({
  name: trimmedString.pipe(
    z.string().min(1, { message: 'Project name is required' }),
  ),
  description: trimmedString.optional(),
  website: trimmedString
    .pipe(z.string().url({ message: 'Please enter a valid URL' }))
    .optional()
    .or(z.literal('')),
});

export type ProjectFormData = z.infer<typeof projectSchema>;

export const useProjectForm = () => {
  const { user } = useAuthStore();
  const updateOrganizationMutation = useUpdateOrganization();
  const deleteOrganizationMutation = useDeleteOrganization();

  const organization = user?.organization;

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: organization?.name ?? '',
      description: organization?.description ?? '',
      website: organization?.website ?? '',
    },
  });

  // Sync form state with organization data
  useEffect(() => {
    if (organization) {
      form.reset({
        name: organization.name,
        description: organization.description ?? '',
        website: organization.website ?? '',
      });
    }
  }, [organization, form]);

  const onSubmit = form.handleSubmit(async (data: ProjectFormData) => {
    await updateOrganizationMutation.mutateAsync({
      name: data.name || undefined,
      description: data.description || null,
      website: data.website || null,
    });
    form.reset(data);
  });

  const handleDelete = async () => {
    await deleteOrganizationMutation.mutateAsync();
  };

  return {
    form,
    onSubmit,
    handleDelete,
    isLoading: updateOrganizationMutation.isPending,
    isSuccess: updateOrganizationMutation.isSuccess,
    error: updateOrganizationMutation.error as Error | null,
    isDeleting: deleteOrganizationMutation.isPending,
    deleteError: deleteOrganizationMutation.error as Error | null,
  };
};

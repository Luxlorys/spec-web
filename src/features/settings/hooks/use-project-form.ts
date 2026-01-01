import { useEffect } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { useAuthStore } from 'shared/store';

import { useDeleteOrganization, useUpdateOrganization } from '../api';

const trimmedString = z.string().transform(val => val.trim());

const userPersonaSchema = z.object({
  name: trimmedString.pipe(
    z
      .string()
      .min(1, { message: 'Name is required' })
      .max(100, { message: 'Name must be 100 characters or less' }),
  ),
  description: trimmedString.pipe(
    z
      .string()
      .min(1, { message: 'Description is required' })
      .max(1000, { message: 'Description must be 1000 characters or less' }),
  ),
});

const projectSchema = z.object({
  name: trimmedString.pipe(
    z.string().min(1, { message: 'Project name is required' }),
  ),
  description: trimmedString.optional(),
  website: trimmedString
    .pipe(z.string().url({ message: 'Please enter a valid URL' }))
    .optional()
    .or(z.literal('')),
  productVision: trimmedString
    .pipe(
      z.string().max(5000, {
        message: 'Product vision must be 5000 characters or less',
      }),
    )
    .optional()
    .or(z.literal('')),
  targetMarket: trimmedString
    .pipe(
      z.string().max(5000, {
        message: 'Target market must be 5000 characters or less',
      }),
    )
    .optional()
    .or(z.literal('')),
  techStack: trimmedString
    .pipe(
      z
        .string()
        .max(5000, { message: 'Tech stack must be 5000 characters or less' }),
    )
    .optional()
    .or(z.literal('')),
  userPersonas: z
    .array(userPersonaSchema)
    .max(20, { message: 'Maximum 20 personas allowed' })
    .optional(),
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
      productVision: organization?.productVision ?? '',
      targetMarket: organization?.targetMarket ?? '',
      techStack: organization?.techStack ?? '',
      userPersonas: organization?.userPersonas ?? [],
    },
  });

  // Sync form state with organization data
  useEffect(() => {
    if (organization) {
      form.reset({
        name: organization.name,
        description: organization.description ?? '',
        website: organization.website ?? '',
        productVision: organization.productVision ?? '',
        targetMarket: organization.targetMarket ?? '',
        techStack: organization.techStack ?? '',
        userPersonas: organization.userPersonas ?? [],
      });
    }
  }, [organization, form]);

  const onSubmit = form.handleSubmit(async (data: ProjectFormData) => {
    await updateOrganizationMutation.mutateAsync({
      name: data.name || undefined,
      description: data.description || null,
      website: data.website || null,
      productVision: data.productVision || null,
      targetMarket: data.targetMarket || null,
      techStack: data.techStack || null,
      userPersonas: data.userPersonas?.length ? data.userPersonas : null,
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

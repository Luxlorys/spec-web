'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { Button, Input, Textarea, Card } from 'shared/ui';
import { createFeatureSchema, CreateFeatureInput } from 'features/feature-requests/lib';
import { featureRequestsApi } from 'shared/api/feature-requests';
import { QueryKeys } from 'shared/constants';
import { queryClient } from 'shared/lib';

function NewFeatureContent() {
  const router = useRouter();
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateFeatureInput>({
    resolver: zodResolver(createFeatureSchema),
    defaultValues: {
      title: '',
      initialContext: '',
    },
  });

  const createMutation = useMutation({
    mutationFn: featureRequestsApi.create,
    onSuccess: feature => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.FEATURE_REQUESTS] });
      // Redirect to AI conversation
      router.push(`/features/${feature.id}/conversation`);
    },
    onError: (err: Error) => {
      setError(err.message);
    },
  });

  const onSubmit = async (values: CreateFeatureInput) => {
    setError('');
    createMutation.mutate(values);
  };

  return (
    <main className="mx-auto max-w-3xl p-6">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-gray-100">
            Create New Feature Request
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Start by giving your feature a name and optional context. The AI will guide you through
            the rest.
          </p>
        </div>

        <Card>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Input
                {...register('title')}
                label="Feature Title"
                placeholder="e.g., User Authentication System"
                error={errors.title?.message}
                helperText="A clear, concise name for this feature"
              />
            </div>

            <div>
              <Textarea
                {...register('initialContext')}
                label="Initial Context (Optional)"
                placeholder="Describe what you're thinking... You can share rough notes, ideas, or just leave this blank and let the AI ask you questions."
                rows={6}
                error={errors.initialContext?.message}
                helperText="Any background information, rough notes, or initial thoughts"
              />
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-400">
                {error}
              </div>
            )}

            <div className="flex items-center gap-3">
              <Button type="submit" isLoading={createMutation.isPending}>
                Start AI Conversation
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={createMutation.isPending}
              >
                Cancel
              </Button>
            </div>

            <div className="rounded-lg border border-blue-100 bg-blue-50 p-4 dark:border-blue-900/50 dark:bg-blue-900/20">
              <h3 className="mb-2 text-sm font-semibold text-blue-900 dark:text-blue-100">
                What happens next?
              </h3>
              <ul className="space-y-1 text-sm text-blue-800 dark:text-blue-200">
                <li>• The AI will ask you questions to understand the feature</li>
                <li>• It will help identify edge cases and requirements</li>
                <li>• A comprehensive spec document will be generated</li>
                <li>• Your team can review and add comments</li>
              </ul>
            </div>
          </form>
        </Card>
    </main>
  );
}

export default function NewFeaturePage() {
  return <NewFeatureContent />;
}

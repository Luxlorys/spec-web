'use client';

import { useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useMutation, useQuery } from '@tanstack/react-query';

import { ActivityList, FeatureOverview } from 'features/feature-details';
import { useDeleteFeature } from 'features/feature-requests';
import {
  RegenerationModal,
  SpecView,
  useGetSpecification,
} from 'features/spec-document';
import { featureRequestsApi } from 'shared/api';
import { QueryKeys } from 'shared/constants';
import { queryClient, showApiError } from 'shared/lib';
import { FeatureStatus } from 'shared/types';
import { Button, EmptyState, Tabs } from 'shared/ui';

interface IProps {
  featureId: string;
}

export const FeatureDetailClient = ({ featureId }: IProps) => {
  const router = useRouter();
  const numericId = parseInt(featureId, 10);
  const [isRegenerationModalOpen, setIsRegenerationModalOpen] = useState(false);

  const { data: feature, isLoading: featureLoading } = useQuery({
    queryKey: [QueryKeys.FEATURE_REQUEST_BY_ID, numericId],
    queryFn: () => featureRequestsApi.getById(numericId),
    enabled: !Number.isNaN(numericId),
  });

  const { data: spec, isLoading: specLoading } = useGetSpecification(
    numericId,
    { enabled: !!feature },
  );

  const { data: activities, isLoading: activitiesLoading } = useQuery({
    queryKey: [QueryKeys.FEATURE_ACTIVITIES, numericId],
    queryFn: () => featureRequestsApi.getActivities(numericId),
    enabled: !!feature,
  });

  const updateStatusMutation = useMutation({
    mutationFn: (status: FeatureStatus) =>
      featureRequestsApi.updateStatus(numericId, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.FEATURE_REQUEST_BY_ID, numericId],
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.FEATURE_REQUESTS],
      });
    },
    onError: error => {
      showApiError(error);
    },
  });

  const deleteFeatureMutation = useDeleteFeature();

  const updateStatus = async (status: FeatureStatus) => {
    await updateStatusMutation.mutateAsync(status);
  };

  const handleDeleteFeature = async () => {
    await deleteFeatureMutation.mutateAsync(numericId);
    router.push('/dashboard');
  };

  if (featureLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!feature) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-600 dark:text-gray-400">Feature not found</p>
      </div>
    );
  }

  const hasSpec = !!spec;

  const renderSpecificationContent = () => {
    if (specLoading) {
      return (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      );
    }

    if (hasSpec && spec) {
      return <SpecView spec={spec} />;
    }

    return (
      <EmptyState
        title="No specification yet"
        description="Complete the AI conversation to generate a specification document"
        action={
          <Link href={`/features/${featureId}/conversation`}>
            <Button>Start Conversation</Button>
          </Link>
        }
      />
    );
  };

  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      content: (
        <FeatureOverview
          feature={feature}
          featureId={featureId}
          onStatusChange={updateStatus}
          isStatusChangePending={updateStatusMutation.isPending}
          onDeleteFeature={handleDeleteFeature}
          isDeletePending={deleteFeatureMutation.isPending}
        />
      ),
    },

    {
      id: 'specification',
      label: 'Specification',
      content: renderSpecificationContent(),
    },
    {
      id: 'activity',
      label: 'Activity',
      content: (
        <ActivityList activities={activities} isLoading={activitiesLoading} />
      ),
    },
  ];

  return (
    <>
      {/* Breadcrumb */}
      <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/dashboard" className="hover:text-foreground">
          Dashboard
        </Link>
        <span>/</span>
        <span className="text-foreground">{feature.title}</span>
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="mb-2 text-2xl font-bold text-foreground">
              {feature.title}
            </h1>
            {feature.initialContext && (
              <p className="text-muted-foreground">{feature.initialContext}</p>
            )}
          </div>

          {hasSpec && (
            <Button
              variant="outline"
              onClick={() => setIsRegenerationModalOpen(true)}
            >
              Regenerate Specification
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} defaultTab="overview" />

      {/* Regeneration Modal */}
      {spec && (
        <RegenerationModal
          isOpen={isRegenerationModalOpen}
          onClose={() => setIsRegenerationModalOpen(false)}
          currentSpec={spec}
        />
      )}
    </>
  );
};

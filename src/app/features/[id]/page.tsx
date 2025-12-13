'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import { AuthGuard } from 'shared/lib/auth-guard';
import { featureRequestsApi } from 'shared/api/feature-requests';
import { specDocumentsApi } from 'shared/api/spec-documents';
import { QueryKeys } from 'shared/constants';
import { Button, Tabs, Card, EmptyState } from 'shared/ui';
import { StatusBadge } from 'features/feature-requests';
import { SpecView } from 'features/spec-document';
import { queryClient } from 'shared/lib';
import { mockUsers } from 'shared/lib/mock-data';
import { formatRelativeTime } from 'shared/lib';
import { use } from 'react';

interface IProps {
  params: Promise<{ id: string }>;
}

function FeatureDetailContent({ featureId }: { featureId: string }) {
  const router = useRouter();

  const { data: feature, isLoading: featureLoading } = useQuery({
    queryKey: [QueryKeys.FEATURE_REQUEST_BY_ID, featureId],
    queryFn: () => featureRequestsApi.getById(featureId),
  });

  const { data: spec, isLoading: specLoading } = useQuery({
    queryKey: [QueryKeys.SPEC_BY_FEATURE, featureId],
    queryFn: () => specDocumentsApi.getByFeatureId(featureId),
    enabled: !!feature?.specDocumentId,
  });

  const updateStatusMutation = useMutation({
    mutationFn: (status: string) =>
      featureRequestsApi.update(featureId, { status: status as any }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.FEATURE_REQUEST_BY_ID, featureId],
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.FEATURE_REQUESTS],
      });
    }
  });

  if (featureLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
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

  const creator = mockUsers.find(u => u.id === feature.createdBy);
  const assignee = feature.assignedTo ? mockUsers.find(u => u.id === feature.assignedTo) : null;

  const createdAt = new Date(feature.createdAt);
  const updatedAt = new Date(feature.updatedAt);

  const hasSpec = !!spec;
  const hasConversation = !!feature.conversationId;

  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      content: (
        <div className="space-y-6">
          <Card>
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
              Feature Information
            </h3>
            <dl className="grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</dt>
                <dd className="mt-1">
                  <StatusBadge status={feature.status} />
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Created By</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                  {creator?.name || 'Unknown'}
                </dd>
              </div>

              {assignee && (
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Assigned To</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                    {assignee.name}
                  </dd>
                </div>
              )}

              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Activity</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                  {formatRelativeTime(feature.lastActivityAt)}
                </dd>
              </div>
            </dl>
          </Card>

          {feature.initialContext && (
            <Card>
              <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
                Initial Context
              </h3>
              <p className="text-gray-700 dark:text-gray-300">{feature.initialContext}</p>
            </Card>
          )}

          <Card>
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
              Quick Actions
            </h3>
            <div className="flex flex-wrap gap-3">
              {hasConversation ? (
                <Link href={`/features/${featureId}/conversation`}>
                  <Button variant="outline">View Conversation</Button>
                </Link>
              ) : (
                <Link href={`/features/${featureId}/conversation`}>
                  <Button>Start AI Conversation</Button>
                </Link>
              )}

              {feature.status === 'under_review' && (
                <Button
                  variant="primary"
                  onClick={() => updateStatusMutation.mutate('ready_to_build')}
                  isLoading={updateStatusMutation.isPending}
                >
                  Mark as Ready to Build
                </Button>
              )}

              {feature.status === 'ready_to_build' && (
                <Button
                  variant="primary"
                  onClick={() => updateStatusMutation.mutate('in_progress')}
                  isLoading={updateStatusMutation.isPending}
                >
                  Start Building
                </Button>
              )}

              {feature.status === 'in_progress' && (
                <Button
                  variant="primary"
                  onClick={() => updateStatusMutation.mutate('complete')}
                  isLoading={updateStatusMutation.isPending}
                >
                  Mark as Complete
                </Button>
              )}
            </div>
          </Card>
        </div>
      )
    },

    {
      id: 'specification',
      label: 'Specification',
      content: specLoading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
        </div>
      ) : hasSpec && spec ? (
        <SpecView spec={spec} />
      ) : (
        <EmptyState
          title="No specification yet"
          description="Complete the AI conversation to generate a specification document"
          action={
            <Link href={`/features/${featureId}/conversation`}>
              <Button>Start Conversation</Button>
            </Link>
          }
        />
      )
    },

    {
      id: 'comments',
      label: 'Comments',
      badge: feature.openQuestionsCount,
      content: (
        <EmptyState
          title="Comments Coming Soon"
          description="This feature will allow team members to discuss and ask questions about the specification"
        />
      )
    },

    {
      id: 'activity',
      label: 'Activity',
      content: (
        <Card>
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center dark:bg-blue-900">
                  <span className="text-blue-600 dark:text-blue-300 text-sm">📝</span>
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900 dark:text-gray-100">
                  <span className="font-medium">{creator?.name}</span> created this feature
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {formatRelativeTime(createdAt)}
                </p>
              </div>
            </div>

            {updatedAt.getTime() !== createdAt.getTime() && (
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center dark:bg-purple-900">
                    <span className="text-purple-600 dark:text-purple-300 text-sm">🔄</span>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900 dark:text-gray-100">
                    Feature status updated to <StatusBadge status={feature.status} />
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatRelativeTime(updatedAt)}
                  </p>
                </div>
              </div>
            )}
          </div>
        </Card>
      )
    }
  ];

  return (
    <main className="p-6">
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

          <Link href="/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} defaultTab="overview" />
    </main>
  );
}

export default function FeatureDetailPage({ params }: IProps) {
  const { id } = use(params);

  return (
    <AuthGuard>
      <FeatureDetailContent featureId={id} />
    </AuthGuard>
  );
}

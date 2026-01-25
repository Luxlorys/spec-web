'use client';

import { useParams, useRouter } from 'next/navigation';

import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Circle,
  Clock,
  FileText,
  Loader2,
} from 'lucide-react';

import { useBreakdown } from 'features/breakdown';
import { BreakdownStatus, FeatureStatus, IBreakdownFeature } from 'shared/api';
import { cn } from 'shared/lib';
import { Badge, Button, Card } from 'shared/ui';

const statusConfig: Record<
  BreakdownStatus,
  { label: string; color: string; icon: typeof Clock }
> = {
  IN_PROGRESS: {
    label: 'In Progress',
    color:
      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    icon: Clock,
  },
  COMPLETED: {
    label: 'Completed',
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    icon: CheckCircle2,
  },
  PARTIALLY_SPECIFIED: {
    label: 'Partially Specified',
    color:
      'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
    icon: Circle,
  },
  FULLY_SPECIFIED: {
    label: 'Fully Specified',
    color:
      'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    icon: CheckCircle2,
  },
};

const featureStatusConfig: Record<
  FeatureStatus,
  {
    label: string;
    variant:
      | 'default'
      | 'primary'
      | 'success'
      | 'warning'
      | 'danger'
      | 'gray'
      | 'blue'
      | 'purple';
  }
> = {
  DRAFT: {
    label: 'Draft',
    variant: 'gray',
  },
  SPEC_GENERATED: {
    label: 'Spec Generated',
    variant: 'blue',
  },
  READY_TO_BUILD: {
    label: 'Ready to Build',
    variant: 'success',
  },
  COMPLETED: {
    label: 'Completed',
    variant: 'purple',
  },
  ARCHIVED: {
    label: 'Archived',
    variant: 'gray',
  },
};

export default function BreakdownDetailPage() {
  const params = useParams();
  const router = useRouter();
  const breakdownId = Number(params.id);

  const { data: breakdown, isLoading } = useBreakdown(breakdownId);

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-2rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!breakdown) {
    return (
      <div className="flex h-[calc(100vh-2rem)] items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">Breakdown not found</p>
      </div>
    );
  }

  const createdFeatures = breakdown.features.filter(f => f.featureRequestId);
  const specsCompleted = createdFeatures.filter(
    f => f.featureStatus && f.featureStatus !== 'DRAFT',
  ).length;
  const totalFeatures = createdFeatures.length;

  const statusInfo = statusConfig[breakdown.status];
  const StatusIcon = statusInfo.icon;

  return (
    <main className="min-h-[calc(100vh-2rem)] bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-6 py-4 dark:border-gray-700 dark:bg-gray-800">
        <div className="mx-auto max-w-4xl">
          <button
            type="button"
            onClick={() => router.push('/dashboard')}
            className="mb-3 flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </button>

          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                  {breakdown.title}
                </h1>
                <Badge className={cn('gap-1', statusInfo.color)}>
                  <StatusIcon className="h-3 w-3" />
                  {statusInfo.label}
                </Badge>
              </div>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Created by {breakdown.createdBy.firstName}{' '}
                {breakdown.createdBy.lastName}
                {' · '}
                {new Date(breakdown.createdAt).toLocaleDateString()}
              </p>
            </div>

            {breakdown.status === 'IN_PROGRESS' && (
              <Button
                onClick={() =>
                  router.push(`/breakdown/${breakdownId}/conversation`)
                }
                className="gap-2"
              >
                Continue Breakdown
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6">
        <div className="mx-auto max-w-4xl space-y-6">
          {/* Vision */}
          <Card>
            <h2 className="mb-3 text-sm font-semibold text-gray-900 dark:text-gray-100">
              Vision
            </h2>
            <p className="whitespace-pre-wrap text-sm text-gray-600 dark:text-gray-400">
              {breakdown.vision}
            </p>
          </Card>

          {/* Progress */}
          {totalFeatures > 0 && (
            <Card>
              <h2 className="mb-3 text-sm font-semibold text-gray-900 dark:text-gray-100">
                Progress
              </h2>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{
                        width: `${(specsCompleted / totalFeatures) * 100}%`,
                      }}
                    />
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {specsCompleted}/{totalFeatures} specs complete
                </span>
              </div>
            </Card>
          )}

          {/* Features */}
          <Card>
            <h2 className="mb-4 text-sm font-semibold text-gray-900 dark:text-gray-100">
              Features ({createdFeatures.length})
            </h2>
            {createdFeatures.length === 0 ? (
              <div className="py-8 text-center">
                <FileText className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600" />
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  No features created yet
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() =>
                    router.push(`/breakdown/${breakdownId}/conversation`)
                  }
                >
                  Start Breakdown
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {createdFeatures.map((feature, index) => (
                  <FeatureRow
                    key={feature.id}
                    feature={feature}
                    index={index}
                    onClick={() => {
                      if (feature.featureRequestId) {
                        router.push(`/features/${feature.featureRequestId}`);
                      }
                    }}
                  />
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </main>
  );
}

interface FeatureRowProps {
  feature: IBreakdownFeature;
  index: number;
  onClick: () => void;
}

const FeatureRow = ({ feature, index, onClick }: FeatureRowProps) => {
  const status = feature.featureStatus || 'DRAFT';
  const statusInfo = featureStatusConfig[status];

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 text-left transition-colors hover:border-primary/50 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-primary/50 dark:hover:bg-gray-700"
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-400">
        {index + 1}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-gray-900 dark:text-gray-100">
            {feature.title}
          </h3>
          <Badge variant={statusInfo.variant} size="sm">
            {statusInfo.label}
          </Badge>
        </div>
        <p className="mt-0.5 truncate text-sm text-gray-500 dark:text-gray-400">
          {feature.description}
        </p>
      </div>
      <ArrowRight className="h-5 w-5 shrink-0 text-gray-400" />
    </button>
  );
};

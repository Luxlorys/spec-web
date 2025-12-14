'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { LayoutGrid, List } from 'lucide-react';
import { featureRequestsApi } from 'shared/api/feature-requests';
import { QueryKeys } from 'shared/constants';
import {
  Button,
  EmptyState,
  Card,
  TabsRoot,
  TabsList,
  TabsTrigger,
  TabsContent,
} from 'shared/ui';
import { FeatureCard } from 'features/feature-requests';
import { FeatureStatus } from 'shared/types';
import { cn } from 'shared/lib';

type TabFilter = 'all' | 'in_progress' | 'generated' | 'review' | 'ready';

const tabToStatuses: Record<TabFilter, FeatureStatus[] | null> = {
  all: null,
  in_progress: ['intake_in_progress', 'in_progress'],
  generated: ['spec_generated'],
  review: ['under_review'],
  ready: ['ready_to_build'],
};

function FeaturesList({
  features,
  viewMode,
  isLoading,
  showCreateButton,
}: {
  features: ReturnType<typeof featureRequestsApi.getAll> extends Promise<infer T> ? T : never;
  viewMode: 'grid' | 'list';
  isLoading: boolean;
  showCreateButton: boolean;
}) {
  if (isLoading) {
    return (
      <div
        className={cn(
          'gap-4',
          viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid'
        )}
      >
        {[1, 2, 3].map((i) => (
          <Card key={i} padding="md" className="h-40 animate-pulse border">
            <div />
          </Card>
        ))}
      </div>
    );
  }

  if (!features || features.length === 0) {
    return (
      <EmptyState
        title="No feature requests found"
        description={
          showCreateButton
            ? 'Get started by creating your first feature request'
            : 'Try adjusting your filters'
        }
        action={
          showCreateButton ? (
            <Link href="/features/new">
              <Button>Create First Feature</Button>
            </Link>
          ) : null
        }
      />
    );
  }

  return (
    <div
      className={cn(
        'gap-4',
        viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid'
      )}
    >
      {features.map((feature) => (
        <FeatureCard key={feature.id} feature={feature} variant={viewMode} />
      ))}
    </div>
  );
}

function DashboardContent() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const { data: features, isLoading } = useQuery({
    queryKey: [QueryKeys.FEATURE_REQUESTS],
    queryFn: () => featureRequestsApi.getAll({}),
  });

  const statsCounts = features?.reduce(
    (acc, f) => {
      acc[f.status] = (acc[f.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const getFilteredFeatures = (tab: TabFilter) => {
    if (!features) return [];
    const statuses = tabToStatuses[tab];
    if (!statuses) return features;
    return features.filter((f) => statuses.includes(f.status));
  };

  const getTabCount = (tab: TabFilter): number => {
    return getFilteredFeatures(tab).length;
  };

  return (
    <main className="p-6">
      <div className="mb-6">
        <h1 className="mb-1 text-2xl font-bold text-foreground">Feature Requests</h1>
        <p className="text-sm text-muted-foreground">
          Manage and track all your feature specifications
        </p>
      </div>

      {/* Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card padding="sm" className="border">
          <div className="text-sm text-muted-foreground">Total Features</div>
          <div className="text-2xl font-bold">{features?.length || 0}</div>
        </Card>
        <Card padding="sm" className="border">
          <div className="text-sm text-muted-foreground">Ready to Build</div>
          <div className="text-2xl font-bold text-green-600">
            {statsCounts?.['ready_to_build'] || 0}
          </div>
        </Card>
        <Card padding="sm" className="border">
          <div className="text-sm text-muted-foreground">Under Review</div>
          <div className="text-2xl font-bold text-yellow-600">
            {statsCounts?.['under_review'] || 0}
          </div>
        </Card>
        <Card padding="sm" className="border">
          <div className="text-sm text-muted-foreground">In Progress</div>
          <div className="text-2xl font-bold text-blue-600">
            {(statsCounts?.['in_progress'] || 0) + (statsCounts?.['intake_in_progress'] || 0)}
          </div>
        </Card>
      </div>

      {/* Tabs and View Toggle */}
      <TabsRoot defaultValue="all">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <TabsList>
            <TabsTrigger value="all" badge={getTabCount('all')}>
              All
            </TabsTrigger>
            <TabsTrigger value="in_progress" badge={getTabCount('in_progress')}>
              In Progress
            </TabsTrigger>
            <TabsTrigger value="generated" badge={getTabCount('generated')}>
              Generated
            </TabsTrigger>
            <TabsTrigger value="review" badge={getTabCount('review')}>
              Review
            </TabsTrigger>
            <TabsTrigger value="ready" badge={getTabCount('ready')}>
              Ready
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-lg border bg-muted/50 p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  'rounded-md p-1.5 transition-colors',
                  viewMode === 'grid'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
                title="Grid view"
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  'rounded-md p-1.5 transition-colors',
                  viewMode === 'list'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
                title="List view"
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Tab Contents */}
        <TabsContent value="all">
          <FeaturesList
            features={getFilteredFeatures('all')}
            viewMode={viewMode}
            isLoading={isLoading}
            showCreateButton={true}
          />
        </TabsContent>

        <TabsContent value="in_progress">
          <FeaturesList
            features={getFilteredFeatures('in_progress')}
            viewMode={viewMode}
            isLoading={isLoading}
            showCreateButton={false}
          />
        </TabsContent>

        <TabsContent value="generated">
          <FeaturesList
            features={getFilteredFeatures('generated')}
            viewMode={viewMode}
            isLoading={isLoading}
            showCreateButton={false}
          />
        </TabsContent>

        <TabsContent value="review">
          <FeaturesList
            features={getFilteredFeatures('review')}
            viewMode={viewMode}
            isLoading={isLoading}
            showCreateButton={false}
          />
        </TabsContent>

        <TabsContent value="ready">
          <FeaturesList
            features={getFilteredFeatures('ready')}
            viewMode={viewMode}
            isLoading={isLoading}
            showCreateButton={false}
          />
        </TabsContent>
      </TabsRoot>
    </main>
  );
}

export default function DashboardPage() {
  return <DashboardContent />;
}

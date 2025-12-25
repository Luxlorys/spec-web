'use client';

import { useState } from 'react';

import Link from 'next/link';

import { useQuery } from '@tanstack/react-query';
import { Home, LayoutGrid, List } from 'lucide-react';

import { FeatureCard } from 'features/feature-requests';
import { featureRequestsApi } from 'shared/api';
import { QueryKeys } from 'shared/constants';
import { cn } from 'shared/lib';
import { FeatureStatus } from 'shared/types';
import {
  Button,
  Card,
  EmptyState,
  TabsContent,
  TabsList,
  TabsRoot,
  TabsTrigger,
} from 'shared/ui';

type TabFilter =
  | 'all'
  | 'draft'
  | 'spec_generated'
  | 'ready_to_build'
  | 'completed';

const tabToStatuses: Record<TabFilter, FeatureStatus[] | null> = {
  all: null,
  draft: ['draft'],
  spec_generated: ['spec_generated'],
  ready_to_build: ['ready_to_build'],
  completed: ['completed'],
};

const FeaturesList = ({
  features,
  viewMode,
  isLoading,
  showCreateButton,
}: {
  features: ReturnType<typeof featureRequestsApi.getAll> extends Promise<
    infer T
  >
    ? T
    : never;
  viewMode: 'grid' | 'list';
  isLoading: boolean;
  showCreateButton: boolean;
}) => {
  if (isLoading) {
    return (
      <div
        className={cn(
          'gap-4',
          viewMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
            : 'grid',
        )}
      >
        {[1, 2, 3].map(i => (
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
        viewMode === 'grid'
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
          : 'grid',
      )}
    >
      {features.map(feature => (
        <FeatureCard key={feature.id} feature={feature} variant={viewMode} />
      ))}
    </div>
  );
};

const DashboardContent = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const { data: features, isLoading } = useQuery({
    queryKey: [QueryKeys.FEATURE_REQUESTS],
    queryFn: () => featureRequestsApi.getAll({}),
  });

  const getFilteredFeatures = (tab: TabFilter) => {
    if (!features) {
      return [];
    }
    const statuses = tabToStatuses[tab];

    if (!statuses) {
      return features;
    }

    return features.filter(f => statuses.includes(f.status));
  };

  const getTabCount = (tab: TabFilter): number => {
    return getFilteredFeatures(tab).length;
  };

  return (
    <main className="p-6">
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-2">
            <Home className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Feature Requests
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage and track all your feature specifications
            </p>
          </div>
        </div>
      </div>

      {/* Tabs and View Toggle */}
      <TabsRoot defaultValue="all">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <TabsList>
            <TabsTrigger value="all" badge={getTabCount('all')}>
              All
            </TabsTrigger>
            <TabsTrigger value="draft" badge={getTabCount('draft')}>
              Draft
            </TabsTrigger>
            <TabsTrigger
              value="spec_generated"
              badge={getTabCount('spec_generated')}
            >
              Spec Generated
            </TabsTrigger>
            <TabsTrigger
              value="ready_to_build"
              badge={getTabCount('ready_to_build')}
            >
              Ready to Build
            </TabsTrigger>
            <TabsTrigger value="completed" badge={getTabCount('completed')}>
              Completed
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-lg border bg-muted/50 p-1">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={cn(
                  'rounded-md p-1.5 transition-colors',
                  viewMode === 'grid'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground',
                )}
                title="Grid view"
                aria-label="Grid view"
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={cn(
                  'rounded-md p-1.5 transition-colors',
                  viewMode === 'list'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground',
                )}
                title="List view"
                aria-label="List view"
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
            showCreateButton
          />
        </TabsContent>

        <TabsContent value="draft">
          <FeaturesList
            features={getFilteredFeatures('draft')}
            viewMode={viewMode}
            isLoading={isLoading}
            showCreateButton={false}
          />
        </TabsContent>

        <TabsContent value="spec_generated">
          <FeaturesList
            features={getFilteredFeatures('spec_generated')}
            viewMode={viewMode}
            isLoading={isLoading}
            showCreateButton={false}
          />
        </TabsContent>

        <TabsContent value="ready_to_build">
          <FeaturesList
            features={getFilteredFeatures('ready_to_build')}
            viewMode={viewMode}
            isLoading={isLoading}
            showCreateButton={false}
          />
        </TabsContent>

        <TabsContent value="completed">
          <FeaturesList
            features={getFilteredFeatures('completed')}
            viewMode={viewMode}
            isLoading={isLoading}
            showCreateButton={false}
          />
        </TabsContent>
      </TabsRoot>
    </main>
  );
};

export default function DashboardPage() {
  return <DashboardContent />;
}

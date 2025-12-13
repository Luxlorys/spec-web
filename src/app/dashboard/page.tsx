'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { LayoutGrid, List } from 'lucide-react';
import { featureRequestsApi } from 'shared/api/feature-requests';
import { QueryKeys } from 'shared/constants';
import { Button, Input, EmptyState, Card } from 'shared/ui';
import { FeatureCard } from 'features/feature-requests';
import { AuthGuard } from 'shared/lib/auth-guard';
import { FeatureStatus } from 'shared/types';
import { cn } from 'shared/lib';

type TabFilter = 'all' | 'in_progress' | 'generated' | 'review' | 'ready';

const tabs: { id: TabFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'in_progress', label: 'In Progress' },
  { id: 'generated', label: 'Generated' },
  { id: 'review', label: 'Review' },
  { id: 'ready', label: 'Ready' },
];

const tabToStatuses: Record<TabFilter, FeatureStatus[] | null> = {
  all: null,
  in_progress: ['intake_in_progress', 'in_progress'],
  generated: ['spec_generated'],
  review: ['under_review'],
  ready: ['ready_to_build'],
};

function DashboardContent() {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<TabFilter>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const { data: features, isLoading } = useQuery({
    queryKey: [QueryKeys.FEATURE_REQUESTS, { search }],
    queryFn: () =>
      featureRequestsApi.getAll({
        search: search || undefined,
      }),
  });

  const filteredFeatures = features?.filter(f => {
    const statuses = tabToStatuses[activeTab];
    if (!statuses) return true;
    return statuses.includes(f.status);
  });

  const statsCounts = features?.reduce(
    (acc, f) => {
      acc[f.status] = (acc[f.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const getTabCount = (tab: TabFilter): number => {
    if (tab === 'all') return features?.length || 0;
    const statuses = tabToStatuses[tab];
    if (!statuses || !features) return 0;
    return features.filter(f => statuses.includes(f.status)).length;
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
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-1 rounded-lg border bg-muted/50 p-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                activeTab === tab.id
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {tab.label} ({getTabCount(tab.id)})
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-lg border bg-muted/50 p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                'rounded-md p-1.5 transition-colors',
                viewMode === 'grid'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
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
                  : 'text-muted-foreground hover:text-foreground',
              )}
              title="List view"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Features Grid/List */}
      {isLoading ? (
        <div
          className={cn(
            'gap-4',
            viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid',
          )}
        >
          {[1, 2, 3].map(i => (
            <Card key={i} padding="md" className="h-40 animate-pulse border">
              <div />
            </Card>
          ))}
        </div>
      ) : filteredFeatures && filteredFeatures.length > 0 ? (
        <div
          className={cn(
            'gap-4',
            viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid',
          )}
        >
          {filteredFeatures.map(feature => (
            <FeatureCard key={feature.id} feature={feature} variant={viewMode} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No feature requests found"
          description={
            search || activeTab !== 'all'
              ? 'Try adjusting your filters'
              : 'Get started by creating your first feature request'
          }
          action={
            !search && activeTab === 'all' ? (
              <Link href="/features/new">
                <Button>Create First Feature</Button>
              </Link>
            ) : null
          }
        />
      )}
    </main>
  );
}

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  );
}

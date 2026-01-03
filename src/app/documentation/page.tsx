'use client';

import { Suspense } from 'react';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { BookOpen, Clock, Loader2, RefreshCw } from 'lucide-react';

import {
  FeaturesTab,
  GlossaryTab,
  OverviewTab,
  ProductContextTab,
  useGetDocumentation,
  useRegenerateDocumentation,
} from 'features/documentation';
import { useAuthStore } from 'shared/store';
import {
  Badge,
  Button,
  Card,
  EmptyState,
  Skeleton,
  TabsContent,
  TabsList,
  TabsRoot,
  TabsTrigger,
} from 'shared/ui';

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const getEmptyStateDescription = (
  completedFeatureCount: number,
  isFounder: boolean,
) => {
  if (completedFeatureCount === 0) {
    return 'Complete at least one feature to generate project documentation.';
  }

  if (isFounder) {
    return 'Click "Generate Documentation" to create comprehensive documentation from your completed features. This process typically takes about 1 minute.';
  }

  return 'Documentation will be generated once the founder initiates the process.';
};

const GeneratingState = () => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
    <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
      Generating Documentation
    </h3>
    <p className="mb-2 max-w-sm text-sm text-gray-600 dark:text-gray-400">
      AI is analyzing your completed features and creating comprehensive
      documentation.
    </p>
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Clock className="h-4 w-4" />
      <span>This typically takes about 1 minute</span>
    </div>
  </div>
);

const LoadingSkeleton = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div className="flex gap-4">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-5 w-24" />
      </div>
      <Skeleton className="h-9 w-32" />
    </div>
    <Skeleton className="h-10 w-full max-w-md" />
    <div className="space-y-4">
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-32 w-full" />
    </div>
  </div>
);

const VALID_TABS = ['overview', 'context', 'features', 'glossary'] as const;

type TabValue = (typeof VALID_TABS)[number];

const DocumentationContent = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { user } = useAuthStore();
  const isFounder = user?.isFounder ?? false;

  const { data, isLoading, error } = useGetDocumentation({ enabled: !!user });
  const regenerateMutation = useRegenerateDocumentation();

  // Generation is in progress if backend says so OR if we just triggered it
  const isGenerating = data?.isPending || regenerateMutation.isPending;

  const tabParam = searchParams.get('tab');
  const activeTab: TabValue =
    tabParam && VALID_TABS.includes(tabParam as TabValue)
      ? (tabParam as TabValue)
      : 'overview';

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set('tab', value);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleRegenerate = async () => {
    try {
      await regenerateMutation.mutateAsync();
    } catch {
      // Error is handled by the mutation
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-2">
            <BookOpen className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Documentation
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              AI-generated project documentation and feature specifications
            </p>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && <LoadingSkeleton />}

      {/* Error State */}
      {error && !isLoading && (
        <Card className="border border-red-200 p-6 dark:border-red-900">
          <p className="text-sm text-red-600 dark:text-red-400">
            Failed to load documentation. Please try again later.
          </p>
        </Card>
      )}

      {/* Content */}
      {!isLoading && !error && data && (
        <>
          {/* Metadata Bar */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              {data.updatedAt && (
                <span>Last updated: {formatDate(data.updatedAt)}</span>
              )}
              <Badge variant="blue">
                {data.completedFeatureCount} completed feature
                {data.completedFeatureCount === 1 ? '' : 's'}
              </Badge>
            </div>

            {isFounder && data.documentation && (
              <div className="flex items-center gap-3">
                {isGenerating && (
                  <span className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    ~1 min
                  </span>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRegenerate}
                  disabled={isGenerating || !data.canRegenerate}
                >
                  {isGenerating ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="mr-2 h-4 w-4" />
                  )}
                  {isGenerating ? 'Regenerating...' : 'Regenerate'}
                </Button>
              </div>
            )}
          </div>

          {/* Documentation Content */}
          {data.documentation ? (
            <TabsRoot value={activeTab} onValueChange={handleTabChange}>
              <TabsList className="h-auto w-full justify-start gap-6 rounded-none border-b border-border bg-transparent p-0">
                <TabsTrigger
                  value="overview"
                  className="rounded-none border-b-2 border-transparent px-0 pb-3 pt-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="context"
                  className="rounded-none border-b-2 border-transparent px-0 pb-3 pt-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                >
                  Product Context
                </TabsTrigger>
                <TabsTrigger
                  value="features"
                  badge={data.documentation.featureCatalog.length}
                  className="rounded-none border-b-2 border-transparent px-0 pb-3 pt-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                >
                  Features
                </TabsTrigger>
                <TabsTrigger
                  value="glossary"
                  badge={data.documentation.glossary.length}
                  className="rounded-none border-b-2 border-transparent px-0 pb-3 pt-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                >
                  Glossary
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                <OverviewTab
                  executiveSummary={data.documentation.executiveSummary}
                />
              </TabsContent>

              <TabsContent value="context" className="mt-6">
                <ProductContextTab
                  productContext={data.documentation.productContext}
                />
              </TabsContent>

              <TabsContent value="features" className="mt-6">
                <FeaturesTab features={data.documentation.featureCatalog} />
              </TabsContent>

              <TabsContent value="glossary" className="mt-6">
                <GlossaryTab glossary={data.documentation.glossary} />
              </TabsContent>
            </TabsRoot>
          ) : isGenerating ? (
            <GeneratingState />
          ) : (
            <EmptyState
              icon={<BookOpen className="h-12 w-12" />}
              title="No documentation generated"
              description={getEmptyStateDescription(
                data.completedFeatureCount,
                isFounder,
              )}
              action={
                isFounder && data.completedFeatureCount > 0 ? (
                  <Button onClick={handleRegenerate}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Generate Documentation
                  </Button>
                ) : undefined
              }
            />
          )}
        </>
      )}
    </div>
  );
};

export default function DocumentationPage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <DocumentationContent />
    </Suspense>
  );
}

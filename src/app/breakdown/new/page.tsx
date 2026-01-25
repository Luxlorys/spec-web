'use client';

import { useCallback, useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Loader2,
  RefreshCw,
} from 'lucide-react';

import {
  useBatchCreateFeatures,
  useGenerateBreakdown,
} from 'features/breakdown';
import {
  IBreakdownFeatureWithSelection,
  useBreakdownStore,
} from 'shared/store';
import { Button } from 'shared/ui';

import { NewAddFeatureDialog } from './add-feature-dialog';
import { NewBreakdownFeatureCard } from './feature-card';

export default function NewBreakdownPage() {
  const router = useRouter();

  const {
    vision,
    features,
    setFeatures,
    updateFeature,
    toggleFeatureSelection,
    addFeature,
    clearBreakdown,
  } = useBreakdownStore();

  const generateMutation = useGenerateBreakdown();
  const batchCreateMutation = useBatchCreateFeatures();

  const [isVisionExpanded, setIsVisionExpanded] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);

  useEffect(() => {
    if (!vision) {
      router.replace('/features/new');
    }
  }, [vision, router]);

  useEffect(() => {
    const generateFeatures = async () => {
      if (!vision) {
        return;
      }

      try {
        const response = await generateMutation.mutateAsync({ vision });

        setFeatures(response.features);
        setHasGenerated(true);
      } catch {
        // Error is handled by mutation state
        setHasGenerated(true);
      }
    };

    if (vision && !hasGenerated && !generateMutation.isPending) {
      generateFeatures();
    }
  }, [vision, hasGenerated, generateMutation, setFeatures]);

  const handleRetryGenerate = async () => {
    if (!vision) {
      return;
    }

    try {
      const response = await generateMutation.mutateAsync({ vision });

      setFeatures(response.features);
    } catch {
      // Error handled by mutation state
    }
  };

  const handleUpdateFeature = useCallback(
    (id: string, updates: Partial<IBreakdownFeatureWithSelection>) => {
      updateFeature(id, updates);
    },
    [updateFeature],
  );

  const handleToggleSelect = useCallback(
    (featureId: string) => {
      toggleFeatureSelection(featureId);
    },
    [toggleFeatureSelection],
  );

  const handleAddFeature = useCallback(
    (feature: Omit<IBreakdownFeatureWithSelection, 'id'>) => {
      addFeature(feature);
    },
    [addFeature],
  );

  const handleCreateFeatures = async () => {
    const selectedFeatures = features.filter(f => f.isSelected);

    if (selectedFeatures.length === 0) {
      return;
    }

    try {
      await batchCreateMutation.mutateAsync({
        features: selectedFeatures.map(
          ({ title, description, contextFeatureId }) => ({
            title,
            description,
            contextFeatureId,
          }),
        ),
      });

      clearBreakdown();
      router.push('/dashboard');
    } catch {
      // Error handled by mutation state
    }
  };

  const selectedCount = features.filter(f => f.isSelected).length;
  const isCreating = batchCreateMutation.isPending;

  // Show loading while redirecting or if no vision
  if (!vision) {
    return (
      <div className="flex h-[calc(100vh-2rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <main className="flex h-[calc(100vh-2rem)] flex-col">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-6 py-4 dark:border-gray-700 dark:bg-gray-900">
        <div className="mx-auto">
          <button
            type="button"
            onClick={() => {
              clearBreakdown();
              router.push('/features/new');
            }}
            className="mb-2 flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <ArrowLeft className="h-4 w-4" />
            Start Over
          </button>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Break Down Your Idea
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Review and refine the proposed features, then create them all at
            once
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto flex gap-8">
          {/* Left column: Vision (sticky) */}
          <div className="flex-1">
            <div className="sticky top-0">
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
                <h2 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Your Vision
                </h2>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isVisionExpanded ? 'max-h-[2000px]' : 'max-h-[7.5rem]'
                  }`}
                >
                  <p className="whitespace-pre-wrap text-sm text-gray-600 dark:text-gray-400">
                    {vision}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsVisionExpanded(!isVisionExpanded)}
                  className="mt-2 flex items-center gap-1 text-xs text-primary hover:text-primary/80"
                >
                  {isVisionExpanded ? (
                    <>
                      Show less <ChevronUp className="h-3 w-3" />
                    </>
                  ) : (
                    <>
                      Show more <ChevronDown className="h-3 w-3" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right column: Features */}
          <div className="flex-1 space-y-6">
            {/* Generating state */}
            {generateMutation.isPending && (
              <div className="flex flex-col items-center gap-4 py-12">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
                <div className="text-center">
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    Breaking down your idea...
                  </p>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    AI is analyzing your vision and proposing features
                  </p>
                </div>
              </div>
            )}

            {/* Error state */}
            {generateMutation.isError && features.length === 0 && (
              <div className="flex flex-col items-center gap-4 py-12">
                <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center dark:border-red-800 dark:bg-red-900/20">
                  <p className="font-medium text-red-800 dark:text-red-200">
                    Failed to generate features
                  </p>
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    AI service is temporarily unavailable. Please try again.
                  </p>
                  <Button
                    onClick={handleRetryGenerate}
                    variant="outline"
                    className="mt-4 gap-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Try Again
                  </Button>
                </div>
              </div>
            )}

            {/* Features list */}
            {!generateMutation.isPending && features.length > 0 && (
              <>
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                    Proposed Features ({features.length})
                  </h2>
                  <NewAddFeatureDialog onAdd={handleAddFeature} />
                </div>

                <div className="space-y-3">
                  {features.map((feature, index) => (
                    <NewBreakdownFeatureCard
                      key={feature.id}
                      feature={feature}
                      index={index}
                      onUpdate={handleUpdateFeature}
                      onToggleSelect={() => handleToggleSelect(feature.id)}
                    />
                  ))}
                </div>

                {/* Batch create error */}
                {batchCreateMutation.isError && (
                  <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-center text-sm text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
                    Failed to create features. Please try again.
                  </div>
                )}

                {/* Summary and create button */}
                <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 dark:bg-primary/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {selectedCount} feature{selectedCount === 1 ? '' : 's'}{' '}
                        selected
                      </p>
                      <p className="mt-0.5 text-sm text-gray-600 dark:text-gray-400">
                        These will be created as draft features for you to
                        refine
                      </p>
                    </div>
                    <Button
                      onClick={handleCreateFeatures}
                      disabled={selectedCount === 0 || isCreating}
                      size="md"
                      className="gap-2"
                    >
                      {isCreating ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        <>
                          Create {selectedCount} Feature
                          {selectedCount === 1 ? '' : 's'}
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

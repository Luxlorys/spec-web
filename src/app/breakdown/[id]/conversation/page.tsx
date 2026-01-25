'use client';

import { useCallback, useEffect, useState } from 'react';

import { useParams, useRouter } from 'next/navigation';

import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Loader2,
  Sparkles,
} from 'lucide-react';

import {
  AddFeatureDialog,
  BreakdownFeatureCard,
  useBreakdown,
  useCreateFeaturesFromBreakdown,
  useGenerateBreakdownFeatures,
  useUpdateBreakdownFeatures,
} from 'features/breakdown';
import { IBreakdownFeature } from 'shared/api';
import { Button } from 'shared/ui';

export default function BreakdownConversationPage() {
  const params = useParams();
  const router = useRouter();
  const breakdownId = Number(params.id);

  const { data: breakdown, isLoading: isLoadingBreakdown } =
    useBreakdown(breakdownId);
  const generateMutation = useGenerateBreakdownFeatures();
  const updateMutation = useUpdateBreakdownFeatures();
  const createFeaturesMutation = useCreateFeaturesFromBreakdown();

  // Local state for features (optimistic updates)
  const [features, setFeatures] = useState<IBreakdownFeature[]>([]);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [isVisionExpanded, setIsVisionExpanded] = useState(false);

  // Sync features from server
  useEffect(() => {
    if (breakdown?.features) {
      setFeatures(breakdown.features);
      if (breakdown.features.length > 0) {
        setHasGenerated(true);
      }
    }
  }, [breakdown?.features]);

  // Generate features on mount if none exist
  useEffect(() => {
    const generateFeatures = async () => {
      const generatedFeatures = await generateMutation.mutateAsync(breakdownId);

      setFeatures(generatedFeatures);
      setHasGenerated(true);
    };

    if (
      breakdown &&
      breakdown.features.length === 0 &&
      !hasGenerated &&
      !generateMutation.isPending
    ) {
      generateFeatures();
    }
  }, [breakdown, breakdownId, generateMutation, hasGenerated]);

  const handleUpdateFeature = useCallback(
    (updatedFeature: IBreakdownFeature) => {
      setFeatures(prev =>
        prev.map(f => (f.id === updatedFeature.id ? updatedFeature : f)),
      );
    },
    [],
  );

  const handleToggleSelect = useCallback((featureId: string) => {
    setFeatures(prev =>
      prev.map(f =>
        f.id === featureId ? { ...f, isSelected: !f.isSelected } : f,
      ),
    );
  }, []);

  const handleAddFeature = useCallback(
    (feature: Omit<IBreakdownFeature, 'id'>) => {
      const newFeature: IBreakdownFeature = {
        ...feature,
        id: Math.random().toString(36).substring(2, 9),
      };

      setFeatures(prev => [...prev, newFeature]);
    },
    [],
  );

  const handleCreateFeatures = async () => {
    const selectedFeatureIds = features
      .filter(f => f.isSelected)
      .map(f => f.id);

    if (selectedFeatureIds.length === 0) {
      return;
    }

    // First save the current state
    await updateMutation.mutateAsync({
      breakdownId,
      features,
    });

    // Then create features
    await createFeaturesMutation.mutateAsync({
      breakdownId,
      featureIds: selectedFeatureIds,
    });

    // Navigate to breakdown detail page
    router.push(`/breakdown/${breakdownId}`);
  };

  const selectedCount = features.filter(f => f.isSelected).length;
  const isCreating =
    createFeaturesMutation.isPending || updateMutation.isPending;

  if (isLoadingBreakdown) {
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

  return (
    <main className="flex h-[calc(100vh-2rem)] flex-col">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-6 py-4 dark:border-gray-700 dark:bg-gray-900">
        <div className="mx-auto">
          <button
            type="button"
            onClick={() => router.push('/dashboard')}
            className="mb-2 flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
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
                    {breakdown.vision}
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
                  <Sparkles className="h-8 w-8 animate-pulse text-primary" />
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

            {/* Features list */}
            {!generateMutation.isPending && features.length > 0 && (
              <>
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                    Proposed Features ({features.length})
                  </h2>
                  <AddFeatureDialog onAdd={handleAddFeature} />
                </div>

                <div className="space-y-3">
                  {features.map((feature, index) => (
                    <BreakdownFeatureCard
                      key={feature.id}
                      feature={feature}
                      index={index}
                      onUpdate={handleUpdateFeature}
                      onToggleSelect={() => handleToggleSelect(feature.id)}
                    />
                  ))}
                </div>

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

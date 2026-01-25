'use client';

import { useRef, useState } from 'react';

import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Lightbulb, Loader2, Plus, Send, X } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';

import { BreakdownSuggestionBanner } from 'features/breakdown';
import {
  ContextFeatureDialog,
  CreateFeatureInput,
  createFeatureSchema,
  StatusBadge,
  useContextFeatures,
} from 'features/feature-requests';
import {
  featureRequestsApi,
  IAnalyzeFeatureTextResponse,
  IContextFeature,
} from 'shared/api';
import { QueryKeys } from 'shared/constants';
import { cn, queryClient } from 'shared/lib';
import { useBreakdownStore } from 'shared/store';

export default function NewFeaturePage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [analysisResult, setAnalysisResult] =
    useState<IAnalyzeFeatureTextResponse | null>(null);
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [submittedValues, setSubmittedValues] =
    useState<CreateFeatureInput | null>(null);

  const { startBreakdown } = useBreakdownStore();
  const { data: features = [] } = useContextFeatures();

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateFeatureInput>({
    resolver: zodResolver(createFeatureSchema),
    defaultValues: {
      idea: '',
      contextFeatureId: undefined,
    },
  });

  const contextFeatureId = watch('contextFeatureId');

  const selectedFeature: IContextFeature | undefined = features.find(
    f => f.id === contextFeatureId,
  );

  const analyzeMutation = useMutation({
    mutationFn: (text: string) => featureRequestsApi.analyzeText({ text }),
  });

  const createMutation = useMutation({
    mutationFn: featureRequestsApi.create,
    onSuccess: feature => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.FEATURE_REQUESTS] });
      router.push(`/features/${feature.id}/conversation`);
    },
    onError: (err: Error) => {
      setError(err.message);
    },
  });

  const onSubmit = async (values: CreateFeatureInput) => {
    setError('');

    const analysis = await analyzeMutation.mutateAsync(values.idea);

    if (analysis.isMultipleFeatures) {
      setSubmittedValues(values);
      setAnalysisResult(analysis);
      setShowSuggestion(true);
    } else {
      await createMutation.mutateAsync(values);
    }
  };

  const handleBreakdownAccept = () => {
    if (!submittedValues || !analysisResult) {
      return;
    }

    startBreakdown(submittedValues.idea, analysisResult);
    router.push('/breakdown/new');
  };

  const handleBreakdownDecline = async () => {
    if (!submittedValues) {
      return;
    }

    setShowSuggestion(false);
    setAnalysisResult(null);

    await createMutation.mutateAsync(submittedValues);
    setSubmittedValues(null);
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;

    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 220)}px`;
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !showSuggestion && !isLoading) {
      e.preventDefault();
      handleSubmit(onSubmit)();
    }
  };

  const handleRemoveContext = () => {
    setValue('contextFeatureId', undefined);
  };

  const isAnalyzing = analyzeMutation.isPending;
  const isLoading = createMutation.isPending || isAnalyzing;

  const canSubmit = !isLoading && !showSuggestion;

  return (
    <main className="flex h-[calc(100vh-2rem)] flex-col">
      {/* Header block */}
      <div className="border-b border-gray-200 bg-white px-6 py-4 dark:border-gray-700 dark:bg-gray-900">
        <div className="mx-auto flex max-w-2xl items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30">
            <Lightbulb className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900 dark:text-gray-100">
              New Feature Request
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Describe a single feature or a bigger idea to break down
            </p>
          </div>
        </div>
      </div>

      {/* Centered form */}
      <div className="flex flex-1 items-center justify-center px-4">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-2xl space-y-4"
        >
          <div className="text-center">
            <h1 className="mb-2 text-2xl font-semibold text-gray-900 dark:text-gray-100">
              What do you want to build?
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Describe your idea — a single feature or a bigger vision
            </p>
          </div>

          {/* Context feature display above input */}
          {selectedFeature && (
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <span>Context:</span>
              <span className="truncate font-medium">
                {selectedFeature.title}
              </span>
              <StatusBadge status={selectedFeature.status} />
              <button
                type="button"
                onClick={handleRemoveContext}
                className="shrink-0 rounded p-0.5 text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                aria-label="Remove context"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Input container - chat interface style */}
          <div
            className={cn(
              'flex items-start gap-2 rounded-2xl border border-gray-300 bg-white p-2 transition-colors dark:border-gray-600 dark:bg-gray-800',
              'focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20',
              errors.idea &&
                'border-red-500 focus-within:border-red-500 focus-within:ring-red-500/20',
            )}
          >
            {/* Plus button */}
            <Controller
              control={control}
              name="contextFeatureId"
              render={({ field }) => (
                <ContextFeatureDialog
                  open={dialogOpen}
                  onOpenChange={setDialogOpen}
                  value={field.value ?? null}
                  onSelect={featureId => field.onChange(featureId)}
                >
                  <button
                    type="button"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
                    aria-label="Add context feature"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </ContextFeatureDialog>
              )}
            />

            {/* Textarea */}
            <textarea
              {...register('idea', {
                onChange: handleTextareaChange,
              })}
              ref={e => {
                register('idea').ref(e);
                (
                  textareaRef as React.MutableRefObject<HTMLTextAreaElement | null>
                ).current = e;
              }}
              onKeyDown={handleKeyPress}
              placeholder="Describe your idea... What do you want to build? What problem does it solve?"
              rows={1}
              disabled={isLoading}
              className="max-h-[300px] min-h-[36px] flex-1 resize-none bg-transparent py-2 text-sm leading-relaxed text-gray-900 outline-none placeholder:text-gray-400 disabled:cursor-not-allowed disabled:opacity-50 dark:text-gray-100 dark:placeholder:text-gray-500"
            />

            {/* Send button - only show when suggestion is not visible */}
            {!showSuggestion && (
              <button
                type="submit"
                disabled={!canSubmit}
                className={cn(
                  'flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors',
                  canSubmit
                    ? 'bg-primary text-white hover:bg-primary/90'
                    : 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500',
                  'disabled:cursor-not-allowed',
                )}
                aria-label="Start conversation"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </button>
            )}
          </div>

          {/* Analyzing state */}
          {isAnalyzing && (
            <div className="flex items-center justify-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 dark:border-blue-800 dark:bg-blue-900/20">
              <Loader2 className="h-4 w-4 animate-spin text-blue-600 dark:text-blue-400" />
              <span className="text-sm text-blue-800 dark:text-blue-200">
                Analyzing your idea...
              </span>
            </div>
          )}

          {/* Breakdown suggestion banner (shown after analysis detects multiple features) */}
          {showSuggestion && analysisResult && (
            <BreakdownSuggestionBanner
              analysis={analysisResult}
              onAccept={handleBreakdownAccept}
              onDecline={handleBreakdownDecline}
              onDismiss={() => {
                setShowSuggestion(false);
                setAnalysisResult(null);
              }}
            />
          )}

          {/* Error messages */}
          {errors.idea && (
            <p className="text-center text-sm text-red-600 dark:text-red-400">
              {errors.idea.message}
            </p>
          )}

          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-center text-sm text-red-800 dark:bg-red-900/20 dark:text-red-400">
              {error}
            </div>
          )}

          <p className="text-center text-xs text-gray-500 dark:text-gray-400">
            {showSuggestion
              ? 'Choose an option above, or edit your description'
              : 'Press Enter to continue, Shift+Enter for new line'}
          </p>
        </form>
      </div>

      {/* Bottom info block */}
      <div className="p-6">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-lg border border-blue-100 bg-blue-50 p-4 dark:border-blue-900/50 dark:bg-blue-900/20">
            <h3 className="mb-2 text-sm font-semibold text-blue-900 dark:text-blue-100">
              What happens next?
            </h3>
            <ul className="space-y-1 text-sm text-blue-800 dark:text-blue-200">
              <li>
                • <strong>Single feature:</strong> AI conversation to refine
                your idea into a spec
              </li>
              <li>
                • <strong>Bigger idea:</strong> AI breaks it down into separate
                features you can work on
              </li>
              <li>• Your team can review and add comments to specs</li>
              <li>• Export specs as prompts for AI coding assistants</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}

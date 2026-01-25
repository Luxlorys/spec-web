'use client';

import { Lightbulb, X } from 'lucide-react';

import { IAnalyzeFeatureTextResponse } from 'shared/api';
import { cn } from 'shared/lib';
import { Button } from 'shared/ui';

interface BreakdownSuggestionBannerProps {
  analysis: IAnalyzeFeatureTextResponse;
  onAccept: () => void;
  onDecline: () => void;
  onDismiss: () => void;
  className?: string;
}

/**
 * Banner that suggests breaking down text into multiple features.
 * Shown after analysis detects multiple features in the input.
 * User must choose: break it down or keep as single feature.
 */
export const BreakdownSuggestionBanner = ({
  analysis,
  onAccept,
  onDecline,
  onDismiss,
  className,
}: BreakdownSuggestionBannerProps) => {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-lg border border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20',
        'duration-300 animate-in fade-in slide-in-from-bottom-2',
        className,
      )}
    >
      {/* Dismiss button */}
      <button
        type="button"
        onClick={onDismiss}
        className="absolute right-2 top-2 rounded p-1 text-blue-400 hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-800 dark:hover:text-blue-300"
        aria-label="Dismiss suggestion"
      >
        <X className="h-4 w-4" />
      </button>

      <div className="px-4 py-3 pr-10">
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-800">
            <Lightbulb className="h-4 w-4 text-blue-600 dark:text-blue-300" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
              This looks like {analysis.suggestedFeatureCount} separate features
            </p>
            <p className="mt-0.5 text-sm text-blue-700 dark:text-blue-300">
              {analysis.reasoning}
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              <Button
                type="button"
                size="sm"
                onClick={onAccept}
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                Yes, break it down
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onDecline}
                className="border-blue-300 text-blue-700 hover:bg-blue-100 dark:border-blue-600 dark:text-blue-300 dark:hover:bg-blue-800"
              >
                No, keep as single feature
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

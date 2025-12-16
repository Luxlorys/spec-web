'use client';

import { useEffect, useState } from 'react';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

import { IRegenerationPreview, ISpecDocument } from 'shared/types';
import { Sheet, SheetContent, SheetHeader, SheetTitle, Button, Badge } from 'shared/ui';

import { SummaryView } from './summary-view';
import { DiffView } from './diff-view';

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  specId: string;
  preview: IRegenerationPreview | null;
  isLoadingPreview: boolean;
  previewError: Error | null;
  onApprove: (proposedSpec: ISpecDocument) => void;
  isCommitting: boolean;
  commitSuccess: boolean;
}

type ViewMode = 'summary' | 'diff';

export function RegenerationModal({
  isOpen,
  onClose,
  specId,
  preview,
  isLoadingPreview,
  previewError,
  onApprove,
  isCommitting,
  commitSuccess,
}: IProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('summary');

  // Reset view mode when modal opens
  useEffect(() => {
    if (isOpen) {
      setViewMode('summary');
    }
  }, [isOpen]);

  // Auto-close after success
  useEffect(() => {
    if (commitSuccess) {
      const timeout = setTimeout(() => {
        onClose();
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [commitSuccess, onClose]);

  const handleApprove = () => {
    if (preview) {
      onApprove(preview.fullProposedSpec);
    }
  };

  // Check if there are any actual changes
  const hasChanges =
    preview?.proposedChanges.some(change => change.changeType !== 'unchanged') ?? false;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-4xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Regenerate Spec from Discussions</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Loading State */}
          {isLoadingPreview && (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
              <p className="text-sm text-gray-600">Analyzing discussions and generating preview...</p>
            </div>
          )}

          {/* Error State */}
          {previewError && (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <AlertCircle className="h-8 w-8 text-red-600" />
              <p className="text-sm text-gray-900 font-medium">Failed to generate preview</p>
              <p className="text-sm text-gray-600">{previewError.message}</p>
            </div>
          )}

          {/* Success State */}
          {commitSuccess && (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <CheckCircle className="h-12 w-12 text-green-600" />
              <p className="text-lg font-semibold text-gray-900">
                Spec updated to v{preview?.nextVersion}!
              </p>
              <p className="text-sm text-gray-600">Changes have been applied successfully</p>
            </div>
          )}

          {/* Preview State */}
          {preview && !isLoadingPreview && !commitSuccess && (
            <>
              {/* Context Summary Card */}
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-purple-900 mb-3">
                  Regeneration Context
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-purple-700">Current Version:</span>
                    <span className="ml-2 font-medium text-purple-900">
                      v{preview.currentVersion}
                    </span>
                  </div>
                  <div>
                    <span className="text-purple-700">Next Version:</span>
                    <span className="ml-2 font-medium text-purple-900">v{preview.nextVersion}</span>
                  </div>
                  <div>
                    <span className="text-purple-700">Resolved Comments:</span>
                    <span className="ml-2 font-medium text-purple-900">
                      {preview.contextSummary.resolvedCommentsCount}
                    </span>
                  </div>
                  <div>
                    <span className="text-purple-700">Answered Questions:</span>
                    <span className="ml-2 font-medium text-purple-900">
                      {preview.contextSummary.answeredQuestionsCount}
                    </span>
                  </div>
                </div>
                {preview.contextSummary.sectionsWithFeedback.length > 0 && (
                  <div className="mt-3">
                    <span className="text-purple-700 text-sm">Sections with feedback:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {preview.contextSummary.sectionsWithFeedback.map(section => (
                        <Badge key={section} variant="purple" className="text-xs">
                          {section}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* No Changes Message */}
              {!hasChanges && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                  <p className="text-gray-700">
                    No changes needed based on current discussions. The spec is already up to date.
                  </p>
                </div>
              )}

              {/* Tab Switcher */}
              {hasChanges && (
                <>
                  <div className="flex gap-2 border-b border-gray-200">
                    <button
                      onClick={() => setViewMode('summary')}
                      className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                        viewMode === 'summary'
                          ? 'border-purple-600 text-purple-600'
                          : 'border-transparent text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Summary
                    </button>
                    <button
                      onClick={() => setViewMode('diff')}
                      className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                        viewMode === 'diff'
                          ? 'border-purple-600 text-purple-600'
                          : 'border-transparent text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Detailed Diff
                    </button>
                  </div>

                  {/* View Content */}
                  <div className="min-h-[400px]">
                    {viewMode === 'summary' ? (
                      <SummaryView changes={preview.proposedChanges} />
                    ) : (
                      <DiffView changes={preview.proposedChanges} />
                    )}
                  </div>
                </>
              )}

              {/* Action Buttons */}
              {hasChanges && (
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                  <Button variant="outline" onClick={onClose} disabled={isCommitting}>
                    Cancel
                  </Button>
                  <Button onClick={handleApprove} disabled={isCommitting}>
                    {isCommitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Applying...
                      </>
                    ) : (
                      'Approve & Apply Changes'
                    )}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

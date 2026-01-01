'use client';

import { useEffect, useState } from 'react';

import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

import { IRegenerationPreview, ISpecDocument } from 'shared/types';
import {
  Badge,
  Button,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  TabsContent,
  TabsList,
  TabsRoot,
  TabsTrigger,
} from 'shared/ui';

import { useApplyRegeneration, useRegenerationPreview } from '../../api';
import { transformRegenerationPreview } from '../../lib';
import { DiffView } from './diff-view';
import { SummaryView } from './summary-view';

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  currentSpec: ISpecDocument;
  onSuccess?: () => void;
}

export const RegenerationModal = ({
  isOpen,
  onClose,
  currentSpec,
  onSuccess,
}: IProps) => {
  const [preview, setPreview] = useState<IRegenerationPreview | null>(null);

  const previewMutation = useRegenerationPreview();
  const applyMutation = useApplyRegeneration();

  // Fetch preview when modal opens
  useEffect(() => {
    if (isOpen && currentSpec?.id) {
      setPreview(null);
      previewMutation.mutateAsync(currentSpec.id).then(response => {
        const transformed = transformRegenerationPreview(response, currentSpec);

        setPreview(transformed);
      });
    }
  }, [isOpen, currentSpec]);

  // Auto-close after success
  useEffect(() => {
    if (applyMutation.isSuccess) {
      const timeout = setTimeout(() => {
        onClose();
        onSuccess?.();
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [applyMutation.isSuccess, onClose, onSuccess]);

  const handleApprove = async () => {
    if (currentSpec?.id) {
      await applyMutation.mutateAsync(currentSpec.id);
    }
  };

  const handleClose = () => {
    if (!applyMutation.isPending) {
      onClose();
    }
  };

  // Check if there are any actual changes
  const hasChanges =
    preview?.proposedChanges.some(
      change => change.changeType !== 'unchanged',
    ) ?? false;

  // Determine which state to show
  const showLoading = previewMutation.isPending;
  const showError = previewMutation.error && !previewMutation.isPending;
  const showSuccess = applyMutation.isSuccess;
  const showPreview =
    preview && !previewMutation.isPending && !applyMutation.isSuccess;

  return (
    <Sheet open={isOpen} onOpenChange={handleClose}>
      <SheetContent
        side="right"
        className="w-full overflow-y-auto sm:max-w-4xl"
      >
        <SheetHeader>
          <SheetTitle>Regenerate Spec from Discussions</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Loading State */}
          {showLoading && (
            <div className="flex flex-col items-center justify-center space-y-4 py-12">
              <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
              <p className="text-sm text-gray-600">
                Analyzing discussions and generating preview...
              </p>
            </div>
          )}

          {/* Error State */}
          {showError && (
            <div className="flex flex-col items-center justify-center space-y-4 py-12">
              <AlertCircle className="h-8 w-8 text-red-600" />
              <p className="text-sm font-medium text-gray-900">
                Failed to generate preview
              </p>
              <p className="text-sm text-gray-600">
                {previewMutation.error?.message}
              </p>
            </div>
          )}

          {/* Success State */}
          {showSuccess && (
            <div className="flex flex-col items-center justify-center space-y-4 py-12">
              <CheckCircle className="h-12 w-12 text-green-600" />
              <p className="text-lg font-semibold text-gray-900">
                Spec updated to v{preview?.nextVersion}!
              </p>
              <p className="text-sm text-gray-600">
                Changes have been applied successfully
              </p>
            </div>
          )}

          {/* Preview State */}
          {showPreview && (
            <>
              {/* Context Summary Card */}
              <div className="rounded-lg border border-purple-200 bg-purple-50 p-4">
                <h3 className="mb-3 text-sm font-semibold text-purple-900">
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
                    <span className="ml-2 font-medium text-purple-900">
                      v{preview.nextVersion}
                    </span>
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
                    <span className="text-sm text-purple-700">
                      Sections with feedback:
                    </span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {preview.contextSummary.sectionsWithFeedback.map(
                        section => (
                          <Badge
                            key={section}
                            variant="purple"
                            className="text-xs"
                          >
                            {section}
                          </Badge>
                        ),
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* No Changes Message */}
              {!hasChanges && (
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 text-center">
                  <p className="text-gray-700">
                    No changes needed based on current discussions. The spec is
                    already up to date.
                  </p>
                </div>
              )}

              {/* Tabs for Summary/Diff view */}
              {hasChanges && (
                <>
                  <TabsRoot defaultValue="summary">
                    <TabsList className="h-auto w-full justify-start gap-4 rounded-none border-b border-gray-200 bg-transparent p-0">
                      <TabsTrigger
                        value="summary"
                        className="rounded-none border-b-2 border-transparent px-1 pb-3 pt-2 data-[state=active]:border-purple-600 data-[state=active]:bg-transparent data-[state=active]:text-purple-600 data-[state=active]:shadow-none"
                      >
                        Summary
                      </TabsTrigger>
                      <TabsTrigger
                        value="diff"
                        className="rounded-none border-b-2 border-transparent px-1 pb-3 pt-2 data-[state=active]:border-purple-600 data-[state=active]:bg-transparent data-[state=active]:text-purple-600 data-[state=active]:shadow-none"
                      >
                        Detailed Diff
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="summary" className="mt-4 min-h-[400px]">
                      <SummaryView changes={preview.proposedChanges} />
                    </TabsContent>

                    <TabsContent value="diff" className="mt-4 min-h-[400px]">
                      <DiffView changes={preview.proposedChanges} />
                    </TabsContent>
                  </TabsRoot>

                  {/* Action Buttons */}
                  <div className="flex justify-end gap-3 border-t border-gray-200 pt-4">
                    <Button
                      variant="outline"
                      onClick={handleClose}
                      disabled={applyMutation.isPending}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleApprove}
                      disabled={applyMutation.isPending}
                    >
                      {applyMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Applying...
                        </>
                      ) : (
                        'Approve & Apply Changes'
                      )}
                    </Button>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

'use client';

import { FC, useState, useEffect } from 'react';
import { Sparkles, History } from 'lucide-react';
import { ISpecDocument, IUpdateSpecSection } from 'shared/types';
import { formatDate } from 'shared/lib';
import {
  useGetCommentCounts,
  useUpdateSpecSection,
  usePreviewRegeneration,
  useCommitRegeneration,
  useGetVersionHistory,
  useRollbackSpec,
  useGetCommentsBySpec,
} from 'shared/hooks';
import { useAuthStore } from 'shared/store';
import { SpecSection } from '../spec-section';
import { Badge, Card, Button } from 'shared/ui';
import { CommentsSidebar } from '../comments-sidebar';
import { OpenQuestionItem } from '../open-question-item';
import { OpenQuestionForm } from '../open-question-form';
import { GeneratePromptButton } from '../generate-prompt-button';
import { RegenerationModal } from '../regeneration-modal';
import { VersionHistorySidebar } from '../version-history-sidebar';

interface IProps {
  spec: ISpecDocument;
}

export const SpecView: FC<IProps> = ({ spec }) => {
  const isFounder = true;

  // Comments sidebar state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [activeSectionTitle, setActiveSectionTitle] = useState<string>('');

  // Regeneration modal state
  const [isRegenerationModalOpen, setIsRegenerationModalOpen] = useState(false);

  // Version history sidebar state
  const [isVersionHistoryOpen, setIsVersionHistoryOpen] = useState(false);

  // Fetch comment counts for all sections
  const { data: commentCounts = {} } = useGetCommentCounts(spec.id);

  // Fetch all comments for regeneration
  const { data: allComments = [] } = useGetCommentsBySpec(spec.id);

  // Update section mutation
  const updateSectionMutation = useUpdateSpecSection();

  // Regeneration hooks
  const {
    data: regenerationPreview,
    refetch: fetchPreview,
    isLoading: isLoadingPreview,
    error: previewError,
  } = usePreviewRegeneration(spec.id);

  const commitRegenerationMutation = useCommitRegeneration();

  // Version history hooks
  const { data: versionHistory = [], isLoading: isLoadingHistory } = useGetVersionHistory(spec.id);
  const rollbackMutation = useRollbackSpec();

  // Calculate if regeneration should be enabled
  const resolvedCommentsCount = allComments.filter(c => c.resolved).length;
  const answeredQuestionsCount = spec.openQuestions.filter(q => q.answer && q.answer.trim().length > 0).length;
  const canRegenerate = resolvedCommentsCount > 0 || answeredQuestionsCount > 0;

  // Handler for opening sidebar
  const handleCommentClick = (sectionId: string, sectionTitle: string) => {
    setActiveSectionId(sectionId);
    setActiveSectionTitle(sectionTitle);
    setIsSidebarOpen(true);
  };

  // Handler for closing sidebar
  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
    setTimeout(() => {
      setActiveSectionId(null);
      setActiveSectionTitle('');
    }, 300);
  };

  // Handler for saving section edits
  const handleSaveSection = (section: IUpdateSpecSection['section'], value: string | string[]) => {
    updateSectionMutation.mutate({
      specId: spec.id,
      update: { section, value },
    });
  };

  // Handler for opening regeneration modal
  const handleRegenerateClick = () => {
    setIsRegenerationModalOpen(true);
    fetchPreview(); // Trigger preview generation
  };

  // Handler for closing regeneration modal
  const handleCloseRegenerationModal = () => {
    setIsRegenerationModalOpen(false);
  };

  // Handler for approving regeneration
  const handleApproveRegeneration = (proposedSpec: ISpecDocument) => {
    commitRegenerationMutation.mutate(
      { specId: spec.id, proposedSpec },
      {
        onSuccess: () => {
          // Modal will auto-close after showing success state
        },
      }
    );
  };

  // Handler for opening version history
  const handleVersionHistoryClick = () => {
    setIsVersionHistoryOpen(true);
  };

  // Handler for closing version history
  const handleCloseVersionHistory = () => {
    setIsVersionHistoryOpen(false);
  };

  // Handler for rollback
  const handleRollback = (targetVersion: number) => {
    rollbackMutation.mutate(
      { specId: spec.id, targetVersion },
      {
        onSuccess: () => {
          // Sidebar will stay open to show updated history
        },
      }
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-start gap-3">
            {/* History button - icon only circle */}
            {isFounder && (
              <Button
                variant="outline"
                size="icon"
                onClick={handleVersionHistoryClick}
                title="Version History"
                className="h-9 w-9 rounded-full"
              >
                <History className="h-4 w-4" />
              </Button>
            )}
            <div>
              <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
                Specification Document
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Version {spec.version} • Generated on {formatDate(spec.generatedAt)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Founder-only buttons */}
            {isFounder && (
              <Button
                variant="primary"
                onClick={handleRegenerateClick}
                disabled={!canRegenerate}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Update Specification
              </Button>
            )}
            <GeneratePromptButton spec={spec} />
            <Badge variant="purple">v{spec.version}</Badge>
          </div>
        </div>
      </Card>

      {/* Overview */}
      <SpecSection
        title="Overview"
        id="overview"
        sectionId="overview"
        specDocumentId={spec.id}
        commentCount={commentCounts['overview'] || 0}
        onCommentClick={sectionId => handleCommentClick(sectionId, 'Overview')}
        editable={isFounder}
        editValue={spec.overview}
        onSave={(value) => handleSaveSection('overview', value)}
        isSaving={updateSectionMutation.isPending}
      >
        <p>{spec.overview}</p>
      </SpecSection>

      {/* Problem Statement */}
      <SpecSection
        title="Problem Statement"
        id="problem-statement"
        sectionId="problem-statement"
        specDocumentId={spec.id}
        commentCount={commentCounts['problem-statement'] || 0}
        onCommentClick={sectionId => handleCommentClick(sectionId, 'Problem Statement')}
        editable={isFounder}
        editValue={spec.problemStatement}
        onSave={(value) => handleSaveSection('problemStatement', value)}
        isSaving={updateSectionMutation.isPending}
      >
        <p>{spec.problemStatement}</p>
      </SpecSection>

      {/* User Stories */}
      <SpecSection
        title="User Stories"
        id="user-stories"
        sectionId="user-stories"
        specDocumentId={spec.id}
        commentCount={commentCounts['user-stories'] || 0}
        onCommentClick={sectionId => handleCommentClick(sectionId, 'User Stories')}
        editable={isFounder}
        editValue={spec.userStories}
        onSave={(value) => handleSaveSection('userStories', value)}
        isSaving={updateSectionMutation.isPending}
        isArrayField
      >
        <ul className="space-y-2">
          {spec.userStories.map((story, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-purple-600 dark:text-purple-400">•</span>
              <span>{story}</span>
            </li>
          ))}
        </ul>
      </SpecSection>

      {/* Acceptance Criteria - Not editable (complex structure) */}
      <SpecSection
        title="Acceptance Criteria"
        id="acceptance-criteria"
        sectionId="acceptance-criteria"
        specDocumentId={spec.id}
        commentCount={commentCounts['acceptance-criteria'] || 0}
        onCommentClick={sectionId => handleCommentClick(sectionId, 'Acceptance Criteria')}
      >
        <ul className="space-y-3">
          {spec.acceptanceCriteria.map(criteria => (
            <li key={criteria.id} className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={criteria.completed}
                readOnly
                className="mt-1 h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <span className={criteria.completed ? 'line-through opacity-60' : ''}>
                {criteria.description}
              </span>
            </li>
          ))}
        </ul>
      </SpecSection>

      {/* Scope - Included */}
      <SpecSection
        title="Scope: Included"
        id="scope-included"
        sectionId="scope-included"
        specDocumentId={spec.id}
        commentCount={commentCounts['scope'] || 0}
        onCommentClick={() => handleCommentClick('scope', 'Scope')}
        editable={isFounder}
        editValue={spec.scopeIncluded}
        onSave={(value) => handleSaveSection('scopeIncluded', value)}
        isSaving={updateSectionMutation.isPending}
        isArrayField
      >
        <ul className="space-y-2">
          {spec.scopeIncluded.map((item, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-green-600 dark:text-green-400">✓</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </SpecSection>

      {/* Scope - Excluded */}
      <SpecSection
        title="Scope: Excluded"
        id="scope-excluded"
        sectionId="scope-excluded"
        specDocumentId={spec.id}
        editable={isFounder}
        editValue={spec.scopeExcluded}
        onSave={(value) => handleSaveSection('scopeExcluded', value)}
        isSaving={updateSectionMutation.isPending}
        isArrayField
      >
        <ul className="space-y-2">
          {spec.scopeExcluded.map((item, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-red-600 dark:text-red-400">✗</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </SpecSection>

      {/* Technical Considerations */}
      <SpecSection
        title="Technical Considerations"
        id="technical"
        sectionId="technical"
        specDocumentId={spec.id}
        commentCount={commentCounts['technical'] || 0}
        onCommentClick={sectionId => handleCommentClick(sectionId, 'Technical Considerations')}
        editable={isFounder}
        editValue={spec.technicalConsiderations}
        onSave={(value) => handleSaveSection('technicalConsiderations', value)}
        isSaving={updateSectionMutation.isPending}
        isArrayField
      >
        <ul className="space-y-2">
          {spec.technicalConsiderations.map((item, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-gray-400">⚙️</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </SpecSection>

      {/* Edge Cases - Not editable (complex structure) */}
      <SpecSection
        title="Edge Cases"
        id="edge-cases"
        sectionId="edge-cases"
        specDocumentId={spec.id}
        commentCount={commentCounts['edge-cases'] || 0}
        onCommentClick={sectionId => handleCommentClick(sectionId, 'Edge Cases')}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="pb-3 pr-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Scenario
                </th>
                <th className="pb-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Expected Behavior
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {spec.edgeCases.map((edgeCase, index) => (
                <tr key={index}>
                  <td className="py-3 pr-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                    {edgeCase.scenario}
                  </td>
                  <td className="py-3 text-sm text-gray-700 dark:text-gray-300">
                    {edgeCase.expectedBehavior}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SpecSection>

      {/* Open Questions - Has dedicated edit UI */}
      <SpecSection
        title="Open Questions"
        id="open-questions"
        sectionId="open-questions"
        specDocumentId={spec.id}
        commentCount={commentCounts['open-questions'] || 0}
        onCommentClick={sectionId => handleCommentClick(sectionId, 'Open Questions')}
      >
        <OpenQuestionForm specId={spec.id} />

        {spec.openQuestions.length > 0 ? (
          <ul className="space-y-4">
            {spec.openQuestions.map(question => (
              <OpenQuestionItem key={question.id} question={question} specId={spec.id} />
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No open questions yet. Add one above to get started.
          </p>
        )}
      </SpecSection>

      {/* Assumptions */}
      <SpecSection
        title="Assumptions"
        id="assumptions"
        sectionId="assumptions"
        specDocumentId={spec.id}
        commentCount={commentCounts['assumptions'] || 0}
        onCommentClick={sectionId => handleCommentClick(sectionId, 'Assumptions')}
        editable={isFounder}
        editValue={spec.assumptions}
        onSave={(value) => handleSaveSection('assumptions', value)}
        isSaving={updateSectionMutation.isPending}
        isArrayField
      >
        <ul className="space-y-2">
          {spec.assumptions.map((assumption, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-gray-400">💭</span>
              <span>{assumption}</span>
            </li>
          ))}
        </ul>
      </SpecSection>

      {/* Comments Sidebar */}
      {activeSectionId && (
        <CommentsSidebar
          isOpen={isSidebarOpen}
          onClose={handleCloseSidebar}
          specDocumentId={spec.id}
          section={activeSectionId}
          sectionTitle={activeSectionTitle}
        />
      )}

      {/* Regeneration Modal */}
      <RegenerationModal
        isOpen={isRegenerationModalOpen}
        onClose={handleCloseRegenerationModal}
        specId={spec.id}
        preview={regenerationPreview || null}
        isLoadingPreview={isLoadingPreview}
        previewError={previewError as Error | null}
        onApprove={handleApproveRegeneration}
        isCommitting={commitRegenerationMutation.isPending}
        commitSuccess={commitRegenerationMutation.isSuccess}
      />

      {/* Version History Sidebar */}
      <VersionHistorySidebar
        isOpen={isVersionHistoryOpen}
        onClose={handleCloseVersionHistory}
        currentVersion={spec.version}
        versions={versionHistory}
        isLoading={isLoadingHistory}
        onRollback={handleRollback}
        isRollingBack={rollbackMutation.isPending}
      />
    </div>
  );
};

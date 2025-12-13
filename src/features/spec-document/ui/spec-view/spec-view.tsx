'use client';

import { FC, useState } from 'react';
import { ISpecDocument } from 'shared/types';
import { formatDate } from 'shared/lib';
import { useGetCommentCounts } from 'shared/hooks';
import { SpecSection } from '../spec-section';
import { Badge, Card } from 'shared/ui';
import { CommentsSidebar } from '../comments-sidebar';
import { OpenQuestionItem } from '../open-question-item';
import { OpenQuestionForm } from '../open-question-form';

interface IProps {
  spec: ISpecDocument;
}

export const SpecView: FC<IProps> = ({ spec }) => {
  // Sidebar state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [activeSectionTitle, setActiveSectionTitle] = useState<string>('');

  // Fetch comment counts for all sections
  const { data: commentCounts = {} } = useGetCommentCounts(spec.id);

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
              Specification Document
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Version {spec.version} • Generated on {formatDate(spec.generatedAt)}
            </p>
          </div>
          <Badge variant="purple">v{spec.version}</Badge>
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
      >
        <ul className="space-y-2">
          {spec.userStories.map((story, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-blue-600 dark:text-blue-400">•</span>
              <span>{story}</span>
            </li>
          ))}
        </ul>
      </SpecSection>

      {/* Acceptance Criteria */}
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
                className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className={criteria.completed ? 'line-through opacity-60' : ''}>
                {criteria.description}
              </span>
            </li>
          ))}
        </ul>
      </SpecSection>

      {/* Scope */}
      <SpecSection
        title="Scope"
        id="scope"
        sectionId="scope"
        specDocumentId={spec.id}
        commentCount={commentCounts['scope'] || 0}
        onCommentClick={sectionId => handleCommentClick(sectionId, 'Scope')}
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h4 className="mb-3 font-semibold text-green-700 dark:text-green-400">
              ✓ Included in This Version
            </h4>
            <ul className="space-y-2">
              {spec.scopeIncluded.map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-green-600 dark:text-green-400">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="mb-3 font-semibold text-red-700 dark:text-red-400">
              ✗ Explicitly Excluded
            </h4>
            <ul className="space-y-2">
              {spec.scopeExcluded.map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-red-600 dark:text-red-400">✗</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </SpecSection>

      {/* Technical Considerations */}
      <SpecSection
        title="Technical Considerations"
        id="technical"
        sectionId="technical"
        specDocumentId={spec.id}
        commentCount={commentCounts['technical'] || 0}
        onCommentClick={sectionId => handleCommentClick(sectionId, 'Technical Considerations')}
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

      {/* Edge Cases */}
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

      {/* Open Questions */}
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
    </div>
  );
};

'use client';

import { FC, ReactNode, useState } from 'react';

import { SectionType } from 'shared/api/comments';
import { formatDate } from 'shared/lib';
import { ISpecificationWithQuestions } from 'shared/types';
import { Badge, Card } from 'shared/ui';

import { useGetComments } from '../../api';
import { CommentsSidebar } from '../comments-sidebar';
import { OpenQuestionForm } from '../open-question-form';
import { OpenQuestionItem } from '../open-question-item';
import { SpecSection } from '../spec-section';

interface IProps {
  spec: ISpecificationWithQuestions;
}

const EmptyPlaceholder = () => (
  <p className="text-sm italic text-muted-foreground">No content yet</p>
);

const renderListOrEmpty = (
  items: string[] | null | undefined,
  icon: ReactNode,
  iconClassName?: string,
) => {
  if (!items || items.length === 0) {
    return <EmptyPlaceholder />;
  }

  return (
    <ul className="space-y-2">
      {items.map(item => (
        <li key={item} className="flex items-start gap-2">
          <span className={iconClassName}>{icon}</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
};

const renderTextOrEmpty = (text: string | null | undefined) => {
  if (!text || text.trim() === '') {
    return <EmptyPlaceholder />;
  }

  return <p>{text}</p>;
};

export const SpecView: FC<IProps> = ({ spec }) => {
  // Fetch comments to get counts
  const { data: commentsBySection } = useGetComments(spec.id);

  // Helper to get comment count for a section
  const getCommentCount = (sectionType: SectionType): number => {
    if (!commentsBySection) {
      return 0;
    }

    return commentsBySection[sectionType]?.length ?? 0;
  };

  // Comments sidebar state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState<SectionType | null>(
    null,
  );
  const [activeSectionTitle, setActiveSectionTitle] = useState<string>('');

  // Handler for opening sidebar
  const handleCommentClick = (sectionId: SectionType, sectionTitle: string) => {
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

  const openQuestions = spec.openQuestions ?? [];
  const unresolvedCount = openQuestions.filter(q => !q.isResolved).length;

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
              Version {spec.version} • Generated on{' '}
              {formatDate(new Date(spec.generatedAt))}
            </p>
          </div>
          <Badge variant="purple">v{spec.version}</Badge>
        </div>
      </Card>

      {/* Overview */}
      <SpecSection
        title="Overview"
        sectionId="overview"
        commentCount={getCommentCount('overview')}
        onCommentClick={sectionId =>
          handleCommentClick(sectionId as SectionType, 'Overview')
        }
      >
        {renderTextOrEmpty(spec.overview)}
      </SpecSection>

      {/* Problem Statement */}
      <SpecSection
        title="Problem Statement"
        sectionId="problemStatement"
        commentCount={getCommentCount('problemStatement')}
        onCommentClick={sectionId =>
          handleCommentClick(sectionId as SectionType, 'Problem Statement')
        }
      >
        {renderTextOrEmpty(spec.problemStatement)}
      </SpecSection>

      {/* User Stories */}
      <SpecSection
        title="User Stories"
        sectionId="userStories"
        commentCount={getCommentCount('userStories')}
        onCommentClick={sectionId =>
          handleCommentClick(sectionId as SectionType, 'User Stories')
        }
      >
        {renderListOrEmpty(
          spec.userStories,
          '•',
          'text-purple-600 dark:text-purple-400',
        )}
      </SpecSection>

      {/* Acceptance Criteria */}
      <SpecSection
        title="Acceptance Criteria"
        sectionId="acceptanceCriteria"
        commentCount={getCommentCount('acceptanceCriteria')}
        onCommentClick={sectionId =>
          handleCommentClick(sectionId as SectionType, 'Acceptance Criteria')
        }
      >
        {renderListOrEmpty(
          spec.acceptanceCriteria,
          '•',
          'text-purple-600 dark:text-purple-400',
        )}
      </SpecSection>

      {/* Scope - Included */}
      <SpecSection
        title="Scope: Included"
        sectionId="scopeIncluded"
        commentCount={getCommentCount('scopeIncluded')}
        onCommentClick={sectionId =>
          handleCommentClick(sectionId as SectionType, 'Scope: Included')
        }
      >
        {renderListOrEmpty(
          spec.scopeIncluded,
          '✓',
          'text-green-600 dark:text-green-400',
        )}
      </SpecSection>

      {/* Scope - Excluded */}
      <SpecSection
        title="Scope: Excluded"
        sectionId="scopeExcluded"
        commentCount={getCommentCount('scopeExcluded')}
        onCommentClick={sectionId =>
          handleCommentClick(sectionId as SectionType, 'Scope: Excluded')
        }
      >
        {renderListOrEmpty(
          spec.scopeExcluded,
          '✗',
          'text-red-600 dark:text-red-400',
        )}
      </SpecSection>

      {/* Technical Considerations */}
      <SpecSection
        title="Technical Considerations"
        sectionId="technicalConsiderations"
        commentCount={getCommentCount('technicalConsiderations')}
        onCommentClick={sectionId =>
          handleCommentClick(
            sectionId as SectionType,
            'Technical Considerations',
          )
        }
      >
        {renderListOrEmpty(spec.technicalConsiderations, '⚙️', 'text-gray-400')}
      </SpecSection>

      {/* Open Questions - No comment button since API doesn't support this section */}
      <SpecSection
        title={
          unresolvedCount > 0
            ? `Open Questions (${unresolvedCount} unresolved)`
            : 'Open Questions'
        }
        sectionId="openQuestions"
      >
        <OpenQuestionForm specificationId={spec.id} />
        {openQuestions.length === 0 ? (
          <p className="text-sm italic text-muted-foreground">
            No open questions yet. Add a question to clarify the specification.
          </p>
        ) : (
          <ul className="space-y-4">
            {openQuestions.map(question => (
              <OpenQuestionItem
                key={question.id}
                question={question}
                specificationId={spec.id}
              />
            ))}
          </ul>
        )}
      </SpecSection>

      {/* Comments Sidebar */}
      {activeSectionId && (
        <CommentsSidebar
          isOpen={isSidebarOpen}
          onClose={handleCloseSidebar}
          sectionTitle={activeSectionTitle}
          specificationId={spec.id}
          sectionType={activeSectionId}
        />
      )}
    </div>
  );
};

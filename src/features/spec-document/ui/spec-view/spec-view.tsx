'use client';

import { FC, ReactNode, useState } from 'react';

import { formatDate } from 'shared/lib';
import { ISpecDocument } from 'shared/types';
import { Badge, Card } from 'shared/ui';

import { CommentsSidebar } from '../comments-sidebar';
import { SpecSection } from '../spec-section';

interface IProps {
  spec: ISpecDocument;
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
  // Comments sidebar state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [activeSectionTitle, setActiveSectionTitle] = useState<string>('');

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
        onCommentClick={sectionId => handleCommentClick(sectionId, 'Overview')}
      >
        {renderTextOrEmpty(spec.overview)}
      </SpecSection>

      {/* Problem Statement */}
      <SpecSection
        title="Problem Statement"
        sectionId="problem-statement"
        onCommentClick={sectionId =>
          handleCommentClick(sectionId, 'Problem Statement')
        }
      >
        {renderTextOrEmpty(spec.problemStatement)}
      </SpecSection>

      {/* User Stories */}
      <SpecSection
        title="User Stories"
        sectionId="user-stories"
        onCommentClick={sectionId =>
          handleCommentClick(sectionId, 'User Stories')
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
        sectionId="acceptance-criteria"
        onCommentClick={sectionId =>
          handleCommentClick(sectionId, 'Acceptance Criteria')
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
        sectionId="scope-included"
        onCommentClick={() => handleCommentClick('scope', 'Scope')}
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
        sectionId="scope-excluded"
        onCommentClick={() =>
          handleCommentClick('scope-excluded', 'Scope: Excluded')
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
        sectionId="technical"
        onCommentClick={sectionId =>
          handleCommentClick(sectionId, 'Technical Considerations')
        }
      >
        {renderListOrEmpty(spec.technicalConsiderations, '⚙️', 'text-gray-400')}
      </SpecSection>

      {/* Comments Sidebar */}
      {activeSectionId && (
        <CommentsSidebar
          isOpen={isSidebarOpen}
          onClose={handleCloseSidebar}
          sectionTitle={activeSectionTitle}
        />
      )}
    </div>
  );
};

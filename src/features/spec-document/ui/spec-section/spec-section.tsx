'use client';

import { FC, ReactNode } from 'react';
import { Card } from 'shared/ui';
import { CommentButton } from '../comment-button';

interface IProps {
  title: string;
  children: ReactNode;
  id?: string;
  sectionId: string;
  specDocumentId: string;
  onCommentClick?: (sectionId: string) => void;
  commentCount?: number;
}

export const SpecSection: FC<IProps> = ({
  title,
  children,
  id,
  sectionId,
  specDocumentId,
  onCommentClick,
  commentCount = 0,
}) => {
  const handleCommentClick = () => {
    onCommentClick?.(sectionId);
  };

  return (
    <Card className="mb-6">
      <div className="mb-4 flex items-start justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
        <CommentButton
          sectionId={sectionId}
          commentCount={commentCount}
          onClick={handleCommentClick}
        />
      </div>
      <div className="text-gray-700 dark:text-gray-300">{children}</div>
    </Card>
  );
};

'use client';

import { FC, ReactNode } from 'react';

import { Card } from 'shared/ui';

import { CommentButton } from '../comment-button';

interface IProps {
  title: string;
  children: ReactNode;
  sectionId: string;
  commentCount?: number;
  onCommentClick?: (sectionId: string) => void;
}

export const SpecSection: FC<IProps> = ({
  title,
  children,
  sectionId,
  commentCount = 0,
  onCommentClick,
}) => {
  const handleCommentClick = () => {
    onCommentClick?.(sectionId);
  };

  return (
    <Card className="group mb-6">
      <div className="mb-4 flex items-start justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {title}
        </h3>
        {onCommentClick && (
          <CommentButton onClick={handleCommentClick} count={commentCount} />
        )}
      </div>
      <div className="text-gray-700 dark:text-gray-300">{children}</div>
    </Card>
  );
};

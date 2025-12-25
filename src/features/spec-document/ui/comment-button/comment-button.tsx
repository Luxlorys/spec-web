'use client';

import { FC } from 'react';

import { MessageCircle } from 'lucide-react';

import { cn } from 'shared/lib';
import { Badge } from 'shared/ui';

interface ICommentButtonProps {
  sectionId: string;
  commentCount: number;
  onClick: () => void;
  className?: string;
}

export const CommentButton: FC<ICommentButtonProps> = ({
  sectionId,
  commentCount,
  onClick,
  className,
}) => {
  const hasComments = commentCount > 0;

  return (
    <button
      onClick={onClick}
      aria-label={`${commentCount} ${commentCount === 1 ? 'comment' : 'comments'} on this section`}
      className={cn(
        'flex items-center gap-2 rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800',
        hasComments
          ? 'text-purple-600 dark:text-purple-400'
          : 'text-gray-400 dark:text-gray-500',
        className,
      )}
    >
      <MessageCircle size={20} />
      {hasComments && (
        <Badge variant="purple" size="sm">
          {commentCount}
        </Badge>
      )}
    </button>
  );
};

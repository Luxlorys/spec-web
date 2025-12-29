'use client';

import { FC } from 'react';

import { MessageCircle } from 'lucide-react';

import { cn } from 'shared/lib';

interface ICommentButtonProps {
  onClick: () => void;
  count?: number;
  className?: string;
}

export const CommentButton: FC<ICommentButtonProps> = ({
  onClick,
  count = 0,
  className,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={count > 0 ? `${count} comments` : 'Comments'}
      className={cn(
        'relative flex items-center gap-1.5 rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 dark:text-gray-500 dark:hover:bg-gray-800',
        count > 0 && 'text-purple-600 dark:text-purple-400',
        className,
      )}
    >
      <MessageCircle size={20} />
      {count > 0 && <span className="text-sm font-medium">{count}</span>}
    </button>
  );
};

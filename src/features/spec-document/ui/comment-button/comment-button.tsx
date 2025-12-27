'use client';

import { FC } from 'react';

import { MessageCircle } from 'lucide-react';

import { cn } from 'shared/lib';

interface ICommentButtonProps {
  onClick: () => void;
  className?: string;
}

export const CommentButton: FC<ICommentButtonProps> = ({
  onClick,
  className,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Comments"
      className={cn(
        'flex items-center gap-2 rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 dark:text-gray-500 dark:hover:bg-gray-800',
        className,
      )}
    >
      <MessageCircle size={20} />
    </button>
  );
};

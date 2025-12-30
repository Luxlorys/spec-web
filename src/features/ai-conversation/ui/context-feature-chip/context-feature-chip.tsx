'use client';

import { FC } from 'react';

import { FileText, Loader2, X } from 'lucide-react';

import { cn } from 'shared/lib';

interface IProps {
  feature: {
    id: number;
    title: string;
  };
  onRemove: () => void;
  isRemoving?: boolean;
}

export const ContextFeatureChip: FC<IProps> = ({
  feature,
  onRemove,
  isRemoving,
}) => {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 rounded-lg border border-purple-200 bg-purple-50 px-3 py-1.5 text-sm dark:border-purple-800 dark:bg-purple-900/30',
        isRemoving && 'opacity-50',
      )}
    >
      <FileText className="h-4 w-4 text-purple-600 dark:text-purple-400" />
      <span className="max-w-[200px] truncate text-purple-900 dark:text-purple-100">
        {feature.title}
      </span>
      <button
        type="button"
        onClick={onRemove}
        disabled={isRemoving}
        className="rounded p-0.5 text-purple-600 hover:bg-purple-200 hover:text-purple-800 disabled:cursor-not-allowed dark:text-purple-400 dark:hover:bg-purple-800 dark:hover:text-purple-200"
        aria-label="Remove context feature"
      >
        {isRemoving ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <X className="h-3.5 w-3.5" />
        )}
      </button>
    </div>
  );
};

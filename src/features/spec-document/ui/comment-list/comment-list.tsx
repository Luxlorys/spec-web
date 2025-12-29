'use client';

import { FC } from 'react';

import { SectionType } from 'shared/api/comments';
import { EmptyState } from 'shared/ui';

import { useGetCommentsBySection } from '../../api';
import { CommentItem } from '../comment-item';

interface ICommentListProps {
  specificationId: number;
  sectionType: SectionType;
}

export const CommentList: FC<ICommentListProps> = ({
  specificationId,
  sectionType,
}) => {
  const {
    data: comments = [],
    isLoading,
    isError,
    refetch,
  } = useGetCommentsBySection(specificationId, sectionType);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-purple-600 dark:border-gray-700 dark:border-t-purple-400" />
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="py-8 text-center">
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          Failed to load comments
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          className="text-purple-600 hover:underline dark:text-purple-400"
        >
          Try again
        </button>
      </div>
    );
  }

  // Empty state
  if (comments.length === 0) {
    return (
      <EmptyState
        title="No comments yet"
        description="Be the first to comment on this section"
        icon="💬"
      />
    );
  }

  return (
    <div className="space-y-2">
      {comments.map(comment => (
        <CommentItem
          key={comment.id}
          comment={comment}
          specificationId={specificationId}
        />
      ))}
    </div>
  );
};

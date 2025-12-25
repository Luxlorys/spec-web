'use client';

import { FC, useState } from 'react';
import { useGetCommentsBySection } from 'shared/hooks';
import { EmptyState } from 'shared/ui';
import { CommentItem } from '../comment-item';
import { CommentForm } from '../comment-form';

interface ICommentListProps {
  specDocumentId: string;
  section: string;
}

export const CommentList: FC<ICommentListProps> = ({ specDocumentId, section }) => {
  const { data: comments = [], isLoading, isError, refetch } = useGetCommentsBySection(
    specDocumentId,
    section,
  );

  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  // Separate top-level comments and replies
  const topLevelComments = comments.filter(c => !c.parentId);
  const getReplies = (commentId: string) => comments.filter(c => c.parentId === commentId);

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
        <p className="mb-4 text-gray-600 dark:text-gray-400">Failed to load comments</p>
        <button
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
      {topLevelComments.map(comment => {
        const replies = getReplies(comment.id);
        const isReplyFormOpen = replyingTo === comment.id;

        return (
          <div key={comment.id} className="space-y-2">
            {/* Parent Comment */}
            <CommentItem comment={comment} onReply={id => setReplyingTo(id)} isReply={false} />

            {/* Replies */}
            {replies.length > 0 && (
              <div className="ml-8 space-y-2 border-l-2 border-gray-200 pl-4 dark:border-gray-700">
                {replies.map(reply => (
                  <CommentItem
                    key={reply.id}
                    comment={reply}
                    onReply={id => setReplyingTo(id)}
                    isReply={true}
                  />
                ))}
              </div>
            )}

            {/* Reply Form */}
            {isReplyFormOpen && (
              <div className="ml-8 pl-4">
                <CommentForm
                  specDocumentId={specDocumentId}
                  section={section}
                  parentId={comment.id}
                  placeholder="Write a reply..."
                  autoFocus
                  onSuccess={() => setReplyingTo(null)}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

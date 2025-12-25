'use client';

import { FC, useState } from 'react';

import { Edit2, Reply, Trash2 } from 'lucide-react';

import { useDeleteComment, useUpdateComment } from 'shared/hooks';
import { formatRelativeTime } from 'shared/lib';
import { mockUsers } from 'shared/lib/mock-data';
import { useAuthStore } from 'shared/store';
import { IComment } from 'shared/types';
import { Avatar, Button } from 'shared/ui';

interface ICommentItemProps {
  comment: IComment;
  onReply: (commentId: string) => void;
  isReply?: boolean;
}

export const CommentItem: FC<ICommentItemProps> = ({
  comment,
  onReply,
  isReply = false,
}) => {
  const currentUser = useAuthStore(state => state.user);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);

  const updateMutation = useUpdateComment();
  const deleteMutation = useDeleteComment();

  // Get author info
  const author = mockUsers.find(u => u.id === comment.authorId);
  const isOwner = currentUser?.id === comment.authorId;
  const isUpdated = comment.createdAt.getTime() !== comment.updatedAt.getTime();

  // Handlers
  const handleEdit = () => setIsEditing(true);
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditContent(comment.content);
  };

  const handleSaveEdit = async () => {
    if (editContent.trim() === comment.content) {
      setIsEditing(false);

      return;
    }

    try {
      await updateMutation.mutateAsync({
        commentId: comment.id,
        data: { content: editContent },
      });
      setIsEditing(false);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to update comment:', error);
    }
  };

  const handleDelete = async () => {
    // eslint-disable-next-line no-alert, no-restricted-globals
    if (!confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    try {
      await deleteMutation.mutateAsync({
        commentId: comment.id,
        specDocumentId: comment.specDocumentId,
        section: comment.section,
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to delete comment:', error);
    }
  };

  return (
    <div className="group rounded-lg p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50">
      {/* Header */}
      <div className="mb-2 flex items-start gap-3">
        <Avatar
          src={author?.avatarUrl}
          alt={author?.name || 'User'}
          size="sm"
        />

        <div className="flex-1">
          <div className="flex items-baseline gap-2">
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {author?.name || 'Unknown User'}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {formatRelativeTime(comment.createdAt)}
            </span>
            {isUpdated && (
              <span className="text-xs text-gray-400 dark:text-gray-500">
                (edited)
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="ml-11">
        {isReply && (
          <div className="mb-1 text-sm text-gray-400 dark:text-gray-500">
            ...
          </div>
        )}

        {isEditing ? (
          <div className="space-y-2">
            <textarea
              value={editContent}
              onChange={e => setEditContent(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
              rows={3}
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleSaveEdit}
                isLoading={updateMutation.isPending}
              >
                Save
              </Button>
              <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-gray-700 dark:text-gray-300">{comment.content}</p>
        )}

        {/* Actions */}
        {!isEditing && (
          <div className="mt-2 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              type="button"
              onClick={() => onReply(comment.id)}
              className="flex items-center gap-1 text-sm text-gray-600 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400"
            >
              <Reply size={14} />
              Reply
            </button>

            {isOwner && (
              <>
                <button
                  type="button"
                  onClick={handleEdit}
                  className="flex items-center gap-1 text-sm text-gray-600 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400"
                >
                  <Edit2 size={14} />
                  Edit
                </button>

                <button
                  type="button"
                  onClick={handleDelete}
                  className="flex items-center gap-1 text-sm text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                  disabled={deleteMutation.isPending}
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

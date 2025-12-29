'use client';

import { FC, useState } from 'react';

import { Edit2, Trash2 } from 'lucide-react';

import { IComment } from 'shared/api/comments';
import { formatRelativeTime } from 'shared/lib';
import { useAuthStore } from 'shared/store';
import { Avatar, Button } from 'shared/ui';

import { useDeleteComment, useUpdateComment } from '../../api';

interface ICommentItemProps {
  comment: IComment;
  specificationId: number;
}

export const CommentItem: FC<ICommentItemProps> = ({
  comment,
  specificationId,
}) => {
  const currentUser = useAuthStore(state => state.user);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);

  const updateMutation = useUpdateComment();
  const deleteMutation = useDeleteComment();

  // Get author info from comment.author object
  const authorName = comment.author
    ? `${comment.author.firstName} ${comment.author.lastName}`
    : 'Unknown User';
  const isOwner =
    currentUser?.id !== undefined && currentUser.id === comment.authorId;
  const isUpdated = comment.createdAt !== comment.updatedAt;

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
        specificationId,
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
        specificationId,
        commentId: comment.id,
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to delete comment:', error);
    }
  };

  // Styles based on ownership
  const bubbleClassName = isOwner
    ? 'bg-purple-50 dark:bg-purple-900/20' // Light purple for own comments
    : 'bg-gray-100 dark:bg-gray-800/50'; // Light gray for others' comments

  return (
    <div
      className={`flex w-full ${isOwner ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`group flex max-w-[80%] gap-2 ${isOwner ? 'flex-row-reverse' : 'flex-row'}`}
      >
        {/* Avatar */}
        <Avatar
          src={comment.author?.avatarUrl ?? undefined}
          alt={authorName}
          size="sm"
          className="shrink-0"
        />

        {/* Comment bubble */}
        <div className={`rounded-lg p-3 ${bubbleClassName}`}>
          {/* Header */}
          <div
            className={`mb-1 flex items-baseline gap-2 ${isOwner ? 'flex-row-reverse' : 'flex-row'}`}
          >
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {authorName}
              {isOwner && (
                <span className="ml-1.5 text-xs font-normal text-purple-600 dark:text-purple-400">
                  (you)
                </span>
              )}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {formatRelativeTime(new Date(comment.createdAt))}
            </span>
            {isUpdated && (
              <span className="text-xs text-gray-400 dark:text-gray-500">
                (edited)
              </span>
            )}
          </div>

          {/* Content */}
          {isEditing ? (
            <div className="space-y-2">
              <textarea
                value={editContent}
                onChange={e => setEditContent(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white p-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
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

          {/* Actions - Only show edit/delete for owner */}
          {!isEditing && isOwner && (
            <div
              className={`mt-2 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100 ${isOwner ? 'justify-end' : 'justify-start'}`}
            >
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

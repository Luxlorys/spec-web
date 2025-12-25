'use client';

import { FC, FormEvent, useState } from 'react';

import { useCreateComment } from 'shared/hooks';
import { Button, Textarea } from 'shared/ui';

import { validateCommentContent } from '../../lib/validation';

interface ICommentFormProps {
  specDocumentId: string;
  section: string;
  parentId?: string;
  onSuccess?: () => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export const CommentForm: FC<ICommentFormProps> = ({
  specDocumentId,
  section,
  parentId,
  onSuccess,
  placeholder = 'Add a comment...',
  autoFocus = false,
}) => {
  const [content, setContent] = useState('');
  const [error, setError] = useState<string | null>(null);

  const createMutation = useCreateComment();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validate
    const validationError = validateCommentContent(content);

    if (validationError) {
      setError(validationError);

      return;
    }

    try {
      await createMutation.mutateAsync({
        specDocumentId,
        data: {
          section,
          content: content.trim(),
          parentId,
        },
      });

      // Clear form
      setContent('');
      setError(null);

      // Callback
      onSuccess?.();
    } catch (err) {
      setError('Failed to post comment. Please try again.');
      console.error('Failed to create comment:', err);
    }
  };

  const handleCancel = () => {
    setContent('');
    setError(null);
    onSuccess?.();
  };

  const isReply = !!parentId;

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Textarea
        value={content}
        onChange={e => {
          setContent(e.target.value);
          if (error) {
            setError(null);
          }
        }}
        placeholder={placeholder}
        rows={3}
        error={error || undefined}
        autoFocus={autoFocus}
        className="w-full"
      />

      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {content.length}/1000
        </span>

        <div className="flex gap-2">
          {isReply && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCancel}
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            size="sm"
            disabled={!content.trim() || createMutation.isPending}
            isLoading={createMutation.isPending}
          >
            {isReply ? 'Reply' : 'Comment'}
          </Button>
        </div>
      </div>
    </form>
  );
};

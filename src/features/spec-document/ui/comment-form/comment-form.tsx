'use client';

import { FC, FormEvent, useState } from 'react';

import { SectionType } from 'shared/api/comments';
import { Button, Textarea } from 'shared/ui';

import { useCreateComment } from '../../api';
import { validateCommentContent } from '../../lib/validation';

interface ICommentFormProps {
  specificationId: number;
  sectionType: SectionType;
  onSuccess?: () => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export const CommentForm: FC<ICommentFormProps> = ({
  specificationId,
  sectionType,
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
        specificationId,
        data: {
          sectionType,
          content: content.trim(),
        },
      });

      // Clear form
      setContent('');
      setError(null);

      // Callback
      onSuccess?.();
    } catch (err) {
      setError('Failed to post comment. Please try again.');
      // eslint-disable-next-line no-console
      console.error('Failed to create comment:', err);
    }
  };

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

        <Button
          type="submit"
          size="sm"
          disabled={!content.trim() || createMutation.isPending}
          isLoading={createMutation.isPending}
        >
          Comment
        </Button>
      </div>
    </form>
  );
};

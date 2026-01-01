'use client';

import { FC } from 'react';

import { SectionType } from 'shared/api/comments';
import { Button, Textarea } from 'shared/ui';

import { useCommentForm } from '../../hooks';

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
  const { form, onSubmit, isLoading } = useCommentForm({
    specificationId,
    sectionType,
    onSuccess,
  });

  const {
    register,
    watch,
    formState: { errors },
  } = form;

  const content = watch('content');

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <Textarea
        {...register('content')}
        placeholder={placeholder}
        rows={3}
        error={errors.content?.message}
        autoFocus={autoFocus}
        className="w-full"
      />

      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {content?.length || 0}/1000
        </span>

        <Button
          type="submit"
          size="sm"
          disabled={!content?.trim() || isLoading}
          isLoading={isLoading}
        >
          Comment
        </Button>
      </div>
    </form>
  );
};

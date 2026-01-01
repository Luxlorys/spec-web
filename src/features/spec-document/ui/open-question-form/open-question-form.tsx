'use client';

import { FC } from 'react';

import { Plus } from 'lucide-react';

import { Button, Textarea } from 'shared/ui';

import { useOpenQuestionForm } from '../../hooks';

interface IOpenQuestionFormProps {
  specificationId: number;
}

export const OpenQuestionForm: FC<IOpenQuestionFormProps> = ({
  specificationId,
}) => {
  const { form, onSubmit, isAdding, startAdding, cancelAdding, isLoading } =
    useOpenQuestionForm({ specificationId });

  const {
    register,
    watch,
    formState: { errors },
  } = form;

  const questionText = watch('question');

  if (!isAdding) {
    return (
      <div className="mb-4">
        <Button onClick={startAdding} variant="outline" size="sm">
          <Plus className="h-4 w-4" />
          Add New Question
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mb-4 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50"
    >
      <div className="mb-3">
        <label
          htmlFor="new-question"
          className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          New Question
        </label>
        <Textarea
          id="new-question"
          {...register('question')}
          placeholder="What question needs to be answered?"
          className="min-h-[80px]"
          error={errors.question?.message}
          autoFocus
        />
      </div>
      <div className="flex gap-2">
        <Button
          type="submit"
          size="sm"
          disabled={!questionText?.trim() || isLoading}
        >
          {isLoading ? 'Adding...' : 'Add Question'}
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={cancelAdding}
          disabled={isLoading}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

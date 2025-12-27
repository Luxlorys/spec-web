// @ts-nocheck
// This component is not currently used - kept for future implementation
// Type checking is disabled until feature is implemented

'use client';

import { FC, useState } from 'react';

import { Plus } from 'lucide-react';

import { useCreateOpenQuestion } from 'shared/hooks';
import { Button, Textarea } from 'shared/ui';

interface IOpenQuestionFormProps {
  specId: string;
}

export const OpenQuestionForm: FC<IOpenQuestionFormProps> = ({ specId }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [questionText, setQuestionText] = useState('');

  const createMutation = useCreateOpenQuestion();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!questionText.trim()) {
      return;
    }

    createMutation.mutate(
      {
        specId,
        data: { question: questionText },
      },
      {
        onSuccess: () => {
          setQuestionText('');
          setIsAdding(false);
        },
      },
    );
  };

  const handleCancel = () => {
    setQuestionText('');
    setIsAdding(false);
  };

  if (!isAdding) {
    return (
      <div className="mb-4">
        <Button onClick={() => setIsAdding(true)} variant="outline" size="sm">
          <Plus className="h-4 w-4" />
          Add New Question
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
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
          value={questionText}
          onChange={e => setQuestionText(e.target.value)}
          placeholder="What question needs to be answered?"
          className="min-h-[80px]"
          autoFocus
        />
      </div>
      <div className="flex gap-2">
        <Button
          type="submit"
          size="sm"
          disabled={!questionText.trim() || createMutation.isPending}
        >
          {createMutation.isPending ? 'Adding...' : 'Add Question'}
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={handleCancel}
          disabled={createMutation.isPending}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

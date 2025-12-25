'use client';

import { FC, useState } from 'react';

import { Check, Pencil, Trash2, X } from 'lucide-react';

import { useDeleteOpenQuestion, useUpdateOpenQuestion } from 'shared/hooks';
import { IOpenQuestion } from 'shared/types';
import { Badge, Button, Textarea } from 'shared/ui';

interface IOpenQuestionItemProps {
  question: IOpenQuestion;
  specId: string;
}

export const OpenQuestionItem: FC<IOpenQuestionItemProps> = ({
  question,
  specId,
}) => {
  const [isEditingQuestion, setIsEditingQuestion] = useState(false);
  const [isEditingAnswer, setIsEditingAnswer] = useState(false);
  const [editedQuestion, setEditedQuestion] = useState(question.question);
  const [editedAnswer, setEditedAnswer] = useState(question.answer || '');

  const updateMutation = useUpdateOpenQuestion();
  const deleteMutation = useDeleteOpenQuestion();

  const handleSaveQuestion = () => {
    if (!editedQuestion.trim()) {
      return;
    }

    updateMutation.mutate(
      {
        specId,
        questionId: question.id,
        data: { question: editedQuestion },
      },
      {
        onSuccess: () => {
          setIsEditingQuestion(false);
        },
      },
    );
  };

  const handleCancelEditQuestion = () => {
    setEditedQuestion(question.question);
    setIsEditingQuestion(false);
  };

  const handleSaveAnswer = () => {
    updateMutation.mutate(
      {
        specId,
        questionId: question.id,
        data: { answer: editedAnswer.trim() || undefined },
      },
      {
        onSuccess: () => {
          setIsEditingAnswer(false);
        },
      },
    );
  };

  const handleCancelEditAnswer = () => {
    setEditedAnswer(question.answer || '');
    setIsEditingAnswer(false);
  };

  const handleToggleResolved = () => {
    updateMutation.mutate({
      specId,
      questionId: question.id,
      data: { resolved: !question.resolved },
    });
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      deleteMutation.mutate({ specId, questionId: question.id });
    }
  };

  const isResolved = question.resolved;
  const borderColor = isResolved
    ? 'border-green-200 dark:border-green-900/50'
    : 'border-yellow-200 dark:border-yellow-900/50';
  const bgColor = isResolved
    ? 'bg-green-50 dark:bg-green-900/20'
    : 'bg-yellow-50 dark:bg-yellow-900/20';
  const textColor = isResolved
    ? 'text-green-900 dark:text-green-100'
    : 'text-yellow-900 dark:text-yellow-100';
  const secondaryTextColor = isResolved
    ? 'text-green-800 dark:text-green-200'
    : 'text-yellow-800 dark:text-yellow-200';

  return (
    <li
      className={`rounded-lg border p-4 transition-colors ${borderColor} ${bgColor}`}
    >
      {/* Question */}
      <div className="mb-3">
        <div className="mb-2 flex items-start justify-between gap-2">
          <div className="flex-1">
            {isEditingQuestion ? (
              <div className="space-y-2">
                <Textarea
                  value={editedQuestion}
                  onChange={e => setEditedQuestion(e.target.value)}
                  className="min-h-[60px]"
                  autoFocus
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={handleSaveQuestion}
                    disabled={
                      !editedQuestion.trim() || updateMutation.isPending
                    }
                  >
                    <Check className="h-3 w-3" />
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCancelEditQuestion}
                    disabled={updateMutation.isPending}
                  >
                    <X className="h-3 w-3" />
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className={`font-medium ${textColor}`}>
                Q: {question.question}
              </div>
            )}
          </div>

          {!isEditingQuestion && (
            <div className="flex gap-1">
              <button
                onClick={() => setIsEditingQuestion(true)}
                className="rounded p-1 transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                title="Edit question"
                type="button"
              >
                <Pencil className="h-4 w-4 text-gray-500" />
              </button>
              <button
                onClick={handleDelete}
                className="rounded p-1 transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                title="Delete question"
                type="button"
                disabled={deleteMutation.isPending}
              >
                <Trash2 className="h-4 w-4 text-gray-500" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Answer */}
      <div className="mb-3">
        {isEditingAnswer ? (
          <div className="space-y-2">
            <Textarea
              value={editedAnswer}
              onChange={e => setEditedAnswer(e.target.value)}
              placeholder="Type your answer here..."
              className="min-h-[80px]"
              autoFocus
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleSaveAnswer}
                disabled={updateMutation.isPending}
              >
                <Check className="h-3 w-3" />
                Save Answer
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCancelEditAnswer}
                disabled={updateMutation.isPending}
              >
                <X className="h-3 w-3" />
                Cancel
              </Button>
            </div>
          </div>
        ) : question.answer ? (
          <div className="group relative">
            <div className={`text-sm ${secondaryTextColor}`}>
              A: {question.answer}
            </div>
            <button
              onClick={() => setIsEditingAnswer(true)}
              className="absolute right-0 top-0 rounded p-1 opacity-0 transition-opacity hover:bg-black/5 group-hover:opacity-100 dark:hover:bg-white/5"
              title="Edit answer"
              type="button"
            >
              <Pencil className="h-3 w-3 text-gray-500" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Badge variant="yellow" size="sm">
              Awaiting Answer
            </Badge>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsEditingAnswer(true)}
            >
              Add Answer
            </Button>
          </div>
        )}
      </div>

      {/* Resolved Checkbox */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={isResolved}
          onChange={handleToggleResolved}
          disabled={updateMutation.isPending}
          className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
          id={`resolved-${question.id}`}
        />
        <label
          htmlFor={`resolved-${question.id}`}
          className="text-sm text-gray-700 dark:text-gray-300"
        >
          Mark as resolved
        </label>
      </div>
    </li>
  );
};

'use client';

import { FC, useState } from 'react';

import { Bot, Check, CheckCircle, Pencil, Trash2, User, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

import { useAuthStore } from 'shared/store';
import { IOpenQuestion, IQuestionAnswer } from 'shared/types';
import { Badge, Button, Textarea } from 'shared/ui';

import {
  useCreateAnswer,
  useDeleteAnswer,
  useDeleteOpenQuestion,
  useEditAnswer,
  useEditOpenQuestion,
  useResolveOpenQuestion,
} from '../../api';

interface IOpenQuestionItemProps {
  question: IOpenQuestion;
  specificationId: number;
}

const AuthorDisplay: FC<{
  name: string | null;
  isAi: boolean;
  label: string;
}> = ({ name, isAi, label }) => (
  <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
    {isAi ? (
      <>
        <Bot className="h-3 w-3" />
        <span>AI {label}</span>
      </>
    ) : (
      <>
        <User className="h-3 w-3" />
        <span>{name || 'Unknown'}</span>
      </>
    )}
  </div>
);

const AiBadge: FC = () => (
  <Badge variant="purple" size="sm" className="ml-2">
    <Bot className="mr-1 h-3 w-3" />
    AI
  </Badge>
);

export const OpenQuestionItem: FC<IOpenQuestionItemProps> = ({
  question,
  specificationId,
}) => {
  const currentUser = useAuthStore(state => state.user);

  // Question editing state
  const [isEditingQuestion, setIsEditingQuestion] = useState(false);
  const [editedQuestion, setEditedQuestion] = useState(question.question);

  // Answer editing state
  const [editingAnswerId, setEditingAnswerId] = useState<number | null>(null);
  const [editedAnswerContent, setEditedAnswerContent] = useState('');

  // Add answer state
  const [isAddingAnswer, setIsAddingAnswer] = useState(false);
  const [newAnswerContent, setNewAnswerContent] = useState('');

  // Mutations
  const editQuestionMutation = useEditOpenQuestion();
  const deleteQuestionMutation = useDeleteOpenQuestion();
  const resolveMutation = useResolveOpenQuestion();
  const createAnswerMutation = useCreateAnswer();
  const editAnswerMutation = useEditAnswer();
  const deleteAnswerMutation = useDeleteAnswer();

  // Permission checks
  const isQuestionOwner =
    currentUser?.id !== undefined &&
    !question.askedByAi &&
    question.askedByUserId === currentUser.id;

  const isAnswerOwner = (answer: IQuestionAnswer) =>
    currentUser?.id !== undefined &&
    !answer.answeredByAi &&
    answer.authorId === currentUser.id;

  // Question handlers
  const handleSaveQuestion = async () => {
    if (!editedQuestion.trim()) {
      return;
    }

    await editQuestionMutation.mutateAsync(
      {
        specificationId,
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

  const handleDeleteQuestion = async () => {
    // eslint-disable-next-line no-alert
    if (window.confirm('Are you sure you want to delete this question?')) {
      await deleteQuestionMutation.mutateAsync({
        specificationId,
        questionId: question.id,
      });
    }
  };

  // Answer handlers
  const handleStartEditAnswer = (answer: IQuestionAnswer) => {
    setEditingAnswerId(answer.id);
    setEditedAnswerContent(answer.content);
  };

  const handleSaveAnswer = async () => {
    if (editingAnswerId === null || !editedAnswerContent.trim()) {
      return;
    }

    await editAnswerMutation.mutateAsync(
      {
        specificationId,
        questionId: question.id,
        answerId: editingAnswerId,
        data: { content: editedAnswerContent },
      },
      {
        onSuccess: () => {
          setEditingAnswerId(null);
          setEditedAnswerContent('');
        },
      },
    );
  };

  const handleCancelEditAnswer = () => {
    setEditingAnswerId(null);
    setEditedAnswerContent('');
  };

  const handleDeleteAnswer = async (answerId: number) => {
    // eslint-disable-next-line no-alert
    if (window.confirm('Are you sure you want to delete this answer?')) {
      await deleteAnswerMutation.mutateAsync({
        specificationId,
        questionId: question.id,
        answerId,
      });
    }
  };

  // Add answer handlers
  const handleAddAnswer = async () => {
    if (!newAnswerContent.trim()) {
      return;
    }

    await createAnswerMutation.mutateAsync(
      {
        specificationId,
        questionId: question.id,
        data: { content: newAnswerContent },
      },
      {
        onSuccess: () => {
          setNewAnswerContent('');
          setIsAddingAnswer(false);
        },
      },
    );
  };

  const handleCancelAddAnswer = () => {
    setNewAnswerContent('');
    setIsAddingAnswer(false);
  };

  // Resolve handler
  const handleResolve = async (answerId: number) => {
    await resolveMutation.mutateAsync({
      specificationId,
      questionId: question.id,
      data: { acceptedAnswerId: answerId },
    });
  };

  const { isResolved } = question;
  const borderColor = isResolved
    ? 'border-green-200 dark:border-green-900/50'
    : 'border-yellow-200 dark:border-yellow-900/50';
  const bgColor = isResolved
    ? 'bg-green-50 dark:bg-green-900/20'
    : 'bg-yellow-50 dark:bg-yellow-900/20';
  const textColor = isResolved
    ? 'text-green-900 dark:text-green-100'
    : 'text-yellow-900 dark:text-yellow-100';

  const askerName = question.askedByUser
    ? `${question.askedByUser.firstName} ${question.askedByUser.lastName}`
    : null;

  return (
    <li
      className={`rounded-lg border p-4 transition-colors ${borderColor} ${bgColor}`}
    >
      {/* Question Header */}
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
                      !editedQuestion.trim() || editQuestionMutation.isPending
                    }
                  >
                    <Check className="h-3 w-3" />
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCancelEditQuestion}
                    disabled={editQuestionMutation.isPending}
                  >
                    <X className="h-3 w-3" />
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <div className={`font-medium ${textColor} flex items-center`}>
                  <span className="mr-1">Q:</span>
                  {question.askedByAi ? (
                    <span className="[&_p]:inline [&_strong]:font-semibold">
                      <ReactMarkdown>{question.question}</ReactMarkdown>
                    </span>
                  ) : (
                    <span>{question.question}</span>
                  )}
                  {question.askedByAi && <AiBadge />}
                </div>
                <div className="mt-1">
                  <AuthorDisplay
                    name={askerName}
                    isAi={question.askedByAi}
                    label="generated"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Only show edit/delete for question owner */}
          {/* Note: Resolved questions cannot be edited, only deleted */}
          {!isEditingQuestion && isQuestionOwner && (
            <div className="flex gap-1">
              {!isResolved && (
                <button
                  onClick={() => setIsEditingQuestion(true)}
                  className="rounded p-1 transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                  title="Edit question"
                  aria-label="Edit question"
                  type="button"
                >
                  <Pencil className="h-4 w-4 text-gray-500" />
                </button>
              )}
              <button
                onClick={handleDeleteQuestion}
                className="rounded p-1 transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                title="Delete question"
                aria-label="Delete question"
                type="button"
                disabled={deleteQuestionMutation.isPending}
              >
                <Trash2 className="h-4 w-4 text-gray-500" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Answers Section */}
      <div className="space-y-3">
        {question.answers.length === 0 && !isAddingAnswer && (
          <div className="flex items-center gap-2">
            <Badge variant="yellow" size="sm">
              Awaiting Answer
            </Badge>
          </div>
        )}

        {question.answers.map(answer => {
          const isAccepted = question.acceptedAnswerId === answer.id;
          const isEditing = editingAnswerId === answer.id;
          const authorName = answer.author
            ? `${answer.author.firstName} ${answer.author.lastName}`
            : null;
          const canEditAnswer = isAnswerOwner(answer);

          return (
            <div
              key={answer.id}
              className={`rounded-md border p-3 ${
                isAccepted
                  ? 'border-green-300 bg-green-100/50 dark:border-green-700 dark:bg-green-900/30'
                  : 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800'
              }`}
            >
              {isEditing ? (
                <div className="space-y-2">
                  <Textarea
                    value={editedAnswerContent}
                    onChange={e => setEditedAnswerContent(e.target.value)}
                    className="min-h-[60px]"
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={handleSaveAnswer}
                      disabled={
                        !editedAnswerContent.trim() ||
                        editAnswerMutation.isPending
                      }
                    >
                      <Check className="h-3 w-3" />
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleCancelEditAnswer}
                      disabled={editAnswerMutation.isPending}
                    >
                      <X className="h-3 w-3" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="group relative">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          A:
                        </span>
                        {answer.answeredByAi && <AiBadge />}
                        {isAccepted && (
                          <Badge variant="green" size="sm">
                            <CheckCircle className="mr-1 h-3 w-3" />
                            Accepted
                          </Badge>
                        )}
                      </div>
                      {answer.answeredByAi ? (
                        <div className="mt-1 text-sm text-gray-600 dark:text-gray-400 [&>p]:mb-2 [&>p:last-child]:mb-0 [&>ol]:list-decimal [&>ol]:pl-4 [&>ul]:list-disc [&>ul]:pl-4 [&>li]:mb-1 [&_strong]:font-semibold">
                          <ReactMarkdown>{answer.content}</ReactMarkdown>
                        </div>
                      ) : (
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                          {answer.content}
                        </p>
                      )}
                      <div className="mt-2">
                        <AuthorDisplay
                          name={authorName}
                          isAi={answer.answeredByAi}
                          label="generated"
                        />
                      </div>
                    </div>

                    <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      {/* Only show edit/delete for answer owner */}
                      {/* Note: Accepted answers on resolved questions cannot be edited, only deleted */}
                      {canEditAnswer && (
                        <>
                          {!(isResolved && isAccepted) && (
                            <button
                              onClick={() => handleStartEditAnswer(answer)}
                              className="rounded p-1 transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                              title="Edit answer"
                              aria-label="Edit answer"
                              type="button"
                            >
                              <Pencil className="h-3 w-3 text-gray-500" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteAnswer(answer.id)}
                            className="rounded p-1 transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                            title="Delete answer"
                            aria-label="Delete answer"
                            type="button"
                            disabled={deleteAnswerMutation.isPending}
                          >
                            <Trash2 className="h-3 w-3 text-gray-500" />
                          </button>
                        </>
                      )}
                      {/* Anyone can accept an answer if question is not resolved */}
                      {!isResolved && (
                        <button
                          onClick={() => handleResolve(answer.id)}
                          className="rounded p-1 transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                          title="Accept this answer"
                          aria-label="Accept this answer"
                          type="button"
                          disabled={resolveMutation.isPending}
                        >
                          <CheckCircle className="h-3 w-3 text-green-600" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Add Answer UI - only show if question is not resolved */}
        {!isResolved && (
          <div className="mt-3">
            {isAddingAnswer ? (
              <div className="space-y-2 rounded-md border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800">
                <Textarea
                  value={newAnswerContent}
                  onChange={e => setNewAnswerContent(e.target.value)}
                  placeholder="Write your answer..."
                  className="min-h-[80px]"
                  autoFocus
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={handleAddAnswer}
                    disabled={
                      !newAnswerContent.trim() || createAnswerMutation.isPending
                    }
                  >
                    {createAnswerMutation.isPending
                      ? 'Adding...'
                      : 'Add Answer'}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCancelAddAnswer}
                    disabled={createAnswerMutation.isPending}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsAddingAnswer(true)}
              >
                Add Answer
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Resolved Status */}
      {isResolved && (
        <div className="mt-3 flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <span className="text-sm font-medium text-green-700 dark:text-green-400">
            Question Resolved
          </span>
        </div>
      )}
    </li>
  );
};

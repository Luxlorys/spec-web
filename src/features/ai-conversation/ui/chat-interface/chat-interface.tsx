'use client';

import { FC, useEffect, useRef, useState } from 'react';

import { useRouter } from 'next/navigation';

import { Loader2, Plus, Send, X } from 'lucide-react';

import { StatusBadge } from 'features/feature-requests';
import { useGetSpecification } from 'features/spec-document';
import { IFeatureRequest } from 'shared/api';
import { cn } from 'shared/lib';
import { Button, Card } from 'shared/ui';

import {
  useContextFeature,
  useGetConversation,
  useUpdateContextFeature,
} from '../../api';
import { useStreamingMessage } from '../../hooks';
import { AttachmentDialog } from '../attachment-dialog';
import { Message } from '../message';
import { ThinkingIndicator } from '../thinking-indicator';

interface IProps {
  featureId: string;
  feature?: IFeatureRequest;
}

export const ChatInterface: FC<IProps> = ({ featureId, feature }) => {
  const router = useRouter();
  const [inputValue, setInputValue] = useState('');
  const [attachmentDialogOpen, setAttachmentDialogOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const numericFeatureId = Number(featureId);

  const { data: conversation, isLoading } =
    useGetConversation(numericFeatureId);

  const { data: contextFeature } = useContextFeature(
    feature?.contextFeatureId ?? null,
  );

  const {
    isStreaming,
    streamedText,
    pendingUserMessage,
    error: streamError,
    sendMessage,
  } = useStreamingMessage(numericFeatureId);

  const updateContextMutation = useUpdateContextFeature(numericFeatureId);

  const { data: specification } = useGetSpecification(numericFeatureId);

  const handleSend = async () => {
    if (!inputValue.trim() || isStreaming) {
      return;
    }

    const userContent = inputValue;

    setInputValue('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    await sendMessage(userContent);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    // Auto-resize textarea
    const textarea = e.target;

    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`;
  };

  const handleAttachFeature = async (contextFeatureId: number) => {
    try {
      await updateContextMutation.mutateAsync(contextFeatureId);
    } catch {
      // Error handled by mutation state
    }
  };

  const handleRemoveContext = async () => {
    try {
      await updateContextMutation.mutateAsync(null);
    } catch {
      // Error handled by mutation state
    }
  };

  // Scroll to bottom on new messages or streaming updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation?.messages, isStreaming, streamedText, pendingUserMessage]);

  const handleViewSpec = () => {
    router.push(`/features/${featureId}`);
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Card className="p-6 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Conversation not found. Please try again.
          </p>
          <Button className="mt-4" onClick={() => router.push('/dashboard')}>
            Back to Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  const { isCompleted } = conversation;

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="mx-auto max-w-4xl space-y-6">
          {conversation.messages.map(message => (
            <Message key={message.id} message={message} />
          ))}

          {/* Optimistic user message while streaming */}
          {pendingUserMessage && (
            <Message
              message={{
                id: -2,
                role: 'USER',
                content: pendingUserMessage,
                createdAt: new Date().toISOString(),
              }}
            />
          )}

          {/* Streaming AI response */}
          {streamedText && (
            <Message
              message={{
                id: -1,
                role: 'ASSISTANT',
                content: streamedText,
                createdAt: new Date().toISOString(),
              }}
              isStreaming={isStreaming}
            />
          )}

          {/* Thinking indicator before text starts streaming */}
          {isStreaming && !streamedText && <ThinkingIndicator />}

          {/* Stream error display */}
          {streamError && (
            <Card className="border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-900/20">
              <p className="text-sm text-red-800 dark:text-red-200">
                Error: {streamError}
              </p>
            </Card>
          )}

          {isCompleted && !specification && (
            <Card className="border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-900/20">
              <div className="flex flex-col items-center text-center">
                <Loader2 className="mb-3 h-8 w-8 animate-spin text-amber-600 dark:text-amber-400" />
                <h3 className="mb-2 text-lg font-semibold text-amber-900 dark:text-amber-100">
                  Generating Specification...
                </h3>
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  Your specification document is being generated. This usually
                  takes a few seconds.
                </p>
              </div>
            </Card>
          )}

          {isCompleted && specification && (
            <Card className="border-green-200 bg-green-50 dark:border-green-900/50 dark:bg-green-900/20">
              <div className="text-center">
                <h3 className="mb-2 text-lg font-semibold text-green-900 dark:text-green-100">
                  Conversation Complete!
                </h3>
                <p className="mb-4 text-sm text-green-800 dark:text-green-200">
                  The specification document has been generated and is ready for
                  review.
                </p>
                <Button onClick={handleViewSpec}>
                  View Specification Document
                </Button>
              </div>
            </Card>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area - Claude-like design */}
      {!isCompleted && (
        <div className="border-t border-purple-200 bg-white pb-2 pt-3 dark:border-gray-700 dark:bg-gray-900">
          <div className="mx-auto max-w-4xl px-4">
            {/* Context feature display above input */}
            {contextFeature && (
              <div className="mb-2 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <span>Additional context:</span>
                <span className="truncate font-medium">
                  {contextFeature.title}
                </span>
                <StatusBadge status={contextFeature.status} />
                <button
                  type="button"
                  onClick={handleRemoveContext}
                  disabled={updateContextMutation.isPending}
                  className="shrink-0 rounded p-0.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-gray-800 dark:hover:text-gray-300"
                  aria-label="Remove context"
                >
                  {updateContextMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <X className="h-4 w-4" />
                  )}
                </button>
              </div>
            )}

            {/* Input container with Claude-like design */}
            <div
              className={cn(
                'flex items-start gap-2 rounded-2xl border border-gray-300 bg-white p-2 transition-colors dark:border-gray-600 dark:bg-gray-800',
                'focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20',
              )}
            >
              {/* Plus button with attachment dialog */}
              <AttachmentDialog
                open={attachmentDialogOpen}
                onOpenChange={setAttachmentDialogOpen}
                currentFeatureId={numericFeatureId}
                onSelectFeature={handleAttachFeature}
              >
                <button
                  type="button"
                  disabled={isStreaming}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
                  aria-label="Add attachment"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </AttachmentDialog>

              {/* Textarea */}
              <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={handleTextareaChange}
                onKeyDown={handleKeyPress}
                placeholder="Type your response... (Shift+Enter for new line)"
                rows={1}
                className="max-h-[150px] min-h-[36px] flex-1 resize-none bg-transparent py-2 text-sm leading-relaxed text-gray-900 outline-none placeholder:text-gray-400 dark:text-gray-100 dark:placeholder:text-gray-500"
              />

              {/* Send button */}
              <button
                type="button"
                onClick={handleSend}
                disabled={!inputValue.trim() || isStreaming}
                className={cn(
                  'flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors',
                  inputValue.trim() && !isStreaming
                    ? 'bg-primary text-white hover:bg-primary/90'
                    : 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500',
                  'disabled:cursor-not-allowed',
                )}
                aria-label="Send message"
              >
                {isStreaming ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </button>
            </div>

            <p className="mt-2 text-center text-xs text-gray-500 dark:text-gray-400">
              Press Enter to send, Shift+Enter for new line
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

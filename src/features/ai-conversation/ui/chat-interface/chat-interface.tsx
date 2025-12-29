'use client';

import { FC, useEffect, useRef, useState } from 'react';

import { useRouter } from 'next/navigation';

import { Button, Card, Textarea } from 'shared/ui';

import { useGetConversation, useSendMessage } from '../../api';
import { Message } from '../message';
import { ThinkingIndicator } from '../thinking-indicator';

interface IProps {
  featureId: string;
}

export const ChatInterface: FC<IProps> = ({ featureId }) => {
  const router = useRouter();
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const numericFeatureId = Number(featureId);

  const { data: conversation, isLoading } =
    useGetConversation(numericFeatureId);

  const sendMessageMutation = useSendMessage(numericFeatureId);

  const handleSend = async () => {
    if (!inputValue.trim() || sendMessageMutation.isPending) {
      return;
    }

    try {
      await sendMessageMutation.mutateAsync({
        content: inputValue,
      });

      setInputValue('');
    } catch {
      // Error is handled by mutation state - input is preserved for retry
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation?.messages, sendMessageMutation.isPending]);

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
    <div className="flex h-[calc(100vh-12rem)] flex-col">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="mx-auto max-w-4xl space-y-6">
          {conversation.messages.map(message => (
            <Message key={message.id} message={message} />
          ))}

          {sendMessageMutation.isPending && <ThinkingIndicator />}

          {isCompleted && (
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

      {/* Input Area */}
      {!isCompleted && (
        <div className="border-t border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <div className="mx-auto max-w-4xl">
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <Textarea
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Type your response... (Shift+Enter for new line)"
                  rows={3}
                  disabled={sendMessageMutation.isPending}
                />
              </div>
              <Button
                onClick={handleSend}
                disabled={!inputValue.trim() || sendMessageMutation.isPending}
                isLoading={sendMessageMutation.isPending}
              >
                Send
              </Button>
            </div>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Press Enter to send, Shift+Enter for new line
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

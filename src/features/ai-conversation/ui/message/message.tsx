'use client';

import { FC } from 'react';

import ReactMarkdown from 'react-markdown';

import { IConversationMessage } from 'shared/api';
import { cn, formatDateTime } from 'shared/lib';

const markdownStyles =
  'text-sm leading-relaxed [&>p]:mb-2 [&>p:last-child]:mb-0 [&>ol]:list-decimal [&>ol]:pl-4 [&>ul]:list-disc [&>ul]:pl-4 [&>li]:mb-1 [&_strong]:font-semibold';

interface IProps {
  message: IConversationMessage;
}

export const Message: FC<IProps> = ({ message }) => {
  const isUser = message.role === 'USER';

  return (
    <div className={cn('flex', isUser ? 'justify-end' : 'justify-start')}>
      <div className={cn('max-w-[80%]', isUser ? 'ml-12' : 'mr-12')}>
        <div
          className={cn(
            'rounded-2xl px-4 py-3',
            isUser
              ? 'bg-primary text-primary-foreground'
              : 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100',
          )}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap text-sm leading-relaxed">
              {message.content}
            </p>
          ) : (
            <div className={markdownStyles}>
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
          )}
        </div>
        <p
          className={cn(
            'mt-1 px-2 text-xs text-gray-500 dark:text-gray-500',
            isUser ? 'text-right' : 'text-left',
          )}
        >
          {formatDateTime(new Date(message.createdAt))}
        </p>
      </div>
    </div>
  );
};

'use client';

import { FC } from 'react';

import { cn, formatDateTime , cn } from 'shared/lib';

interface IProps {
  message: IConversationMessage;
}

export const Message: FC<IProps> = ({ message }) => {
  const isUser = message.role === 'user';

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
          <p className="whitespace-pre-wrap text-sm leading-relaxed">
            {message.content}
          </p>
        </div>
        <p
          className={cn(
            'mt-1 px-2 text-xs text-gray-500 dark:text-gray-500',
            isUser ? 'text-right' : 'text-left',
          )}
        >
          {formatDateTime(message.timestamp)}
        </p>
      </div>
    </div>
  );
};

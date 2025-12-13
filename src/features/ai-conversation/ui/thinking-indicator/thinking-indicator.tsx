'use client';

import { FC } from 'react';

export const ThinkingIndicator: FC = () => {
  return (
    <div className="flex justify-start">
      <div className="max-w-[80%] mr-12">
        <div className="rounded-2xl bg-gray-100 px-4 py-3 dark:bg-gray-800">
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.3s]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.15s]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" />
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400">AI is thinking...</span>
          </div>
        </div>
      </div>
    </div>
  );
};

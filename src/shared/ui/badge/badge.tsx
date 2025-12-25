import { FC, ReactNode } from 'react';

import { cn } from 'shared/lib';

interface IProps {
  children: ReactNode;
  variant?:
    | 'default'
    | 'primary'
    | 'success'
    | 'warning'
    | 'danger'
    | 'gray'
    | 'blue'
    | 'purple'
    | 'cyan'
    | 'green'
    | 'yellow'
    | 'red';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: FC<IProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className,
}) => {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium',
        {
          'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300':
            variant === 'default',
          'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300':
            variant === 'primary',
          'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300':
            variant === 'success',
          'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300':
            variant === 'warning',
          'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300':
            variant === 'danger',
          'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300':
            variant === 'gray',
          'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300':
            variant === 'blue',
          'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300':
            variant === 'purple',
          'bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-300':
            variant === 'cyan',
          'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300':
            variant === 'green',
          'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300':
            variant === 'yellow',
          'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300':
            variant === 'red',
        },
        {
          'px-2 py-0.5 text-xs': size === 'sm',
          'px-2.5 py-1 text-sm': size === 'md',
        },
        className,
      )}
    >
      {children}
    </span>
  );
};

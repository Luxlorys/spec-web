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

export const Badge: FC<IProps> = ({ children, variant = 'default', size = 'md', className }) => {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium',
        {
          'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300': variant === 'default',
          'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300': variant === 'primary',
          'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300':
            variant === 'success',
          'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300':
            variant === 'warning',
          'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300': variant === 'danger',
          'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300': variant === 'gray',
          'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300': variant === 'blue',
          'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300':
            variant === 'purple',
          'bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-300': variant === 'cyan',
          'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300': variant === 'green',
          'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300':
            variant === 'yellow',
          'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300': variant === 'red',
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

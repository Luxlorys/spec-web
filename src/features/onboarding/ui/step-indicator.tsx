import { FC } from 'react';

import { cn } from 'shared/lib';

interface IProps {
  current: number;
  total: number;
}

export const StepIndicator: FC<IProps> = ({ current, total }) => {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-500 dark:text-gray-400">
        Step {current} of {total}
      </span>
      <div className="flex gap-1">
        {Array.from({ length: total }, (_, i) => (
          <div
            key={i}
            className={cn('h-1.5 w-8 rounded-full transition-colors', {
              'bg-primary': i < current,
              'bg-gray-200 dark:bg-gray-700': i >= current,
            })}
          />
        ))}
      </div>
    </div>
  );
};

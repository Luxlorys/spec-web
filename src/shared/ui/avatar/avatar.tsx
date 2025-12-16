import { FC } from 'react';
import { cn } from 'shared/lib';

interface IProps {
  src?: string;
  alt: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const Avatar: FC<IProps> = ({ src, alt, size = 'md', className }) => {
  const initials = alt
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className={cn(
        'inline-flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 font-semibold text-white',
        {
          'h-6 w-6 text-[10px]': size === 'xs',
          'h-8 w-8 text-xs': size === 'sm',
          'h-10 w-10 text-sm': size === 'md',
          'h-12 w-12 text-base': size === 'lg',
          'h-16 w-16 text-xl': size === 'xl',
        },
        className,
      )}
    >
      {src ? (
        <img src={src} alt={alt} className="h-full w-full rounded-full object-cover" />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
};

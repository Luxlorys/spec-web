import { ReactNode } from 'react';

interface IProps {
  children: ReactNode;
}

export default function OnboardingLayout({ children }: IProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-900">
      <div className="w-full max-w-lg">{children}</div>
    </div>
  );
}

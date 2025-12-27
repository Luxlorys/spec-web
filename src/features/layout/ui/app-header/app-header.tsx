'use client';

import { FC } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { NotificationCenter } from 'features/notifications';
import { authApi } from 'shared/api/auth';
import { useAuthStore } from 'shared/store';
import { getFullName } from 'shared/types';
import { Avatar, Button } from 'shared/ui';

export const AppHeader: FC = () => {
  const router = useRouter();
  const { user } = useAuthStore();

  const handleLogout = () => {
    authApi.logout();
    router.push('/login');
  };

  const userName = user ? getFullName(user) : '';
  const userRole = user?.role ?? null;

  return (
    <header className="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="text-xl font-bold text-blue-600">
            SpecFlow
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            <Link
              href="/dashboard"
              className="text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
            >
              Dashboard
            </Link>
            <Link
              href="/team"
              className="text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
            >
              Team
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/features/new">
            <Button size="sm">New Feature</Button>
          </Link>

          <NotificationCenter />

          {user && (
            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {userName}
                </p>
                <p className="text-xs capitalize text-gray-500 dark:text-gray-400">
                  {userRole?.toLowerCase()}
                </p>
              </div>
              <Avatar
                src={user.avatarUrl ?? undefined}
                alt={userName}
                size="md"
              />
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

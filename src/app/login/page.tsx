import { Suspense } from 'react';

import Link from 'next/link';

import { LoginForm } from 'features/auth';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-gray-900">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-gray-100">
            Welcome to SpecFlow
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Turn your feature ideas into clear specs
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <Suspense fallback={<div className="h-64 animate-pulse" />}>
            <LoginForm />
          </Suspense>
        </div>

        <p className="mt-8 text-center text-xs text-gray-500 dark:text-gray-500">
          By signing in, you agree to our{' '}
          <Link href="#" className="underline hover:text-gray-700">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="#" className="underline hover:text-gray-700">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}

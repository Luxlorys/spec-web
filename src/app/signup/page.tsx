'use client';

import { useState } from 'react';

import Link from 'next/link';

import {
  AdminSignupForm,
  MemberSignupForm,
  SignupRoleSelect,
} from 'features/auth';

type SignupStep = 'select' | 'admin' | 'member';

export default function SignupPage() {
  const [step, setStep] = useState<SignupStep>('select');

  const getTitle = () => {
    switch (step) {
      case 'admin':
        return 'Create your project';

      case 'member':
        return 'Join a project';

      default:
        return 'Get started';
    }
  };

  const getSubtitle = () => {
    switch (step) {
      case 'admin':
        return 'Set up your workspace and invite your team';

      case 'member':
        return 'Enter your invite code to join an existing project';

      default:
        return 'Create or join a project to start building better specs';
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-900">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-gray-100">
            {getTitle()}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">{getSubtitle()}</p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          {step === 'select' && (
            <SignupRoleSelect onSelect={flow => setStep(flow)} />
          )}
          {step === 'admin' && (
            <AdminSignupForm onBack={() => setStep('select')} />
          )}
          {step === 'member' && (
            <MemberSignupForm onBack={() => setStep('select')} />
          )}
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link
              href="/login"
              className="font-medium text-primary hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>

        <p className="mt-8 text-center text-xs text-gray-500 dark:text-gray-500">
          By creating an account, you agree to our{' '}
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

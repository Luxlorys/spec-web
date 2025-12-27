'use client';

import { FC } from 'react';

import Link from 'next/link';

import { CheckCircle2, Loader2, Mail } from 'lucide-react';

import { useVerifyEmail } from '../../lib';

const CODE_POSITIONS = [0, 1, 2, 3, 4, 5] as const;

export const VerifyEmailForm: FC = () => {
  const {
    email,
    code,
    isVerifying,
    isResending,
    resent,
    verified,
    inputRefs,
    handleChange,
    handleKeyDown,
    handlePaste,
    handleResend,
  } = useVerifyEmail();

  if (verified) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
            <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="mb-2 text-2xl font-bold text-foreground">
            Email verified!
          </h1>
          <p className="mb-4 text-muted-foreground">
            Your email has been verified successfully. Redirecting to login...
          </p>
          <Link
            href="/login"
            className="inline-flex w-full items-center justify-center rounded-lg bg-primary px-4 py-2 text-base font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Sign in now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Mail className="h-8 w-8 text-primary" />
        </div>

        <h1 className="mb-2 text-2xl font-bold text-foreground">
          Verify your email
        </h1>

        <p className="mb-6 text-muted-foreground">
          We&apos;ve sent a 6-character verification code to{' '}
          {email ? (
            <strong className="text-foreground">{email}</strong>
          ) : (
            'your email address'
          )}
          .
        </p>

        <div className="mb-6">
          <div className="flex justify-center gap-2">
            {CODE_POSITIONS.map(position => (
              <input
                key={`code-input-${position}`}
                ref={el => {
                  inputRefs.current[position] = el;
                }}
                type="text"
                inputMode="text"
                maxLength={1}
                value={code[position]}
                onChange={e => handleChange(position, e.target.value)}
                onKeyDown={e => handleKeyDown(position, e)}
                onPaste={handlePaste}
                disabled={isVerifying}
                className="h-14 w-12 rounded-lg border border-input bg-background text-center text-xl font-semibold uppercase text-foreground transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
              />
            ))}
          </div>

          {isVerifying && (
            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Verifying...
            </div>
          )}
        </div>

        {resent && (
          <div className="mb-4 flex items-center justify-center gap-2 rounded-lg bg-green-50 p-3 text-sm text-green-800 dark:bg-green-900/20 dark:text-green-400">
            <CheckCircle2 className="h-4 w-4" />
            <span>Verification code sent!</span>
          </div>
        )}

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Didn&apos;t receive the code?{' '}
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending || !email}
              className="font-medium text-primary hover:text-primary/80 disabled:opacity-50"
            >
              {isResending ? 'Sending...' : 'Resend'}
            </button>
          </p>

          <div className="pt-2 text-sm text-muted-foreground">
            <Link
              href="/login"
              className="font-medium text-primary hover:text-primary/80"
            >
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

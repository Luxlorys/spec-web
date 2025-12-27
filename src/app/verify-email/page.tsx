import { Suspense } from 'react';

import { VerifyEmailForm } from 'features/auth';

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background">
          <div className="h-16 w-16 animate-pulse rounded-full bg-primary/10" />
        </div>
      }
    >
      <VerifyEmailForm />
    </Suspense>
  );
}

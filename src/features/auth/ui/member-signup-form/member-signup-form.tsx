'use client';

import { FC } from 'react';

import { ArrowLeft, CheckCircle2, Loader2 } from 'lucide-react';

import { formatRole } from 'shared/api';
import { Button, Input } from 'shared/ui';

import { useMemberSignupForm } from '../../hooks';
import { PASSWORD_REQUIREMENTS } from '../../lib';

interface IProps {
  onBack: () => void;
}

export const MemberSignupForm: FC<IProps> = ({ onBack }) => {
  const {
    form,
    onSubmit,
    inviteCode,
    validatedInvite,
    isValidating,
    validateInviteCode,
    isSubmitting,
  } = useMemberSignupForm();

  const {
    register,
    formState: { errors },
  } = form;

  return (
    <div>
      <button
        type="button"
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to options
      </button>

      <form onSubmit={onSubmit} className="space-y-4">
        {/* Invite Code Section */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                {...register('inviteCode')}
                type="text"
                label="Invite Code"
                placeholder="Enter your invite code"
                error={validatedInvite ? undefined : errors.inviteCode?.message}
                disabled={!!validatedInvite}
              />
            </div>
            {!validatedInvite && (
              <Button
                type="button"
                variant="outline"
                onClick={validateInviteCode}
                disabled={isValidating || !inviteCode.trim()}
                className="mt-6"
              >
                {isValidating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Verify'
                )}
              </Button>
            )}
          </div>

          {validatedInvite && validatedInvite.organization && (
            <div className="flex items-center gap-2 rounded-lg bg-green-50 p-3 text-sm text-green-800 dark:bg-green-900/20 dark:text-green-400">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>
                You&apos;re joining{' '}
                <strong>{validatedInvite.organization.name}</strong>
                {validatedInvite.defaultRole && (
                  <>
                    {' '}
                    as{' '}
                    <strong>{formatRole(validatedInvite.defaultRole)}</strong>
                  </>
                )}
              </span>
            </div>
          )}
        </div>

        {/* Only show rest of form after invite validation */}
        {validatedInvite && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Input
                  {...register('firstName')}
                  type="text"
                  label="First Name"
                  placeholder="John"
                  error={errors.firstName?.message}
                  autoComplete="given-name"
                />
              </div>

              <div>
                <Input
                  {...register('lastName')}
                  type="text"
                  label="Last Name"
                  placeholder="Doe"
                  error={errors.lastName?.message}
                  autoComplete="family-name"
                />
              </div>
            </div>

            <div>
              <Input
                {...register('email')}
                type="email"
                label="Email"
                placeholder="you@example.com"
                error={errors.email?.message}
                autoComplete="email"
              />
            </div>

            <div>
              <Input
                {...register('password')}
                type="password"
                label="Password"
                placeholder="********"
                error={errors.password?.message}
                helperText={PASSWORD_REQUIREMENTS}
                autoComplete="new-password"
              />
            </div>
          </>
        )}

        <Button
          type="submit"
          className="w-full"
          isLoading={isSubmitting}
          disabled={!validatedInvite}
        >
          Join Organization
        </Button>
      </form>
    </div>
  );
};

'use client';

import { FC, useState } from 'react';

import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, CheckCircle2, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';

import { authApi, formatRole } from 'shared/api';
import { showApiError } from 'shared/lib';
import { IInviteCodeValidation } from 'shared/types';
import { Button, Input } from 'shared/ui';

import {
  MemberSignupInput,
  memberSignupSchema,
  PASSWORD_REQUIREMENTS,
} from '../../lib';

interface IProps {
  onBack: () => void;
}

export const MemberSignupForm: FC<IProps> = ({ onBack }) => {
  const router = useRouter();
  const [validatedInvite, setValidatedInvite] =
    useState<IInviteCodeValidation | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<MemberSignupInput>({
    resolver: zodResolver(memberSignupSchema),
    defaultValues: {
      inviteCode: '',
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    },
  });

  const inviteCode = watch('inviteCode');

  const validateInviteCode = async () => {
    if (!inviteCode.trim()) {
      return;
    }

    setIsValidating(true);
    setValidatedInvite(null);

    try {
      const invite = await authApi.verifyInviteCode(inviteCode.trim());

      if (invite.valid) {
        setValidatedInvite(invite);
      } else {
        showApiError(new Error('Invalid invite code'));
      }
    } catch (err) {
      showApiError(err);
    } finally {
      setIsValidating(false);
    }
  };

  const onSubmit = async (values: MemberSignupInput) => {
    if (!validatedInvite) {
      showApiError(new Error('Please validate your invite code first'));

      return;
    }

    try {
      await authApi.registerWithInvite({
        email: values.email,
        password: values.password,
        firstName: values.firstName,
        lastName: values.lastName,
        inviteCode: values.inviteCode,
      });
      // Redirect to verification page - user must verify email before logging in
      router.push(`/verify-email?email=${encodeURIComponent(values.email)}`);
    } catch (err) {
      showApiError(err);
    }
  };

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

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

'use client';

import { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle2, Loader2 } from 'lucide-react';
import { memberSignupSchema, MemberSignupInput } from '../../lib';
import { Button, Input } from 'shared/ui';
import { authApi } from 'shared/api/auth';
import { useAuthStore } from 'shared/store';
import { IInviteCode, TeamMemberRole } from 'shared/types';

interface IProps {
  onBack: () => void;
}

const roleOptions: { value: TeamMemberRole; label: string; description: string }[] = [
  { value: 'developer', label: 'Developer', description: 'Build and implement features' },
  { value: 'ba', label: 'Business Analyst', description: 'Define requirements and specs' },
  { value: 'pm', label: 'Project Manager', description: 'Coordinate and manage projects' },
  { value: 'designer', label: 'Designer', description: 'Design UI/UX and visuals' },
];

export const MemberSignupForm: FC<IProps> = ({ onBack }) => {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [error, setError] = useState<string>('');
  const [validatedInvite, setValidatedInvite] = useState<IInviteCode | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<MemberSignupInput>({
    resolver: zodResolver(memberSignupSchema),
    defaultValues: {
      inviteCode: '',
      name: '',
      email: '',
      password: '',
      role: undefined,
    },
  });

  const inviteCode = watch('inviteCode');
  const selectedRole = watch('role');

  const validateInviteCode = async () => {
    if (!inviteCode.trim()) return;

    setIsValidating(true);
    setError('');
    setValidatedInvite(null);

    try {
      const invite = await authApi.validateInviteCode(inviteCode.trim());
      setValidatedInvite(invite);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid invite code');
    } finally {
      setIsValidating(false);
    }
  };

  const onSubmit = async (values: MemberSignupInput) => {
    if (!validatedInvite) {
      setError('Please validate your invite code first');
      return;
    }

    try {
      setError('');
      const response = await authApi.signupWithInvite(values);
      setAuth(response.user, response.token);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed');
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
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
                error={!validatedInvite ? errors.inviteCode?.message : undefined}
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

          {validatedInvite && (
            <div className="flex items-center gap-2 rounded-lg bg-green-50 p-3 text-sm text-green-800 dark:bg-green-900/20 dark:text-green-400">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>
                You're joining <strong>{validatedInvite.organizationName}</strong>
              </span>
            </div>
          )}
        </div>

        {/* Only show rest of form after invite validation */}
        {validatedInvite && (
          <>
            <div>
              <Input
                {...register('name')}
                type="text"
                label="Full Name"
                placeholder="John Doe"
                error={errors.name?.message}
                autoComplete="name"
              />
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
                helperText="Minimum 8 characters"
                autoComplete="new-password"
              />
            </div>

            {/* Role Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Your Role
              </label>
              <div className="grid grid-cols-2 gap-2">
                {roleOptions.map((role) => (
                  <button
                    key={role.value}
                    type="button"
                    onClick={() => setValue('role', role.value, { shouldValidate: true })}
                    className={`rounded-lg border p-3 text-left transition-colors ${
                      selectedRole === role.value
                        ? 'border-primary bg-primary/5 ring-1 ring-primary'
                        : 'border-border hover:border-primary/50 hover:bg-muted/50'
                    }`}
                  >
                    <div className="font-medium text-sm">{role.label}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {role.description}
                    </div>
                  </button>
                ))}
              </div>
              {errors.role?.message && (
                <p className="text-sm text-red-600 dark:text-red-400">
                  {errors.role.message}
                </p>
              )}
            </div>
          </>
        )}

        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}

        <Button
          type="submit"
          className="w-full"
          isLoading={isSubmitting}
          disabled={!validatedInvite}
        >
          Join Project
        </Button>
      </form>
    </div>
  );
};

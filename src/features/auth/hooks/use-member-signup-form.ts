import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { authApi } from 'shared/api';
import { showApiError } from 'shared/lib';
import { IInviteCodeValidation } from 'shared/types';

import { MemberSignupInput, memberSignupSchema } from '../lib';

export const useMemberSignupForm = () => {
  const router = useRouter();
  const [validatedInvite, setValidatedInvite] =
    useState<IInviteCodeValidation | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  const form = useForm<MemberSignupInput>({
    resolver: zodResolver(memberSignupSchema),
    defaultValues: {
      inviteCode: '',
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    },
  });

  const inviteCode = form.watch('inviteCode');

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

  const onSubmit = form.handleSubmit(async (values: MemberSignupInput) => {
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
  });

  return {
    form,
    onSubmit,
    inviteCode,
    validatedInvite,
    isValidating,
    validateInviteCode,
    isSubmitting: form.formState.isSubmitting,
  };
};

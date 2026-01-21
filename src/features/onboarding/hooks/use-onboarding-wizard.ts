'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { ICompleteOnboardingRequest, ProductStageValue } from 'shared/api';
import { showApiError } from 'shared/lib';
import { useAuthStore } from 'shared/store';

import { useCompleteOnboarding } from '../api';
import {
  COMPANY_SIZES,
  OnboardingFormData,
  onboardingSchema,
  TARGET_USER_TYPES,
  TOTAL_STEPS,
} from '../lib';

const STEP_FIELDS: Record<number, (keyof OnboardingFormData)[]> = {
  1: ['name', 'description'],
  2: ['targetUserTypes', 'companySize'],
  3: ['productStage', 'problemStatement'],
  4: ['userPersonas', 'techStack'],
};

export const useOnboardingWizard = () => {
  const [step, setStep] = useState(1);
  const router = useRouter();
  const { user } = useAuthStore();
  const completeMutation = useCompleteOnboarding();

  const form = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      name: user?.organization.name || '',
      description: '',
      targetUserTypes: [],
      companySize: '',
      productStage: '',
      problemStatement: '',
      userPersonas: [],
      techStack: '',
    },
  });

  const nextStep = async () => {
    const fields = STEP_FIELDS[step];
    const isValid = await form.trigger(fields);

    if (isValid && step < TOTAL_STEPS) {
      setStep(s => s + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(s => s - 1);
    }
  };

  const skipStep = () => {
    if (step < TOTAL_STEPS) {
      setStep(s => s + 1);
    }
  };

  const transformToApiFormat = (
    data: OnboardingFormData,
  ): ICompleteOnboardingRequest => {
    const result: ICompleteOnboardingRequest = {};

    // Step 1: Product Identity
    if (data.description) {
      result.productIdentity = {
        description: data.description,
      };
    }

    // Step 2: Target Users
    if (data.targetUserTypes.length > 0 || data.companySize) {
      result.targetUsers = {
        userTypes: data.targetUserTypes.map(
          value =>
            TARGET_USER_TYPES.find(t => t.value === value)?.label || value,
        ),
        companySize: data.companySize
          ? COMPANY_SIZES.find(s => s.value === data.companySize)?.label
          : undefined,
      };
    }

    // Step 3: Product Stage
    if (data.productStage) {
      result.productStage = {
        stage: data.productStage as ProductStageValue,
        problemStatement: data.problemStatement || undefined,
      };
    }

    // Step 4: Quick Start
    const personas = data.userPersonas?.filter(p => p.name && p.description);

    if ((personas && personas.length > 0) || data.techStack) {
      result.quickStart = {
        personas: personas && personas.length > 0 ? personas : undefined,
        techStack: data.techStack || undefined,
      };
    }

    return result;
  };

  const skipAll = async () => {
    try {
      await completeMutation.mutateAsync({});
      router.push('/features/new');
    } catch (err) {
      showApiError(err);
    }
  };

  const complete = async () => {
    try {
      const data = form.getValues();
      const apiData = transformToApiFormat(data);

      await completeMutation.mutateAsync(apiData);
      router.push('/features/new');
    } catch (err) {
      showApiError(err);
    }
  };

  return {
    form,
    step,
    totalSteps: TOTAL_STEPS,
    nextStep,
    prevStep,
    skipStep,
    skipAll,
    complete,
    isSubmitting: completeMutation.isPending,
  };
};

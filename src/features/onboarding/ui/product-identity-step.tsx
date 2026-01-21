'use client';

import { FC } from 'react';

import { UseFormReturn } from 'react-hook-form';

import { Input, Textarea } from 'shared/ui';

import { OnboardingFormData } from '../lib';

interface IProps {
  form: UseFormReturn<OnboardingFormData>;
}

export const ProductIdentityStep: FC<IProps> = ({ form }) => {
  const {
    register,
    formState: { errors },
    watch,
  } = form;

  const description = watch('description') || '';
  const maxLength = 200;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          Let&apos;s start with the basics
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          This helps our AI understand your product and give relevant
          suggestions.
        </p>
      </div>

      <div className="space-y-4">
        <Input
          label="Project name"
          placeholder="e.g., SpecFlow"
          error={errors.name?.message}
          {...register('name')}
        />

        <div>
          <Textarea
            label="Describe it in one sentence"
            placeholder="e.g., An AI assistant that helps founders turn ideas into developer-ready specifications"
            rows={3}
            error={errors.description?.message}
            {...register('description')}
          />
          <p className="mt-1 text-right text-xs text-gray-500 dark:text-gray-400">
            {description.length}/{maxLength}
          </p>
        </div>
      </div>
    </div>
  );
};

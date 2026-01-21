'use client';

import { FC } from 'react';

import { UseFormReturn } from 'react-hook-form';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from 'shared/ui';

import { OnboardingFormData, PRODUCT_STAGES } from '../lib';

interface IProps {
  form: UseFormReturn<OnboardingFormData>;
}

export const ProductStageStep: FC<IProps> = ({ form }) => {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = form;

  const productStage = watch('productStage');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          Where are you in your journey?
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          This helps us calibrate the complexity of our suggestions.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Product stage
          </label>
          <Select
            value={productStage || ''}
            onValueChange={value => setValue('productStage', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select your product stage" />
            </SelectTrigger>
            <SelectContent>
              {PRODUCT_STAGES.map(stage => (
                <SelectItem key={stage.value} value={stage.value}>
                  {stage.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Textarea
          label="What problem are you solving? (optional)"
          placeholder="e.g., Founders waste time explaining requirements to developers, leading to misaligned builds"
          rows={4}
          error={errors.problemStatement?.message}
          {...register('problemStatement')}
        />
      </div>
    </div>
  );
};

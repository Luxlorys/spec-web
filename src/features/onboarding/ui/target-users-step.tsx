'use client';

import { FC } from 'react';

import { UseFormReturn } from 'react-hook-form';

import { cn } from 'shared/lib';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'shared/ui';

import { COMPANY_SIZES, OnboardingFormData, TARGET_USER_TYPES } from '../lib';

interface IProps {
  form: UseFormReturn<OnboardingFormData>;
}

export const TargetUsersStep: FC<IProps> = ({ form }) => {
  const { watch, setValue } = form;

  const selectedUserTypes = watch('targetUserTypes') || [];
  const companySize = watch('companySize');

  const toggleUserType = (value: string) => {
    if (selectedUserTypes.includes(value)) {
      setValue(
        'targetUserTypes',
        selectedUserTypes.filter(v => v !== value),
      );
    } else {
      setValue('targetUserTypes', [...selectedUserTypes, value]);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          Who are you building for?
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Select all that apply. This helps us tailor AI suggestions to your
          users.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Target users
          </label>
          <div className="flex flex-wrap gap-2">
            {TARGET_USER_TYPES.map(type => (
              <button
                key={type.value}
                type="button"
                onClick={() => toggleUserType(type.value)}
                className={cn(
                  'rounded-full border px-4 py-2 text-sm font-medium transition-colors',
                  selectedUserTypes.includes(type.value)
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-gray-300 text-gray-700 hover:border-gray-400 dark:border-gray-600 dark:text-gray-300 dark:hover:border-gray-500',
                )}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Company size (optional)
          </label>
          <Select
            value={companySize || ''}
            onValueChange={value => setValue('companySize', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select company size" />
            </SelectTrigger>
            <SelectContent>
              {COMPANY_SIZES.map(size => (
                <SelectItem key={size.value} value={size.value}>
                  {size.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

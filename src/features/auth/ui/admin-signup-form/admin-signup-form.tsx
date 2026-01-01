'use client';

import { FC } from 'react';

import { ArrowLeft } from 'lucide-react';

import { Button, Input } from 'shared/ui';

import { useAdminSignupForm } from '../../hooks';
import { PASSWORD_REQUIREMENTS } from '../../lib';

interface IProps {
  onBack: () => void;
}

export const AdminSignupForm: FC<IProps> = ({ onBack }) => {
  const { form, onSubmit, isSubmitting } = useAdminSignupForm();

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

        <div>
          <Input
            {...register('organizationName')}
            type="text"
            label="Organization Name"
            placeholder="My Company"
            error={errors.organizationName?.message}
            helperText="This will be the name of your workspace"
          />
        </div>

        <Button type="submit" className="w-full" isLoading={isSubmitting}>
          Create Account
        </Button>
      </form>
    </div>
  );
};

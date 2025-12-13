'use client';

import { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { adminSignupSchema, AdminSignupInput } from '../../lib';
import { Button, Input } from 'shared/ui';
import { authApi } from 'shared/api/auth';
import { useAuthStore } from 'shared/store';

interface IProps {
  onBack: () => void;
}

export const AdminSignupForm: FC<IProps> = ({ onBack }) => {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [error, setError] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AdminSignupInput>({
    resolver: zodResolver(adminSignupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      projectName: '',
    },
  });

  const onSubmit = async (values: AdminSignupInput) => {
    try {
      setError('');
      const response = await authApi.signupAsAdmin(values);
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

        <div>
          <Input
            {...register('projectName')}
            type="text"
            label="Project Name"
            placeholder="My Awesome Project"
            error={errors.projectName?.message}
            helperText="This will be the name of your workspace"
          />
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}

        <Button type="submit" className="w-full" isLoading={isSubmitting}>
          Create Project
        </Button>
      </form>
    </div>
  );
};

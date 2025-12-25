'use client';

import { FC, useState } from 'react';

import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, FileText } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';

import { authApi } from 'shared/api';
import { useAuthStore } from 'shared/store';
import { Button, FileUpload, Input } from 'shared/ui';

import { AdminSignupInput, adminSignupSchema } from '../../lib';

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
    control,
    formState: { errors, isSubmitting },
  } = useForm<AdminSignupInput>({
    resolver: zodResolver(adminSignupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      projectName: '',
      contextFiles: [],
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
        className="mb-6 flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
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

        <div className="border-t border-gray-200 pt-4 dark:border-gray-700">
          <div className="mb-3 flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Project Documentation (Optional)
            </h3>
          </div>
          <p className="mb-3 text-xs text-gray-600 dark:text-gray-400">
            Upload initial project documentation to help your team understand
            the context and requirements.
          </p>

          <Controller
            name="contextFiles"
            control={control}
            render={({ field: { onChange, value } }) => (
              <FileUpload
                label="Upload Files"
                helperText="Upload documentation files (.txt, .md, .pdf, .docx) up to 10MB each"
                accept=".txt,.md,.pdf,.docx,.doc"
                multiple
                files={value || []}
                onFilesChange={onChange}
                error={errors.contextFiles?.message}
              />
            )}
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

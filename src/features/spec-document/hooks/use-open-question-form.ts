import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { useCreateOpenQuestion } from '../api';

const openQuestionSchema = z.object({
  question: z
    .string()
    .min(1, { message: 'Question is required' })
    .max(500, { message: 'Question must be less than 500 characters' })
    .transform(val => val.trim())
    .refine(val => val.length > 0, {
      message: 'Question cannot be only whitespace',
    }),
});

export type OpenQuestionFormData = z.infer<typeof openQuestionSchema>;

interface UseOpenQuestionFormProps {
  specificationId: number;
}

export const useOpenQuestionForm = ({
  specificationId,
}: UseOpenQuestionFormProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const createMutation = useCreateOpenQuestion();

  const form = useForm<OpenQuestionFormData>({
    resolver: zodResolver(openQuestionSchema),
    defaultValues: {
      question: '',
    },
  });

  const onSubmit = form.handleSubmit(async (data: OpenQuestionFormData) => {
    await createMutation.mutateAsync({
      specificationId,
      data: { question: data.question },
    });

    form.reset();
    setIsAdding(false);
  });

  const startAdding = () => setIsAdding(true);

  const cancelAdding = () => {
    form.reset();
    setIsAdding(false);
  };

  return {
    form,
    onSubmit,
    isAdding,
    startAdding,
    cancelAdding,
    isLoading: createMutation.isPending,
    error: createMutation.error as Error | null,
  };
};

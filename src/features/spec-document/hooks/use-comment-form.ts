import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { SectionType } from 'shared/api/comments';

import { useCreateComment } from '../api';

const commentSchema = z.object({
  content: z
    .string()
    .min(1, { message: 'Comment content is required' })
    .max(1000, { message: 'Comment must be less than 1000 characters' })
    .transform(val => val.trim())
    .refine(val => val.length > 0, {
      message: 'Comment cannot be only whitespace',
    }),
});

export type CommentFormData = z.infer<typeof commentSchema>;

interface UseCommentFormProps {
  specificationId: number;
  sectionType: SectionType;
  onSuccess?: () => void;
}

export const useCommentForm = ({
  specificationId,
  sectionType,
  onSuccess,
}: UseCommentFormProps) => {
  const createMutation = useCreateComment();

  const form = useForm<CommentFormData>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      content: '',
    },
  });

  const onSubmit = form.handleSubmit(async (data: CommentFormData) => {
    await createMutation.mutateAsync({
      specificationId,
      data: {
        sectionType,
        content: data.content,
      },
    });

    form.reset();
    onSuccess?.();
  });

  return {
    form,
    onSubmit,
    isLoading: createMutation.isPending,
    error: createMutation.error as Error | null,
  };
};

import { z } from 'zod';

export const createFeatureSchema = z.object({
  idea: z
    .string()
    .min(20, { message: 'Idea must be at least 20 characters' })
    .max(5000, { message: 'Idea must not exceed 5000 characters' }),
  contextFeatureId: z.number().optional(),
});

export type CreateFeatureInput = z.infer<typeof createFeatureSchema>;

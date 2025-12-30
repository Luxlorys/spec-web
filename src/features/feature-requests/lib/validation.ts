import { z } from 'zod';

export const createFeatureSchema = z.object({
  title: z
    .string()
    .min(3, { message: 'Title must be at least 3 characters' })
    .max(100, { message: 'Title must be less than 100 characters' }),
  initialContext: z.string().optional(),
  contextFeatureId: z.number().optional(),
});

export type CreateFeatureInput = z.infer<typeof createFeatureSchema>;

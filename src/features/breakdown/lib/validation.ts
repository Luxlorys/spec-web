import { z } from 'zod';

export const addFeatureSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
  description: z.string().trim().optional().default(''),
});

export type AddFeatureFormData = z.infer<typeof addFeatureSchema>;

export const editFeatureSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
  description: z.string().trim().optional().default(''),
});

export type EditFeatureFormData = z.infer<typeof editFeatureSchema>;

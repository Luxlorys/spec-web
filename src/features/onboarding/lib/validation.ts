import { z } from 'zod';

export const userPersonaSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  description: z.string().min(1, 'Description is required').max(1000),
});

export const onboardingSchema = z.object({
  // Step 1: Product Identity
  name: z.string().min(1, 'Project name is required'),
  description: z.string().max(200).optional(),

  // Step 2: Target Users
  targetUserTypes: z.array(z.string()).default([]),
  companySize: z.string().optional(),

  // Step 3: Product Stage & Problem
  productStage: z.string().optional(),
  problemStatement: z.string().max(1000).optional(),

  // Step 4: Optional expansions
  userPersonas: z.array(userPersonaSchema).optional(),
  techStack: z.string().max(5000).optional(),
});

export type OnboardingFormData = z.infer<typeof onboardingSchema>;
export type UserPersonaData = z.infer<typeof userPersonaSchema>;

'use client';

import { useCallback, useState } from 'react';

import { useFieldArray, UseFormReturn } from 'react-hook-form';

import { OnboardingFormData, UserPersonaData, userPersonaSchema } from '../lib';

interface UseQuickStartFormProps {
  form: UseFormReturn<OnboardingFormData>;
}

interface UseQuickStartFormReturn {
  // Section visibility
  showPersonas: boolean;
  showTechStack: boolean;
  togglePersonas: () => void;
  toggleTechStack: () => void;

  // Draft persona state
  draftPersonaName: string;
  draftPersonaDescription: string;
  setDraftPersonaName: (value: string) => void;
  setDraftPersonaDescription: (value: string) => void;

  // Persona field array
  personaFields: { id: string; name: string; description: string }[];
  addPersona: () => { success: boolean; error?: string };
  removePersona: (index: number) => void;

  // Validation
  draftPersonaError: string | null;
  canAddPersona: boolean;
}

export const useQuickStartForm = ({
  form,
}: UseQuickStartFormProps): UseQuickStartFormReturn => {
  // Section visibility state
  const [showPersonas, setShowPersonas] = useState(false);
  const [showTechStack, setShowTechStack] = useState(false);

  // Draft persona state
  const [draftPersonaName, setDraftPersonaName] = useState('');
  const [draftPersonaDescription, setDraftPersonaDescription] = useState('');
  const [draftPersonaError, setDraftPersonaError] = useState<string | null>(
    null,
  );

  // Field array for personas
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'userPersonas',
  });

  // Toggle section visibility (only one open at a time)
  const togglePersonas = useCallback(() => {
    setShowPersonas(prev => !prev);
    setShowTechStack(false);
    setDraftPersonaError(null);
  }, []);

  const toggleTechStack = useCallback(() => {
    setShowTechStack(prev => !prev);
    setShowPersonas(false);
  }, []);

  // Validate and add persona using Zod schema
  const addPersona = useCallback((): { success: boolean; error?: string } => {
    const personaData: UserPersonaData = {
      name: draftPersonaName.trim(),
      description: draftPersonaDescription.trim(),
    };

    // Validate against Zod schema
    const result = userPersonaSchema.safeParse(personaData);

    if (!result.success) {
      const errorMessage = result.error.errors[0]?.message || 'Invalid persona';

      setDraftPersonaError(errorMessage);

      return { success: false, error: errorMessage };
    }

    // Clear error and add persona
    setDraftPersonaError(null);
    append(result.data);
    setDraftPersonaName('');
    setDraftPersonaDescription('');

    return { success: true };
  }, [draftPersonaName, draftPersonaDescription, append]);

  // Remove persona by index
  const removePersona = useCallback(
    (index: number) => {
      remove(index);
    },
    [remove],
  );

  // Clear error when user starts typing
  const handleSetDraftPersonaName = useCallback((value: string) => {
    setDraftPersonaName(value);
    setDraftPersonaError(null);
  }, []);

  const handleSetDraftPersonaDescription = useCallback((value: string) => {
    setDraftPersonaDescription(value);
    setDraftPersonaError(null);
  }, []);

  // Check if persona can be added (both fields have content)
  const canAddPersona =
    draftPersonaName.trim().length > 0 &&
    draftPersonaDescription.trim().length > 0;

  return {
    // Section visibility
    showPersonas,
    showTechStack,
    togglePersonas,
    toggleTechStack,

    // Draft persona state
    draftPersonaName,
    draftPersonaDescription,
    setDraftPersonaName: handleSetDraftPersonaName,
    setDraftPersonaDescription: handleSetDraftPersonaDescription,

    // Persona field array
    personaFields: fields,
    addPersona,
    removePersona,

    // Validation
    draftPersonaError,
    canAddPersona,
  };
};

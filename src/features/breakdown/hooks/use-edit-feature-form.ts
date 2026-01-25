import { useCallback, useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { IBreakdownFeature } from 'shared/api';

import { EditFeatureFormData, editFeatureSchema } from '../lib/validation';

interface UseEditFeatureFormProps {
  feature: IBreakdownFeature;
  onUpdate: (feature: IBreakdownFeature) => void;
}

export const useEditFeatureForm = ({
  feature,
  onUpdate,
}: UseEditFeatureFormProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<EditFeatureFormData>({
    resolver: zodResolver(editFeatureSchema),
    defaultValues: {
      title: feature.title,
      description: feature.description,
    },
  });

  // Sync form when feature prop changes
  useEffect(() => {
    form.reset({
      title: feature.title,
      description: feature.description,
    });
  }, [feature.title, feature.description, form]);

  const handleSave = form.handleSubmit((data: EditFeatureFormData) => {
    onUpdate({
      ...feature,
      title: data.title,
      description: data.description || '',
    });
    setIsEditing(false);
  });

  const handleCancel = useCallback(() => {
    form.reset({
      title: feature.title,
      description: feature.description,
    });
    setIsEditing(false);
  }, [form, feature.title, feature.description]);

  const handleStartEditing = useCallback(() => {
    setIsEditing(true);
  }, []);

  return {
    form,
    isEditing,
    handleSave,
    handleCancel,
    handleStartEditing,
  };
};

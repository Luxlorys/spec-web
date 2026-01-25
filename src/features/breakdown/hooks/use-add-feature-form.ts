import { useCallback, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { IBreakdownFeature } from 'shared/api';

import { AddFeatureFormData, addFeatureSchema } from '../lib/validation';

interface UseAddFeatureFormProps {
  onAdd: (feature: Omit<IBreakdownFeature, 'id'>) => void;
}

export const useAddFeatureForm = ({ onAdd }: UseAddFeatureFormProps) => {
  const [open, setOpen] = useState(false);

  const form = useForm<AddFeatureFormData>({
    resolver: zodResolver(addFeatureSchema),
    defaultValues: {
      title: '',
      description: '',
    },
  });

  const onSubmit = form.handleSubmit((data: AddFeatureFormData) => {
    onAdd({
      title: data.title,
      description: data.description || '',
      priority: 'P1',
      complexity: 'M',
      dependencies: [],
      isSelected: true,
      hasEnoughContext: false,
    });

    form.reset();
    setOpen(false);
  });

  const handleOpenChange = useCallback(
    (isOpen: boolean) => {
      setOpen(isOpen);
      if (!isOpen) {
        form.reset();
      }
    },
    [form],
  );

  return {
    form,
    open,
    onSubmit,
    handleOpenChange,
  };
};

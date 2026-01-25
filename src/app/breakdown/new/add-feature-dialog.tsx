'use client';

import { useCallback, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { IBreakdownFeatureWithSelection } from 'shared/store';
import {
  Button,
  Input,
  Label,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Textarea,
} from 'shared/ui';

const addFeatureSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
});

type AddFeatureFormData = z.infer<typeof addFeatureSchema>;

interface NewAddFeatureDialogProps {
  onAdd: (feature: Omit<IBreakdownFeatureWithSelection, 'id'>) => void;
}

export const NewAddFeatureDialog = ({ onAdd }: NewAddFeatureDialogProps) => {
  const [open, setOpen] = useState(false);

  const form = useForm<AddFeatureFormData>({
    resolver: zodResolver(addFeatureSchema),
    defaultValues: {
      title: '',
      description: '',
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = form;

  const onSubmit = handleSubmit((data: AddFeatureFormData) => {
    onAdd({
      title: data.title,
      description: data.description || '',
      hasEnoughContext: false,
      isSelected: true,
    });

    reset();
    setOpen(false);
  });

  const handleOpenChange = useCallback(
    (isOpen: boolean) => {
      setOpen(isOpen);
      if (!isOpen) {
        reset();
      }
    },
    [reset],
  );

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Plus className="h-4 w-4" />
          Add Feature
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add Feature</SheetTitle>
          <SheetDescription>
            Add a new feature to the breakdown. You can edit the details later.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={onSubmit} className="space-y-4 py-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              {...register('title')}
              placeholder="Feature title"
              error={errors.title?.message}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="What does this feature do?"
              rows={3}
            />
          </div>

          <SheetFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!isDirty}>
              Add Feature
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
};

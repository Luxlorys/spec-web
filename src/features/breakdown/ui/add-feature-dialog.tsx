'use client';

import { Plus } from 'lucide-react';

import { IBreakdownFeature } from 'shared/api';
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

import { useAddFeatureForm } from '../hooks';

interface AddFeatureDialogProps {
  onAdd: (feature: Omit<IBreakdownFeature, 'id'>) => void;
}

export const AddFeatureDialog = ({ onAdd }: AddFeatureDialogProps) => {
  const { form, open, onSubmit, handleOpenChange } = useAddFeatureForm({
    onAdd,
  });

  const {
    register,
    formState: { errors, isDirty },
  } = form;

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

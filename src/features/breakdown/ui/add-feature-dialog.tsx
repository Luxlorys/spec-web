'use client';

import { useState } from 'react';

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

interface AddFeatureDialogProps {
  onAdd: (feature: Omit<IBreakdownFeature, 'id'>) => void;
}

export const AddFeatureDialog = ({ onAdd }: AddFeatureDialogProps) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleAdd = () => {
    if (!title.trim()) {
      return;
    }

    onAdd({
      title: title.trim(),
      description: description.trim(),
      priority: 'P1',
      complexity: 'M',
      dependencies: [],
      isSelected: true,
      hasEnoughContext: false,
    });

    // Reset form
    setTitle('');
    setDescription('');
    setOpen(false);
  };

  const canAdd = title.trim().length > 0;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
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

        <div className="space-y-4 py-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Feature title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="What does this feature do?"
              rows={3}
            />
          </div>
        </div>

        <SheetFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleAdd} disabled={!canAdd}>
            Add Feature
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

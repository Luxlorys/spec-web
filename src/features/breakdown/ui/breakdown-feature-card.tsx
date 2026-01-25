'use client';

import { useState } from 'react';

import { Check, ChevronDown, ChevronUp, Pencil, Plus, X } from 'lucide-react';

import {
  ContextFeatureDialog,
  StatusBadge,
  useContextFeatures,
} from 'features/feature-requests';
import { IBreakdownFeature } from 'shared/api';
import { cn } from 'shared/lib';
import { Badge, Button, Input, Textarea } from 'shared/ui';

interface BreakdownFeatureCardProps {
  feature: IBreakdownFeature;
  index: number;
  onUpdate: (feature: IBreakdownFeature) => void;
  onToggleSelect: () => void;
}

export const BreakdownFeatureCard = ({
  feature,
  index,
  onUpdate,
  onToggleSelect,
}: BreakdownFeatureCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [editTitle, setEditTitle] = useState(feature.title);
  const [editDescription, setEditDescription] = useState(feature.description);
  const [contextDialogOpen, setContextDialogOpen] = useState(false);

  const { data: contextFeatures = [] } = useContextFeatures();
  const selectedContextFeature = contextFeatures.find(
    f => f.id === feature.contextFeatureId,
  );

  const handleSave = () => {
    onUpdate({
      ...feature,
      title: editTitle,
      description: editDescription,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(feature.title);
    setEditDescription(feature.description);
    setIsEditing(false);
  };

  const handleContextSelect = (featureId: number | undefined) => {
    onUpdate({ ...feature, contextFeatureId: featureId });
  };

  return (
    <div
      className={cn(
        'group rounded-lg border bg-white transition-all dark:bg-gray-800',
        feature.isSelected
          ? 'border-primary/50 ring-1 ring-primary/20'
          : 'border-gray-200 dark:border-gray-700',
        !feature.isSelected && 'opacity-60',
      )}
    >
      <div className="flex items-start gap-3 p-4">
        <div className="flex flex-col gap-2 pt-px">
          <button
            type="button"
            onClick={onToggleSelect}
            className={cn(
              'flex h-5 w-5 items-center justify-center rounded border-2 transition-colors',
              feature.isSelected
                ? 'border-primary bg-primary text-white'
                : 'border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-700',
            )}
            aria-label={
              feature.isSelected ? 'Deselect feature' : 'Select feature'
            }
          >
            {feature.isSelected && <Check className="h-3 w-3" />}
          </button>
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          {isEditing ? (
            <div className="space-y-3">
              <Input
                value={editTitle}
                onChange={e => setEditTitle(e.target.value)}
                placeholder="Feature title"
                className="font-medium"
              />
              <Textarea
                value={editDescription}
                onChange={e => setEditDescription(e.target.value)}
                placeholder="Feature description"
                rows={2}
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleSave}>
                  Save
                </Button>
                <Button size="sm" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {index + 1}.
                    </span>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                      {feature.title}
                    </h3>
                  </div>
                  <p
                    className={cn(
                      'mt-1 text-sm text-gray-600 dark:text-gray-400',
                      !isExpanded && 'line-clamp-2',
                    )}
                  >
                    {feature.description}
                  </p>
                  {feature.description.length > 120 && (
                    <button
                      type="button"
                      onClick={() => setIsExpanded(!isExpanded)}
                      className="mt-1 flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    >
                      {isExpanded ? (
                        <>
                          Show less <ChevronUp className="h-3 w-3" />
                        </>
                      ) : (
                        <>
                          Show more <ChevronDown className="h-3 w-3" />
                        </>
                      )}
                    </button>
                  )}
                </div>

                {/* Actions */}
                <div className="flex shrink-0 items-center gap-1 transition-opacity">
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                    aria-label="Edit feature"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Context feature */}
              <div className="mt-3 flex items-center gap-2">
                {selectedContextFeature ? (
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <span className="text-xs text-gray-500">Context:</span>
                    <span className="truncate font-medium">
                      {selectedContextFeature.title}
                    </span>
                    <StatusBadge status={selectedContextFeature.status} />
                    <button
                      type="button"
                      onClick={() => handleContextSelect(undefined)}
                      className="shrink-0 rounded p-0.5 text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                      aria-label="Remove context"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ) : (
                  <ContextFeatureDialog
                    open={contextDialogOpen}
                    onOpenChange={setContextDialogOpen}
                    value={feature.contextFeatureId ?? null}
                    onSelect={handleContextSelect}
                  >
                    <button
                      type="button"
                      className="flex items-center gap-1 text-xs text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary"
                    >
                      <Plus className="h-3 w-3" />
                      Add context
                    </button>
                  </ContextFeatureDialog>
                )}
              </div>

              {/* Badge */}
              {feature.hasEnoughContext && (
                <div className="mt-2">
                  <Badge variant="success" size="sm">
                    Ready for spec
                  </Badge>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

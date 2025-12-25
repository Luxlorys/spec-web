'use client';

import { FC, ReactNode, useState } from 'react';

import { Check, Pencil, X } from 'lucide-react';

import { Button, Card } from 'shared/ui';

import { CommentButton } from '../comment-button';

interface IProps {
  title: string;
  children: ReactNode;
  id?: string;
  sectionId: string;
  specDocumentId: string;
  onCommentClick?: (sectionId: string) => void;
  commentCount?: number;
  editable?: boolean;
  editValue?: string | string[];
  onSave?: (value: string | string[]) => void;
  isSaving?: boolean;
  isArrayField?: boolean;
}

export const SpecSection: FC<IProps> = ({
  title,
  children,
  id,
  sectionId,
  specDocumentId,
  onCommentClick,
  commentCount = 0,
  editable = false,
  editValue,
  onSave,
  isSaving = false,
  isArrayField = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localValue, setLocalValue] = useState('');

  const handleCommentClick = () => {
    onCommentClick?.(sectionId);
  };

  const handleStartEdit = () => {
    if (isArrayField && Array.isArray(editValue)) {
      setLocalValue(editValue.join('\n'));
    } else {
      setLocalValue((editValue as string) || '');
    }
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setLocalValue('');
  };

  const handleSave = () => {
    if (!onSave) {
      return;
    }

    if (isArrayField) {
      const arrayValue = localValue
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);

      onSave(arrayValue);
    } else {
      onSave(localValue.trim());
    }
    setIsEditing(false);
  };

  return (
    <Card className="group mb-6">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {title}
          </h3>
          {editable && !isEditing && (
            <button
              onClick={handleStartEdit}
              className="rounded p-1 text-muted-foreground opacity-0 transition-opacity hover:bg-muted hover:text-foreground group-hover:opacity-100"
              title="Edit section"
            >
              <Pencil className="h-4 w-4" />
            </button>
          )}
        </div>
        <CommentButton
          sectionId={sectionId}
          commentCount={commentCount}
          onClick={handleCommentClick}
        />
      </div>

      {isEditing ? (
        <div className="space-y-3">
          <textarea
            value={localValue}
            onChange={e => setLocalValue(e.target.value)}
            className="min-h-[120px] w-full resize-y rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder={
              isArrayField
                ? 'Enter each item on a new line...'
                : 'Enter content...'
            }
            autoFocus
          />
          {isArrayField && (
            <p className="text-xs text-muted-foreground">
              Enter each item on a separate line
            </p>
          )}
          <div className="flex gap-2">
            <Button size="sm" onClick={handleSave} disabled={isSaving}>
              <Check className="mr-1.5 h-3.5 w-3.5" />
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleCancel}
              disabled={isSaving}
            >
              <X className="mr-1.5 h-3.5 w-3.5" />
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-gray-700 dark:text-gray-300">{children}</div>
      )}
    </Card>
  );
};

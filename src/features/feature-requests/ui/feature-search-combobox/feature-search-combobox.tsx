'use client';

import { FC, useMemo, useState } from 'react';

import { Check, ChevronsUpDown, Search, X } from 'lucide-react';

import { cn } from 'shared/lib';
import { FeatureStatus } from 'shared/types';
import {
  Badge,
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from 'shared/ui';

import { useContextFeatures } from '../../api';

interface IProps {
  value: number | null;
  onChange: (featureId: number | null) => void;
  excludeFeatureId?: number;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  error?: string;
  helperText?: string;
}

const statusConfig: Record<
  FeatureStatus,
  {
    label: string;
    variant: 'gray' | 'blue' | 'purple' | 'green';
  }
> = {
  DRAFT: { label: 'Draft', variant: 'gray' },
  SPEC_GENERATED: { label: 'Spec', variant: 'purple' },
  READY_TO_BUILD: { label: 'Ready', variant: 'blue' },
  COMPLETED: { label: 'Done', variant: 'green' },
  ARCHIVED: { label: 'Archived', variant: 'gray' },
};

export const FeatureSearchCombobox: FC<IProps> = ({
  value,
  onChange,
  excludeFeatureId,
  placeholder = 'Search for a feature...',
  label,
  disabled,
  error,
  helperText,
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const { data: features = [], isLoading } =
    useContextFeatures(excludeFeatureId);

  const filteredFeatures = useMemo(() => {
    if (!search.trim()) {
      return features;
    }
    const lowerSearch = search.toLowerCase();

    return features.filter(f => f.title.toLowerCase().includes(lowerSearch));
  }, [features, search]);

  const selectedFeature = useMemo(
    () => features.find(f => f.id === value),
    [features, value],
  );

  const handleSelect = (featureId: number) => {
    onChange(featureId === value ? null : featureId);
    setOpen(false);
    setSearch('');
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
  };

  return (
    <div className="w-full">
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            type="button"
            disabled={disabled}
            className={cn(
              'w-full justify-between font-normal',
              !selectedFeature && 'text-gray-500 dark:text-gray-400',
              error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
            )}
          >
            <span className="flex-1 truncate text-left">
              {selectedFeature ? selectedFeature.title : placeholder}
            </span>
            <div className="flex items-center gap-1">
              {selectedFeature && (
                <X
                  className="h-4 w-4 shrink-0 opacity-50 hover:opacity-100"
                  onClick={handleClear}
                />
              )}
              <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] p-0"
          align="start"
        >
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <input
              placeholder="Search features..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex h-10 w-full bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <div className="max-h-[200px] overflow-y-auto p-1">
            {isLoading && (
              <div className="px-2 py-4 text-center text-sm text-gray-500">
                Loading features...
              </div>
            )}
            {!isLoading && filteredFeatures.length === 0 && (
              <div className="px-2 py-4 text-center text-sm text-gray-500">
                {search
                  ? 'No features found matching your search'
                  : 'No features with specifications available'}
              </div>
            )}
            {!isLoading &&
              filteredFeatures.length > 0 &&
              filteredFeatures.map(feature => {
                const config = statusConfig[feature.status];

                return (
                  <button
                    key={feature.id}
                    type="button"
                    onClick={() => handleSelect(feature.id)}
                    className={cn(
                      'flex w-full cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground',
                      feature.id === value &&
                        'bg-accent text-accent-foreground',
                    )}
                  >
                    <Check
                      className={cn(
                        'h-4 w-4 shrink-0',
                        feature.id === value ? 'opacity-100' : 'opacity-0',
                      )}
                    />
                    <span className="flex-1 truncate text-left">
                      {feature.title}
                    </span>
                    <Badge variant={config.variant} size="sm">
                      {config.label}
                    </Badge>
                  </button>
                );
              })}
          </div>
        </PopoverContent>
      </Popover>
      {error && (
        <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
          {helperText}
        </p>
      )}
    </div>
  );
};

'use client';

import { FC, useMemo, useState } from 'react';

import { Check, Search, X } from 'lucide-react';

import { cn } from 'shared/lib';
import { FeatureStatus } from 'shared/types';
import { Badge, Popover, PopoverContent, PopoverTrigger } from 'shared/ui';

import { useContextFeatures } from '../../api';

interface IProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: number | null;
  onSelect: (featureId: number | undefined) => void;
  children: React.ReactNode;
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

export const ContextFeatureDialog: FC<IProps> = ({
  open,
  onOpenChange,
  value,
  onSelect,
  children,
}) => {
  const [search, setSearch] = useState('');

  const { data: features = [], isLoading } = useContextFeatures();

  const filteredFeatures = useMemo(() => {
    if (!search.trim()) {
      return features;
    }
    const lowerSearch = search.toLowerCase();

    return features.filter(f => f.title.toLowerCase().includes(lowerSearch));
  }, [features, search]);

  const handleSelect = (featureId: number) => {
    onSelect(featureId === value ? undefined : featureId);
    onOpenChange(false);
    setSearch('');
  };

  const handleOpenChange = (newOpen: boolean) => {
    onOpenChange(newOpen);
    if (!newOpen) {
      setSearch('');
    }
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        className="w-[400px] p-0"
        align="start"
        side="top"
        sideOffset={8}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b px-3 py-2">
          <span className="text-sm font-medium">Add context feature</span>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Search input */}
        <div className="flex items-center border-b px-3">
          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <input
            placeholder="Search features..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex h-9 w-full bg-transparent py-2 text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>

        {/* Results */}
        <div className="max-h-[200px] overflow-y-auto p-1">
          {isLoading && (
            <div className="px-2 py-4 text-center text-sm text-gray-500">
              Loading...
            </div>
          )}
          {!isLoading && filteredFeatures.length === 0 && (
            <div className="px-2 py-4 text-center text-sm text-gray-500">
              {search ? 'No features found' : 'No features available'}
            </div>
          )}
          {!isLoading &&
            filteredFeatures.length > 0 &&
            filteredFeatures.map(feature => {
              const config = statusConfig[feature.status];
              const isSelected = feature.id === value;

              return (
                <button
                  key={feature.id}
                  type="button"
                  onClick={() => handleSelect(feature.id)}
                  className={cn(
                    'flex w-full cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground',
                    isSelected && 'bg-accent text-accent-foreground',
                  )}
                >
                  <Check
                    className={cn(
                      'h-4 w-4 shrink-0',
                      isSelected ? 'opacity-100' : 'opacity-0',
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
  );
};

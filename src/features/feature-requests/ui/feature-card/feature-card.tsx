'use client';

import { FC } from 'react';

import Link from 'next/link';

import { Calendar } from 'lucide-react';

import { cn, formatRelativeTime } from 'shared/lib';
import { IFeatureRequest } from 'shared/types';
import { Avatar, Card } from 'shared/ui';

import { StatusBadge } from '../status-badge';

interface IProps {
  feature: IFeatureRequest;
  variant?: 'grid' | 'list';
}

export const FeatureCard: FC<IProps> = ({ feature, variant = 'grid' }) => {
  const creatorName = `${feature.createdBy.firstName} ${feature.createdBy.lastName}`;

  if (variant === 'list') {
    return (
      <Link href={`/features/${feature.id}`}>
        <Card className="transition-shadow hover:shadow-md" padding="md">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h3 className="font-semibold text-foreground">
                  {feature.title}
                </h3>
                <StatusBadge status={feature.status} />
              </div>
              {feature.initialContext && (
                <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
                  {feature.initialContext}
                </p>
              )}
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Avatar
                  src={feature.createdBy.avatarUrl ?? undefined}
                  alt={creatorName}
                  size="xs"
                />
                <span>{creatorName}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{formatRelativeTime(new Date(feature.updatedAt))}</span>
              </div>
            </div>
          </div>
        </Card>
      </Link>
    );
  }

  return (
    <Link href={`/features/${feature.id}`}>
      <Card
        className={cn(
          'flex h-full flex-col border transition-shadow hover:shadow-md',
        )}
        padding="md"
      >
        {/* Header with badges */}
        <div className="mb-3 flex items-start justify-between gap-2">
          <StatusBadge status={feature.status} />
        </div>

        {/* Title and description */}
        <div className="mb-4 flex-1">
          <h3 className="mb-2 line-clamp-2 font-semibold text-foreground">
            {feature.title}
          </h3>
          {feature.initialContext && (
            <p className="line-clamp-2 text-sm text-muted-foreground">
              {feature.initialContext}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t pt-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Avatar
              src={feature.createdBy.avatarUrl ?? undefined}
              alt={creatorName}
              size="xs"
            />
            <span>{creatorName}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3 w-3" />
            <span>{formatRelativeTime(new Date(feature.updatedAt))}</span>
          </div>
        </div>
      </Card>
    </Link>
  );
};

'use client';

import { FC } from 'react';

import Link from 'next/link';

import { formatRelativeTime } from 'shared/lib';
import { FeatureStatus, IFeatureRequest } from 'shared/types';
import {
  Avatar,
  Button,
  Card,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'shared/ui';

const statusOptions: { value: FeatureStatus; label: string }[] = [
  { value: 'DRAFT', label: 'Draft' },
  { value: 'SPEC_GENERATED', label: 'Spec Generated' },
  { value: 'READY_TO_BUILD', label: 'Ready to Build' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'ARCHIVED', label: 'Archived' },
];

interface IProps {
  feature: IFeatureRequest;
  featureId: string;
  onStatusChange: (status: FeatureStatus) => void;
  isStatusChangePending: boolean;
}

export const FeatureOverview: FC<IProps> = ({
  feature,
  featureId,
  onStatusChange,
  isStatusChangePending,
}) => {
  const creatorName = `${feature.createdBy.firstName} ${feature.createdBy.lastName}`;
  const createdAt = new Date(feature.createdAt);
  const updatedAt = new Date(feature.updatedAt);

  return (
    <div className="space-y-6">
      <Card>
        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
          Feature Information
        </h3>
        <dl className="grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="mb-1 text-sm font-medium text-gray-500 dark:text-gray-400">
              Status
            </dt>
            <dd>
              <Select
                value={feature.status}
                onValueChange={value => onStatusChange(value as FeatureStatus)}
                disabled={isStatusChangePending}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Created By
            </dt>
            <dd className="mt-1 flex items-center gap-2 text-sm text-gray-900 dark:text-gray-100">
              <Avatar
                src={feature.createdBy.avatarUrl ?? undefined}
                alt={creatorName}
                size="xs"
              />
              {creatorName}
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Created
            </dt>
            <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
              {formatRelativeTime(createdAt)}
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Last Updated
            </dt>
            <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
              {formatRelativeTime(updatedAt)}
            </dd>
          </div>
        </dl>
      </Card>

      {feature.initialContext && (
        <Card>
          <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
            Initial Context
          </h3>
          <p className="text-gray-700 dark:text-gray-300">
            {feature.initialContext}
          </p>
        </Card>
      )}

      <Card>
        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
          Quick Actions
        </h3>
        <div className="flex flex-wrap gap-3">
          <Link href={`/features/${featureId}/conversation`}>
            <Button variant="outline">View Conversation</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
};

'use client';

import { FC } from 'react';

import { IActivity } from 'shared/types';
import { Card, EmptyState } from 'shared/ui';

import { ActivityItem } from './activity-item';

interface IProps {
  activities: IActivity[] | undefined;
  isLoading: boolean;
}

export const ActivityList: FC<IProps> = ({ activities, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!activities || activities.length === 0) {
    return (
      <EmptyState
        title="No activity yet"
        description="Activity will appear here as changes are made to this feature"
      />
    );
  }

  return (
    <Card>
      <div className="space-y-4">
        {activities.map(activity => (
          <ActivityItem key={activity.id} activity={activity} />
        ))}
      </div>
    </Card>
  );
};

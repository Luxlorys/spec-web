'use client';

import { FC } from 'react';

import { StatusBadge } from 'features/feature-requests';
import { formatRelativeTime } from 'shared/lib';
import { IActivity } from 'shared/types';

interface IProps {
  activity: IActivity;
}

const getActivityIcon = (eventType: IActivity['eventType']): string => {
  switch (eventType) {
    case 'SPEC_CREATED':
      return '📝';

    case 'SPEC_REGENERATED':
      return '🔄';

    case 'COMMENT_ADDED':
      return '💬';

    case 'COMMENT_RESOLVED':
      return '✅';

    case 'OPEN_QUESTION_ASKED':
      return '❓';

    case 'OPEN_QUESTION_ANSWERED':
      return '💡';

    case 'OPEN_QUESTION_RESOLVED':
      return '✅';

    case 'STATUS_CHANGED':
      return '🏷️';

    case 'VERSION_CREATED':
      return '📋';

    default:
      return '📌';
  }
};

const getActivityDescription = (activity: IActivity): React.ReactNode => {
  const actorName = `${activity.actor.firstName} ${activity.actor.lastName}`;

  switch (activity.eventType) {
    case 'SPEC_CREATED':
      return (
        <>
          <span className="font-medium">{actorName}</span> created specification
          for {activity.metadata.featureTitle}
        </>
      );

    case 'SPEC_REGENERATED':
      return (
        <>
          <span className="font-medium">{actorName}</span> regenerated
          specification (v{activity.metadata.fromVersion} → v
          {activity.metadata.toVersion})
        </>
      );

    case 'COMMENT_ADDED':
      return (
        <>
          <span className="font-medium">{actorName}</span> added a comment on{' '}
          {activity.metadata.sectionType}
        </>
      );

    case 'COMMENT_RESOLVED':
      return (
        <>
          <span className="font-medium">{actorName}</span> resolved a comment on{' '}
          {activity.metadata.sectionType}
        </>
      );

    case 'OPEN_QUESTION_ASKED':
      return (
        <>
          <span className="font-medium">{actorName}</span> asked:{' '}
          {activity.metadata.questionText}
        </>
      );

    case 'OPEN_QUESTION_ANSWERED':
      return (
        <>
          <span className="font-medium">{actorName}</span> answered a question
        </>
      );

    case 'OPEN_QUESTION_RESOLVED':
      return (
        <>
          <span className="font-medium">{actorName}</span> resolved a question
        </>
      );

    case 'STATUS_CHANGED':
      return (
        <>
          <span className="font-medium">{actorName}</span> changed status from{' '}
          <StatusBadge status={activity.metadata.previousStatus} /> to{' '}
          <StatusBadge status={activity.metadata.newStatus} />
        </>
      );

    case 'VERSION_CREATED':
      return (
        <>
          <span className="font-medium">{actorName}</span> created version{' '}
          {activity.metadata.version}
        </>
      );

    default:
      return (
        <>
          <span className="font-medium">{actorName}</span> performed an action
        </>
      );
  }
};

export const ActivityItem: FC<IProps> = ({ activity }) => {
  return (
    <div className="flex gap-3">
      <div className="flex-shrink-0">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/50">
          <span className="text-sm text-purple-600 dark:text-purple-300">
            {getActivityIcon(activity.eventType)}
          </span>
        </div>
      </div>
      <div className="flex-1">
        <p className="text-sm text-gray-900 dark:text-gray-100">
          {getActivityDescription(activity)}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {formatRelativeTime(new Date(activity.createdAt))}
        </p>
      </div>
    </div>
  );
};

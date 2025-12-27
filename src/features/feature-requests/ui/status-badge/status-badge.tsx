import { FC } from 'react';

import { FeatureStatus } from 'shared/types';
import { Badge } from 'shared/ui';

interface IProps {
  status: FeatureStatus;
}

const statusConfig: Record<
  FeatureStatus,
  {
    label: string;
    variant: 'gray' | 'blue' | 'purple' | 'green';
  }
> = {
  DRAFT: { label: 'Draft', variant: 'gray' },
  SPEC_GENERATED: { label: 'Spec Generated', variant: 'purple' },
  READY_TO_BUILD: { label: 'Ready to Build', variant: 'blue' },
  COMPLETED: { label: 'Completed', variant: 'green' },
  ARCHIVED: { label: 'Archived', variant: 'gray' },
};

export const StatusBadge: FC<IProps> = ({ status }) => {
  const config = statusConfig[status];

  return <Badge variant={config.variant}>{config.label}</Badge>;
};

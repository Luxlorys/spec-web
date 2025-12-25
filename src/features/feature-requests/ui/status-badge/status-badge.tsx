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
  draft: { label: 'Draft', variant: 'gray' },
  spec_generated: { label: 'Spec Generated', variant: 'purple' },
  ready_to_build: { label: 'Ready to Build', variant: 'blue' },
  completed: { label: 'Completed', variant: 'green' },
};

export const StatusBadge: FC<IProps> = ({ status }) => {
  const config = statusConfig[status];

  return <Badge variant={config.variant}>{config.label}</Badge>;
};

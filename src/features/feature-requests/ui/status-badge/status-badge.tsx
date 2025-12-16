import { FC } from 'react';
import { Badge } from 'shared/ui';
import { FeatureStatus } from 'shared/types';

interface IProps {
  status: FeatureStatus;
}

const statusConfig: Record<
  FeatureStatus,
  {
    label: string;
    variant: 'gray' | 'blue' | 'purple' | 'yellow' | 'green' | 'cyan';
  }
> = {
  draft: { label: 'Draft', variant: 'gray' },
  spec_generated: { label: 'Spec Generated', variant: 'purple' },
  ready_to_build: { label: 'Ready to Build', variant: 'green' },
  in_progress: { label: 'In Progress', variant: 'blue' },
  review: { label: 'Review', variant: 'yellow' },
  ready: { label: 'Ready', variant: 'cyan' },
};

export const StatusBadge: FC<IProps> = ({ status }) => {
  const config = statusConfig[status];

  return <Badge variant={config.variant}>{config.label}</Badge>;
};

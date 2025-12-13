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
  intake_in_progress: { label: 'In Progress', variant: 'blue' },
  spec_generated: { label: 'Spec Generated', variant: 'purple' },
  under_review: { label: 'Under Review', variant: 'yellow' },
  ready_to_build: { label: 'Ready to Build', variant: 'green' },
  in_progress: { label: 'Building', variant: 'cyan' },
  complete: { label: 'Complete', variant: 'green' },
};

export const StatusBadge: FC<IProps> = ({ status }) => {
  const config = statusConfig[status];

  return <Badge variant={config.variant}>{config.label}</Badge>;
};

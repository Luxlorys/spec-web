'use client';

import { Card } from 'shared/ui';

interface IProps {
  executiveSummary: {
    productOverview: string;
    valueProposition: string;
    targetAudience: string;
  };
}

export const OverviewTab = ({ executiveSummary }: IProps) => (
  <div className="space-y-6">
    <Card className="p-6">
      <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
        Product Overview
      </h3>
      <p className="text-gray-700 dark:text-gray-300">
        {executiveSummary.productOverview}
      </p>
    </Card>

    <Card className="p-6">
      <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
        Value Proposition
      </h3>
      <p className="text-gray-700 dark:text-gray-300">
        {executiveSummary.valueProposition}
      </p>
    </Card>

    <Card className="p-6">
      <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
        Target Audience
      </h3>
      <p className="text-gray-700 dark:text-gray-300">
        {executiveSummary.targetAudience}
      </p>
    </Card>
  </div>
);

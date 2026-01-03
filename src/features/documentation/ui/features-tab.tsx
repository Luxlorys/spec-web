'use client';

import Link from 'next/link';

import { ArrowRight, FileText } from 'lucide-react';

import { IDocumentationFeature } from 'shared/api';
import { EmptyState } from 'shared/ui';

interface IProps {
  features: IDocumentationFeature[];
}

export const FeaturesTab = ({ features }: IProps) => (
  <div>
    {features.length === 0 ? (
      <EmptyState
        icon={<FileText className="h-12 w-12" />}
        title="No features documented"
        description="Completed features will appear here as they are documented."
      />
    ) : (
      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
        {features.map(feature => (
          <div
            key={feature.id}
            className="mb-4 break-inside-avoid rounded-lg border border-border bg-card p-4"
          >
            <h4 className="font-medium text-primary">{feature.title}</h4>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {feature.overview}
            </p>
            <Link
              href={`/features/${feature.id}`}
              className="mt-3 inline-flex items-center gap-1 text-xs text-primary/70 transition-colors hover:text-primary"
            >
              View details <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        ))}
      </div>
    )}
  </div>
);

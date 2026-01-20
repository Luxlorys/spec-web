'use client';

import { BookOpen } from 'lucide-react';

import { IGlossaryTerm } from 'shared/api';
import { EmptyState } from 'shared/ui';

interface IProps {
  glossary: IGlossaryTerm[];
}

export const GlossaryTab = ({ glossary }: IProps) => (
  <div>
    {glossary.length === 0 ? (
      <EmptyState
        icon={<BookOpen className="h-12 w-12" />}
        title="No glossary terms"
        description="Domain-specific terms will appear here as they are extracted from specifications."
      />
    ) : (
      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
        {glossary.map(term => (
          <div
            key={term.term}
            className="mb-4 break-inside-avoid rounded-lg border border-border bg-card p-4"
          >
            <h4 className="font-medium text-primary">{term.term}</h4>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {term.definition}
            </p>
            {term.context && (
              <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
                {term.context}
              </p>
            )}
          </div>
        ))}
      </div>
    )}
  </div>
);

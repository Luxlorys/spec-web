'use client';

import { useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import { BookOpen, FileText } from 'lucide-react';

import { QueryKeys } from 'shared/constants';
import { mockDocumentationData } from 'shared/lib';
import { useAuthStore } from 'shared/store';
import { Card, EmptyState } from 'shared/ui';

type DocumentationType = 'project-context' | 'feature-specs' | 'technical-docs';

const documentationTypes: {
  value: DocumentationType;
  label: string;
  description: string;
}[] = [
  {
    value: 'project-context',
    label: 'Project Context',
    description:
      'Initial project documentation and context provided during setup',
  },
  {
    value: 'feature-specs',
    label: 'Feature Specifications',
    description: 'Generated specifications from completed features',
  },
  {
    value: 'technical-docs',
    label: 'Technical Documentation',
    description: 'Additional technical documentation and guides',
  },
];

const getEmptyStateDescription = (type: DocumentationType): string => {
  if (type === 'project-context') {
    return 'Project context documentation will appear here once uploaded during project setup.';
  }

  if (type === 'feature-specs') {
    return 'Feature specifications will be automatically generated as features are completed.';
  }

  return 'Additional technical documentation can be added to help your team understand the project better.';
};

export default function DocumentationPage() {
  const { user } = useAuthStore();
  const [selectedType, setSelectedType] =
    useState<DocumentationType>('project-context');

  const { data: documentation = [], isLoading } = useQuery({
    queryKey: [
      QueryKeys.DOCUMENTATION,
      user?.organizationId || user?.id,
      selectedType,
    ],
    queryFn: () => {
      // In a real app, this would fetch from an API
      return mockDocumentationData.filter(
        doc =>
          doc.projectId === (user?.organizationId || user?.id) &&
          doc.type === selectedType,
      );
    },
    enabled: !!user,
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatContent = (content: string) => {
    // Simple markdown-like formatting
    return content.split('\n').map((line, idx) => {
      const key = `line-${idx}-${line.slice(0, 20).replace(/\s/g, '')}`;

      if (line.startsWith('# ')) {
        return (
          <h2
            key={key}
            className="mb-2 mt-4 text-xl font-semibold text-primary"
          >
            {line.slice(2)}
          </h2>
        );
      }
      if (line.startsWith('## ')) {
        return (
          <h3 key={key} className="mb-2 mt-3 text-lg font-medium">
            {line.slice(3)}
          </h3>
        );
      }
      if (line.startsWith('- ')) {
        return (
          <li key={key} className="mb-1 ml-4">
            {line.slice(2)}
          </li>
        );
      }
      if (line.trim() === '') {
        return <br key={key} />;
      }

      return (
        <p key={key} className="mb-2 text-gray-700 dark:text-gray-300">
          {line}
        </p>
      );
    });
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-2">
            <BookOpen className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Documentation
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Project documentation and feature specifications
            </p>
          </div>
        </div>

        {/* Type Filter Tabs */}
        <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
          {documentationTypes.map(type => (
            <button
              type="button"
              key={type.value}
              onClick={() => setSelectedType(type.value)}
              className={`border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
                selectedType === type.value
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Current Type Description */}
      <div className="mb-6">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {documentationTypes.find(t => t.value === selectedType)?.description}
        </p>
      </div>

      {/* Documentation Content */}
      {isLoading && (
        <div className="grid gap-4">
          {['skeleton-1', 'skeleton-2', 'skeleton-3'].map(key => (
            <Card key={key} className="animate-pulse p-6">
              <div className="mb-2 h-4 rounded bg-gray-200 dark:bg-gray-700" />
              <div className="mb-4 h-3 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
              <div className="space-y-2">
                <div className="h-3 rounded bg-gray-200 dark:bg-gray-700" />
                <div className="h-3 w-5/6 rounded bg-gray-200 dark:bg-gray-700" />
              </div>
            </Card>
          ))}
        </div>
      )}

      {!isLoading && documentation.length > 0 && (
        <div className="grid gap-6">
          {documentation.map(doc => (
            <Card key={doc.id} className="p-6">
              <div className="mb-4 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-primary" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {doc.title}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <span>Created {formatDate(doc.createdAt)}</span>
                      {doc.updatedAt !== doc.createdAt && (
                        <span>Updated {formatDate(doc.updatedAt)}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="prose prose-sm max-w-none">
                <div className="text-gray-700 dark:text-gray-300">
                  {formatContent(doc.content)}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {!isLoading && documentation.length === 0 && (
        <EmptyState
          icon={<BookOpen className="h-12 w-12" />}
          title={`No ${documentationTypes.find(t => t.value === selectedType)?.label?.toLowerCase()} found`}
          description={getEmptyStateDescription(selectedType)}
        />
      )}
    </div>
  );
}

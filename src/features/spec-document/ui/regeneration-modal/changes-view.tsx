'use client';

import { ChangeType, IProposedChange } from 'shared/types';
import { Badge } from 'shared/ui';

interface IProps {
  changes: IProposedChange[];
  regenerationSummary: string;
}

const getProposedBgColor = (changeType: ChangeType): string => {
  if (changeType === 'added') {
    return 'bg-green-50';
  }
  if (changeType === 'modified') {
    return 'bg-purple-50';
  }

  return 'bg-gray-50';
};

const getChangeTypeBadge = (type: ChangeType) => {
  switch (type) {
    case 'modified':
      return <Badge variant="purple">Modified</Badge>;

    case 'added':
      return <Badge variant="green">Added</Badge>;

    case 'removed':
      return <Badge variant="red">Removed</Badge>;

    default:
      return <Badge variant="gray">Unchanged</Badge>;
  }
};

const formatSectionName = (section: string): string => {
  return section
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();
};

const renderValue = (value: string | string[] | null): React.ReactNode => {
  if (value === null || value === undefined) {
    return <span className="italic text-gray-400">Empty</span>;
  }

  if (typeof value === 'string') {
    return <p className="whitespace-pre-wrap">{value}</p>;
  }

  if (Array.isArray(value) && value.length > 0) {
    return (
      <ul className="list-inside list-disc space-y-1">
        {value.map((item: string) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    );
  }

  if (Array.isArray(value) && value.length === 0) {
    return <span className="italic text-gray-400">Empty list</span>;
  }

  return (
    <pre className="overflow-auto text-xs">
      {JSON.stringify(value, null, 2)}
    </pre>
  );
};

export const ChangesView = ({ changes, regenerationSummary }: IProps) => {
  const visibleChanges = changes.filter(c => c.changeType !== 'unchanged');

  const modified = visibleChanges.filter(c => c.changeType === 'modified');
  const added = visibleChanges.filter(c => c.changeType === 'added');
  const removed = visibleChanges.filter(c => c.changeType === 'removed');

  if (visibleChanges.length === 0) {
    return (
      <div className="py-8 text-center text-gray-600">
        <p>No changes to display</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Section */}
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
        <h3 className="mb-3 text-sm font-semibold text-gray-900">Summary</h3>
        <p className="mb-4 text-sm text-gray-700">{regenerationSummary}</p>
        <div className="flex flex-wrap gap-3 text-sm">
          {modified.length > 0 && (
            <div className="flex items-center gap-2">
              <Badge variant="purple">Modified</Badge>
              <span className="text-gray-600">
                {modified.length} section{modified.length === 1 ? '' : 's'}
              </span>
            </div>
          )}
          {added.length > 0 && (
            <div className="flex items-center gap-2">
              <Badge variant="green">Added</Badge>
              <span className="text-gray-600">
                {added.length} section{added.length === 1 ? '' : 's'}
              </span>
            </div>
          )}
          {removed.length > 0 && (
            <div className="flex items-center gap-2">
              <Badge variant="red">Removed</Badge>
              <span className="text-gray-600">
                {removed.length} section{removed.length === 1 ? '' : 's'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Diff Blocks */}
      {visibleChanges.map(change => (
        <div
          key={change.section}
          className="overflow-hidden rounded-lg border border-gray-200"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-4 py-3">
            <h3 className="font-semibold text-gray-900">
              {formatSectionName(change.section)}
            </h3>
            {getChangeTypeBadge(change.changeType)}
          </div>

          {/* Diff Grid */}
          <div className="grid grid-cols-2 divide-x divide-gray-200">
            {/* Current Value */}
            <div
              className={`p-4 ${change.changeType === 'removed' ? 'bg-red-50' : 'bg-gray-50'}`}
            >
              <h4 className="mb-2 text-xs font-semibold uppercase text-gray-600">
                Current
              </h4>
              <div className="text-sm text-gray-900">
                {renderValue(change.currentValue)}
              </div>
            </div>

            {/* Proposed Value */}
            <div className={`p-4 ${getProposedBgColor(change.changeType)}`}>
              <h4 className="mb-2 text-xs font-semibold uppercase text-gray-600">
                Proposed
              </h4>
              <div className="text-sm text-gray-900">
                {renderValue(change.proposedValue)}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

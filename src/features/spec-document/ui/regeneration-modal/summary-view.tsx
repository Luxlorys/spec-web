'use client';

import { IProposedChange } from 'shared/types';
import { Badge } from 'shared/ui';

interface IProps {
  changes: IProposedChange[];
}

export function SummaryView({ changes }: IProps) {
  // Group changes by type
  const modified = changes.filter(c => c.changeType === 'modified');
  const added = changes.filter(c => c.changeType === 'added');
  const removed = changes.filter(c => c.changeType === 'removed');

  const getChangeTypeBadge = (type: string) => {
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
    // Convert camelCase to Title Case with spaces
    return section
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  };

  return (
    <div className="space-y-6">
      {modified.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Badge variant="purple">Modified</Badge>
            <span>{modified.length} section{modified.length !== 1 ? 's' : ''}</span>
          </h3>
          <div className="space-y-3">
            {modified.map((change, index) => (
              <div
                key={`modified-${index}`}
                className="bg-purple-50 border border-purple-200 rounded-lg p-4"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-purple-900">{formatSectionName(change.section)}</h4>
                  {getChangeTypeBadge(change.changeType)}
                </div>
                <p className="text-sm text-purple-800">{change.reason}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {added.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Badge variant="green">Added</Badge>
            <span>{added.length} section{added.length !== 1 ? 's' : ''}</span>
          </h3>
          <div className="space-y-3">
            {added.map((change, index) => (
              <div
                key={`added-${index}`}
                className="bg-green-50 border border-green-200 rounded-lg p-4"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-green-900">{formatSectionName(change.section)}</h4>
                  {getChangeTypeBadge(change.changeType)}
                </div>
                <p className="text-sm text-green-800">{change.reason}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {removed.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Badge variant="red">Removed</Badge>
            <span>{removed.length} section{removed.length !== 1 ? 's' : ''}</span>
          </h3>
          <div className="space-y-3">
            {removed.map((change, index) => (
              <div
                key={`removed-${index}`}
                className="bg-red-50 border border-red-200 rounded-lg p-4"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-red-900">{formatSectionName(change.section)}</h4>
                  {getChangeTypeBadge(change.changeType)}
                </div>
                <p className="text-sm text-red-800">{change.reason}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {modified.length === 0 && added.length === 0 && removed.length === 0 && (
        <div className="text-center py-8 text-gray-600">
          <p>No changes to display</p>
        </div>
      )}
    </div>
  );
}

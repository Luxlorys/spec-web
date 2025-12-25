'use client';

import { IProposedChange, IAcceptanceCriteria, IEdgeCase } from 'shared/types';
import { Badge } from 'shared/ui';

interface IProps {
  changes: IProposedChange[];
}

export function DiffView({ changes }: IProps) {
  const formatSectionName = (section: string): string => {
    return section
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  };

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

  const renderValue = (value: any): React.ReactNode => {
    // Handle null/undefined
    if (value === null || value === undefined) {
      return <span className="text-gray-400 italic">Empty</span>;
    }

    // Handle string
    if (typeof value === 'string') {
      return <p className="whitespace-pre-wrap">{value}</p>;
    }

    // Handle string array
    if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'string') {
      return (
        <ul className="list-disc list-inside space-y-1">
          {value.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      );
    }

    // Handle acceptance criteria array
    if (Array.isArray(value) && value.length > 0 && 'description' in value[0]) {
      const criteria = value as IAcceptanceCriteria[];
      return (
        <ul className="space-y-2">
          {criteria.map((item, idx) => (
            <li key={item.id || idx} className="flex items-start gap-2">
              <span className="text-gray-600 font-medium">{idx + 1}.</span>
              <span>{item.description}</span>
            </li>
          ))}
        </ul>
      );
    }

    // Handle edge cases array
    if (Array.isArray(value) && value.length > 0 && 'scenario' in value[0]) {
      const cases = value as IEdgeCase[];
      return (
        <div className="space-y-3">
          {cases.map((item, idx) => (
            <div key={idx} className="border-l-2 border-gray-300 pl-3">
              <p className="font-medium text-gray-900">{item.scenario}</p>
              <p className="text-sm text-gray-600 mt-1">{item.expectedBehavior}</p>
            </div>
          ))}
        </div>
      );
    }

    // Handle empty arrays
    if (Array.isArray(value) && value.length === 0) {
      return <span className="text-gray-400 italic">Empty list</span>;
    }

    // Fallback for complex objects
    return <pre className="text-xs overflow-auto">{JSON.stringify(value, null, 2)}</pre>;
  };

  // Filter out unchanged sections for cleaner view
  const visibleChanges = changes.filter(c => c.changeType !== 'unchanged');

  return (
    <div className="space-y-6">
      {visibleChanges.map((change, index) => (
        <div key={`change-${index}`} className="border border-gray-200 rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">{formatSectionName(change.section)}</h3>
            {getChangeTypeBadge(change.changeType)}
          </div>

          {/* Diff Grid */}
          <div className="grid grid-cols-2 divide-x divide-gray-200">
            {/* Current Value */}
            <div
              className={`p-4 ${change.changeType === 'removed' ? 'bg-red-50' : 'bg-gray-50'}`}
            >
              <h4 className="text-xs font-semibold text-gray-600 uppercase mb-2">Current</h4>
              <div className="text-sm text-gray-900">{renderValue(change.currentValue)}</div>
            </div>

            {/* Proposed Value */}
            <div
              className={`p-4 ${
                change.changeType === 'added'
                  ? 'bg-green-50'
                  : change.changeType === 'modified'
                    ? 'bg-purple-50'
                    : 'bg-gray-50'
              }`}
            >
              <h4 className="text-xs font-semibold text-gray-600 uppercase mb-2">Proposed</h4>
              <div className="text-sm text-gray-900">{renderValue(change.proposedValue)}</div>
            </div>
          </div>

          {/* AI Reasoning */}
          <div className="bg-purple-50 px-4 py-3 border-t border-purple-200">
            <h4 className="text-xs font-semibold text-purple-700 uppercase mb-1">AI Reasoning</h4>
            <p className="text-sm text-purple-900">{change.reason}</p>
          </div>
        </div>
      ))}

      {visibleChanges.length === 0 && (
        <div className="text-center py-8 text-gray-600">
          <p>No changes to display</p>
        </div>
      )}
    </div>
  );
}

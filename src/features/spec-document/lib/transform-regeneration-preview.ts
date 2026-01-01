import {
  ChangeType,
  IProposedChange,
  IRegenerationChanges,
  IRegenerationPreview,
  IRegenerationPreviewResponse,
  ISpecDocument,
} from 'shared/types';

/**
 * Transforms the API regeneration preview response to the UI format
 * used by the regeneration modal components.
 */
export const transformRegenerationPreview = (
  response: IRegenerationPreviewResponse,
  currentSpec: ISpecDocument,
): IRegenerationPreview => {
  const proposedChanges = transformChangesToArray(
    response.changes,
    response.regenerationSummary,
  );

  // Build the full proposed spec by applying changes to current spec
  const fullProposedSpec = buildProposedSpec(currentSpec, response.changes);

  // Extract section names that have changes
  const sectionsWithFeedback = Object.keys(response.changes).map(
    formatSectionName,
  );

  return {
    currentVersion: currentSpec.version,
    nextVersion: currentSpec.version + 1,
    contextSummary: {
      resolvedCommentsCount: response.commentCount,
      answeredQuestionsCount: response.resolvedQuestionCount,
      sectionsWithFeedback,
    },
    proposedChanges,
    fullProposedSpec,
    regenerationSummary: response.regenerationSummary,
    newOpenQuestions: response.newOpenQuestions,
    cachedAt: response.cachedAt ? new Date(response.cachedAt) : null,
    canRegenerateAt: new Date(response.canRegenerateAt),
  };
};

/**
 * Converts the flat changes object from API to array of IProposedChange
 */
const transformChangesToArray = (
  changes: IRegenerationChanges,
  regenerationSummary: string,
): IProposedChange[] => {
  const sectionKeys = [
    'overview',
    'problemStatement',
    'userStories',
    'acceptanceCriteria',
    'scopeIncluded',
    'scopeExcluded',
    'technicalConsiderations',
  ] as const;

  return sectionKeys
    .map((section): IProposedChange | null => {
      const change = changes[section];

      if (!change) {
        return null;
      }

      const changeType = determineChangeType(change.old, change.new);

      return {
        section: section as string,
        currentValue: change.old,
        proposedValue: change.new,
        changeType,
        reason: regenerationSummary,
      };
    })
    .filter((change): change is IProposedChange => change !== null);
};

/**
 * Determines the change type based on old and new values
 */
const determineChangeType = (
  oldValue: string | string[] | null | undefined,
  newValue: string | string[] | null | undefined,
): ChangeType => {
  const oldEmpty = isEmpty(oldValue);
  const newEmpty = isEmpty(newValue);

  if (oldEmpty && !newEmpty) {
    return 'added';
  }

  if (!oldEmpty && newEmpty) {
    return 'removed';
  }

  if (oldEmpty && newEmpty) {
    return 'unchanged';
  }

  // Both have values - check if they're different
  if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
    return 'modified';
  }

  return 'unchanged';
};

/**
 * Checks if a value is empty (null, undefined, empty string, or empty array)
 */
const isEmpty = (value: string | string[] | null | undefined): boolean => {
  if (value === null || value === undefined) {
    return true;
  }

  if (typeof value === 'string') {
    return value.trim() === '';
  }

  if (Array.isArray(value)) {
    return value.length === 0;
  }

  return false;
};

/**
 * Builds the full proposed spec by applying changes to the current spec
 */
const buildProposedSpec = (
  currentSpec: ISpecDocument,
  changes: IRegenerationChanges,
): ISpecDocument => {
  return {
    ...currentSpec,
    version: currentSpec.version + 1,
    overview: changes.overview?.new ?? currentSpec.overview,
    problemStatement:
      changes.problemStatement?.new ?? currentSpec.problemStatement,
    userStories: changes.userStories?.new ?? currentSpec.userStories,
    acceptanceCriteria:
      changes.acceptanceCriteria?.new ?? currentSpec.acceptanceCriteria,
    scopeIncluded: changes.scopeIncluded?.new ?? currentSpec.scopeIncluded,
    scopeExcluded: changes.scopeExcluded?.new ?? currentSpec.scopeExcluded,
    technicalConsiderations:
      changes.technicalConsiderations?.new ??
      currentSpec.technicalConsiderations,
  };
};

/**
 * Formats a camelCase section key to a readable name
 */
const formatSectionName = (section: string): string => {
  return section
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();
};

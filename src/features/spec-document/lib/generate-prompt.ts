import { ISpecDocument, IComment } from 'shared/types';
import { formatDate } from 'shared/lib';
import {
  formatUserStories,
  formatAcceptanceCriteria,
  formatEdgeCases,
  formatResolvedComments,
  formatOpenQuestions,
  formatArrayAsBulletList,
} from './format-prompt-sections';

export interface IGeneratePromptOptions {
  spec: ISpecDocument;
  featureTitle?: string;
  resolvedComments?: IComment[];
  includeMetadata?: boolean;
}

/**
 * Generate AI-ready prompt from spec document
 * Produces markdown-formatted prompt suitable for Cursor, Claude, Copilot
 */
export function generateAIPrompt(options: IGeneratePromptOptions): string {
  const {
    spec,
    featureTitle = 'Feature Implementation',
    resolvedComments = [],
    includeMetadata = true,
  } = options;

  const sections: string[] = [];

  // Header
  sections.push(`# Feature Implementation Request: ${featureTitle}`);
  sections.push('');

  // Context section
  sections.push('## Context');
  sections.push(spec.overview);
  sections.push('');

  // Problem Statement
  if (spec.problemStatement) {
    sections.push('## Problem Statement');
    sections.push(spec.problemStatement);
    sections.push('');
  }

  // User Requirements
  if (spec.userStories.length > 0) {
    sections.push('## User Requirements');
    sections.push(formatUserStories(spec.userStories));
    sections.push('');
  }

  // Acceptance Criteria
  if (spec.acceptanceCriteria.length > 0) {
    sections.push('## Acceptance Criteria');
    sections.push(formatAcceptanceCriteria(spec.acceptanceCriteria));
    sections.push('');
  }

  // Constraints & Technical Considerations
  const hasConstraints = spec.scopeExcluded.length > 0 ||
    spec.technicalConsiderations.length > 0 ||
    spec.assumptions.length > 0;

  if (hasConstraints) {
    sections.push('## Constraints & Technical Considerations');
    sections.push('');

    if (spec.scopeExcluded.length > 0) {
      sections.push('### Out of Scope');
      sections.push(formatArrayAsBulletList(spec.scopeExcluded));
      sections.push('');
    }

    if (spec.technicalConsiderations.length > 0) {
      sections.push('### Technical Requirements');
      sections.push(formatArrayAsBulletList(spec.technicalConsiderations));
      sections.push('');
    }

    if (spec.assumptions.length > 0) {
      sections.push('### Assumptions');
      sections.push(formatArrayAsBulletList(spec.assumptions));
      sections.push('');
    }
  }

  // Edge Cases
  if (spec.edgeCases.length > 0) {
    sections.push('## Edge Cases to Handle');
    sections.push(formatEdgeCases(spec.edgeCases));
    sections.push('');
  }

  // Design Notes from resolved comments and answered questions
  const hasDesignNotes = resolvedComments.length > 0 ||
    spec.openQuestions.some(q => q.answer && q.answer.trim().length > 0);

  if (hasDesignNotes) {
    const commentsSection = formatResolvedComments(resolvedComments);
    const questionsSection = formatOpenQuestions(spec.openQuestions);

    if (commentsSection || questionsSection) {
      sections.push('## Design Notes & Decisions');
      sections.push('');

      if (questionsSection) {
        sections.push(questionsSection);
      }

      if (commentsSection) {
        sections.push(commentsSection);
      }
    }
  }

  // Implementation Notes (metadata)
  if (includeMetadata) {
    sections.push('## Implementation Notes');
    sections.push(`- Spec Version: v${spec.version}`);
    sections.push(`- Last Updated: ${formatDate(spec.updatedAt)}`);
    sections.push(`- Feature ID: ${spec.featureRequestId}`);
    sections.push('');
  }

  return sections.join('\n');
}

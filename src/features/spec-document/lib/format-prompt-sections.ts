import {
  IAcceptanceCriteria,
  IComment,
  IEdgeCase,
  IOpenQuestion,
} from 'shared/types';

/**
 * Format user stories as a numbered list
 */
export function formatUserStories(stories: string[]): string {
  if (stories.length === 0) {
    return '(None specified)';
  }

  return stories.map((story, index) => `${index + 1}. ${story}`).join('\n');
}

/**
 * Format acceptance criteria as numbered requirements
 */
export function formatAcceptanceCriteria(
  criteria: IAcceptanceCriteria[],
): string {
  if (criteria.length === 0) {
    return '(None specified)';
  }

  return criteria
    .map((item, index) => `${index + 1}. ${item.description}`)
    .join('\n');
}

/**
 * Format edge cases as descriptive list
 */
export function formatEdgeCases(cases: IEdgeCase[]): string {
  if (cases.length === 0) {
    return '(None specified)';
  }

  return cases
    .map(
      edgeCase => `- When ${edgeCase.scenario}: ${edgeCase.expectedBehavior}`,
    )
    .join('\n');
}

/**
 * Format resolved comments grouped by section
 */
export function formatResolvedComments(comments: IComment[]): string {
  if (comments.length === 0) {
    return '';
  }

  // Group comments by section
  const commentsBySection: Record<string, IComment[]> = {};

  comments.forEach(comment => {
    if (!commentsBySection[comment.section]) {
      commentsBySection[comment.section] = [];
    }
    commentsBySection[comment.section].push(comment);
  });

  const sections = Object.keys(commentsBySection);

  if (sections.length === 0) {
    return '';
  }

  let formatted = '\n## Design Notes & Decisions\n\n';

  sections.forEach(section => {
    const sectionComments = commentsBySection[section];
    const sectionTitle = section
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    formatted += `**${sectionTitle}:**\n`;
    sectionComments.forEach(comment => {
      formatted += `- ${comment.content}\n`;
      if (comment.aiResponse) {
        formatted += `  Response: ${comment.aiResponse}\n`;
      }
    });
    formatted += '\n';
  });

  return formatted;
}

/**
 * Format answered open questions
 */
export function formatOpenQuestions(questions: IOpenQuestion[]): string {
  // Only include questions that have answers
  const answeredQuestions = questions.filter(
    q => q.answer && q.answer.trim().length > 0,
  );

  if (answeredQuestions.length === 0) {
    return '';
  }

  let formatted = '';

  answeredQuestions.forEach(question => {
    formatted += `**Q:** ${question.question}\n`;
    formatted += `**A:** ${question.answer}\n\n`;
  });

  return formatted;
}

/**
 * Format array items as bullet list
 */
export function formatArrayAsBulletList(
  items: string[],
  prefix: string = '-',
): string {
  if (items.length === 0) {
    return '(None specified)';
  }

  return items.map(item => `${prefix} ${item}`).join('\n');
}

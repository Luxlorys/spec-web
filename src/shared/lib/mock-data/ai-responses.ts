// Mock AI regeneration logic
import type {
  IComment,
  IOpenQuestion,
  IProposedChange,
  ISpecDocument,
} from 'shared/types';

// Pre-scripted AI questions for the mock conversation flow
export const aiQuestionFlow = [
  {
    step: 1,
    question:
      "Let's start by understanding the core problem. Who is this feature for?",
    keywords: ['user', 'users', 'team', 'admin', 'customer', 'people'],
  },
  {
    step: 2,
    question: 'What problem does this feature solve for them?',
    keywords: ['problem', 'issue', 'pain', 'difficulty', 'challenge'],
  },
  {
    step: 3,
    question:
      'What does success look like? How will you know this feature is working well?',
    keywords: ['success', 'metric', 'goal', 'outcome', 'result'],
  },
  {
    step: 4,
    question:
      'Walk me through what a user would do with this feature. What are the main interactions?',
    keywords: ['flow', 'steps', 'interaction', 'process', 'workflow'],
  },
  {
    step: 5,
    question:
      "What's explicitly NOT included in this feature? What are we saving for later?",
    keywords: ['scope', 'out of scope', 'later', 'v2', 'future'],
  },
  {
    step: 6,
    question:
      'Are there any technical constraints or dependencies I should know about?',
    keywords: [
      'technical',
      'constraint',
      'dependency',
      'limitation',
      'integration',
    ],
  },
  {
    step: 7,
    question: 'Is there a target timeline or deadline for this feature?',
    keywords: ['timeline', 'deadline', 'date', 'when', 'urgent'],
  },
];

// Edge case questions based on feature context
export const generateEdgeCaseQuestions = (featureTitle: string): string[] => {
  const lowerTitle = featureTitle.toLowerCase();

  const questions: string[] = [];

  if (lowerTitle.includes('invite') || lowerTitle.includes('invitation')) {
    questions.push('What happens if an invitation expires?');
    questions.push('Can someone be invited to multiple teams?');
    questions.push('What if an admin tries to invite themselves?');
  }

  if (lowerTitle.includes('auth') || lowerTitle.includes('login')) {
    questions.push('What happens if a user forgets their password?');
    questions.push('How many failed login attempts should we allow?');
    questions.push('Should sessions expire after inactivity?');
  }

  if (lowerTitle.includes('upload') || lowerTitle.includes('file')) {
    questions.push('What file types are allowed?');
    questions.push('What is the maximum file size?');
    questions.push('What happens if upload fails midway?');
  }

  if (lowerTitle.includes('notification')) {
    questions.push('What if a user has hundreds of unread notifications?');
    questions.push('Should notifications expire or be deleted?');
    questions.push('What happens if the notification source is deleted?');
  }

  if (lowerTitle.includes('search') || lowerTitle.includes('filter')) {
    questions.push('How should the system handle no results?');
    questions.push('Should search be case-sensitive?');
    questions.push('What if someone searches for special characters?');
  }

  // Generic edge cases if none of the above match
  if (questions.length === 0) {
    questions.push('What should happen if this action fails?');
    questions.push('Are there any user permissions to consider?');
    questions.push('How should this behave for very large datasets?');
  }

  return questions;
};

// Mock AI responses to common questions
export const aiResponses: Record<string, string> = {
  email_bounce: `Email bounce tracking is a good consideration but may be out of scope for v1. Most email services (like SendGrid) provide bounce notifications that can be reviewed manually. We can add automated bounce handling in a future iteration if it becomes a priority.`,

  multi_team: `Supporting users across multiple teams is a common pattern. Each team membership should be independent, with separate permissions per team. The user's profile would show all teams they belong to, and they can switch between team contexts.`,

  security: `Security considerations are critical. We should implement rate limiting, HTTPS for all communication, secure token generation with sufficient entropy, and proper input validation. Consider adding audit logging for sensitive operations.`,

  performance: `For performance, consider implementing pagination for large lists, lazy loading for images/heavy content, and caching frequently accessed data. Database queries should be optimized with proper indexing. Monitor API response times in production.`,

  permissions: `Permission handling should follow principle of least privilege. Create clear roles (viewer, member, admin, owner) with explicit permissions for each. Verify permissions on both client and server side. Document who can perform each action.`,
};

// Summary confirmation message
export const generateSummary = (responses: string[]): string => {
  return `Great! Let me summarize what I understand so far:

Based on our conversation, this feature will ${responses[0] || 'serve your users'}. The main problem it solves is ${responses[1] || 'a key user need'}. Success will look like ${responses[2] || 'positive user outcomes'}.

${responses[4] ? `We're explicitly excluding: ${responses[4]}` : ''}

${responses[5] ? `Technical considerations: ${responses[5]}` : ''}

Does this match your vision? Should I proceed with generating the specification document?`;
};

/**
 * Mock function that simulates AI regenerating a spec from discussions
 * In production, this would be replaced with actual Claude/OpenAI API call
 */
export const generateRegeneratedSpec = (
  currentSpec: ISpecDocument,
  resolvedComments: IComment[],
  answeredQuestions: IOpenQuestion[],
): IProposedChange[] => {
  const changes: IProposedChange[] = [];

  // Group comments by section
  const commentsBySection: Record<string, IComment[]> = {};

  resolvedComments.forEach(comment => {
    if (!commentsBySection[comment.section]) {
      commentsBySection[comment.section] = [];
    }
    commentsBySection[comment.section].push(comment);
  });

  // Check technical considerations section for comments
  if (
    commentsBySection.technical ||
    commentsBySection['technical-considerations']
  ) {
    const techComments = [
      ...(commentsBySection.technical || []),
      ...(commentsBySection['technical-considerations'] || []),
    ];

    const newConsiderations = [...currentSpec.technicalConsiderations];

    techComments.forEach(comment => {
      // Extract technical decisions from comments
      if (
        comment.content.toLowerCase().includes('should use') ||
        comment.content.toLowerCase().includes('need to') ||
        comment.content.toLowerCase().includes('must')
      ) {
        newConsiderations.push(comment.content);
      }
    });

    if (newConsiderations.length > currentSpec.technicalConsiderations.length) {
      changes.push({
        section: 'technicalConsiderations',
        currentValue: currentSpec.technicalConsiderations,
        proposedValue: newConsiderations,
        changeType: 'modified',
        reason: `Incorporated ${techComments.length} technical decisions from resolved comment discussions`,
      });
    }
  }

  // Check for scope clarifications
  if (
    commentsBySection.scope ||
    commentsBySection['scope-included'] ||
    commentsBySection['scope-excluded']
  ) {
    const scopeComments = [
      ...(commentsBySection.scope || []),
      ...(commentsBySection['scope-included'] || []),
      ...(commentsBySection['scope-excluded'] || []),
    ];

    const newExcluded = [...currentSpec.scopeExcluded];

    scopeComments.forEach(comment => {
      if (
        comment.content.toLowerCase().includes('not include') ||
        comment.content.toLowerCase().includes('out of scope') ||
        comment.content.toLowerCase().includes('future version')
      ) {
        // Extract what should be excluded
        const extracted = comment.content.replace(
          /.*?(not include|out of scope|future version):?\s*/i,
          '',
        );

        if (extracted && extracted.length > 10) {
          newExcluded.push(extracted);
        }
      }
    });

    if (newExcluded.length > currentSpec.scopeExcluded.length) {
      changes.push({
        section: 'scopeExcluded',
        currentValue: currentSpec.scopeExcluded,
        proposedValue: newExcluded,
        changeType: 'modified',
        reason: `Clarified scope boundaries based on ${scopeComments.length} discussion comments`,
      });
    }
  }

  // Incorporate answered open questions into assumptions
  if (answeredQuestions.length > 0) {
    const newAssumptions = [...currentSpec.assumptions];

    answeredQuestions.forEach(q => {
      if (q.answer && q.answer.trim().length > 0) {
        const assumption = `${q.question} - Decision: ${q.answer}`;

        newAssumptions.push(assumption);
      }
    });

    if (newAssumptions.length > currentSpec.assumptions.length) {
      changes.push({
        section: 'assumptions',
        currentValue: currentSpec.assumptions,
        proposedValue: newAssumptions,
        changeType: 'modified',
        reason: `Added ${answeredQuestions.length} resolved decisions from open questions`,
      });
    }
  }

  // Check for problem statement clarifications
  if (commentsBySection['problem-statement']) {
    const problemComments = commentsBySection['problem-statement'];

    if (problemComments.length > 0) {
      // In a real implementation, AI would synthesize comments into updated text
      // For mock, we'll append the first substantive comment
      const substantiveComment = problemComments.find(
        c => c.content.length > 50,
      );

      if (substantiveComment) {
        const proposedStatement = `${currentSpec.problemStatement} ${substantiveComment.content}`;

        changes.push({
          section: 'problemStatement',
          currentValue: currentSpec.problemStatement,
          proposedValue: proposedStatement,
          changeType: 'modified',
          reason:
            'Enhanced problem statement with clarifications from team discussion',
        });
      }
    }
  }

  // Mark unchanged sections
  const changedSections = new Set(changes.map(c => c.section));
  const allSections = [
    'overview',
    'problemStatement',
    'userStories',
    'scopeIncluded',
    'scopeExcluded',
    'technicalConsiderations',
    'assumptions',
  ];

  allSections.forEach(section => {
    if (!changedSections.has(section)) {
      changes.push({
        section,
        currentValue: (currentSpec as any)[section],
        proposedValue: (currentSpec as any)[section],
        changeType: 'unchanged',
        reason: 'No changes needed based on discussions',
      });
    }
  });

  return changes;
};

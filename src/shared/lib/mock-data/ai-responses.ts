// Pre-scripted AI questions for the mock conversation flow
export const aiQuestionFlow = [
  {
    step: 1,
    question: "Let's start by understanding the core problem. Who is this feature for?",
    keywords: ['user', 'users', 'team', 'admin', 'customer', 'people'],
  },
  {
    step: 2,
    question: 'What problem does this feature solve for them?',
    keywords: ['problem', 'issue', 'pain', 'difficulty', 'challenge'],
  },
  {
    step: 3,
    question: 'What does success look like? How will you know this feature is working well?',
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
    question: "What's explicitly NOT included in this feature? What are we saving for later?",
    keywords: ['scope', 'out of scope', 'later', 'v2', 'future'],
  },
  {
    step: 6,
    question: 'Are there any technical constraints or dependencies I should know about?',
    keywords: ['technical', 'constraint', 'dependency', 'limitation', 'integration'],
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

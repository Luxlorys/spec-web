import { IComment } from 'shared/types';

export const mockComments: IComment[] = [
  // Technical Considerations section
  {
    id: 'comment-1',
    specDocumentId: 'spec-2',
    section: 'technical',
    content: 'Should we use SendGrid or AWS SES for email sending?',
    authorId: 'user-2',
    resolved: false,
    createdAt: new Date('2024-12-08T10:00:00'),
    updatedAt: new Date('2024-12-08T10:00:00'),
  },
  {
    id: 'comment-2',
    specDocumentId: 'spec-2',
    section: 'technical',
    content: "Let's go with SendGrid for now since we already have an account",
    authorId: 'user-1',
    parentId: 'comment-1',
    resolved: true,
    createdAt: new Date('2024-12-08T14:30:00'),
    updatedAt: new Date('2024-12-08T14:30:00'),
  },

  // Edge Cases section
  {
    id: 'comment-3',
    specDocumentId: 'spec-2',
    section: 'edge-cases',
    content: 'What if the email bounces? Should we track that?',
    authorId: 'user-4',
    resolved: false,
    createdAt: new Date('2024-12-09T09:15:00'),
    updatedAt: new Date('2024-12-09T09:15:30'),
  },
  {
    id: 'comment-3a',
    specDocumentId: 'spec-2',
    section: 'edge-cases',
    content:
      'For v1, SendGrid will handle bounce notifications that we can review manually. We can add automated handling later.',
    authorId: 'user-1',
    parentId: 'comment-3',
    resolved: false,
    createdAt: new Date('2024-12-09T10:00:00'),
    updatedAt: new Date('2024-12-09T10:00:00'),
  },

  // Scope section
  {
    id: 'comment-4',
    specDocumentId: 'spec-2',
    section: 'scope',
    content: 'Why are email notifications excluded? Seems like a must-have.',
    authorId: 'user-2',
    resolved: false,
    createdAt: new Date('2024-12-09T11:00:00'),
    updatedAt: new Date('2024-12-09T11:00:00'),
  },
  {
    id: 'comment-5',
    specDocumentId: 'spec-2',
    section: 'scope',
    content:
      "We'll add email notifications in v2. Want to validate in-app notifications work well first.",
    authorId: 'user-1',
    parentId: 'comment-4',
    resolved: true,
    createdAt: new Date('2024-12-09T13:20:00'),
    updatedAt: new Date('2024-12-09T13:20:00'),
  },

  // Overview section
  {
    id: 'comment-6',
    specDocumentId: 'spec-2',
    section: 'overview',
    content:
      'This overview looks comprehensive, but should we mention the mobile app requirement?',
    authorId: 'user-2',
    resolved: false,
    createdAt: new Date('2024-12-10T09:00:00'),
    updatedAt: new Date('2024-12-10T09:00:00'),
  },
  {
    id: 'comment-7',
    specDocumentId: 'spec-2',
    section: 'overview',
    content: 'Good point, let me update it. Mobile web is in scope but native apps are v2.',
    authorId: 'user-1',
    parentId: 'comment-6',
    resolved: false,
    createdAt: new Date('2024-12-10T10:30:00'),
    updatedAt: new Date('2024-12-10T10:30:00'),
  },

  // User Stories section
  {
    id: 'comment-8',
    specDocumentId: 'spec-2',
    section: 'user-stories',
    content: 'Are we covering the admin user stories in this version?',
    authorId: 'user-4',
    resolved: false,
    createdAt: new Date('2024-12-11T14:00:00'),
    updatedAt: new Date('2024-12-11T14:00:00'),
  },
  {
    id: 'comment-9',
    specDocumentId: 'spec-2',
    section: 'user-stories',
    content: 'Yes, admin invite functionality is included. The user story for that is #3.',
    authorId: 'user-1',
    parentId: 'comment-8',
    resolved: false,
    createdAt: new Date('2024-12-11T15:00:00'),
    updatedAt: new Date('2024-12-11T15:00:00'),
  },

  // Problem Statement section
  {
    id: 'comment-10',
    specDocumentId: 'spec-2',
    section: 'problem-statement',
    content: 'Should we add metrics about the current manual process time?',
    authorId: 'user-2',
    resolved: false,
    createdAt: new Date('2024-12-12T08:30:00'),
    updatedAt: new Date('2024-12-12T08:30:00'),
  },

  // Acceptance Criteria section
  {
    id: 'comment-11',
    specDocumentId: 'spec-2',
    section: 'acceptance-criteria',
    content: 'Do we need to add a criterion for invitation expiration?',
    authorId: 'user-4',
    resolved: false,
    createdAt: new Date('2024-12-12T11:00:00'),
    updatedAt: new Date('2024-12-12T11:00:00'),
  },
  {
    id: 'comment-12',
    specDocumentId: 'spec-2',
    section: 'acceptance-criteria',
    content: 'Yes! I\'ll add "Invitation expires after 7 days" to the criteria.',
    authorId: 'user-1',
    parentId: 'comment-11',
    resolved: false,
    createdAt: new Date('2024-12-12T11:15:00'),
    updatedAt: new Date('2024-12-12T11:15:00'),
  },

  // Assumptions section
  {
    id: 'comment-13',
    specDocumentId: 'spec-2',
    section: 'assumptions',
    content: 'Is the assumption about SMTP correct? We might need OAuth2 for Gmail.',
    authorId: 'user-2',
    resolved: false,
    createdAt: new Date('2024-12-12T16:00:00'),
    updatedAt: new Date('2024-12-12T16:00:00'),
  },
];

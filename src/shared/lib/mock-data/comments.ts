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
    content:
      'Good point, let me update it. Mobile web is in scope but native apps are v2.',
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
    content:
      'Yes, admin invite functionality is included. The user story for that is #3.',
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
    content:
      'Yes! I\'ll add "Invitation expires after 7 days" to the criteria.',
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
    content:
      'Is the assumption about SMTP correct? We might need OAuth2 for Gmail.',
    authorId: 'user-2',
    resolved: false,
    createdAt: new Date('2024-12-12T16:00:00'),
    updatedAt: new Date('2024-12-12T16:00:00'),
  },

  // ========== SPEC-4: Advanced Search Filters - Many resolved comments for regeneration demo ==========

  // Technical Considerations - Resolved
  {
    id: 'comment-100',
    specDocumentId: 'spec-4',
    section: 'technical',
    content: 'Should we use PostgreSQL full-text search or Elasticsearch?',
    authorId: 'user-2',
    resolved: false,
    createdAt: new Date('2024-12-02T10:00:00'),
    updatedAt: new Date('2024-12-02T10:00:00'),
  },
  {
    id: 'comment-101',
    specDocumentId: 'spec-4',
    section: 'technical',
    content:
      'Elasticsearch would be better for this. We need fast filtering across multiple fields and it handles that really well. Plus we can scale horizontally if needed.',
    authorId: 'user-1',
    parentId: 'comment-100',
    resolved: true,
    createdAt: new Date('2024-12-02T11:30:00'),
    updatedAt: new Date('2024-12-02T11:30:00'),
  },

  // Technical Considerations - Resolved
  {
    id: 'comment-102',
    specDocumentId: 'spec-4',
    section: 'technical',
    content: 'We need to add composite indexes on frequently filtered columns',
    authorId: 'user-4',
    resolved: true,
    createdAt: new Date('2024-12-03T09:00:00'),
    updatedAt: new Date('2024-12-03T09:00:00'),
  },

  // Technical Considerations - Resolved
  {
    id: 'comment-103',
    specDocumentId: 'spec-4',
    section: 'technical',
    content:
      'Should we implement debouncing for the filter inputs to reduce API calls?',
    authorId: 'user-2',
    resolved: false,
    createdAt: new Date('2024-12-03T14:00:00'),
    updatedAt: new Date('2024-12-03T14:00:00'),
  },
  {
    id: 'comment-104',
    specDocumentId: 'spec-4',
    section: 'technical',
    content:
      "Yes definitely! Let's use 300ms debounce. That's the sweet spot for instant feel while reducing server load.",
    authorId: 'user-1',
    parentId: 'comment-103',
    resolved: true,
    createdAt: new Date('2024-12-03T15:00:00'),
    updatedAt: new Date('2024-12-03T15:00:00'),
  },

  // Scope - Resolved
  {
    id: 'comment-105',
    specDocumentId: 'spec-4',
    section: 'scope',
    content:
      'We should add URL parameters for shareable filtered searches. Users often want to share specific search views.',
    authorId: 'user-4',
    resolved: false,
    createdAt: new Date('2024-12-04T10:00:00'),
    updatedAt: new Date('2024-12-04T10:00:00'),
  },
  {
    id: 'comment-106',
    specDocumentId: 'spec-4',
    section: 'scope',
    content:
      "That's a great idea but let's keep it out of v1 scope. We want to ship the core filtering first, then add URL params in v2.",
    authorId: 'user-1',
    parentId: 'comment-105',
    resolved: true,
    createdAt: new Date('2024-12-04T11:00:00'),
    updatedAt: new Date('2024-12-04T11:00:00'),
  },

  // Scope - Resolved
  {
    id: 'comment-107',
    specDocumentId: 'spec-4',
    section: 'scope',
    content: 'What about active filter badges? Should they be included?',
    authorId: 'user-2',
    resolved: false,
    createdAt: new Date('2024-12-04T14:00:00'),
    updatedAt: new Date('2024-12-04T14:00:00'),
  },
  {
    id: 'comment-108',
    specDocumentId: 'spec-4',
    section: 'scope',
    content:
      'Yes! Active filter badges showing current selections are definitely in scope. They help users understand what filters are applied.',
    authorId: 'user-1',
    parentId: 'comment-107',
    resolved: true,
    createdAt: new Date('2024-12-04T15:30:00'),
    updatedAt: new Date('2024-12-04T15:30:00'),
  },

  // Problem Statement - Resolved
  {
    id: 'comment-109',
    specDocumentId: 'spec-4',
    section: 'problem-statement',
    content:
      'Can we add more context about the scale? How many items do users typically search through?',
    authorId: 'user-4',
    resolved: false,
    createdAt: new Date('2024-12-05T09:00:00'),
    updatedAt: new Date('2024-12-05T09:00:00'),
  },
  {
    id: 'comment-110',
    specDocumentId: 'spec-4',
    section: 'problem-statement',
    content:
      'Good point. Our analytics show most active users have 200-500 items, with power users having 1000+. The problem gets exponentially worse as the dataset grows.',
    authorId: 'user-1',
    parentId: 'comment-109',
    resolved: true,
    createdAt: new Date('2024-12-05T10:00:00'),
    updatedAt: new Date('2024-12-05T10:00:00'),
  },

  // Edge Cases - Resolved
  {
    id: 'comment-111',
    specDocumentId: 'spec-4',
    section: 'edge-cases',
    content:
      'What happens if a tag is deleted while a user has it selected as a filter?',
    authorId: 'user-2',
    resolved: false,
    createdAt: new Date('2024-12-06T11:00:00'),
    updatedAt: new Date('2024-12-06T11:00:00'),
  },
  {
    id: 'comment-112',
    specDocumentId: 'spec-4',
    section: 'edge-cases',
    content:
      'We should automatically remove that filter and show a notification to the user explaining what happened.',
    authorId: 'user-1',
    parentId: 'comment-111',
    resolved: true,
    createdAt: new Date('2024-12-06T12:00:00'),
    updatedAt: new Date('2024-12-06T12:00:00'),
  },

  // Edge Cases - Resolved
  {
    id: 'comment-113',
    specDocumentId: 'spec-4',
    section: 'edge-cases',
    content:
      'How do we handle very large numbers of tags in the filter dropdown?',
    authorId: 'user-4',
    resolved: false,
    createdAt: new Date('2024-12-06T14:00:00'),
    updatedAt: new Date('2024-12-06T14:00:00'),
  },
  {
    id: 'comment-114',
    specDocumentId: 'spec-4',
    section: 'edge-cases',
    content:
      'For 100+ tags, we need search within the tags dropdown and virtual scrolling for performance. Good catch!',
    authorId: 'user-1',
    parentId: 'comment-113',
    resolved: true,
    createdAt: new Date('2024-12-06T15:30:00'),
    updatedAt: new Date('2024-12-06T15:30:00'),
  },

  // Edge Cases - Resolved
  {
    id: 'comment-115',
    specDocumentId: 'spec-4',
    section: 'edge-cases',
    content: "What if there's a network error while applying filters?",
    authorId: 'user-2',
    resolved: false,
    createdAt: new Date('2024-12-07T09:00:00'),
    updatedAt: new Date('2024-12-07T09:00:00'),
  },
  {
    id: 'comment-116',
    specDocumentId: 'spec-4',
    section: 'edge-cases',
    content:
      "Show error toast, keep previous results visible, and allow retry. Don't break the entire UI.",
    authorId: 'user-1',
    parentId: 'comment-115',
    resolved: true,
    createdAt: new Date('2024-12-07T10:00:00'),
    updatedAt: new Date('2024-12-07T10:00:00'),
  },

  // Assumptions - Resolved
  {
    id: 'comment-117',
    specDocumentId: 'spec-4',
    section: 'assumptions',
    content: 'Are we assuming date ranges are in UTC or user local time?',
    authorId: 'user-4',
    resolved: false,
    createdAt: new Date('2024-12-07T14:00:00'),
    updatedAt: new Date('2024-12-07T14:00:00'),
  },
  {
    id: 'comment-118',
    specDocumentId: 'spec-4',
    section: 'assumptions',
    content:
      'Dates stored in UTC, displayed in user local timezone. This prevents confusion for distributed teams.',
    authorId: 'user-1',
    parentId: 'comment-117',
    resolved: true,
    createdAt: new Date('2024-12-07T15:00:00'),
    updatedAt: new Date('2024-12-07T15:00:00'),
  },

  // Assumptions - Resolved
  {
    id: 'comment-119',
    specDocumentId: 'spec-4',
    section: 'assumptions',
    content: "What's the maximum number of results we support with filters?",
    authorId: 'user-2',
    resolved: false,
    createdAt: new Date('2024-12-08T09:00:00'),
    updatedAt: new Date('2024-12-08T09:00:00'),
  },
  {
    id: 'comment-120',
    specDocumentId: 'spec-4',
    section: 'assumptions',
    content:
      'Maximum 1000 results per page even with filters. Should be plenty for most use cases.',
    authorId: 'user-1',
    parentId: 'comment-119',
    resolved: true,
    createdAt: new Date('2024-12-08T10:00:00'),
    updatedAt: new Date('2024-12-08T10:00:00'),
  },

  // Technical Considerations - Resolved (mobile responsive)
  {
    id: 'comment-121',
    specDocumentId: 'spec-4',
    section: 'technical',
    content: 'Do we need to make the filter UI mobile-responsive?',
    authorId: 'user-4',
    resolved: false,
    createdAt: new Date('2024-12-08T11:00:00'),
    updatedAt: new Date('2024-12-08T11:00:00'),
  },
  {
    id: 'comment-122',
    specDocumentId: 'spec-4',
    section: 'technical',
    content:
      'Absolutely! We have significant mobile traffic. The filter UI must work well on small screens.',
    authorId: 'user-1',
    parentId: 'comment-121',
    resolved: true,
    createdAt: new Date('2024-12-08T12:00:00'),
    updatedAt: new Date('2024-12-08T12:00:00'),
  },
];

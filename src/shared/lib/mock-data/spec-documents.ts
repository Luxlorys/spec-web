import { ISpecDocument, ISpecVersion } from 'shared/types';

// Version history storage for spec regeneration
export const mockSpecVersionHistory: ISpecVersion[] = [
  // Version 1 of Advanced Search Filters spec
  {
    id: 'version-4-1',
    specDocumentId: 'spec-4',
    version: 1,
    snapshot: {
      overview:
        'Add filtering capabilities to the search feature to help users find content more quickly.',
      problemStatement:
        'Users currently have basic search that returns too many results, making it hard to find specific items.',
      userStories: [
        'As a user, I want to filter by date range so that I can find recent content',
        'As a user, I want to filter by tags so that I can narrow down results',
      ],
      acceptanceCriteria: [
        {
          id: 'ac-20',
          description:
            'Given search results, when I apply a date filter, then only matching items show',
          completed: false,
        },
        {
          id: 'ac-21',
          description:
            'Given search results, when I apply a tag filter, then only tagged items show',
          completed: false,
        },
      ],
      scopeIncluded: [
        'Date range filter',
        'Tag filter',
        'Basic UI for filters',
      ],
      scopeExcluded: [
        'Advanced query builder',
        'Saved search filters',
        'Export filtered results',
      ],
      technicalConsiderations: [
        'Database query optimization',
        'Filter UI component design',
      ],
      openQuestions: [
        {
          id: 'oq-10',
          question: 'Should filters be AND or OR logic?',
          askedBy: 'user-2',
          resolved: false,
        },
      ],
      edgeCases: [
        {
          scenario: 'User selects invalid date range',
          expectedBehavior: 'Show validation error',
        },
      ],
      assumptions: [
        'Users understand how filters work',
        'Search index supports filtering',
      ],
      generatedAt: new Date('2024-12-01T09:00:00'),
      updatedAt: new Date('2024-12-01T09:00:00'),
    },
    changeDescription: 'Initial spec generation',
    createdBy: 'user-1',
    createdAt: new Date('2024-12-01T09:00:00'),
  },
];

export const mockSpecDocuments: ISpecDocument[] = [
  {
    id: 'spec-2',
    featureRequestId: 'feat-2',
    overview:
      'Enable administrators and organization owners to invite new team members via email, with role assignment and expiration handling.',
    problemStatement:
      'Currently, there is no way to add new team members to the organization. Admins need a simple, secure way to invite people via email while controlling their access level.',
    userStories: [
      'As an admin, I want to invite team members by email so that I can grow my team',
      'As an invitee, I want to receive an email invitation so that I can join the organization',
      'As an admin, I want to assign roles during invitation so that new members have appropriate permissions',
      'As an admin, I want to revoke pending invitations so that I can control who joins',
    ],
    acceptanceCriteria: [
      {
        id: 'ac-1',
        description:
          'Given I am an admin, when I enter an email and role, then an invitation is sent',
        completed: false,
      },
      {
        id: 'ac-2',
        description:
          'Given an invitation is sent, when 7 days pass, then the invitation expires automatically',
        completed: false,
      },
      {
        id: 'ac-3',
        description:
          'Given I am an admin, when I view pending invitations, then I can revoke any of them',
        completed: false,
      },
      {
        id: 'ac-4',
        description:
          'Given a user receives an invitation, when they have an existing account, then they can accept and join immediately',
        completed: false,
      },
      {
        id: 'ac-5',
        description:
          'Given a user receives an invitation, when they do not have an account, then they can sign up and join in one flow',
        completed: false,
      },
    ],
    scopeIncluded: [
      'Email invitation sending',
      'Role assignment (admin, member)',
      'Invitation expiration (7 days)',
      'Revoke pending invitations',
      'Accept invitation flow for existing users',
      'Sign up + accept flow for new users',
      'List of pending invitations in admin panel',
    ],
    scopeExcluded: [
      'Bulk invitation import from CSV',
      'Custom expiration dates per invitation',
      'Invitation templates or custom messages',
      'Automatic role suggestions based on email domain',
    ],
    technicalConsiderations: [
      'Email service integration needed for sending invitations',
      'Secure token generation for invitation links',
      'Database schema for tracking invitation status',
      'Handle race condition where expired invitation is accepted',
    ],
    openQuestions: [
      {
        id: 'oq-1',
        question:
          'What should happen if someone is already a member and gets invited again?',
        askedBy: 'user-2',
        resolved: false,
      },
      {
        id: 'oq-2',
        question:
          'Should we send a reminder email before the invitation expires?',
        answer: 'Not in v1, we can add this later if needed',
        askedBy: 'user-4',
        answeredBy: 'user-1',
        resolved: true,
      },
    ],
    edgeCases: [
      {
        scenario: 'User clicks invitation link after it expired',
        expectedBehavior:
          'Show friendly error message with option to request new invitation',
      },
      {
        scenario: 'User is invited to multiple teams simultaneously',
        expectedBehavior:
          'Each invitation is independent; user can accept each separately',
      },
      {
        scenario: 'Admin invites themselves',
        expectedBehavior: 'Show validation error preventing self-invitation',
      },
    ],
    assumptions: [
      'Email delivery is reliable and users check their email',
      'Organization has configured email sending service',
      'Users have unique email addresses',
      'Invitation links are accessed from same device type (no mobile-desktop mismatch issues)',
    ],
    version: 1,
    generatedAt: new Date('2024-11-20T10:30:00'),
    updatedAt: new Date('2024-11-20T10:30:00'),
  },
  {
    id: 'spec-3',
    featureRequestId: 'feat-3',
    overview:
      'Implement a real-time notification system to keep users informed of important events in the application.',
    problemStatement:
      'Users miss important updates because they have to manually check for changes. They need to be notified immediately when relevant events occur.',
    userStories: [
      'As a user, I want to receive notifications for mentions so that I know when someone needs my attention',
      'As a user, I want to receive notifications for project updates so that I stay informed',
      'As a user, I want to manage my notification preferences so that I only see what matters to me',
    ],
    acceptanceCriteria: [
      {
        id: 'ac-10',
        description:
          'Given a user is mentioned, when the mention is saved, then they receive a notification',
        completed: false,
      },
      {
        id: 'ac-11',
        description:
          'Given a user has unread notifications, when they view the notification panel, then unread count is displayed',
        completed: false,
      },
      {
        id: 'ac-12',
        description:
          'Given a user clicks a notification, when it loads, then they are taken to the relevant content',
        completed: false,
      },
    ],
    scopeIncluded: [
      'In-app notification panel',
      'Notification badge with unread count',
      'Mark as read functionality',
      'Notification types: mentions, assignments, comments',
      'Click to navigate to source',
    ],
    scopeExcluded: [
      'Email notifications',
      'Push notifications',
      'Notification grouping',
      'Notification preferences/settings',
    ],
    technicalConsiderations: [
      'Consider WebSocket for real-time delivery',
      'Notification storage and indexing',
      'Performance with large notification lists',
    ],
    openQuestions: [],
    edgeCases: [
      {
        scenario: 'Notification source is deleted before user clicks',
        expectedBehavior: 'Show message that content no longer exists',
      },
    ],
    assumptions: [
      'Users have browser notifications permission',
      'Application is open in browser',
    ],
    version: 1,
    generatedAt: new Date('2024-11-25T15:00:00'),
    updatedAt: new Date('2024-11-25T15:00:00'),
  },
  {
    id: 'spec-4',
    featureRequestId: 'feat-4',
    overview:
      'Add comprehensive filtering capabilities to the search feature, including date range, tags, and status filters, to help users find content more efficiently and reduce information overload.',
    problemStatement:
      'Users currently have basic keyword search that returns too many results, making it hard to find specific items. With hundreds of items in the system, users spend too much time scrolling through irrelevant results. We need advanced filters to help them narrow down results quickly.',
    userStories: [
      'As a user, I want to filter by date range so that I can find recent content',
      'As a user, I want to filter by tags so that I can narrow down results by category',
      'As a user, I want to filter by status so that I can see only active or archived items',
      'As a user, I want to combine multiple filters so that I can be very specific in my search',
      'As a user, I want to see filter results instantly so that I get immediate feedback',
    ],
    acceptanceCriteria: [
      {
        id: 'ac-20',
        description:
          'Given search results exist, when I apply a date range filter, then only items within that date range are displayed',
        completed: false,
      },
      {
        id: 'ac-21',
        description:
          'Given search results exist, when I apply a tag filter, then only items with that tag are displayed',
        completed: false,
      },
      {
        id: 'ac-22',
        description:
          'Given search results exist, when I apply a status filter, then only items with that status are displayed',
        completed: false,
      },
      {
        id: 'ac-23',
        description:
          'Given multiple filters are applied, when results update, then items must match ALL filters (AND logic)',
        completed: false,
      },
      {
        id: 'ac-24',
        description:
          'Given filters are applied, when I clear all filters, then all search results are shown again',
        completed: false,
      },
      {
        id: 'ac-25',
        description:
          'Given no results match the filters, when filters are applied, then an empty state is shown with clear messaging',
        completed: false,
      },
    ],
    scopeIncluded: [
      'Date range filter with calendar picker',
      'Multi-select tag filter',
      'Status filter (dropdown)',
      'Clear all filters button',
      'Active filter badges showing current selections',
      'Result count updates as filters change',
      'Empty state when no results match',
      'Debounced filter updates for performance',
    ],
    scopeExcluded: [
      'Advanced query builder interface',
      'Saved search filters',
      'Export filtered results to CSV',
      'Filter presets or templates',
      'Keyboard shortcuts for filters',
      'URL parameters for shareable filtered searches',
    ],
    technicalConsiderations: [
      'Database query optimization with composite indexes on date, tags, and status',
      'Elasticsearch for fast full-text search with filtering',
      'Debounce filter changes to reduce API calls',
      'Pagination must work correctly with filters applied',
      'Cache invalidation when underlying data changes',
      'Mobile-responsive filter UI that works well on small screens',
    ],
    openQuestions: [
      {
        id: 'oq-10',
        question:
          'Should filters be AND or OR logic when multiple are selected?',
        answer:
          'AND logic - users want to narrow down results, not expand them',
        askedBy: 'user-2',
        answeredBy: 'user-1',
        resolved: true,
      },
      {
        id: 'oq-11',
        question:
          'Should we show filter options that would result in zero results?',
        answer:
          'Yes, but disable them visually and show count (0) to set expectations',
        askedBy: 'user-4',
        answeredBy: 'user-1',
        resolved: true,
      },
      {
        id: 'oq-12',
        question:
          'What date range presets should we include (last 7 days, last month, etc.)?',
        answer: 'Last 7 days, Last 30 days, Last 90 days, Custom range',
        askedBy: 'user-2',
        answeredBy: 'user-1',
        resolved: true,
      },
    ],
    edgeCases: [
      {
        scenario: 'User selects end date before start date',
        expectedBehavior:
          'Automatically swap dates or show validation error with helpful message',
      },
      {
        scenario: 'User applies filters that result in zero matches',
        expectedBehavior:
          'Show empty state with clear message and suggestion to remove some filters',
      },
      {
        scenario: 'Tag is deleted while user has it selected as filter',
        expectedBehavior:
          'Remove the filter automatically and show notification to user',
      },
      {
        scenario: 'Very large number of tags (100+) in filter dropdown',
        expectedBehavior:
          'Implement search within tags and virtual scrolling for performance',
      },
      {
        scenario: 'Network error while applying filters',
        expectedBehavior:
          'Show error toast, keep previous results visible, allow retry',
      },
    ],
    assumptions: [
      'Users understand how filters work and expect AND logic by default',
      'Search index supports filtering without significant performance degradation',
      'Date range is stored in UTC and displayed in user local timezone',
      'Maximum 1000 results per page even with filters applied',
      'Tag taxonomy is flat (no nested tags) for v1',
    ],
    version: 2,
    generatedAt: new Date('2024-12-01T09:00:00'),
    updatedAt: new Date('2024-12-08T14:30:00'),
  },
];

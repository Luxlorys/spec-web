import { ISpecDocument } from 'shared/types';

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
        question: 'What should happen if someone is already a member and gets invited again?',
        askedBy: 'user-2',
        resolved: false,
      },
      {
        id: 'oq-2',
        question: 'Should we send a reminder email before the invitation expires?',
        answer: 'Not in v1, we can add this later if needed',
        askedBy: 'user-4',
        answeredBy: 'user-1',
        resolved: true,
      },
    ],
    edgeCases: [
      {
        scenario: 'User clicks invitation link after it expired',
        expectedBehavior: 'Show friendly error message with option to request new invitation',
      },
      {
        scenario: 'User is invited to multiple teams simultaneously',
        expectedBehavior: 'Each invitation is independent; user can accept each separately',
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
    assumptions: ['Users have browser notifications permission', 'Application is open in browser'],
    version: 1,
    generatedAt: new Date('2024-11-25T15:00:00'),
    updatedAt: new Date('2024-11-25T15:00:00'),
  },
];

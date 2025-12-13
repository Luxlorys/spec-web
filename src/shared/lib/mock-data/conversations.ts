import { IAIConversation } from 'shared/types';

export const mockConversations: IAIConversation[] = [
  {
    id: 'conv-2',
    featureRequestId: 'feat-2',
    status: 'completed',
    messages: [
      {
        id: 'msg-1',
        role: 'assistant',
        content:
          "I'll help you design the team invitation feature. Let me start by understanding the requirements better. Who should be able to send invitations in your system?",
        timestamp: new Date('2024-11-20T10:00:00'),
      },
      {
        id: 'msg-2',
        role: 'user',
        content: 'Only admins and organization owners should be able to send invitations.',
        timestamp: new Date('2024-11-20T10:02:00'),
      },
      {
        id: 'msg-3',
        role: 'assistant',
        content:
          'Got it. When someone receives an invitation, what should their experience be? Should they create a new account, or can they also join with an existing account?',
        timestamp: new Date('2024-11-20T10:02:30'),
      },
      {
        id: 'msg-4',
        role: 'user',
        content:
          "They'll get an email with a link. If they have an account, they can accept and be added to the team. If not, they create an account first.",
        timestamp: new Date('2024-11-20T10:05:00'),
      },
      {
        id: 'msg-5',
        role: 'assistant',
        content:
          'Makes sense. A few important questions: Should invitations expire? Is there a limit to pending invitations? Can invitations be revoked?',
        timestamp: new Date('2024-11-20T10:05:45'),
      },
      {
        id: 'msg-6',
        role: 'user',
        content: 'Yes, expire after 7 days. No limit on pending. Yes, admins can revoke.',
        timestamp: new Date('2024-11-20T10:08:00'),
      },
      {
        id: 'msg-7',
        role: 'assistant',
        content:
          "Perfect. What happens if someone is invited to multiple teams? And should there be role assignment during invitation (admin, member, etc.)?",
        timestamp: new Date('2024-11-20T10:08:30'),
      },
      {
        id: 'msg-8',
        role: 'user',
        content:
          'They can be part of multiple teams. Yes, invite should specify role: admin or member.',
        timestamp: new Date('2024-11-20T10:11:00'),
      },
    ],
    createdAt: new Date('2024-11-20'),
    updatedAt: new Date('2024-11-20'),
  },
  {
    id: 'conv-6',
    featureRequestId: 'feat-6',
    status: 'active',
    messages: [
      {
        id: 'msg-20',
        role: 'assistant',
        content:
          "Let's discuss the dark mode feature. First, who is this feature for - all users or specific user groups?",
        timestamp: new Date('2024-12-05T14:00:00'),
      },
      {
        id: 'msg-21',
        role: 'user',
        content: 'All users. It should be a user preference they can toggle.',
        timestamp: new Date('2024-12-05T14:02:00'),
      },
      {
        id: 'msg-22',
        role: 'assistant',
        content:
          'Great! Should the dark mode preference be saved per device or sync across all devices where the user logs in?',
        timestamp: new Date('2024-12-05T14:02:30'),
      },
      {
        id: 'msg-23',
        role: 'user',
        content: 'Sync across devices. Save it in their user profile.',
        timestamp: new Date('2024-12-05T14:05:00'),
      },
      {
        id: 'msg-24',
        role: 'assistant',
        content:
          'Perfect. Should there also be an "auto" mode that follows the system preference, or just manual light/dark toggle?',
        timestamp: new Date('2024-12-05T14:05:45'),
      },
      {
        id: 'msg-25',
        role: 'user',
        content:
          "Yes, three options: Light, Dark, and Auto (follows system). Auto should be the default for new users.",
        timestamp: new Date('2024-12-10T09:30:00'),
      },
    ],
    createdAt: new Date('2024-12-05'),
    updatedAt: new Date('2024-12-10'),
  },
];

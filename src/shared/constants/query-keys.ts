export enum QueryKeys {
  GET_TODOS,

  // Auth
  CURRENT_USER = 'currentUser',

  // Organizations
  ORGANIZATIONS = 'organizations',
  ORGANIZATION_BY_ID = 'organizationById',

  // Feature Requests
  FEATURE_REQUESTS = 'featureRequests',
  FEATURE_REQUEST_BY_ID = 'featureRequestById',

  // Conversations
  CONVERSATION_BY_FEATURE = 'conversationByFeature',

  // Specs
  SPEC_BY_FEATURE = 'specByFeature',

  // Comments
  COMMENTS_BY_SPEC = 'commentsBySpec',

  // Notifications
  NOTIFICATIONS = 'notifications',
  UNREAD_COUNT = 'unreadCount',

  // Team
  TEAM_MEMBERS = 'teamMembers',
  TEAM_INVITES = 'teamInvites',
}

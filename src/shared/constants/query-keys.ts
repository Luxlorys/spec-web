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
  FEATURE_ACTIVITIES = 'featureActivities',

  // Conversations
  CONVERSATION_BY_FEATURE = 'conversationByFeature',

  // Specifications
  SPECIFICATION_BY_FEATURE = 'specificationByFeature',
  SPEC_REGENERATION_PREVIEW = 'specRegenerationPreview',
  SPEC_VERSION_HISTORY = 'specVersionHistory',

  // Comments
  COMMENTS_BY_SPEC = 'commentsBySpec',

  // Notifications
  NOTIFICATIONS = 'notifications',
  UNREAD_COUNT = 'unreadCount',

  // Team
  TEAM_MEMBERS = 'teamMembers',
  TEAM_INVITES = 'teamInvites',

  // Users
  USERS = 'users',

  // Documentation
  DOCUMENTATION = 'documentation',
}

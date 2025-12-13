export type NotificationType =
  | 'feature_created'
  | 'spec_generated'
  | 'question_asked'
  | 'question_answered'
  | 'status_changed'
  | 'spec_updated';

export interface INotification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: Date;
}

export interface IMarkNotificationReadRequest {
  notificationId: string;
}

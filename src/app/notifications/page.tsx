'use client';

import Link from 'next/link';

import { useQuery } from '@tanstack/react-query';
import {
  ArrowRight,
  Bell,
  CheckCheck,
  FileText,
  MessageSquare,
  RefreshCw,
  Sparkles,
} from 'lucide-react';

import { QueryKeys } from 'shared/constants';
import { cn, formatRelativeTime } from 'shared/lib';
import { mockNotifications } from 'shared/lib/mock-data';
import { useAuthStore } from 'shared/store';
import { INotification, NotificationType } from 'shared/types';
import {
  Badge,
  Button,
  Card,
  TabsContent,
  TabsList,
  TabsRoot,
  TabsTrigger,
} from 'shared/ui';

const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case 'feature_created':
      return {
        icon: Sparkles,
        color: 'text-purple-500',
        bg: 'bg-purple-100 dark:bg-purple-900/30',
      };

    case 'spec_generated':
      return {
        icon: FileText,
        color: 'text-green-500',
        bg: 'bg-green-100 dark:bg-green-900/30',
      };

    case 'question_asked':
      return {
        icon: MessageSquare,
        color: 'text-orange-500',
        bg: 'bg-orange-100 dark:bg-orange-900/30',
      };

    case 'question_answered':
      return {
        icon: MessageSquare,
        color: 'text-purple-500',
        bg: 'bg-purple-100 dark:bg-purple-900/30',
      };

    case 'status_changed':
      return {
        icon: RefreshCw,
        color: 'text-yellow-500',
        bg: 'bg-yellow-100 dark:bg-yellow-900/30',
      };

    case 'spec_updated':
      return {
        icon: FileText,
        color: 'text-indigo-500',
        bg: 'bg-indigo-100 dark:bg-indigo-900/30',
      };

    default:
      return {
        icon: Bell,
        color: 'text-gray-500',
        bg: 'bg-gray-100 dark:bg-gray-800',
      };
  }
};

const getNotificationTypeLabel = (type: NotificationType): string => {
  switch (type) {
    case 'feature_created':
      return 'New Feature';

    case 'spec_generated':
      return 'Spec Ready';

    case 'question_asked':
      return 'Question';

    case 'question_answered':
      return 'Answer';

    case 'status_changed':
      return 'Status Update';

    case 'spec_updated':
      return 'Spec Updated';

    default:
      return 'Notification';
  }
};

function NotificationCard({ notification }: { notification: INotification }) {
  const { icon: Icon, color, bg } = getNotificationIcon(notification.type);

  return (
    <Card
      className={cn(
        'border transition-all hover:shadow-md',
        !notification.read && 'border-l-4 border-l-primary bg-primary/5',
      )}
      padding="md"
    >
      <div className="flex gap-4">
        <div
          className={cn(
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
            bg,
          )}
        >
          <Icon className={cn('h-5 w-5', color)} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <Badge variant={notification.read ? 'gray' : 'blue'} size="sm">
                {getNotificationTypeLabel(notification.type)}
              </Badge>
              {!notification.read && (
                <span className="h-2 w-2 rounded-full bg-primary" />
              )}
            </div>
            <span className="shrink-0 text-xs text-muted-foreground">
              {formatRelativeTime(notification.createdAt)}
            </span>
          </div>

          <h3 className="mb-1 font-medium text-foreground">
            {notification.title}
          </h3>
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {notification.message}
          </p>

          {notification.link && (
            <Link
              href={notification.link}
              className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              View details
              <ArrowRight className="h-3 w-3" />
            </Link>
          )}
        </div>
      </div>
    </Card>
  );
}

function NotificationsList({
  notifications,
  emptyMessage,
}: {
  notifications: INotification[];
  emptyMessage: string;
}) {
  if (notifications.length === 0) {
    return (
      <Card className="border py-12 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <Bell className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="mb-1 font-medium text-foreground">No notifications</h3>
        <p className="text-sm text-muted-foreground">{emptyMessage}</p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {notifications.map(notification => (
        <NotificationCard key={notification.id} notification={notification} />
      ))}
    </div>
  );
}

function NotificationsContent() {
  const { user } = useAuthStore();

  const { data: notifications = [] } = useQuery({
    queryKey: [QueryKeys.NOTIFICATIONS],
    queryFn: async () => {
      return mockNotifications.filter(n => n.userId === user?.id);
    },
    enabled: !!user,
  });

  const unreadNotifications = notifications.filter(n => !n.read);
  const unreadCount = unreadNotifications.length;

  return (
    <main className="p-6">
      <div className="mb-6 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-2">
            <Bell className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Notifications
            </h1>
            <p className="text-sm text-muted-foreground">
              Stay updated on your feature requests and team activity
            </p>
          </div>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" className="gap-2">
            <CheckCheck className="h-4 w-4" />
            Mark all as read
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <Card padding="sm" className="border">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Bell className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold">{notifications.length}</div>
              <div className="text-xs text-muted-foreground">Total</div>
            </div>
          </div>
        </Card>
        <Card padding="sm" className="border">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
              <MessageSquare className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {unreadCount}
              </div>
              <div className="text-xs text-muted-foreground">Unread</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <TabsRoot defaultValue="all">
        <TabsList className="mb-6">
          <TabsTrigger value="all" badge={notifications.length}>
            All
          </TabsTrigger>
          <TabsTrigger value="unread" badge={unreadCount}>
            Unread
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <NotificationsList
            notifications={notifications}
            emptyMessage="No notifications to show"
          />
        </TabsContent>

        <TabsContent value="unread">
          <NotificationsList
            notifications={unreadNotifications}
            emptyMessage="You're all caught up!"
          />
        </TabsContent>
      </TabsRoot>
    </main>
  );
}

export default function NotificationsPage() {
  return <NotificationsContent />;
}

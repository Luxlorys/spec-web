'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
  Bell,
  Check,
  CheckCheck,
  MessageSquare,
  FileText,
  Sparkles,
  RefreshCw,
  ArrowRight,
} from 'lucide-react';
import { AuthGuard } from 'shared/lib/auth-guard';
import { Button, Card, Badge } from 'shared/ui';
import { mockNotifications } from 'shared/lib/mock-data';
import { useAuthStore } from 'shared/store';
import { QueryKeys } from 'shared/constants';
import { formatRelativeTime } from 'shared/lib';
import { cn } from 'shared/lib';
import { NotificationType, INotification } from 'shared/types';

type TabFilter = 'all' | 'unread' | 'read';

const tabs: { id: TabFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'unread', label: 'Unread' },
  { id: 'read', label: 'Read' },
];

const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case 'feature_created':
      return { icon: Sparkles, color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-900/30' };
    case 'spec_generated':
      return { icon: FileText, color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/30' };
    case 'question_asked':
      return { icon: MessageSquare, color: 'text-orange-500', bg: 'bg-orange-100 dark:bg-orange-900/30' };
    case 'question_answered':
      return { icon: MessageSquare, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30' };
    case 'status_changed':
      return { icon: RefreshCw, color: 'text-yellow-500', bg: 'bg-yellow-100 dark:bg-yellow-900/30' };
    case 'spec_updated':
      return { icon: FileText, color: 'text-indigo-500', bg: 'bg-indigo-100 dark:bg-indigo-900/30' };
    default:
      return { icon: Bell, color: 'text-gray-500', bg: 'bg-gray-100 dark:bg-gray-800' };
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
        <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-full', bg)}>
          <Icon className={cn('h-5 w-5', color)} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <Badge
                variant={notification.read ? 'gray' : 'blue'}
                size="sm"
              >
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

          <h3 className="mb-1 font-medium text-foreground">{notification.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{notification.message}</p>

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

function NotificationsContent() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<TabFilter>('all');

  const { data: notifications = [] } = useQuery({
    queryKey: [QueryKeys.NOTIFICATIONS],
    queryFn: async () => {
      return mockNotifications.filter(n => n.userId === user?.id);
    },
    enabled: !!user,
  });

  const filteredNotifications = notifications.filter(n => {
    if (activeTab === 'unread') return !n.read;
    if (activeTab === 'read') return n.read;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const getTabCount = (tab: TabFilter): number => {
    if (tab === 'all') return notifications.length;
    if (tab === 'unread') return notifications.filter(n => !n.read).length;
    return notifications.filter(n => n.read).length;
  };

  return (
    <main className="p-6">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="mb-1 text-2xl font-bold text-foreground">Notifications</h1>
          <p className="text-sm text-muted-foreground">
            Stay updated on your feature requests and team activity
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" className="gap-2">
            <CheckCheck className="h-4 w-4" />
            Mark all as read
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
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
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
              <MessageSquare className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">{unreadCount}</div>
              <div className="text-xs text-muted-foreground">Unread</div>
            </div>
          </div>
        </Card>
        <Card padding="sm" className="border">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
              <Check className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {notifications.length - unreadCount}
              </div>
              <div className="text-xs text-muted-foreground">Read</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="flex items-center gap-1 rounded-lg border bg-muted/50 p-1 w-fit">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                activeTab === tab.id
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {tab.label} ({getTabCount(tab.id)})
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      {filteredNotifications.length > 0 ? (
        <div className="space-y-3">
          {filteredNotifications.map(notification => (
            <NotificationCard key={notification.id} notification={notification} />
          ))}
        </div>
      ) : (
        <Card className="border py-12 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <Bell className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="mb-1 font-medium text-foreground">No notifications</h3>
          <p className="text-sm text-muted-foreground">
            {activeTab === 'unread'
              ? "You're all caught up!"
              : activeTab === 'read'
                ? 'No read notifications yet'
                : 'No notifications to show'}
          </p>
        </Card>
      )}
    </main>
  );
}

export default function NotificationsPage() {
  return (
    <AuthGuard>
      <NotificationsContent />
    </AuthGuard>
  );
}

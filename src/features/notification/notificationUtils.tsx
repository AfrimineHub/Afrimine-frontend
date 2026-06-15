import { Bell } from 'lucide-react';
import type { DashboardNotification } from '@/features/dashboard/types';
import { formatRelativeTime } from '@/lib/utils/formatRelativeTime';

export interface NotificationListItem {
  id: string;
  type: string;
  title: string;
  desc: string;
  time: string;
  unread: boolean;
  priority: string | null;
  icon: React.ReactNode;
  color: string;
}

export function mapDashboardNotificationToListItem(
  notification: DashboardNotification,
): NotificationListItem {
  return {
    id: notification.id,
    type: 'System Alerts',
    title: notification.title ?? 'Notification',
    desc: notification.message ?? '',
    time: formatRelativeTime(notification.createdAt) || '',
    unread: !notification.isRead,
    priority: null,
    icon: <Bell size={18} />,
    color: 'text-slate-500 bg-slate-50',
  };
}

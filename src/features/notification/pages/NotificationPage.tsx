import { useMemo, useState } from 'react';
import NotificationTabs from '../components/NotificationTabs';
import NotificationList from '../components/NotificationList';
import { NoNotification } from '../components/EmptyNotificationState';
import {
  useDashboardNotificationsQuery,
  useMarkNotificationsReadMutation,
} from '@/features/dashboard/queries';
import { mapDashboardNotificationToListItem } from '../notificationUtils';
import { getApiErrorMessage } from '@/lib/api/errors';

const TABS = ['All', 'Disputes', 'KYC Pending', 'Escrow', 'System Alerts'];

const NotificationsPage = () => {
  const [activeTab, setActiveTab] = useState('All');
  const notificationsQuery = useDashboardNotificationsQuery();
  const markReadMutation = useMarkNotificationsReadMutation();

  const notifications = useMemo(
    () => (notificationsQuery.data ?? []).map(mapDashboardNotificationToListItem),
    [notificationsQuery.data],
  );

  const filteredNotifications = useMemo(() => {
    return activeTab === 'All'
      ? notifications
      : notifications.filter((n) => n.type === activeTab);
  }, [activeTab, notifications]);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const loadError =
    notificationsQuery.isError &&
    getApiErrorMessage(notificationsQuery.error, 'Could not load notifications.');

  if (!notificationsQuery.isLoading && notifications.length === 0) {
    return <NoNotification />;
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      <main className="max-w-5xl mx-auto py-10 px-6">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-1">Notifications</h1>
            <p className="text-slate-500 font-medium">
              {notificationsQuery.isLoading ? '…' : unreadCount} Unread notification
              {unreadCount !== 1 ? 's' : ''}
            </p>
          </div>

          {unreadCount > 0 ? (
            <button
              type="button"
              onClick={() => markReadMutation.mutate()}
              disabled={markReadMutation.isPending}
              className="text-sm font-semibold text-yellow-700 hover:text-yellow-800 disabled:opacity-50"
            >
              Mark all as read
            </button>
          ) : null}
        </div>

        {loadError ? (
          <p className="mb-6 text-sm text-red-600 rounded-lg border border-red-100 bg-red-50 px-4 py-3" role="alert">
            {loadError}
          </p>
        ) : null}

        <NotificationTabs
          tabs={TABS}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {notificationsQuery.isLoading ? (
          <div className="space-y-3 py-6" aria-busy="true">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <NotificationList notifications={filteredNotifications} />
        )}
      </main>
    </div>
  );
};

export default NotificationsPage;

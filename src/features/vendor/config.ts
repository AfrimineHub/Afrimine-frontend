const trimSlash = (path: string) => path.replace(/^\/+|\/+$/g, '');

export const vendorDashboardPaths = {
  summary: trimSlash(import.meta.env.VITE_DASHBOARD_SUMMARY_PATH ?? 'dashboard/summary'),
  notifications: trimSlash(import.meta.env.VITE_DASHBOARD_NOTIFICATIONS_PATH ?? 'dashboard/notifications'),
  notificationsRead: trimSlash(
    import.meta.env.VITE_DASHBOARD_NOTIFICATIONS_READ_PATH ?? 'dashboard/notifications/read',
  ),
} as const;

export const VENDOR_DASHBOARD_SUMMARY_QUERY_KEY = ['vendor', 'dashboard', 'summary'] as const;
export const VENDOR_DASHBOARD_NOTIFICATIONS_QUERY_KEY = ['vendor', 'dashboard', 'notifications'] as const;

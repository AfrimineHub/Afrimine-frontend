const trimSlash = (path: string) => path.replace(/^\/+|\/+$/g, '');

export const dashboardPaths = {
  summary: trimSlash(import.meta.env.VITE_DASHBOARD_SUMMARY_PATH ?? 'dashboard/summary'),
  notifications: trimSlash(import.meta.env.VITE_DASHBOARD_NOTIFICATIONS_PATH ?? 'dashboard/notifications'),
  notificationsRead: trimSlash(
    import.meta.env.VITE_DASHBOARD_NOTIFICATIONS_READ_PATH ?? 'dashboard/notifications/read',
  ),
  recommended: trimSlash(import.meta.env.VITE_DASHBOARD_RECOMMENDED_PATH ?? 'dashboard/recommended'),
  savedListings: trimSlash(import.meta.env.VITE_DASHBOARD_SAVED_LISTINGS_PATH ?? 'dashboard/saved-listings'),
  subscription: trimSlash(import.meta.env.VITE_DASHBOARD_SUBSCRIPTION_PATH ?? 'dashboard/subscription'),
} as const;

export const DASHBOARD_SUBSCRIPTION_QUERY_KEY = ['dashboard', 'subscription'] as const;

export const DASHBOARD_SUMMARY_QUERY_KEY = ['dashboard', 'summary'] as const;
export const DASHBOARD_NOTIFICATIONS_QUERY_KEY = ['dashboard', 'notifications'] as const;
export const DASHBOARD_RECOMMENDED_QUERY_KEY = ['dashboard', 'recommended'] as const;
export const DASHBOARD_SAVED_LISTINGS_QUERY_KEY = ['dashboard', 'saved-listings'] as const;

export type { DashboardSummary, DashboardNotification } from '@/features/dashboard/types';

export { dashboardPaths as vendorDashboardPaths } from '@/features/dashboard/config';
export {
  DASHBOARD_SUMMARY_QUERY_KEY as VENDOR_DASHBOARD_SUMMARY_QUERY_KEY,
  DASHBOARD_NOTIFICATIONS_QUERY_KEY as VENDOR_DASHBOARD_NOTIFICATIONS_QUERY_KEY,
} from '@/features/dashboard/config';

export {
  vendorDashboardApiPaths,
  VENDOR_DASHBOARD_QUERY_KEY,
  VENDOR_SUBSCRIPTION_QUERY_KEY,
  VENDOR_REVENUE_SUMMARY_QUERY_KEY,
  VENDOR_LISTING_PERFORMANCE_QUERY_KEY,
  VENDOR_QUOTES_QUERY_KEY,
  VENDOR_ORDERS_QUERY_KEY,
  VENDOR_PAYOUTS_SUMMARY_QUERY_KEY,
} from '@/features/vendor/dashboardConfig';

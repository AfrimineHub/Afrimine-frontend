/**
 * Vendor dashboard API paths.
 * 
 */
const trimSlash = (path: string) => path.replace(/^\/+|\/+$/g, '');

export const vendorDashboardApiPaths = {
  dashboard: trimSlash(import.meta.env.VITE_VENDOR_DASHBOARD_PATH ?? 'vendor/dashboard'),
  subscription: trimSlash(import.meta.env.VITE_DASHBOARD_SUBSCRIPTION_PATH ?? 'dashboard/subscription'),
  revenueSummary: trimSlash(import.meta.env.VITE_VENDOR_REVENUE_SUMMARY_PATH ?? 'vendor/revenue/summary'),
  listingPerformance: trimSlash(
    import.meta.env.VITE_VENDOR_LISTING_PERFORMANCE_PATH ?? 'vendor/dashboard/listings/performance',
  ),
  quotes: trimSlash(import.meta.env.VITE_VENDOR_QUOTES_PATH ?? 'vendor/quotes'),
  orders: trimSlash(import.meta.env.VITE_VENDOR_ORDERS_PATH ?? 'vendor/orders'),
  payoutsSummary: trimSlash(import.meta.env.VITE_VENDOR_PAYOUTS_SUMMARY_PATH ?? 'vendor/payout/summary'),
  openBuyerRfqs: trimSlash(import.meta.env.VITE_VENDOR_OPEN_RFQS_PATH ?? 'rfqs'),
} as const;

export const VENDOR_DASHBOARD_QUERY_KEY = ['vendor', 'dashboard'] as const;
export const VENDOR_SUBSCRIPTION_QUERY_KEY = ['vendor', 'subscription'] as const;
export const VENDOR_REVENUE_SUMMARY_QUERY_KEY = ['vendor', 'revenue', 'summary'] as const;
export const VENDOR_LISTING_PERFORMANCE_QUERY_KEY = ['vendor', 'listings', 'performance'] as const;
export const VENDOR_QUOTES_QUERY_KEY = ['vendor', 'quotes'] as const;
export const VENDOR_ORDERS_QUERY_KEY = ['vendor', 'orders'] as const;
export const VENDOR_PAYOUTS_SUMMARY_QUERY_KEY = ['vendor', 'payout', 'summary'] as const;
export const VENDOR_OPEN_BUYER_RFQS_QUERY_KEY = ['vendor', 'open-buyer-rfqs'] as const;

/**
 * Admin API paths (relative to VITE_API_BASE_URL).
 * All routes require super-admin authentication unless noted otherwise.
 */
const trimSlash = (path: string) => path.replace(/^\/+|\/+$/g, '');

export const adminApiPaths = {
  dashboard: trimSlash(import.meta.env.VITE_ADMIN_DASHBOARD_PATH ?? 'admin/dashboard'),
  users: trimSlash(import.meta.env.VITE_ADMIN_USERS_PATH ?? 'admin/users'),
  listings: trimSlash(import.meta.env.VITE_ADMIN_LISTINGS_PATH ?? 'admin/listings'),
  quotes: trimSlash(import.meta.env.VITE_ADMIN_QUOTES_PATH ?? 'admin/quotes'),
  orders: trimSlash(import.meta.env.VITE_ADMIN_ORDERS_PATH ?? 'admin/orders'),
  revenue: trimSlash(import.meta.env.VITE_ADMIN_REVENUE_PATH ?? 'admin/revenue'),
  revenueTransactions: trimSlash(
    import.meta.env.VITE_ADMIN_REVENUE_TRANSACTIONS_PATH ?? 'admin/revenue/transactions',
  ),
  withdrawals: trimSlash(import.meta.env.VITE_ADMIN_WITHDRAWALS_PATH ?? 'admin/withdrawals'),
  kyc: trimSlash(import.meta.env.VITE_ADMIN_KYC_PATH ?? 'admin/kyc'),
  escrow: trimSlash(import.meta.env.VITE_ADMIN_ESCROW_PATH ?? 'admin/escrow'),
  milestones: trimSlash(import.meta.env.VITE_ADMIN_MILESTONES_PATH ?? 'admin/milestones'),
} as const;

export const ADMIN_DASHBOARD_QUERY_KEY = ['admin', 'dashboard'] as const;
export const ADMIN_USERS_QUERY_KEY = ['admin', 'users'] as const;
export const ADMIN_USERS_STATS_QUERY_KEY = ['admin', 'users', 'stats'] as const;
export const ADMIN_LISTINGS_QUERY_KEY = ['admin', 'listings'] as const;
export const ADMIN_LISTING_COUNTS_QUERY_KEY = ['admin', 'listings', 'counts'] as const;
export const ADMIN_QUOTES_QUERY_KEY = ['admin', 'quotes'] as const;
export const ADMIN_ORDERS_QUERY_KEY = ['admin', 'orders'] as const;
export const ADMIN_ORDERS_SUMMARY_QUERY_KEY = ['admin', 'orders', 'summary'] as const;
export const ADMIN_ORDER_QUERY_KEY = ['admin', 'order'] as const;
export const ADMIN_REVENUE_SUMMARY_QUERY_KEY = ['admin', 'revenue', 'summary'] as const;
export const ADMIN_REVENUE_TRANSACTIONS_QUERY_KEY = ['admin', 'revenue', 'transactions'] as const;
export const ADMIN_WITHDRAWALS_QUERY_KEY = ['admin', 'withdrawals'] as const;
export const ADMIN_KYC_QUEUE_QUERY_KEY = ['admin', 'kyc', 'queue'] as const;
export const ADMIN_KYC_DETAIL_QUERY_KEY = ['admin', 'kyc', 'detail'] as const;
export const ADMIN_ESCROW_QUERY_KEY = ['admin', 'escrow'] as const;
export const ADMIN_MILESTONES_QUERY_KEY = ['admin', 'milestones'] as const;
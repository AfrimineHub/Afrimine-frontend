/**
 * Buyer dashboard API paths.
 * .
 */
const trimSlash = (path: string) => path.replace(/^\/+|\/+$/g, '');

export const buyerDashboardApiPaths = {
  dashboard: trimSlash(import.meta.env.VITE_BUYER_DASHBOARD_PATH ?? 'buyer/dashboard'),
  orders: trimSlash(import.meta.env.VITE_BUYER_ORDERS_PATH ?? 'buyer/orders'),
  rfqs: trimSlash(import.meta.env.VITE_BUYER_RFQS_PATH ?? 'buyer/rfqs'),
  listings: trimSlash(import.meta.env.VITE_MARKETPLACE_LISTINGS_PATH ?? 'listings'),
  listingCategories: trimSlash(import.meta.env.VITE_MARKETPLACE_CATEGORIES_PATH ?? 'listings/categories'),
  marketTrends: trimSlash(import.meta.env.VITE_DASHBOARD_MARKET_TRENDS_PATH ?? 'dashboard/market-trends'),
  investmentInsights: trimSlash(
    import.meta.env.VITE_DASHBOARD_INVESTMENT_INSIGHTS_PATH ?? 'dashboard/investment-insights',
  ),
  conversations: trimSlash(import.meta.env.VITE_MESSAGES_CONVERSATIONS_PATH ?? 'messages/conversations'),
} as const;

export const BUYER_DASHBOARD_QUERY_KEY = ['buyer', 'dashboard'] as const;
export const BUYER_ORDERS_QUERY_KEY = ['buyer', 'orders'] as const;
export const BUYER_RFQS_QUERY_KEY = ['buyer', 'rfqs'] as const;
export const BUYER_RFQ_QUOTES_QUERY_KEY = ['buyer', 'rfqs', 'quotes'] as const;
export const MARKETPLACE_LISTINGS_QUERY_KEY = ['marketplace', 'listings'] as const;
export const MARKETPLACE_LISTING_QUERY_KEY = ['marketplace', 'listing'] as const;
export const MARKETPLACE_CATEGORIES_QUERY_KEY = ['marketplace', 'categories'] as const;
export const BUYER_MARKET_TRENDS_QUERY_KEY = ['buyer', 'market-trends'] as const;
export const BUYER_INVESTMENT_INSIGHTS_QUERY_KEY = ['buyer', 'investment-insights'] as const;
export const BUYER_CONVERSATIONS_QUERY_KEY = ['buyer', 'conversations'] as const;
export const BUYER_MESSAGES_QUERY_KEY = ['buyer', 'messages'] as const;
export const BUYER_CONVERSATION_CONTEXT_QUERY_KEY = ['buyer', 'conversation-context'] as const;

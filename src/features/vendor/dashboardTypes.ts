import type { DashboardNotification } from '@/features/dashboard/types';

export type CurrencyCode = 'NGN' | 'USD';

/** Matches VendorDashboardStatsDto */
export interface VendorDashboardStats {
  totalListingsCount: number;
  activeQuotesCount: number;
  ongoingOrdersCount: number;
  unreadMessagesCount: number;
  pendingPayoutAmount: number;
  successfulOrdersCount: number;
}

/** Matches SubscriptionSummaryDto */
export interface VendorSubscription {
  planId: string | null;
  planName: string | null;
  listingsLimit: number;
  listingsUsed: number;
  listingsRemaining: number;
  usagePercent: number;
  canUpgrade: boolean;
  renewsAt: string | null;
}

/** Matches RevenueSummaryDto */
export interface VendorRevenueSummary {
  currency: string | null;
  totalInflow: number;
  totalInflowChangePercent: number | null;
  thisMonthInflow: number;
  thisMonthChangePercent: number | null;
}

/** Matches ListingPerformanceItemDto */
export interface ListingPerformanceItem {
  listingId: string;
  title: string | null;
  viewsCount: number;
  savesCount: number;
  inquiriesCount: number;
}

export interface ListingPerformanceQueryParams {
  page?: number;
  pageSize?: number;
}

export interface ListingPerformancePage {
  items: ListingPerformanceItem[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

/** Matches PayoutItemDto */
export interface VendorPayoutItem {
  id: string;
  amount: number;
  currency: string | null;
  status: string | null;
  reference: string | null;
  processedAt: string | null;
  createdAt: string;
}

/** Matches PayoutSummaryDto */
export interface VendorPayoutSummary {
  currency: string | null;
  pendingAmount: number;
  totalPaid: number;
  recentPayouts: VendorPayoutItem[];
}

/** Matches VendorQuoteDto */
export interface VendorQuoteListItem {
  id: string;
  listingId: string;
  listingTitle: string | null;
  buyerName: string | null;
  amount: number;
  currency: string | null;
  status: string | null;
  note: string | null;
  expiresAt: string | null;
  createdAt: string;
}

export interface VendorQuotesQueryParams {
  Page?: number;
  PageSize?: number;
  Status?: number;
}

export interface VendorQuotesPage {
  items: VendorQuoteListItem[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

/** Matches VendorOrderDto */
export interface VendorOrderListItem {
  id: string;
  listingId: string;
  listingTitle: string | null;
  buyerName: string | null;
  status: string | null;
  createdAt: string;
  updatedAt: string | null;
}

export interface VendorOrdersQueryParams {
  Page?: number;
  PageSize?: number;
  Status?: number;
}

export interface VendorOrdersPage {
  items: VendorOrderListItem[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

/** Matches VendorDashboardDto */
export interface VendorDashboard {
  subscription: VendorSubscription;
  revenue: VendorRevenueSummary;
  stats: VendorDashboardStats;
  listingPerformance: ListingPerformanceItem[];
  recentNotifications: DashboardNotification[];
}

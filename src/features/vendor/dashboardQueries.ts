import { useQuery } from '@tanstack/react-query';
import {
  fetchVendorDashboard,
  fetchVendorListingPerformance,
  fetchVendorOrders,
  fetchVendorPayoutSummary,
  fetchVendorQuotes,
  fetchVendorRevenueSummary,
  fetchVendorSubscription,
  fetchOpenBuyerRfqs,
} from '@/features/vendor/dashboardApi';
import {
  VENDOR_DASHBOARD_QUERY_KEY,
  VENDOR_LISTING_PERFORMANCE_QUERY_KEY,
  VENDOR_ORDERS_QUERY_KEY,
  VENDOR_OPEN_BUYER_RFQS_QUERY_KEY,
  VENDOR_PAYOUTS_SUMMARY_QUERY_KEY,
  VENDOR_QUOTES_QUERY_KEY,
  VENDOR_REVENUE_SUMMARY_QUERY_KEY,
  VENDOR_SUBSCRIPTION_QUERY_KEY,
} from '@/features/vendor/dashboardConfig';
import type {
  ListingPerformanceQueryParams,
  VendorOrdersQueryParams,
  VendorQuotesQueryParams,
} from '@/features/vendor/dashboardTypes';
import type { BuyerRfqsQueryParams } from '@/features/buyer/dashboardTypes';

export function useVendorDashboardQuery() {
  return useQuery({
    queryKey: VENDOR_DASHBOARD_QUERY_KEY,
    queryFn: fetchVendorDashboard,
    staleTime: 60 * 1000,
  });
}

export function useVendorSubscriptionQuery() {
  const isGatingFrozen = true as boolean;

  if (isGatingFrozen) {
    return {
      data: {
        id: 'frozen-sub',
        planName: 'Pro Plan',
        status: 'ACTIVE',
      },
      isLoading: false,
      isError: false,
      error: null,
      refetch: async () => {},
    } as unknown as ReturnType<typeof useQuery>;
  }
  
  return useQuery({
    queryKey: VENDOR_SUBSCRIPTION_QUERY_KEY,
    queryFn: fetchVendorSubscription,
    staleTime: 5 * 60 * 1000,
  });
}

export function useVendorRevenueSummaryQuery() {
  return useQuery({
    queryKey: VENDOR_REVENUE_SUMMARY_QUERY_KEY,
    queryFn: fetchVendorRevenueSummary,
    staleTime: 60 * 1000,
  });
}

export function useVendorListingPerformanceQuery(params: ListingPerformanceQueryParams = {}) {
  return useQuery({
    queryKey: [...VENDOR_LISTING_PERFORMANCE_QUERY_KEY, params],
    queryFn: () => fetchVendorListingPerformance(params),
    staleTime: 60 * 1000,
  });
}

export function useVendorPayoutSummaryQuery() {
  return useQuery({
    queryKey: VENDOR_PAYOUTS_SUMMARY_QUERY_KEY,
    queryFn: fetchVendorPayoutSummary,
    staleTime: 60 * 1000,
  });
}

export function useVendorQuotesQuery(params: VendorQuotesQueryParams = {}) {
  return useQuery({
    queryKey: [...VENDOR_QUOTES_QUERY_KEY, params],
    queryFn: () => fetchVendorQuotes(params),
    staleTime: 60 * 1000,
  });
}

export function useVendorOrdersQuery(
  params: VendorOrdersQueryParams = {},
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: [...VENDOR_ORDERS_QUERY_KEY, params],
    queryFn: () => fetchVendorOrders(params),
    staleTime: 60 * 1000,
    enabled: options?.enabled ?? true,
  });
}

export function useOpenBuyerRfqsQuery(params: BuyerRfqsQueryParams = {}) {
  return useQuery({
    queryKey: [...VENDOR_OPEN_BUYER_RFQS_QUERY_KEY, params],
    queryFn: () => fetchOpenBuyerRfqs(params),
    staleTime: 60 * 1000,
  });
}

import { apiClient } from '@/lib/api/client';
import { extractApiData } from '@/lib/api/extractApiData';
import { vendorDashboardApiPaths } from '@/features/vendor/dashboardConfig';
import type {
  ListingPerformancePage,
  ListingPerformanceQueryParams,
  VendorDashboard,
  VendorOrderListItem,
  VendorOrdersPage,
  VendorOrdersQueryParams,
  VendorPayoutSummary,
  VendorQuoteListItem,
  VendorQuotesPage,
  VendorQuotesQueryParams,
  VendorRevenueSummary,
  VendorSubscription,
} from '@/features/vendor/dashboardTypes';
import type {
  BuyerRfqListItem,
  BuyerRfqsPage,
  BuyerRfqsQueryParams,
} from '@/features/buyer/dashboardTypes';

type PagedResult<T> = {
  items?: T[];
  page?: number;
  pageSize?: number;
  totalCount?: number;
  totalPages?: number;
};

function normalizePagedResult<T>(
  extracted: PagedResult<T> | T[],
  params: { page?: number; pageSize?: number },
): { items: T[]; page: number; pageSize: number; totalCount: number; totalPages: number } {
  if (Array.isArray(extracted)) {
    return {
      items: extracted,
      page: params.page ?? 1,
      pageSize: params.pageSize ?? 10,
      totalCount: extracted.length,
      totalPages: 1,
    };
  }

  const items = extracted.items ?? [];
  return {
    items,
    page: extracted.page ?? params.page ?? 1,
    pageSize: extracted.pageSize ?? params.pageSize ?? 10,
    totalCount: extracted.totalCount ?? items.length,
    totalPages: extracted.totalPages ?? 1,
  };
}

export async function fetchVendorDashboard(): Promise<VendorDashboard> {
  const { data } = await apiClient.get(vendorDashboardApiPaths.dashboard);
  const extracted = extractApiData<VendorDashboard>(data);
  return {
    ...extracted,
    listingPerformance: extracted.listingPerformance ?? [],
    recentNotifications: extracted.recentNotifications ?? [],
  };
}

export async function fetchVendorSubscription(): Promise<VendorSubscription> {
  const { data } = await apiClient.get(vendorDashboardApiPaths.subscription);
  return extractApiData<VendorSubscription>(data);
}

export async function fetchVendorRevenueSummary(): Promise<VendorRevenueSummary> {
  const { data } = await apiClient.get(vendorDashboardApiPaths.revenueSummary);
  return extractApiData<VendorRevenueSummary>(data);
}

export async function fetchVendorListingPerformance(
  params: ListingPerformanceQueryParams = {},
): Promise<ListingPerformancePage> {
  const { data } = await apiClient.get(vendorDashboardApiPaths.listingPerformance, { params });
  const extracted = extractApiData<PagedResult<ListingPerformancePage['items'][number]> | ListingPerformancePage['items']>(data);
  const page = normalizePagedResult(extracted, params);
  return page;
}

export async function fetchVendorPayoutSummary(): Promise<VendorPayoutSummary> {
  const { data } = await apiClient.get(vendorDashboardApiPaths.payoutsSummary);
  const extracted = extractApiData<VendorPayoutSummary>(data);
  return {
    ...extracted,
    recentPayouts: extracted.recentPayouts ?? [],
  };
}

export async function fetchVendorQuotes(
  params: VendorQuotesQueryParams = {},
): Promise<VendorQuotesPage> {
  const { data } = await apiClient.get(vendorDashboardApiPaths.quotes, { params });
  const extracted = extractApiData<PagedResult<VendorQuoteListItem> | VendorQuoteListItem[]>(data);
  const page = normalizePagedResult(extracted, {
    page: params.Page,
    pageSize: params.PageSize,
  });
  return page;
}

export async function fetchVendorOrders(
  params: VendorOrdersQueryParams = {},
): Promise<VendorOrdersPage> {
  const { data } = await apiClient.get(vendorDashboardApiPaths.orders, { params });
  const extracted = extractApiData<PagedResult<VendorOrderListItem> | VendorOrderListItem[]>(data);
  const page = normalizePagedResult(extracted, {
    page: params.Page,
    pageSize: params.PageSize,
  });
  return page;
}

/** Open buyer RFQs marketplace — vendors browse and message buyers. */
export async function fetchOpenBuyerRfqs(
  params: BuyerRfqsQueryParams = {},
): Promise<BuyerRfqsPage> {
  const { data } = await apiClient.get(vendorDashboardApiPaths.openBuyerRfqs, { params });
  const extracted = extractApiData<PagedResult<BuyerRfqListItem> | BuyerRfqListItem[]>(data);
  return normalizePagedResult(extracted, {
    page: params.Page,
    pageSize: params.PageSize,
  });
}

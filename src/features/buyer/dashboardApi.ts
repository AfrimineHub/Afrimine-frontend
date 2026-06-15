import { apiClient } from '@/lib/api/client';
import { extractApiData } from '@/lib/api/extractApiData';
import { buyerDashboardApiPaths } from '@/features/buyer/dashboardConfig';
import type {
  BuyerDashboard,
  BuyerOrderListItem,
  BuyerOrdersPage,
  BuyerOrdersQueryParams,
  BuyerRfqListItem,
  BuyerRfqQuote,
  BuyerRfqsPage,
  BuyerRfqsQueryParams,
  ConversationContext,
  ConversationListItem,
  ConversationsPage,
  ConversationsQueryParams,
  CreateBuyerRfqPayload,
  InvestmentInsightItem,
  ListingCategory,
  MarketplaceListing,
  MarketplaceListingsPage,
  MarketplaceListingsQueryParams,
  MarketTrendItem,
  MessageItem,
  MessagesPage,
  MessagesQueryParams,
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

export async function fetchBuyerDashboard(): Promise<BuyerDashboard> {
  const { data } = await apiClient.get(buyerDashboardApiPaths.dashboard);
  const extracted = extractApiData<BuyerDashboard>(data);
  return {
    ...extracted,
    marketTrends: extracted.marketTrends ?? [],
    investmentInsights: extracted.investmentInsights ?? [],
    recentNotifications: extracted.recentNotifications ?? [],
  };
}

export async function fetchBuyerOrders(
  params: BuyerOrdersQueryParams = {},
): Promise<BuyerOrdersPage> {
  const { data } = await apiClient.get(buyerDashboardApiPaths.orders, { params });
  const extracted = extractApiData<PagedResult<BuyerOrderListItem> | BuyerOrderListItem[]>(data);
  return normalizePagedResult(extracted, {
    page: params.Page,
    pageSize: params.PageSize,
  });
}

export async function fetchBuyerOrder(orderId: string): Promise<BuyerOrderListItem> {
  const { data } = await apiClient.get(`${buyerDashboardApiPaths.orders}/${orderId}`);
  return extractApiData<BuyerOrderListItem>(data);
}

export async function fetchBuyerRfqs(
  params: BuyerRfqsQueryParams = {},
): Promise<BuyerRfqsPage> {
  const { data } = await apiClient.get(buyerDashboardApiPaths.rfqs, { params });
  const extracted = extractApiData<PagedResult<BuyerRfqListItem> | BuyerRfqListItem[]>(data);
  return normalizePagedResult(extracted, {
    page: params.Page,
    pageSize: params.PageSize,
  });
}

export async function fetchBuyerRfq(rfqId: string): Promise<BuyerRfqListItem> {
  const { data } = await apiClient.get(`${buyerDashboardApiPaths.rfqs}/${rfqId}`);
  return extractApiData<BuyerRfqListItem>(data);
}

export async function createBuyerRfq(payload: CreateBuyerRfqPayload): Promise<BuyerRfqListItem> {
  const { data } = await apiClient.post(buyerDashboardApiPaths.rfqs, payload);
  return extractApiData<BuyerRfqListItem>(data);
}

export async function fetchBuyerRfqQuotes(rfqId: string): Promise<BuyerRfqQuote[]> {
  const { data } = await apiClient.get(`${buyerDashboardApiPaths.rfqs}/${rfqId}/quotes`);
  return extractApiData<BuyerRfqQuote[]>(data) ?? [];
}

export async function acceptBuyerRfqQuote(rfqId: string, quoteId: string): Promise<void> {
  await apiClient.post(`${buyerDashboardApiPaths.rfqs}/${rfqId}/quotes/${quoteId}/accept`);
}

export async function fetchMarketplaceListings(
  params: MarketplaceListingsQueryParams = {},
): Promise<MarketplaceListingsPage> {
  const { data } = await apiClient.get(buyerDashboardApiPaths.listings, { params });
  const extracted = extractApiData<PagedResult<MarketplaceListing> | MarketplaceListing[]>(data);
  return normalizePagedResult(extracted, params);
}

export async function fetchMarketplaceListing(listingId: string): Promise<MarketplaceListing> {
  const { data } = await apiClient.get(`${buyerDashboardApiPaths.listings}/${listingId}`);
  return extractApiData<MarketplaceListing>(data);
}

export async function fetchListingCategories(): Promise<ListingCategory[]> {
  const { data } = await apiClient.get(buyerDashboardApiPaths.listingCategories);
  return extractApiData<ListingCategory[]>(data) ?? [];
}

export async function fetchMarketTrends(): Promise<MarketTrendItem[]> {
  const { data } = await apiClient.get(buyerDashboardApiPaths.marketTrends);
  return extractApiData<MarketTrendItem[]>(data) ?? [];
}

export async function fetchInvestmentInsights(): Promise<InvestmentInsightItem[]> {
  const { data } = await apiClient.get(buyerDashboardApiPaths.investmentInsights);
  return extractApiData<InvestmentInsightItem[]>(data) ?? [];
}

export async function fetchConversations(
  params: ConversationsQueryParams = {},
): Promise<ConversationsPage> {
  const { data } = await apiClient.get(buyerDashboardApiPaths.conversations, { params });
  const extracted = extractApiData<PagedResult<ConversationListItem> | ConversationListItem[]>(data);
  return normalizePagedResult(extracted, params);
}

export async function fetchConversationMessages(
  conversationId: string,
  params: MessagesQueryParams = {},
): Promise<MessagesPage> {
  const { data } = await apiClient.get(
    `${buyerDashboardApiPaths.conversations}/${conversationId}/messages`,
    { params },
  );
  const extracted = extractApiData<PagedResult<MessageItem> | MessageItem[]>(data);
  return normalizePagedResult(extracted, params);
}

export async function sendConversationMessage(
  conversationId: string,
  body: string,
): Promise<MessageItem> {
  const { data } = await apiClient.post(
    `${buyerDashboardApiPaths.conversations}/${conversationId}/messages`,
    { body },
  );
  return extractApiData<MessageItem>(data);
}

export async function fetchConversationContext(
  conversationId: string,
): Promise<ConversationContext> {
  const { data } = await apiClient.get(
    `${buyerDashboardApiPaths.conversations}/${conversationId}/context`,
  );
  return extractApiData<ConversationContext>(data);
}

export async function confirmBuyerOrderDelivery(orderId: string): Promise<void> {
  await apiClient.patch(`${buyerDashboardApiPaths.orders}/${orderId}/confirm-delivery`);
}

export async function openBuyerOrderDispute(
  orderId: string,
  payload: { reason: string; details?: string },
): Promise<void> {
  await apiClient.post(`${buyerDashboardApiPaths.orders}/${orderId}/dispute`, payload);
}

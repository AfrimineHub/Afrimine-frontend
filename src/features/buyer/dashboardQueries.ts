import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  acceptBuyerRfqQuote,
  confirmBuyerOrderDelivery,
  createBuyerRfq,
  fetchBuyerDashboard,
  fetchBuyerOrder,
  fetchBuyerOrders,
  fetchBuyerRfq,
  fetchBuyerRfqQuotes,
  fetchBuyerRfqs,
  fetchConversationContext,
  fetchConversationMessages,
  fetchConversations,
  fetchInvestmentInsights,
  fetchListingCategories,
  fetchMarketTrends,
  fetchMarketplaceListing,
  fetchMarketplaceListings,
  markConversationRead,
  openBuyerOrderDispute,
  sendConversationMessage,
  startConversation,
} from '@/features/buyer/dashboardApi';
import {
  BUYER_CONVERSATION_CONTEXT_QUERY_KEY,
  BUYER_CONVERSATIONS_QUERY_KEY,
  BUYER_DASHBOARD_QUERY_KEY,
  BUYER_INVESTMENT_INSIGHTS_QUERY_KEY,
  BUYER_MARKET_TRENDS_QUERY_KEY,
  BUYER_MESSAGES_QUERY_KEY,
  BUYER_ORDERS_QUERY_KEY,
  BUYER_RFQ_QUOTES_QUERY_KEY,
  BUYER_RFQS_QUERY_KEY,
  MARKETPLACE_CATEGORIES_QUERY_KEY,
  MARKETPLACE_LISTING_QUERY_KEY,
  MARKETPLACE_LISTINGS_QUERY_KEY,
} from '@/features/buyer/dashboardConfig';
import type {
  BuyerOrdersQueryParams,
  BuyerRfqsQueryParams,
  CreateBuyerRfqPayload,
  MarketplaceListingsQueryParams,
  StartConversationPayload,
} from '@/features/buyer/dashboardTypes';

export function useBuyerDashboardQuery() {
  return useQuery({
    queryKey: BUYER_DASHBOARD_QUERY_KEY,
    queryFn: fetchBuyerDashboard,
    staleTime: 60 * 1000,
  });
}

export function useBuyerOrdersQuery(
  params: BuyerOrdersQueryParams = {},
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: [...BUYER_ORDERS_QUERY_KEY, params],
    queryFn: () => fetchBuyerOrders(params),
    staleTime: 60 * 1000,
    enabled: options?.enabled ?? true,
  });
}

export function useBuyerOrderQuery(orderId: string | undefined) {
  return useQuery({
    queryKey: [...BUYER_ORDERS_QUERY_KEY, orderId],
    queryFn: () => fetchBuyerOrder(orderId!),
    enabled: Boolean(orderId),
    staleTime: 60 * 1000,
  });
}

export function useBuyerRfqsQuery(params: BuyerRfqsQueryParams = {}) {
  return useQuery({
    queryKey: [...BUYER_RFQS_QUERY_KEY, params],
    queryFn: () => fetchBuyerRfqs(params),
    staleTime: 60 * 1000,
  });
}

export function useBuyerRfqQuery(rfqId: string | undefined) {
  return useQuery({
    queryKey: [...BUYER_RFQS_QUERY_KEY, rfqId],
    queryFn: () => fetchBuyerRfq(rfqId!),
    enabled: Boolean(rfqId),
    staleTime: 60 * 1000,
  });
}

export function useBuyerRfqQuotesQuery(rfqId: string | undefined) {
  return useQuery({
    queryKey: [...BUYER_RFQ_QUOTES_QUERY_KEY, rfqId],
    queryFn: () => fetchBuyerRfqQuotes(rfqId!),
    enabled: Boolean(rfqId),
    staleTime: 60 * 1000,
  });
}

export function useMarketplaceListingsQuery(params: MarketplaceListingsQueryParams = {}) {
  return useQuery({
    queryKey: [...MARKETPLACE_LISTINGS_QUERY_KEY, params],
    queryFn: () => fetchMarketplaceListings(params),
    staleTime: 60 * 1000,
  });
}

export function useMarketplaceListingQuery(listingId: string | undefined) {
  return useQuery({
    queryKey: [...MARKETPLACE_LISTING_QUERY_KEY, listingId],
    queryFn: () => fetchMarketplaceListing(listingId!),
    enabled: Boolean(listingId),
    staleTime: 60 * 1000,
  });
}

export function useListingCategoriesQuery() {
  return useQuery({
    queryKey: MARKETPLACE_CATEGORIES_QUERY_KEY,
    queryFn: fetchListingCategories,
    staleTime: 5 * 60 * 1000,
  });
}

export function useMarketTrendsQuery() {
  return useQuery({
    queryKey: BUYER_MARKET_TRENDS_QUERY_KEY,
    queryFn: fetchMarketTrends,
    staleTime: 5 * 60 * 1000,
  });
}

export function useInvestmentInsightsQuery() {
  return useQuery({
    queryKey: BUYER_INVESTMENT_INSIGHTS_QUERY_KEY,
    queryFn: fetchInvestmentInsights,
    staleTime: 5 * 60 * 1000,
  });
}

export function useConversationsQuery() {
  return useQuery({
    queryKey: BUYER_CONVERSATIONS_QUERY_KEY,
    queryFn: fetchConversations,
    staleTime: 30 * 1000,
  });
}

export function useConversationMessagesQuery(conversationId: string | undefined) {
  return useQuery({
    queryKey: [...BUYER_MESSAGES_QUERY_KEY, conversationId],
    queryFn: () => fetchConversationMessages(conversationId!),
    enabled: Boolean(conversationId),
    staleTime: 15 * 1000,
  });
}

export function useConversationContextQuery(conversationId: string | undefined) {
  return useQuery({
    queryKey: [...BUYER_CONVERSATION_CONTEXT_QUERY_KEY, conversationId],
    queryFn: () => fetchConversationContext(conversationId!),
    enabled: Boolean(conversationId),
    staleTime: 60 * 1000,
  });
}

export function useCreateBuyerRfqMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateBuyerRfqPayload) => createBuyerRfq(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BUYER_RFQS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: BUYER_DASHBOARD_QUERY_KEY });
    },
  });
}

export function useAcceptBuyerRfqQuoteMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ rfqId, quoteId }: { rfqId: string; quoteId: string }) =>
      acceptBuyerRfqQuote(rfqId, quoteId),
    onSuccess: (_data, { rfqId }) => {
      queryClient.invalidateQueries({ queryKey: [...BUYER_RFQ_QUOTES_QUERY_KEY, rfqId] });
      queryClient.invalidateQueries({ queryKey: BUYER_RFQS_QUERY_KEY });
    },
  });
}

export function useConfirmBuyerOrderDeliveryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string) => confirmBuyerOrderDelivery(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BUYER_ORDERS_QUERY_KEY });
    },
  });
}

export function useOpenBuyerOrderDisputeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderId,
      reason,
      details,
    }: {
      orderId: string;
      reason: string;
      details?: string;
    }) => openBuyerOrderDispute(orderId, { reason, details }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BUYER_ORDERS_QUERY_KEY });
    },
  });
}

export function useSendConversationMessageMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ conversationId, content }: { conversationId: string; content: string }) =>
      sendConversationMessage(conversationId, { content }),
    onSuccess: (_data, { conversationId }) => {
      queryClient.invalidateQueries({ queryKey: [...BUYER_MESSAGES_QUERY_KEY, conversationId] });
      queryClient.invalidateQueries({ queryKey: BUYER_CONVERSATIONS_QUERY_KEY });
    },
  });
}

export function useStartConversationMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: StartConversationPayload) => startConversation(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BUYER_CONVERSATIONS_QUERY_KEY });
    },
  });
}

export function useMarkConversationReadMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (conversationId: string) => markConversationRead(conversationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BUYER_CONVERSATIONS_QUERY_KEY });
    },
  });
}

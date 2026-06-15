import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  acceptRfqQuote,
  confirmOrderDelivery,
  createOrderCheckout,
  fetchAdminDispute,
  fetchAdminDisputes,
  fetchBuyerOrderEscrow,
  fetchVendorOrder,
  fetchVendorOrderEscrow,
  freezeAdminOrder,
  markVendorOrderDelivered,
  openOrderDispute,
  releaseAdminOrderFunds,
  requestVendorPayout,
  resolveAdminDispute,
  submitVendorQuote,
  verifyOrderCheckout,
} from '@/features/escrow/api';
import {
  ADMIN_DISPUTES_QUERY_KEY,
  ESCROW_DETAILS_QUERY_KEY,
} from '@/features/escrow/config';
import type {
  AdminDisputesQueryParams,
  AdminOrderActionPayload,
  OpenDisputePayload,
  OrderCheckoutRequest,
  RequestPayoutPayload,
  ResolveDisputePayload,
  SubmitVendorQuotePayload,
  VerifyOrderCheckoutParams,
} from '@/features/escrow/types';
import { BUYER_ORDERS_QUERY_KEY, BUYER_RFQS_QUERY_KEY } from '@/features/buyer/dashboardConfig';
import {
  VENDOR_ORDERS_QUERY_KEY,
  VENDOR_PAYOUTS_SUMMARY_QUERY_KEY,
  VENDOR_QUOTES_QUERY_KEY,
} from '@/features/vendor/dashboardConfig';

function invalidateOrderQueries(queryClient: ReturnType<typeof useQueryClient>, orderId?: string) {
  queryClient.invalidateQueries({ queryKey: BUYER_ORDERS_QUERY_KEY });
  queryClient.invalidateQueries({ queryKey: VENDOR_ORDERS_QUERY_KEY });
  if (orderId) {
    queryClient.invalidateQueries({ queryKey: [...ESCROW_DETAILS_QUERY_KEY, orderId] });
  }
}

export function useBuyerOrderEscrowQuery(orderId: string | undefined) {
  return useQuery({
    queryKey: [...ESCROW_DETAILS_QUERY_KEY, 'buyer', orderId],
    queryFn: () => fetchBuyerOrderEscrow(orderId!),
    enabled: Boolean(orderId),
    staleTime: 30 * 1000,
    retry: false,
  });
}

export function useVendorOrderEscrowQuery(orderId: string | undefined) {
  return useQuery({
    queryKey: [...ESCROW_DETAILS_QUERY_KEY, 'vendor', orderId],
    queryFn: () => fetchVendorOrderEscrow(orderId!),
    enabled: Boolean(orderId),
    staleTime: 30 * 1000,
    retry: false,
  });
}

export function useVendorOrderQuery(orderId: string | undefined) {
  return useQuery({
    queryKey: [...VENDOR_ORDERS_QUERY_KEY, orderId],
    queryFn: () => fetchVendorOrder(orderId!),
    enabled: Boolean(orderId),
    staleTime: 60 * 1000,
  });
}

export function useOrderCheckoutMutation() {
  return useMutation({
    mutationFn: ({ orderId, ...payload }: OrderCheckoutRequest & { orderId: string }) =>
      createOrderCheckout(orderId, payload),
    onSuccess: (result) => {
      if (result.checkoutUrl) {
        window.location.assign(result.checkoutUrl);
      }
    },
  });
}

export function useVerifyOrderCheckoutMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, ...params }: VerifyOrderCheckoutParams & { orderId: string }) =>
      verifyOrderCheckout(orderId, params),
    onSuccess: (_data, { orderId }) => {
      invalidateOrderQueries(queryClient, orderId);
    },
  });
}

export function useConfirmOrderDeliveryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string) => confirmOrderDelivery(orderId),
    onSuccess: (_data, orderId) => {
      invalidateOrderQueries(queryClient, orderId);
    },
  });
}

export function useOpenOrderDisputeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, ...payload }: OpenDisputePayload & { orderId: string }) =>
      openOrderDispute(orderId, payload),
    onSuccess: (_data, { orderId }) => {
      invalidateOrderQueries(queryClient, orderId);
    },
  });
}

export function useMarkVendorOrderDeliveredMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string) => markVendorOrderDelivered(orderId),
    onSuccess: (_data, orderId) => {
      invalidateOrderQueries(queryClient, orderId);
    },
  });
}

export function useSubmitVendorQuoteMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SubmitVendorQuotePayload) => submitVendorQuote(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VENDOR_QUOTES_QUERY_KEY });
    },
  });
}

export function useRequestPayoutMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: RequestPayoutPayload) => requestVendorPayout(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VENDOR_PAYOUTS_SUMMARY_QUERY_KEY });
    },
  });
}

export function useAcceptRfqQuoteMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ rfqId, quoteId }: { rfqId: string; quoteId: string }) =>
      acceptRfqQuote(rfqId, quoteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BUYER_RFQS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: BUYER_ORDERS_QUERY_KEY });
    },
  });
}

export function useAdminDisputesQuery(params: AdminDisputesQueryParams = {}) {
  return useQuery({
    queryKey: [...ADMIN_DISPUTES_QUERY_KEY, params],
    queryFn: async () => {
      try {
        return await fetchAdminDisputes(params);
      } catch {
        return { items: [], page: 1, pageSize: 10, totalCount: 0, totalPages: 0 };
      }
    },
    staleTime: 60 * 1000,
  });
}

export function useAdminDisputeQuery(disputeId: string | undefined) {
  return useQuery({
    queryKey: [...ADMIN_DISPUTES_QUERY_KEY, disputeId],
    queryFn: () => fetchAdminDispute(disputeId!),
    enabled: Boolean(disputeId),
    staleTime: 30 * 1000,
    retry: false,
  });
}

export function useResolveAdminDisputeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      disputeId,
      ...payload
    }: ResolveDisputePayload & { disputeId: string }) =>
      resolveAdminDispute(disputeId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_DISPUTES_QUERY_KEY });
    },
  });
}

export function useFreezeAdminOrderMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, ...payload }: AdminOrderActionPayload & { orderId: string }) =>
      freezeAdminOrder(orderId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_DISPUTES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: BUYER_ORDERS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: VENDOR_ORDERS_QUERY_KEY });
    },
  });
}

export function useReleaseAdminOrderFundsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, ...payload }: AdminOrderActionPayload & { orderId: string }) =>
      releaseAdminOrderFunds(orderId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_DISPUTES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: BUYER_ORDERS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: VENDOR_ORDERS_QUERY_KEY });
    },
  });
}

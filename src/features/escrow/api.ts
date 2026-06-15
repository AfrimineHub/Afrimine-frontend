import { apiClient } from '@/lib/api/client';
import { extractApiData } from '@/lib/api/extractApiData';
import { buyerDashboardApiPaths } from '@/features/buyer/dashboardConfig';
import { escrowApiPaths } from '@/features/escrow/config';
import type {
  AcceptQuoteResponse,
  AdminDisputeListItem,
  AdminDisputesPage,
  AdminDisputesQueryParams,
  AdminOrderActionPayload,
  EscrowDetails,
  OpenDisputePayload,
  OrderCheckoutRequest,
  OrderCheckoutResponse,
  RequestPayoutPayload,
  RequestPayoutResponse,
  ResolveDisputePayload,
  SubmitVendorQuotePayload,
  VerifyOrderCheckoutParams,
} from '@/features/escrow/types';
import type { BuyerOrderListItem } from '@/features/buyer/dashboardTypes';
import type { VendorOrderListItem } from '@/features/vendor/dashboardTypes';

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

export async function fetchBuyerOrderEscrow(orderId: string): Promise<EscrowDetails> {
  const { data } = await apiClient.get(`${escrowApiPaths.buyerOrderEscrow}/${orderId}/escrow`);
  return extractApiData<EscrowDetails>(data);
}

export async function fetchVendorOrderEscrow(orderId: string): Promise<EscrowDetails> {
  const { data } = await apiClient.get(`${escrowApiPaths.vendorOrders}/${orderId}/escrow`);
  return extractApiData<EscrowDetails>(data);
}

export async function createOrderCheckout(
  orderId: string,
  payload: OrderCheckoutRequest,
): Promise<OrderCheckoutResponse> {
  const { data } = await apiClient.post(
    `${escrowApiPaths.buyerOrderCheckout}/${orderId}/checkout`,
    payload,
  );
  return extractApiData<OrderCheckoutResponse>(data);
}

export async function verifyOrderCheckout(
  orderId: string,
  params: VerifyOrderCheckoutParams,
): Promise<EscrowDetails> {
  const { data } = await apiClient.get(
    `${escrowApiPaths.buyerOrderCheckoutVerify}/${orderId}/checkout/verify`,
    { params },
  );
  return extractApiData<EscrowDetails>(data);
}

export async function confirmOrderDelivery(orderId: string): Promise<BuyerOrderListItem> {
  const { data } = await apiClient.patch(
    `${escrowApiPaths.buyerOrderEscrow}/${orderId}/confirm-delivery`,
  );
  return extractApiData<BuyerOrderListItem>(data);
}

export async function openOrderDispute(
  orderId: string,
  payload: OpenDisputePayload,
): Promise<BuyerOrderListItem> {
  const { data } = await apiClient.post(
    `${escrowApiPaths.buyerOrderEscrow}/${orderId}/dispute`,
    payload,
  );
  return extractApiData<BuyerOrderListItem>(data);
}

export async function fetchVendorOrder(orderId: string): Promise<VendorOrderListItem> {
  const { data } = await apiClient.get(`${escrowApiPaths.vendorOrders}/${orderId}`);
  return extractApiData<VendorOrderListItem>(data);
}

export async function markVendorOrderDelivered(orderId: string): Promise<VendorOrderListItem> {
  const { data } = await apiClient.patch(
    `${escrowApiPaths.vendorOrders}/${orderId}/mark-delivered`,
  );
  return extractApiData<VendorOrderListItem>(data);
}

export async function submitVendorQuote(
  payload: SubmitVendorQuotePayload,
): Promise<{ id: string }> {
  const { data } = await apiClient.post(escrowApiPaths.vendorQuotes, payload);
  return extractApiData<{ id: string }>(data);
}

export async function requestVendorPayout(
  payload: RequestPayoutPayload,
): Promise<RequestPayoutResponse> {
  const { data } = await apiClient.post(escrowApiPaths.vendorPayoutRequest, payload);
  return extractApiData<RequestPayoutResponse>(data);
}

export async function acceptRfqQuote(
  rfqId: string,
  quoteId: string,
): Promise<AcceptQuoteResponse> {
  const { data } = await apiClient.post(
    `${buyerDashboardApiPaths.rfqs}/${rfqId}/quotes/${quoteId}/accept`,
  );

  try {
    return extractApiData<AcceptQuoteResponse>(data);
  } catch {
    return { orderId: '' };
  }
}

export async function fetchAdminDisputes(
  params: AdminDisputesQueryParams = {},
): Promise<AdminDisputesPage> {
  const { data } = await apiClient.get(escrowApiPaths.adminDisputes, { params });
  const extracted = extractApiData<PagedResult<AdminDisputeListItem> | AdminDisputeListItem[]>(data);
  return normalizePagedResult(extracted, params);
}

export async function fetchAdminDispute(disputeId: string): Promise<AdminDisputeListItem> {
  const { data } = await apiClient.get(`${escrowApiPaths.adminDisputes}/${disputeId}`);
  return extractApiData<AdminDisputeListItem>(data);
}

export async function resolveAdminDispute(
  disputeId: string,
  payload: ResolveDisputePayload,
): Promise<AdminDisputeListItem> {
  const { data } = await apiClient.post(
    `${escrowApiPaths.adminDisputes}/${disputeId}/resolve`,
    payload,
  );
  return extractApiData<AdminDisputeListItem>(data);
}

export async function freezeAdminOrder(
  orderId: string,
  payload: AdminOrderActionPayload = {},
): Promise<void> {
  await apiClient.post(`${escrowApiPaths.adminOrders}/${orderId}/freeze`, payload);
}

export async function releaseAdminOrderFunds(
  orderId: string,
  payload: AdminOrderActionPayload = {},
): Promise<void> {
  await apiClient.post(`${escrowApiPaths.adminOrders}/${orderId}/release-funds`, payload);
}

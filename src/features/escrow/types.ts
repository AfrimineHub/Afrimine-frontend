export type EscrowStatus = 'pending' | 'funded' | 'released' | 'disputed' | 'frozen' | 'refunded';

export interface EscrowDetails {
  orderId: string;
  escrowId: string | null;
  status: EscrowStatus | string;
  amount: number;
  currency: string | null;
  fundedAt: string | null;
  releasedAt: string | null;
  disputeReason: string | null;
  canFund: boolean;
  canConfirmDelivery: boolean;
  canDispute: boolean;
  canMarkDelivered: boolean;
}

export interface OrderCheckoutRequest {
  successUrl?: string;
  cancelUrl?: string;
}

export interface OrderCheckoutResponse {
  checkoutUrl: string;
  sessionId: string;
  provider?: string | null;
}

export interface VerifyOrderCheckoutParams {
  sessionId: string;
}

export interface AcceptQuoteResponse {
  orderId: string;
}

export interface SubmitVendorQuotePayload {
  listingId?: string;
  rfqId?: string;
  amount: number;
  currency?: string;
  note?: string;
  leadTime?: string;
  deliveryTerms?: string;
  inspectionMethod?: string;
}

export interface RequestPayoutPayload {
  amount: number;
  paymentMethod: string;
}

export interface RequestPayoutResponse {
  id: string;
  status: string | null;
  message?: string | null;
}

export interface OpenDisputePayload {
  reason: string;
  details?: string;
}

export interface AdminDisputeListItem {
  id: string;
  orderId: string;
  listingTitle: string | null;
  buyerName: string | null;
  vendorName: string | null;
  amount: number;
  currency: string | null;
  status: string | null;
  reason: string | null;
  openedAt: string;
}

export interface AdminDisputesPage {
  items: AdminDisputeListItem[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface AdminDisputesQueryParams {
  page?: number;
  pageSize?: number;
  status?: string;
}

export interface ResolveDisputePayload {
  resolution: 'release' | 'refund' | 'partial';
  notes?: string;
  releaseAmount?: number;
  refundAmount?: number;
}

export interface AdminOrderActionPayload {
  notes?: string;
}

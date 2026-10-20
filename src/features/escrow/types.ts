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
  orderId: string | null;
  bookingId: string | null;
  source: string | null;
  listingTitle: string | null;
  raisedByName: string | null;
  reason: string | null;
  status: string | null;
  adminNote: string | null;
  resolvedAt: string | null;
  createdAt: string;
  amount: number;
  currency: string | null;
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
  resolution: 'buyer' | 'vendor';
  adminNote?: string;
}

export interface AdminOrderDetail {
  id: string;
  listingTitle: string | null;
  buyerName: string | null;
  buyerEmail: string | null;
  vendorName: string | null;
  vendorEmail: string | null;
  amount: number;
  currency: string | null;
  status: string | null;
  createdAt: string | null;
  timeline: { step: string | null; occurredAt: string | null; status: string | null }[] | null;
  documents: { id: string | null; name: string | null; downloadUrl: string | null; uploadedBy: string | null }[] | null;
}

export const RESOLVED_DISPUTE_STATUSES = ['ResolvedBuyer', 'ResolvedVendor', 'Closed'];
export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'trialing' | 'none';

/** Matches SubscriptionPlanDto from the backend catalog endpoint. */
export interface SubscriptionPlanDto {
  id: string;
  name: string;
  description: string | null;
  priceMonthly: number;
  currency: string | null;
  listingsLimit: number;
  isPopular: boolean;
  features: { text: string; included: boolean }[];
}

/** UI-facing plan shape used by pricing cards. */
export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: string;
  isPopular: boolean;
  features: { text: string; included: boolean }[];
}

export interface SubscriptionCheckoutRequest {
  planId: string;
  successUrl?: string;
  cancelUrl?: string;
}

export interface SubscriptionCheckoutResponse {
  checkoutUrl: string;
  sessionId: string;
  provider?: string | null;
}

export interface ChangePlanRequest {
  planId: string;
}

export interface CancelSubscriptionRequest {
  reason?: string;
}

export interface SubscriptionInvoice {
  id: string;
  amount: number;
  currency: string | null;
  status: string | null;
  planName: string | null;
  paidAt: string | null;
  createdAt: string;
  invoiceUrl: string | null;
}

export interface SubscriptionInvoicesQueryParams {
  page?: number;
  pageSize?: number;
}

export interface SubscriptionInvoicesPage {
  items: SubscriptionInvoice[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface ContactSalesRequest {
  message?: string;
  phoneNumber?: string;
  preferredPlanId?: string;
}

export interface VerifyCheckoutParams {
  sessionId: string;
}

import { apiClient } from '@/lib/api/client';
import { extractApiData } from '@/lib/api/extractApiData';
import { subscriptionApiPaths } from '@/features/subscription/config';
import type { VendorSubscription } from '@/features/vendor/dashboardTypes';
import type {
  CancelSubscriptionRequest,
  ChangePlanRequest,
  ContactSalesRequest,
  SubscriptionCheckoutRequest,
  SubscriptionCheckoutResponse,
  SubscriptionInvoice,
  SubscriptionInvoicesPage,
  SubscriptionInvoicesQueryParams,
  SubscriptionPlanDto,
  VerifyCheckoutParams,
} from '@/features/subscription/types';

type PagedResult<T> = {
  items?: T[];
  page?: number;
  pageSize?: number;
  totalCount?: number;
  totalPages?: number;
};

function normalizeInvoicesPage(
  extracted: PagedResult<SubscriptionInvoice> | SubscriptionInvoice[],
  params: SubscriptionInvoicesQueryParams,
): SubscriptionInvoicesPage {
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

export async function fetchSubscriptionPlans(): Promise<SubscriptionPlanDto[]> {
  const { data } = await apiClient.get(subscriptionApiPaths.plans);
  const extracted = extractApiData<SubscriptionPlanDto[] | { items?: SubscriptionPlanDto[] }>(data);

  if (Array.isArray(extracted)) {
    return extracted;
  }

  return extracted.items ?? [];
}

export async function createSubscriptionCheckout(
  payload: SubscriptionCheckoutRequest,
): Promise<SubscriptionCheckoutResponse> {
  const { data } = await apiClient.post(subscriptionApiPaths.checkout, payload);
  return extractApiData<SubscriptionCheckoutResponse>(data);
}

export async function changeSubscriptionPlan(payload: ChangePlanRequest): Promise<VendorSubscription> {
  const { data } = await apiClient.post(subscriptionApiPaths.changePlan, payload);
  return extractApiData<VendorSubscription>(data);
}

export async function cancelSubscription(
  payload: CancelSubscriptionRequest = {},
): Promise<VendorSubscription> {
  const { data } = await apiClient.post(subscriptionApiPaths.cancel, payload);
  return extractApiData<VendorSubscription>(data);
}

export async function fetchSubscriptionInvoices(
  params: SubscriptionInvoicesQueryParams = {},
): Promise<SubscriptionInvoicesPage> {
  const { data } = await apiClient.get(subscriptionApiPaths.invoices, { params });
  const extracted = extractApiData<PagedResult<SubscriptionInvoice> | SubscriptionInvoice[]>(data);
  return normalizeInvoicesPage(extracted, params);
}

export async function contactSubscriptionSales(
  payload: ContactSalesRequest = {},
): Promise<{ message?: string }> {
  const { data } = await apiClient.post(subscriptionApiPaths.contactSales, payload);
  return extractApiData<{ message?: string }>(data);
}

export async function verifySubscriptionCheckout(
  params: VerifyCheckoutParams,
): Promise<VendorSubscription> {
  const { data } = await apiClient.get(subscriptionApiPaths.verifyCheckout, { params });
  return extractApiData<VendorSubscription>(data);
}

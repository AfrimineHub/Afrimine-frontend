import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  cancelSubscription,
  changeSubscriptionPlan,
  contactSubscriptionSales,
  createSubscriptionCheckout,
  fetchSubscriptionInvoices,
  fetchSubscriptionPlans,
  verifySubscriptionCheckout,
} from '@/features/subscription/api';
import { subscriptionPlans as fallbackPlans } from '@/features/subscription/data/subscriptionData';
import {
  SUBSCRIPTION_INVOICES_QUERY_KEY,
  SUBSCRIPTION_PLANS_QUERY_KEY,
} from '@/features/subscription/config';
import { mapPlanDtoToPlan } from '@/features/subscription/utils';
import type {
  CancelSubscriptionRequest,
  ChangePlanRequest,
  ContactSalesRequest,
  SubscriptionCheckoutRequest,
  SubscriptionInvoicesQueryParams,
  VerifyCheckoutParams,
} from '@/features/subscription/types';
import {
  VENDOR_DASHBOARD_QUERY_KEY,
  VENDOR_SUBSCRIPTION_QUERY_KEY,
} from '@/features/vendor/dashboardConfig';

function invalidateSubscriptionQueries(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: VENDOR_SUBSCRIPTION_QUERY_KEY });
  queryClient.invalidateQueries({ queryKey: VENDOR_DASHBOARD_QUERY_KEY });
}

export function useSubscriptionPlansQuery() {
  return useQuery({
    queryKey: SUBSCRIPTION_PLANS_QUERY_KEY,
    queryFn: async () => {
      try {
        const plans = await fetchSubscriptionPlans();
        if (plans.length === 0) return fallbackPlans;
        return plans.map(mapPlanDtoToPlan);
      } catch {
        return fallbackPlans;
      }
    },
    staleTime: 10 * 60 * 1000,
  });
}

export function useSubscriptionInvoicesQuery(params: SubscriptionInvoicesQueryParams = {}) {
  return useQuery({
    queryKey: [...SUBSCRIPTION_INVOICES_QUERY_KEY, params],
    queryFn: async () => {
      try {
        return await fetchSubscriptionInvoices(params);
      } catch {
        return { items: [], page: 1, pageSize: 10, totalCount: 0, totalPages: 0 };
      }
    },
    staleTime: 60 * 1000,
  });
}

export function useSubscriptionCheckoutMutation() {
  return useMutation({
    mutationFn: (payload: SubscriptionCheckoutRequest) => createSubscriptionCheckout(payload),
    onSuccess: (result) => {
      if (result.checkoutUrl) {
        window.location.assign(result.checkoutUrl);
      }
    },
  });
}

export function useChangeSubscriptionPlanMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ChangePlanRequest) => changeSubscriptionPlan(payload),
    onSuccess: () => {
      invalidateSubscriptionQueries(queryClient);
    },
  });
}

export function useCancelSubscriptionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CancelSubscriptionRequest = {}) => cancelSubscription(payload),
    onSuccess: () => {
      invalidateSubscriptionQueries(queryClient);
    },
  });
}

export function useContactSalesMutation() {
  return useMutation({
    mutationFn: (payload: ContactSalesRequest = {}) => contactSubscriptionSales(payload),
  });
}

export function useVerifyCheckoutMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: VerifyCheckoutParams) => verifySubscriptionCheckout(params),
    onSuccess: () => {
      invalidateSubscriptionQueries(queryClient);
    },
  });
}

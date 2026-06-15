import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SubscriptionPricingCard } from '../components/SubscriptionPricingCard';
import { useVendorSubscriptionQuery } from '@/features/vendor/dashboardQueries';
import {
  useCancelSubscriptionMutation,
  useChangeSubscriptionPlanMutation,
  useContactSalesMutation,
  useSubscriptionCheckoutMutation,
  useSubscriptionInvoicesQuery,
  useSubscriptionPlansQuery,
  useVerifyCheckoutMutation,
} from '@/features/subscription/queries';
import { buildCheckoutReturnUrls, formatRenewalDate } from '@/features/subscription/utils';
import { getApiErrorMessage } from '@/lib/api/errors';
import { formatVendorAmount } from '@/features/vendor/dashboardUtils';

const SubscriptionPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const subscriptionQuery = useVendorSubscriptionQuery();
  const plansQuery = useSubscriptionPlansQuery();
  const invoicesQuery = useSubscriptionInvoicesQuery({ page: 1, pageSize: 5 });

  const checkoutMutation = useSubscriptionCheckoutMutation();
  const changePlanMutation = useChangeSubscriptionPlanMutation();
  const cancelMutation = useCancelSubscriptionMutation();
  const contactSalesMutation = useContactSalesMutation();
  const verifyCheckoutMutation = useVerifyCheckoutMutation();

  const subscription = subscriptionQuery.data;
  const plans = plansQuery.data ?? [];

  const checkoutStatus = searchParams.get('checkout');
  const sessionId = searchParams.get('session_id');
  const verifyAttemptedRef = useRef(false);

  useEffect(() => {
    if (checkoutStatus !== 'success' || !sessionId || verifyAttemptedRef.current) return;

    verifyAttemptedRef.current = true;
    verifyCheckoutMutation.mutate(
      { sessionId },
      {
        onSuccess: () => {
          setActionSuccess('Your subscription has been updated successfully.');
          setSearchParams({}, { replace: true });
        },
        onError: (error) => {
          setActionError(getApiErrorMessage(error, 'Could not verify your payment.'));
          setSearchParams({}, { replace: true });
        },
      },
    );
  }, [checkoutStatus, sessionId, setSearchParams, verifyCheckoutMutation.mutate]);

  useEffect(() => {
    if (checkoutStatus === 'canceled') {
      setActionError('Checkout was canceled. You can try again when you are ready.');
      setSearchParams({}, { replace: true });
    }
  }, [checkoutStatus, setSearchParams]);

  const loadError =
    subscriptionQuery.isError &&
    getApiErrorMessage(subscriptionQuery.error, 'Could not load your subscription.');

  const renewalDate = formatRenewalDate(subscription?.renewsAt);
  const isCanceled =
    subscription?.status?.toLowerCase() === 'canceled' || Boolean(subscription?.canceledAt);

  const canCancel = useMemo(() => {
    if (subscription?.canCancel !== undefined) return subscription.canCancel;
    return Boolean(subscription?.planId && subscription.planId !== 'free' && !isCanceled);
  }, [isCanceled, subscription?.canCancel, subscription?.planId]);

  const isPlanActionPending =
    checkoutMutation.isPending ||
    changePlanMutation.isPending ||
    cancelMutation.isPending ||
    verifyCheckoutMutation.isPending;

  const handleSelectPlan = async (planId: string) => {
    setActionError(null);
    setActionSuccess(null);
    setSelectedPlanId(planId);

    try {
      if (planId === 'free') {
        await changePlanMutation.mutateAsync({ planId });
        setActionSuccess('Your plan has been changed to Free.');
        return;
      }

      const { successUrl, cancelUrl } = buildCheckoutReturnUrls();
      await checkoutMutation.mutateAsync({
        planId,
        successUrl,
        cancelUrl,
      });
    } catch (error) {
      setActionError(getApiErrorMessage(error, 'Could not start checkout for this plan.'));
    } finally {
      setSelectedPlanId(null);
    }
  };

  const handleCancelSubscription = async () => {
    const confirmed = window.confirm(
      'Cancel your subscription at the end of the current billing period? You will keep access until then.',
    );
    if (!confirmed) return;

    setActionError(null);
    setActionSuccess(null);

    try {
      await cancelMutation.mutateAsync({});
      setActionSuccess('Your subscription will cancel at the end of the current billing period.');
    } catch (error) {
      setActionError(getApiErrorMessage(error, 'Could not cancel your subscription.'));
    }
  };

  const handleContactSales = async () => {
    const message = window.prompt(
      'Tell us about your needs (optional). Our sales team will reach out shortly.',
      '',
    );
    if (message === null) return;

    setActionError(null);
    setActionSuccess(null);

    try {
      const result = await contactSalesMutation.mutateAsync({
        message: message.trim() || undefined,
        preferredPlanId: subscription?.planId ?? undefined,
      });
      setActionSuccess(result.message ?? 'Thanks! Our sales team will contact you shortly.');
    } catch (error) {
      setActionError(getApiErrorMessage(error, 'Could not submit your sales request.'));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        {subscriptionQuery.isLoading ? (
          <div className="mb-10 h-24 bg-white rounded-xl border border-gray-100 animate-pulse" aria-busy="true" />
        ) : loadError ? (
          <p className="mb-10 text-sm text-red-600 rounded-lg border border-red-100 bg-red-50 px-4 py-3" role="alert">
            {loadError}
          </p>
        ) : subscription ? (
          <div className="mb-10 rounded-xl border border-yellow-100 bg-yellow-50 px-6 py-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-yellow-800">Current plan</p>
                <h2 className="text-xl font-bold text-slate-900 mt-1">
                  {subscription.planName?.trim() || 'Free Plan'}
                </h2>
                <p className="text-sm text-yellow-900/80 mt-2">
                  {subscription.listingsUsed} of {subscription.listingsLimit} listings used ·{' '}
                  {subscription.listingsRemaining} remaining
                </p>
                {renewalDate ? (
                  <p className="text-sm text-yellow-900/80 mt-1">
                    {isCanceled ? 'Access until' : 'Renews on'} {renewalDate}
                  </p>
                ) : null}
                {subscription.status ? (
                  <p className="text-xs font-medium uppercase tracking-wide text-yellow-800 mt-2">
                    Status: {subscription.status}
                  </p>
                ) : null}
              </div>

              {canCancel ? (
                <button
                  type="button"
                  onClick={handleCancelSubscription}
                  disabled={cancelMutation.isPending}
                  className="inline-flex items-center justify-center min-h-10 px-4 py-2 text-sm font-medium text-red-700 bg-white border border-red-200 rounded-lg hover:bg-red-50 disabled:opacity-60"
                >
                  {cancelMutation.isPending ? 'Canceling…' : 'Cancel subscription'}
                </button>
              ) : null}
            </div>
          </div>
        ) : null}

        {actionSuccess ? (
          <p className="mb-6 text-sm text-green-700 rounded-lg border border-green-100 bg-green-50 px-4 py-3" role="status">
            {actionSuccess}
          </p>
        ) : null}

        {actionError ? (
          <p className="mb-6 text-sm text-red-600 rounded-lg border border-red-100 bg-red-50 px-4 py-3" role="alert">
            {actionError}
          </p>
        ) : null}

        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            Choose Your Subscription Plan
          </h1>
          <p className="text-lg text-gray-600">
            Select the perfect plan for your mining operations. All plans include secure transactions and verified buyer network.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 gap-y-12 mb-16">
          {plans.map((plan) => (
            <SubscriptionPricingCard
              key={plan.id}
              plan={plan}
              isCurrent={subscription?.planId === plan.id}
              isLoading={isPlanActionPending && selectedPlanId === plan.id}
              onSelect={handleSelectPlan}
            />
          ))}
        </div>

        {invoicesQuery.data && invoicesQuery.data.items.length > 0 ? (
          <div className="mb-16 max-w-4xl mx-auto">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Billing history</h3>
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">Date</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">Plan</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">Amount</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {invoicesQuery.data.items.map((invoice) => (
                    <tr key={invoice.id}>
                      <td className="px-4 py-3 text-gray-700">
                        {formatRenewalDate(invoice.paidAt ?? invoice.createdAt) ?? '—'}
                      </td>
                      <td className="px-4 py-3 text-gray-700">{invoice.planName ?? '—'}</td>
                      <td className="px-4 py-3 text-gray-700">
                        {formatVendorAmount(invoice.amount, invoice.currency)}
                      </td>
                      <td className="px-4 py-3 text-gray-700 capitalize">{invoice.status ?? '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}

        <div className="max-w-4xl mx-auto text-center border-t border-gray-200 pt-10">
          <h4 className="text-xl font-bold text-gray-900 mb-2">Need a Custom Plan?</h4>
          <p className="text-gray-500 mb-6 text-sm">
            We understand that every mining operation is unique. Contact our sales team to discuss a custom plan tailored to your specific needs.
          </p>
          <button
            type="button"
            onClick={handleContactSales}
            disabled={contactSalesMutation.isPending}
            className="bg-[#1E293B] hover:bg-slate-800 text-white py-2.5 px-8 rounded-lg font-bold transition-colors cursor-pointer disabled:opacity-60"
          >
            {contactSalesMutation.isPending ? 'Sending…' : 'Contact Sales'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;

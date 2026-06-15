import { subscriptionPlans } from '../data/subscriptionData';
import { SubscriptionPricingCard } from '../components/SubscriptionPricingCard';
import { useVendorSubscriptionQuery } from '@/features/vendor/dashboardQueries';
import { getApiErrorMessage } from '@/lib/api/errors';

const SubscriptionPage = () => {
  const subscriptionQuery = useVendorSubscriptionQuery();
  const subscription = subscriptionQuery.data;

  const loadError =
    subscriptionQuery.isError &&
    getApiErrorMessage(subscriptionQuery.error, 'Could not load your subscription.');

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
            <p className="text-xs font-semibold uppercase tracking-wide text-yellow-800">Current plan</p>
            <h2 className="text-xl font-bold text-slate-900 mt-1">
              {subscription.planName?.trim() || 'Free Plan'}
            </h2>
            <p className="text-sm text-yellow-900/80 mt-2">
              {subscription.listingsUsed} of {subscription.listingsLimit} listings used ·{' '}
              {subscription.listingsRemaining} remaining
            </p>
          </div>
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
          {subscriptionPlans.map((plan) => (
            <SubscriptionPricingCard
              key={plan.id}
              plan={plan}
              isCurrent={subscription?.planId === plan.id}
            />
          ))}
        </div>

        <div className="max-w-4xl mx-auto text-center border-t border-gray-200 pt-10">
          <h4 className="text-xl font-bold text-gray-900 mb-2">Need a Custom Plan?</h4>
          <p className="text-gray-500 mb-6 text-sm">
            We understand that every mining operation is unique. Contact our sales team to discuss a custom plan tailored to your specific needs.
          </p>
          <button
            type="button"
            className="bg-[#1E293B] hover:bg-slate-800 text-white py-2.5 px-8 rounded-lg font-bold transition-colors cursor-pointer"
          >
            Contact Sales
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;

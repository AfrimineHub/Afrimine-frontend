import { subscriptionPlans } from '../data/subscriptionData';
import { SubscriptionPricingCard } from '../components/SubscriptionPricingCard';

const SubscriptionPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            Choose Your Subscription Plan
          </h1>
          <p className="text-lg text-gray-600">
            Select the perfect plan for your mining operations. All plans include secure transactions and verified buyer network.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 gap-y-12 mb-16">
          {subscriptionPlans.map((plan) => (
            <SubscriptionPricingCard key={plan.id} plan={plan} />
          ))}
        </div>

        {/* Footer Section */}
        <div className="max-w-4xl mx-auto text-center border-t border-gray-200 pt-10">
          <h4 className="text-xl font-bold text-gray-900 mb-2">
            Need a Custom Plan?
          </h4>
          <p className="text-gray-500 mb-6 text-sm">
            We understand that every mining operation is unique. Contact our sales team to discuss a custom plan tailored to your specific needs.
          </p>
          <button className="bg-[#1E293B] hover:bg-slate-800 text-white py-2.5 px-8 rounded-lg font-bold transition-colors">
            Contact Sales
          </button>
        </div>

      </div>
    </div>
  );
};

export default SubscriptionPage;
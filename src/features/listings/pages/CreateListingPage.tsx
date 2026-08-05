import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { CreateListingForm } from '@/features/listings/components/CreateListingForm';
import { SubscriptionRequiredNotice } from '@/features/subscription/components/SubscriptionRequiredNotice';
import { canCreateNewListing } from '@/features/subscription/listingAccess';
import { useVendorSubscriptionQuery } from '@/features/vendor/dashboardQueries';

const CreateListingPage: React.FC = () => {
  const subscriptionQuery = useVendorSubscriptionQuery();
  const canCreateListing = canCreateNewListing(subscriptionQuery.data);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Link
          to="/my-ad"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-yellow-700 mb-6"
        >
          <ArrowLeft size={16} aria-hidden />
          Back to My Listings
        </Link>

        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Create listing</h1>
          <p className="text-sm text-gray-500 mt-2">
            List minerals, mining sites, equipment, or manpower for buyers on Afrimine.
          </p>
        </div>

        {subscriptionQuery.isLoading ? (
          <div className="rounded-xl border border-gray-200 bg-white px-4 py-6 text-sm text-gray-500">
            Loading subscription…
          </div>
        ) : canCreateListing ? (
          <CreateListingForm />
        ) : (
          <SubscriptionRequiredNotice description="A paid subscription is required to publish new seller listings from the dashboard. Upgrade your plan to continue." />
        )}
      </div>
    </div>
  );
};

export default CreateListingPage;

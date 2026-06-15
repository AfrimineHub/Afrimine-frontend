import { useMemo, useState, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { RfqFilter } from '@/features/rfq/components/RfqFilter';
import { VendorOpenRfqCard } from '@/features/rfq/components/VendorOpenRfqCard';
import { useStartRfqConversationMutation } from '@/features/buyer/dashboardQueries';
import { useOpenBuyerRfqsQuery } from '@/features/vendor/dashboardQueries';
import { mapBuyerRfqToCard } from '@/features/buyer/dashboardUtils';
import { getApiErrorMessage } from '@/lib/api/errors';

export const VendorOpenRfqsPage = () => {
  const navigate = useNavigate();
  const [messagingRfqId, setMessagingRfqId] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    resource: '',
    location: '',
    minQuantity: '',
  });

  const rfqsQuery = useOpenBuyerRfqsQuery({
    resource: filters.resource || undefined,
    location: filters.location || undefined,
    minQuantity: filters.minQuantity || undefined,
    Status: 'open',
    Page: 1,
    PageSize: 50,
  });

  const startConversationMutation = useStartRfqConversationMutation();

  const rfqs = useMemo(
    () => (rfqsQuery.data?.items ?? []).map(mapBuyerRfqToCard),
    [rfqsQuery.data?.items],
  );

  const handleFilterChange = (field: keyof typeof filters) => (e: ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleMessageBuyer = (rfqId: string) => {
    setMessagingRfqId(rfqId);
    startConversationMutation.mutate(rfqId, {
      onSuccess: (data) => {
        navigate(`/messages?conversationId=${data.conversationId}&rfqId=${rfqId}`);
      },
      onSettled: () => setMessagingRfqId(null),
    });
  };

  const loadError =
    rfqsQuery.isError &&
    getApiErrorMessage(rfqsQuery.error, 'Could not load buyer requests.');

  const messageError =
    startConversationMutation.isError &&
    getApiErrorMessage(startConversationMutation.error, 'Could not start conversation.');

  return (
    <div className="min-h-screen bg-[#FAFAFA] py-12 px-6 lg:px-12 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <h1 className="text-[28px] font-extrabold text-gray-900 tracking-tight mb-2">
            Buyer Requests
          </h1>
          <p className="text-gray-500 text-sm max-w-2xl">
            Buyers post these when they can&apos;t find an item in the marketplace.
            If you can supply what they need, message them to let them know.
          </p>
        </div>

        <div className="mb-10 space-y-4">
          <div className="flex items-center gap-2 text-sm text-gray-800 font-bold">
            <span>Filter:</span>
            <span className="text-gray-400 font-normal">Resource | Location | Quantity</span>
          </div>

          <div className="flex flex-col md:flex-row gap-4 max-w-4xl">
            <RfqFilter
              placeholder="Search resource..."
              value={filters.resource}
              onChange={handleFilterChange('resource')}
              icon=""
            />
            <RfqFilter
              placeholder="Search location..."
              value={filters.location}
              onChange={handleFilterChange('location')}
              icon=""
            />
            <RfqFilter
              placeholder="Min quantity..."
              value={filters.minQuantity}
              onChange={handleFilterChange('minQuantity')}
              icon=""
            />
          </div>
        </div>

        {loadError || messageError ? (
          <p className="mb-6 text-sm text-red-600 rounded-lg border border-red-100 bg-red-50 px-4 py-3" role="alert">
            {loadError || messageError}
          </p>
        ) : null}

        {rfqsQuery.isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6" aria-busy="true">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-48 bg-white border border-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : rfqs.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-16">No open buyer requests right now.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            {rfqs.map((rfq) => (
              <VendorOpenRfqCard
                key={rfq.id}
                rfq={rfq}
                onMessageBuyer={handleMessageBuyer}
                isMessaging={messagingRfqId === rfq.id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorOpenRfqsPage;

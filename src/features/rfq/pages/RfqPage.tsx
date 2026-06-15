import { useMemo, useState, type ChangeEvent } from 'react';
import { RfqFilter } from '../components/RfqFilter';
import { BuyerRfqCard } from '../components/BuyerRfqCard';
import { CreateRfqForm } from '../components/CreateRfqForm';
import { useBuyerRfqsQuery } from '@/features/buyer/dashboardQueries';
import { mapBuyerRfqToCard } from '@/features/buyer/dashboardUtils';
import { getApiErrorMessage } from '@/lib/api/errors';

const RfqPage = () => {
  const [filters, setFilters] = useState({
    resource: '',
    location: '',
    minQuantity: '',
  });
  const [showCreateForm, setShowCreateForm] = useState(true);

  const rfqsQuery = useBuyerRfqsQuery({
    resource: filters.resource || undefined,
    location: filters.location || undefined,
    minQuantity: filters.minQuantity || undefined,
    Page: 1,
    PageSize: 50,
  });

  const rfqs = useMemo(
    () => (rfqsQuery.data?.items ?? []).map(mapBuyerRfqToCard),
    [rfqsQuery.data?.items],
  );

  const handleFilterChange = (field: keyof typeof filters) => (e: ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const loadError =
    rfqsQuery.isError &&
    getApiErrorMessage(rfqsQuery.error, 'Could not load your requests.');

  return (
    <div className="min-h-screen bg-[#FAFAFA] py-12 px-6 lg:px-12 font-sans">
      <div className="max-w-6xl mx-auto space-y-10">
        <div>
          <h1 className="text-[28px] font-extrabold text-gray-900 tracking-tight mb-2">
            Request for Quote (RFQ)
          </h1>
          <p className="text-gray-500 text-sm max-w-2xl">
            Didn&apos;t find what you need in the marketplace? Post a buying request here.
            Vendors who can supply it will message you directly.
          </p>
        </div>

        {showCreateForm ? (
          <CreateRfqForm onSuccess={() => setShowCreateForm(false)} />
        ) : (
          <button
            type="button"
            onClick={() => setShowCreateForm(true)}
            className="text-sm font-bold text-yellow-700 hover:text-yellow-800"
          >
            + Post another request
          </button>
        )}

        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-6">My requests</h2>

          <div className="mb-8 space-y-4">
            <div className="flex items-center gap-2 text-sm text-gray-800 font-bold">
              <span>Filter:</span>
              <span className="text-gray-400 font-normal">Resource | Location | Quantity</span>
            </div>

            <div className="flex flex-col md:flex-row gap-4 max-w-4xl">
              <RfqFilter
                placeholder="Search resource..."
                value={filters.resource}
                onChange={handleFilterChange('resource')}
                icon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
              />
              <RfqFilter
                placeholder="Search location..."
                value={filters.location}
                onChange={handleFilterChange('location')}
                icon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                }
              />
              <RfqFilter
                placeholder="Min quantity..."
                value={filters.minQuantity}
                onChange={handleFilterChange('minQuantity')}
                icon=""
              />
            </div>
          </div>

          {loadError ? (
            <p className="mb-6 text-sm text-red-600 rounded-lg border border-red-100 bg-red-50 px-4 py-3" role="alert">
              {loadError}
            </p>
          ) : null}

          {rfqsQuery.isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6" aria-busy="true">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-48 bg-white border border-gray-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : rfqs.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
              <p className="text-sm text-gray-500 mb-2">You haven&apos;t posted any requests yet.</p>
              <p className="text-xs text-gray-400">Use the form above to tell vendors what you&apos;re looking for.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              {rfqs.map((rfq) => (
                <BuyerRfqCard key={rfq.id} rfq={rfq} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RfqPage;

import { useMemo, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { ListingCard } from './ListingCard';
import { useMarketplaceListingsQuery } from '@/features/buyer/dashboardQueries';
import { mapMarketplaceListingToCard } from '@/features/buyer/dashboardUtils';
import type { MarketplaceListingsQueryParams } from '@/features/buyer/dashboardTypes';
import { getApiErrorMessage } from '@/lib/api/errors';

const TAB_PARAMS: Record<string, Partial<MarketplaceListingsQueryParams>> = {
  Latest: { sort: 'latest' },
  Recommended: { sort: 'recommended' },
  Price: { sort: 'price' },
  'Verified Only': { verifiedOnly: true },
};

interface ListingsGridProps {
  searchQuery?: string;
  listingType?: string;
  mineral?: string;
  location?: string;
}

export const ListingsGrid = ({
  searchQuery = '',
  listingType,
  mineral,
  location,
}: ListingsGridProps) => {
  const [activeTab, setActiveTab] = useState('Latest');

  const queryParams = useMemo(
    () => ({
      q: searchQuery || undefined,
      listingType,
      mineral,
      location,
      page: 1,
      pageSize: 24,
      ...TAB_PARAMS[activeTab],
    }),
    [activeTab, listingType, location, mineral, searchQuery],
  );

  const listingsQuery = useMarketplaceListingsQuery(queryParams);

  const listings = useMemo(
    () => (listingsQuery.data?.items ?? []).map(mapMarketplaceListingToCard),
    [listingsQuery.data?.items],
  );

  const loadError =
    listingsQuery.isError &&
    getApiErrorMessage(listingsQuery.error, 'Could not load listings.');

  return (
    <section className="mt-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
        <h2 className="text-xl font-bold text-gray-800">Recent Listings</h2>
        <button
          type="button"
          className="bg-yellow-400 hover:bg-[#CA8A04] text-black font-bold px-5 py-2 rounded-lg text-sm transition-colors shadow-sm cursor-pointer w-full sm:w-auto"
        >
          Post New Listings
        </button>
      </div>

      <div className="flex items-center gap-8 mb-8 border-b border-gray-100 overflow-x-auto whitespace-nowrap scrollbar-hide">
        {Object.keys(TAB_PARAMS).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-sm font-bold flex items-center gap-1 transition-all cursor-pointer ${
              activeTab === tab
                ? 'text-gray-900 p-2 rounded-lg bg-yellow-500 border-yellow-500'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {tab}
            {tab === 'Price' && <ChevronDown size={14} />}
          </button>
        ))}
      </div>

      {loadError ? (
        <p className="mb-6 text-sm text-red-600 rounded-lg border border-red-100 bg-red-50 px-4 py-3" role="alert">
          {loadError}
        </p>
      ) : null}

      {listingsQuery.isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" aria-busy="true">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-72 bg-white border border-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : listings.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-16">No listings found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {listings.map((listing) => (
            <ListingCard key={listing.id} data={listing} />
          ))}
        </div>
      )}
    </section>
  );
};

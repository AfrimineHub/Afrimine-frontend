import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { ListingCard } from './ListingCard';
import { useMarketplaceListingsQuery } from '@/features/buyer/dashboardQueries';
import { mapMarketplaceListingToCard } from '@/features/buyer/dashboardUtils';
import type { MarketplaceListingsQueryParams } from '@/features/buyer/dashboardTypes';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { USER_TYPES } from '@/features/auth/types';
import { getApiErrorMessage } from '@/lib/api/errors';

const TAB_PARAMS: Record<string, Partial<MarketplaceListingsQueryParams>> = {
  Latest: { sort: 'latest' },
  Recommended: { sort: 'recommended' },
  Price: { sort: 'price' },
};

interface ListingsGridProps {
  searchQuery?: string;
  listingType?: string;
  mineral?: string;
  location?: string;
  verifiedOnly?: boolean;
  page?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
}

interface ListingsPaginationProps {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

const ListingsPagination = ({
  page,
  pageSize,
  totalCount,
  totalPages,
  onPageChange,
  isLoading = false,
}: ListingsPaginationProps) => {
  if (totalPages <= 1) return null;

  const rangeStart = (page - 1) * pageSize + 1;
  const rangeEnd = Math.min(page * pageSize, totalCount);

  return (
    <nav
      className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-between"
      aria-label="Listings pagination"
    >
      <p className="text-sm text-gray-500">
        Showing {rangeStart}–{rangeEnd} of {totalCount} listings
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1 || isLoading}
          className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
          Previous
        </button>

        <span className="px-2 text-sm font-medium text-gray-700">
          Page {page} of {totalPages}
        </span>

        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages || isLoading}
          className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Next page"
        >
          Next
          <ChevronRight size={16} />
        </button>
      </div>
    </nav>
  );
};

export const ListingsGrid = ({
  searchQuery = '',
  listingType,
  mineral,
  location,
  verifiedOnly,
  page = 1,
  pageSize = 24,
  onPageChange,
}: ListingsGridProps) => {
  const { user } = useAuth();
  const isBuyer = user?.type === USER_TYPES.buyer;
  const [activeTab, setActiveTab] = useState('Latest');

  const queryParams = useMemo(
    () => ({
      q: searchQuery || undefined,
      listingType,
      mineral,
      location,
      verifiedOnly: verifiedOnly || undefined,
      page,
      pageSize,
      ...TAB_PARAMS[activeTab],
    }),
    [activeTab, listingType, location, mineral, page, pageSize, searchQuery, verifiedOnly],
  );

  const listingsQuery = useMarketplaceListingsQuery(queryParams);

  const listings = useMemo(
    () => (listingsQuery.data?.items ?? []).map(mapMarketplaceListingToCard),
    [listingsQuery.data?.items],
  );

  const totalCount = listingsQuery.data?.totalCount ?? 0;
  const totalPages = listingsQuery.data?.totalPages ?? 1;

  useEffect(() => {
    if (!onPageChange || totalPages < 1 || page <= totalPages) return;
    onPageChange(totalPages);
  }, [onPageChange, page, totalPages]);

  const loadError =
    listingsQuery.isError &&
    getApiErrorMessage(listingsQuery.error, 'Could not load listings.');

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    onPageChange?.(1);
  };

  const handlePageChange = (nextPage: number) => {
    onPageChange?.(nextPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
            onClick={() => handleTabChange(tab)}
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
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <p className="text-sm text-gray-500 mb-2">No listings found.</p>
          {isBuyer ? (
            <p className="text-xs text-gray-400">
              Can&apos;t find what you need?{' '}
              <Link to="/rfq" className="text-yellow-700 font-semibold hover:underline">
                Post a buying request (RFQ)
              </Link>{' '}
              and vendors will message you.
            </p>
          ) : null}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {listings.map((listing) => (
            <ListingCard key={listing.id} data={listing} />
          ))}
        </div>
      )}

      {onPageChange ? (
        <ListingsPagination
          page={page}
          pageSize={pageSize}
          totalCount={totalCount}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          isLoading={listingsQuery.isFetching}
        />
      ) : null}
    </section>
  );
};

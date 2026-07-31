import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { ListingCard } from './ListingCard';
import { useMarketplaceEquipmentQuery } from '../equipmentQueries';
import { mapEquipmentToCard } from '../equipmentMappers';
import type { MarketplaceEquipmentDto, MarketplaceEquipmentQueryParams } from '../equipmentTypes';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { USER_TYPES } from '@/features/auth/types';
import { getApiErrorMessage } from '@/lib/api/errors';

// The backend has no server-side sort param, so tabs sort the current page
// of results client-side. "Recommended" is left in fetch order for now.
const TABS = ['Latest', 'Recommended', 'Price'] as const;
type Tab = (typeof TABS)[number];

function sortEquipment(items: MarketplaceEquipmentDto[], tab: Tab): MarketplaceEquipmentDto[] {
  if (tab === 'Latest') {
    return [...items].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }
  if (tab === 'Price') {
    return [...items].sort((a, b) => a.dailyRentalRate - b.dailyRentalRate);
  }
  return items;
}

interface ListingsGridProps {
  searchQuery?: string;
  machineType?: number;
  location?: string;
  maxDailyRate?: number;
  availableOnly?: boolean;
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
  machineType,
  location,
  maxDailyRate,
  availableOnly,
  page = 1,
  pageSize = 24,
  onPageChange,
}: ListingsGridProps) => {
  const { user } = useAuth();
  const isBuyer = user?.type === USER_TYPES.buyer;
  const isSupplier = user?.type === USER_TYPES.supplier;
  const [activeTab, setActiveTab] = useState<Tab>('Latest');

  const queryParams = useMemo<MarketplaceEquipmentQueryParams>(
    () => ({
      q: searchQuery || undefined,
      machineType,
      location,
      maxDailyRate,
      availableOnly,
      page,
      pageSize,
    }),
    [availableOnly, location, machineType, maxDailyRate, page, pageSize, searchQuery],
  );

  const equipmentQuery = useMarketplaceEquipmentQuery(queryParams);

  const listings = useMemo(() => {
    const items = equipmentQuery.data?.items ?? [];
    return sortEquipment(items, activeTab).map(mapEquipmentToCard);
  }, [activeTab, equipmentQuery.data?.items]);

  const totalCount = equipmentQuery.data?.totalCount ?? 0;
  const totalPages = equipmentQuery.data?.totalPages ?? 1;

  useEffect(() => {
    if (!onPageChange || totalPages < 1 || page <= totalPages) return;
    onPageChange(totalPages);
  }, [onPageChange, page, totalPages]);

  const loadError =
    equipmentQuery.isError &&
    getApiErrorMessage(equipmentQuery.error, 'Could not load equipment listings.');

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
  };

  const handlePageChange = (nextPage: number) => {
    onPageChange?.(nextPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="mt-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
        <h2 className="text-xl font-bold text-gray-800">Equipment Available to Lease</h2>
        {isSupplier ? (
          <Link
            to="/supplier/machines/new"
            className="bg-yellow-400 hover:bg-[#CA8A04] text-black font-bold px-5 py-2 rounded-lg text-sm text-center transition-colors shadow-sm cursor-pointer w-full sm:w-auto"
          >
            List New Equipment
          </Link>
        ) : null}
      </div>

      <div className="flex items-center gap-8 mb-8 border-b border-gray-100 overflow-x-auto whitespace-nowrap scrollbar-hide">
        {TABS.map((tab) => (
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

      {equipmentQuery.isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" aria-busy="true">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-72 bg-white border border-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : listings.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <p className="text-sm text-gray-500 mb-2">No equipment found.</p>
          {isBuyer ? (
            <p className="text-xs text-gray-400">
              Can&apos;t find what you need?{' '}
              <Link to="/rfq" className="text-yellow-700 font-semibold hover:underline">
                Post a buying request (RFQ)
              </Link>{' '}
              and suppliers will message you.
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
          isLoading={equipmentQuery.isFetching}
        />
      ) : null}
    </section>
  );
};
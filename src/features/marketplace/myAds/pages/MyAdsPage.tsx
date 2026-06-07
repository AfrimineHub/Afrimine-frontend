import { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AdsFilterBar } from '../components/AdsFilterBar';
import { AdListItem } from '../components/AdListItem';
import { useVendorListingsQuery } from '@/features/listings/queries';
import {
  formatListingDate,
  formatListingPrice,
  getCategoryLabel,
  getListingImageUrl,
  isDraftListing,
  mapListingStatusToDisplay,
} from '@/features/listings/utils';
import { getApiErrorMessage } from '@/lib/api/errors';

const MyAdsPage = () => {
  const location = useLocation();
  const locationState = location.state as {
    listingCreated?: boolean;
    listingUpdated?: boolean;
    listingPublished?: boolean;
  } | null;
  const listingCreated = Boolean(locationState?.listingCreated);
  const listingUpdated = Boolean(locationState?.listingUpdated);
  const listingPublished = Boolean(locationState?.listingPublished);

  const listingsQuery = useVendorListingsQuery({ page: 1, pageSize: 20 });
  const listings = listingsQuery.data?.items ?? [];

  const rows = useMemo(
    () =>
      listings.map((listing) => ({
        id: listing.id,
        image: getListingImageUrl(listing),
        title: listing.title,
        category: getCategoryLabel(listing),
        status: mapListingStatusToDisplay(listing.status),
        isDraft: isDraftListing(listing.status),
        price: formatListingPrice(listing),
        stats: {
          views: listing.viewsCount ?? 0,
          inquiries: listing.inquiriesCount ?? 0,
        },
        date: formatListingDate(listing.createdAt),
      })),
    [listings],
  );

  const loadError =
    listingsQuery.isError &&
    getApiErrorMessage(listingsQuery.error, 'Could not load your listings.');

  return (
    <div className="min-h-screen bg-white p-6 md:p-10">
      {listingCreated ? (
        <p className="mb-4 text-sm text-emerald-700 rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-3">
          Listing submitted successfully. It will appear here once reviewed.
        </p>
      ) : null}
      {listingUpdated ? (
        <p className="mb-4 text-sm text-emerald-700 rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-3">
          Listing updated successfully.
        </p>
      ) : null}
      {listingPublished ? (
        <p className="mb-4 text-sm text-emerald-700 rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-3">
          Listing submitted for review. It will be published once approved.
        </p>
      ) : null}

      <AdsFilterBar />

      {listingsQuery.isLoading ? (
        <div className="mt-8 space-y-4" aria-busy="true">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : loadError ? (
        <div className="mt-8 rounded-xl border border-amber-100 bg-amber-50 px-4 py-6 text-center">
          <p className="text-sm text-amber-800 mb-2">{loadError}</p>
          <p className="text-xs text-amber-700">
            If the listings API is not deployed yet, you can still create a listing — it will be sent to{' '}
            <code className="text-[11px]">POST /vendor/listings</code> when the backend is ready.
          </p>
        </div>
      ) : rows.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-gray-200 px-6 py-12 text-center">
          <p className="text-slate-700 font-medium mb-1">No listings yet</p>
          <p className="text-sm text-gray-500 mb-4">Create your first mineral, site, or equipment listing.</p>
          <Link
            to="/my-ad/new"
            className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-bold text-white bg-yellow-600 rounded-xl hover:bg-yellow-700"
          >
            Create listing
          </Link>
        </div>
      ) : (
        <div className="mt-8 overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-left text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                <th className="pb-4 pl-3 pr-5 sm:px-4 min-w-[10.5rem]">Listings</th>
                <th className="hidden sm:table-cell pb-4 px-4 min-w-[5.5rem]">Status</th>
                <th className="pb-4 px-4">Category</th>
                <th className="pb-4 px-4">Price</th>
                <th className="pb-4 px-4">Performance</th>
                <th className="pb-4 px-4">Date Created</th>
                <th className="pb-4 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((ad) => (
                <AdListItem key={ad.id} {...ad} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyAdsPage;

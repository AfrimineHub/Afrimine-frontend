import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Edit2 } from 'lucide-react';
import { useVendorListingQuery } from '@/features/listings/queries';
import {
  formatListingDate,
  formatListingPrice,
  getCategoryLabel,
  mapListingStatusToDisplay,
} from '@/features/listings/utils';
import { getApiErrorMessage } from '@/lib/api/errors';

const PLACEHOLDER_IMAGE = '/images/listings/gold-ore.png';

const ViewListingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const listingQuery = useVendorListingQuery(id ?? '');

  if (!id) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <p className="text-sm text-red-600">Invalid listing.</p>
      </div>
    );
  }

  const listing = listingQuery.data;
  const loadError =
    listingQuery.isError &&
    getApiErrorMessage(listingQuery.error, 'Could not load listing details.');

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between gap-4 mb-6">
          <Link
            to="/my-ad"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-yellow-700"
          >
            <ArrowLeft size={16} aria-hidden />
            Back to My Listings
          </Link>
          {listing ? (
            <Link
              to={`/my-ad/${id}/edit`}
              className="inline-flex items-center gap-2 text-sm font-semibold text-yellow-700 hover:text-yellow-800"
            >
              <Edit2 size={16} aria-hidden />
              Edit listing
            </Link>
          ) : null}
        </div>

        {listingQuery.isLoading ? (
          <div className="space-y-4" aria-busy="true">
            <div className="h-48 bg-gray-100 rounded-xl animate-pulse" />
            <div className="h-8 bg-gray-100 rounded-lg animate-pulse w-2/3" />
            <div className="h-24 bg-gray-100 rounded-lg animate-pulse" />
          </div>
        ) : loadError ? (
          <p className="text-sm text-red-600 rounded-lg border border-red-100 bg-red-50 px-4 py-3" role="alert">
            {loadError}
          </p>
        ) : listing ? (
          <article className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
            <img
              src={listing.imageUrl ?? PLACEHOLDER_IMAGE}
              alt={listing.title}
              className="w-full h-56 object-cover bg-gray-100"
            />
            <div className="p-6 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-gray-100 text-gray-700">
                  {mapListingStatusToDisplay(listing.status)}
                </span>
                <span className="text-xs text-gray-500">{getCategoryLabel(listing)}</span>
              </div>

              <h1 className="text-2xl font-bold text-slate-900">{listing.title}</h1>
              <p className="text-lg font-semibold text-slate-800">{formatListingPrice(listing)}</p>

              <div className="text-sm text-gray-600 space-y-1">
                <p>
                  <span className="font-medium text-slate-700">Location:</span>{' '}
                  {[listing.location, listing.country].filter(Boolean).join(', ') || '—'}
                </p>
                <p>
                  <span className="font-medium text-slate-700">Created:</span>{' '}
                  {formatListingDate(listing.createdAt)}
                </p>
                {listing.contactInfo ? (
                  <p>
                    <span className="font-medium text-slate-700">Contact:</span> {listing.contactInfo}
                  </p>
                ) : null}
              </div>

              {listing.description ? (
                <div>
                  <h2 className="text-sm font-bold text-slate-800 mb-2">Description</h2>
                  <p className="text-sm text-gray-600 whitespace-pre-wrap">{listing.description}</p>
                </div>
              ) : null}

              {listing.adminReviewNote ? (
                <div className="rounded-lg border border-amber-100 bg-amber-50 px-4 py-3">
                  <p className="text-xs font-bold text-amber-800 mb-1">Review note</p>
                  <p className="text-sm text-amber-900">{listing.adminReviewNote}</p>
                </div>
              ) : null}

              {listing.images && listing.images.length > 1 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                  {listing.images.slice(1).map((image) => (
                    <img
                      key={image.id}
                      src={image.url}
                      alt=""
                      className="w-full h-24 rounded-lg object-cover bg-gray-100"
                    />
                  ))}
                </div>
              ) : null}
            </div>
          </article>
        ) : null}
      </div>
    </div>
  );
};

export default ViewListingPage;

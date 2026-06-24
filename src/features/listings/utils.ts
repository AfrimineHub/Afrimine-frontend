import type { ListingStatus } from '@/features/listings/constants';
import type { VendorListing } from '@/features/listings/types';

export const LISTING_PLACEHOLDER_IMAGE = '/images/gold-mine.svg';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/+$/, '');
const API_ORIGIN = API_BASE_URL.replace(/\/api\/v\d+$/i, '');

export function resolveListingImageUrl(url?: string | null): string | null {
  if (!url?.trim()) return null;

  const trimmed = url.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (trimmed.startsWith('//')) return `https:${trimmed}`;
  if (trimmed.startsWith('/')) {
    return API_ORIGIN ? `${API_ORIGIN}${trimmed}` : trimmed;
  }
  return API_BASE_URL ? `${API_BASE_URL}/${trimmed}` : trimmed;
}

export function getListingImageUrl(listing: VendorListing): string {
  const primaryFromGallery = listing.images?.find((image) => image.isPrimary)?.url;
  const firstFromGallery = listing.images?.[0]?.url;

  return (
    resolveListingImageUrl(listing.primaryImageUrl) ??
    resolveListingImageUrl(listing.imageUrl) ??
    resolveListingImageUrl(primaryFromGallery) ??
    resolveListingImageUrl(firstFromGallery) ??
    LISTING_PLACEHOLDER_IMAGE
  );
}

export type AdDisplayStatus = 'Active' | 'Draft' | 'Pending' | 'Rejected';

export function mapListingStatusToDisplay(status: ListingStatus | string): AdDisplayStatus {
  switch (status) {
    case 'active':
      return 'Active';
    case 'rejected':
      return 'Rejected';
    case 'draft':
      return 'Draft';
    case 'pending_review':
    case 'archived':
    default:
      return 'Pending';
  }
}

export function isDraftListing(status: ListingStatus | string): boolean {
  return status === 'draft';
}

export function formatListingPrice(listing: VendorListing): string {
  if (listing.priceDisplay) return listing.priceDisplay;
  if (listing.priceAmount == null) return '—';
  const currency = listing.priceCurrency === 'USD' ? '$' : '₦';
  return `${currency}${listing.priceAmount.toLocaleString()}`;
}

export function formatListingDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' });
}

export function getCategoryLabel(listing: VendorListing): string {
  if (listing.categoryLabel) return listing.categoryLabel;
  if (listing.category) return listing.category;
  
  switch (listing.categoryType) {
    case 1:
      return 'Mineral';
    case 2:
      return 'Equipment';
    case 3:
      return 'Site';
    case 4:
      return 'Manpower';
    default:
      return listing.categoryType;
  }
}

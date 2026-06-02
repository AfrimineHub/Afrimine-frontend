import type { ListingStatus } from '@/features/listings/constants';
import type { VendorListing } from '@/features/listings/types';

export type AdDisplayStatus = 'Active' | 'Pending' | 'Rejected';

export function mapListingStatusToDisplay(status: ListingStatus | string): AdDisplayStatus {
  switch (status) {
    case 'active':
      return 'Active';
    case 'rejected':
      return 'Rejected';
    case 'draft':
    case 'pending_review':
    case 'archived':
    default:
      return 'Pending';
  }
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
  switch (listing.categoryType) {
    case 'mineral':
      return 'Mineral';
    case 'equipment':
      return 'Equipment';
    case 'mining_site':
      return 'Site';
    case 'manpower':
      return 'Manpower';
    default:
      return listing.categoryType;
  }
}

import type { ListingCategoryType, ListingStatus } from '@/features/listings/constants';

export interface ListingImage {
  id: string;
  url: string;
  isPrimary?: boolean;
  sortOrder?: number;
}

export interface VendorListing {
  id: string;
  title: string;
  description?: string | null;
  categoryType: ListingCategoryType;
  categoryLabel?: string | null;
  status: ListingStatus;
  location?: string | null;
  country?: string | null;
  stateOrRegion?: string | null;
  priceAmount?: number | null;
  priceCurrency?: string | null;
  priceUnit?: string | null;
  priceDisplay?: string | null;
  contactInfo?: string | null;
  adminReviewNote?: string | null;
  imageUrl?: string | null;
  images?: ListingImage[];
  viewsCount?: number;
  inquiriesCount?: number;
  savesCount?: number;
  createdAt: string;
  updatedAt?: string;
  publishedAt?: string | null;
}

export interface UpdateListingPayload {
  title?: string;
  description?: string;
  location?: string;
  country?: string;
  priceDescription?: string;
  contactInfo?: string;
  category?: ListingCategoryType;
}

export interface CreateListingPayload {
  categoryType: ListingCategoryType;
  title: string;
  description: string;
  country: string;
  stateOrRegion: string;
  location: string;
  priceAmount: number;
  priceCurrency: string;
  priceUnit: string;
  quantity?: string;
  mineralType?: string;
  gradeOrPurity?: string;
  equipmentType?: string;
  yearManufactured?: number;
  condition?: string;
  acreageHectares?: number;
  leaseType?: string;
  manpowerRole?: string;
  availability?: string;
  publish?: boolean;
}

export interface VendorListingsQueryParams {
  page?: number;
  pageSize?: number;
  status?: ListingStatus;
  search?: string;
  categoryType?: ListingCategoryType;
}

export interface VendorListingsPage {
  items: VendorListing[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface ListingCategoryOption {
  value: ListingCategoryType;
  label: string;
  description?: string;
}

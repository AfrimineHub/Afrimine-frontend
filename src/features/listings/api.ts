import { apiClient } from '@/lib/api/client';
import { extractApiData } from '@/lib/api/extractApiData';
import { vendorListingPaths } from '@/features/listings/config';
import { LISTING_CATEGORY_TYPES, LISTING_STATUS } from '@/features/listings/constants';
import type { ListingCategoryType, ListingStatus } from '@/features/listings/constants';
import { resolveListingImageUrl } from '@/features/listings/utils';
import type {
  CreateListingPayload,
  ListingCategoryOption,
  ListingImage,
  UpdateListingPayload,
  VendorListing,
  VendorListingsPage,
  VendorListingsQueryParams,
} from '@/features/listings/types';

type RawListing = Record<string, unknown>;

type VendorListingsApiPage = {
  items?: unknown[];
  page?: number;
  pageSize?: number;
  totalCount?: number;
  totalPages?: number;
};

function asRawListing(value: unknown): RawListing {
  return value as RawListing;
}

const STATUS_BY_CODE: Record<number, ListingStatus> = {
  0: LISTING_STATUS.draft,
  1: LISTING_STATUS.pendingReview,
  2: LISTING_STATUS.active,
  3: LISTING_STATUS.rejected,
  4: LISTING_STATUS.archived,
};

function normalizeStatus(status: unknown): ListingStatus {
  if (typeof status === 'number') {
    return STATUS_BY_CODE[status] ?? LISTING_STATUS.pendingReview;
  }
  if (typeof status === 'string') {
    const normalized = status.trim().toLowerCase().replace(/\s+/g, '_');
    const known = Object.values(LISTING_STATUS) as string[];
    if (known.includes(normalized)) return normalized as ListingStatus;
  }
  return LISTING_STATUS.pendingReview;
}

function normalizeCategoryType(category: unknown): ListingCategoryType {
  if (typeof category === 'number' && category >= 1 && category <= 4) {
    return category as ListingCategoryType;
  }
  if (typeof category === 'string') {
    const value = category.trim().toLowerCase();
    if (value.includes('mineral')) return LISTING_CATEGORY_TYPES.mineral;
    if (value.includes('equipment')) return LISTING_CATEGORY_TYPES.equipment;
    if (value.includes('site') || value.includes('mining')) return LISTING_CATEGORY_TYPES.miningSite;
    if (value.includes('manpower') || value.includes('labor')) return LISTING_CATEGORY_TYPES.manpower;
  }
  return LISTING_CATEGORY_TYPES.mineral;
}

function normalizeListingImage(raw: RawListing): ListingImage {
  const url =
    resolveListingImageUrl(String(raw.url ?? raw.imageUrl ?? '')) ?? '';

  return {
    id: String(raw.id ?? raw.imageId ?? ''),
    url,
    isPrimary: Boolean(raw.isPrimary),
    sortOrder: typeof raw.sortOrder === 'number' ? raw.sortOrder : undefined,
  };
}

export function normalizeVendorListing(raw: RawListing): VendorListing {
  const category = raw.category ?? raw.categoryType;
  const categoryType = normalizeCategoryType(category);
  const categoryLabel = typeof category === 'string' ? category : null;
  const images = Array.isArray(raw.images)
    ? raw.images.map((image) => normalizeListingImage(image as RawListing))
    : undefined;

  return {
    id: String(raw.id),
    title: String(raw.title ?? ''),
    description: (raw.description as string | null | undefined) ?? null,
    categoryType,
    categoryLabel,
    status: normalizeStatus(raw.status),
    location: (raw.location as string | null | undefined) ?? null,
    country: (raw.country as string | null | undefined) ?? null,
    stateOrRegion: (raw.stateOrRegion as string | null | undefined) ?? null,
    priceDisplay:
      (raw.priceDescription as string | null | undefined) ??
      (raw.priceDisplay as string | null | undefined) ??
      null,
    contactInfo: (raw.contactInfo as string | null | undefined) ?? null,
    adminReviewNote: (raw.adminReviewNote as string | null | undefined) ?? null,
    imageUrl:
      resolveListingImageUrl(raw.primaryImageUrl as string | null | undefined) ??
      resolveListingImageUrl(raw.imageUrl as string | null | undefined) ??
      images?.find((image) => image.isPrimary)?.url ??
      images?.[0]?.url ??
      null,
    images,
    viewsCount: typeof raw.viewsCount === 'number' ? raw.viewsCount : 0,
    inquiriesCount: typeof raw.inquiriesCount === 'number' ? raw.inquiriesCount : 0,
    savesCount: typeof raw.savesCount === 'number' ? raw.savesCount : 0,
    createdAt: String(raw.createdAt ?? ''),
    updatedAt: raw.updatedAt as string | undefined,
    publishedAt: (raw.publishedAt as string | null | undefined) ?? null,
  };
}

function appendListingFields(formData: FormData, payload: CreateListingPayload) {
  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    formData.append(key, String(value));
  });
}

export async function fetchVendorListings(
  params: VendorListingsQueryParams = {},
): Promise<VendorListingsPage> {
  const { data } = await apiClient.get(vendorListingPaths.listings, { params });
  const extracted = extractApiData<unknown>(data);

  if (Array.isArray(extracted)) {
    return {
      items: extracted.map((item) => normalizeVendorListing(asRawListing(item))),
      page: params.page ?? 1,
      pageSize: params.pageSize ?? 10,
      totalCount: extracted.length,
      totalPages: 1,
    };
  }

  const page = extracted as VendorListingsApiPage;
  const items = page.items ?? [];

  return {
    page: page.page ?? params.page ?? 1,
    pageSize: page.pageSize ?? params.pageSize ?? 10,
    totalCount: page.totalCount ?? items.length,
    totalPages: page.totalPages ?? 1,
    items: items.map((item) => normalizeVendorListing(asRawListing(item))),
  };
}

export async function fetchVendorListing(id: string): Promise<VendorListing> {
  const { data } = await apiClient.get(vendorListingPaths.listing(id));
  const extracted = extractApiData<RawListing>(data);
  return normalizeVendorListing(extracted);
}

export async function fetchListingCategories(): Promise<ListingCategoryOption[]> {
  const { data } = await apiClient.get(vendorListingPaths.categories);
  return extractApiData<ListingCategoryOption[]>(data) ?? [];
}

export async function createVendorListing(
  payload: CreateListingPayload,
  images: File[] = [],
): Promise<VendorListing> {
  if (images.length > 0) {
    const formData = new FormData();
    appendListingFields(formData, payload);
    images.forEach((file) => formData.append('images', file));

    const { data } = await apiClient.post(vendorListingPaths.listings, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return extractApiData<VendorListing>(data);
  }

  const { data } = await apiClient.post(vendorListingPaths.listings, payload);
  return extractApiData<VendorListing>(data);
}

export async function updateVendorListing(
  id: string,
  payload: UpdateListingPayload,
): Promise<VendorListing> {
  const { data } = await apiClient.put(vendorListingPaths.listing(id), payload);
  const extracted = extractApiData<RawListing>(data);
  return normalizeVendorListing(extracted);
}

export async function deleteVendorListing(id: string): Promise<void> {
  await apiClient.delete(vendorListingPaths.listing(id));
}

export async function publishVendorListing(id: string): Promise<VendorListing> {
  const { data } = await apiClient.post(vendorListingPaths.listingPublish(id));
  const extracted = extractApiData<RawListing>(data);
  return normalizeVendorListing(extracted);
}

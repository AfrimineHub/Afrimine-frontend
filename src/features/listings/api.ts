import { apiClient } from '@/lib/api/client';
import { extractApiData } from '@/lib/api/extractApiData';
import { vendorListingPaths } from '@/features/listings/config';
import type {
  CreateListingPayload,
  ListingCategoryOption,
  VendorListing,
  VendorListingsPage,
  VendorListingsQueryParams,
} from '@/features/listings/types';

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
  const extracted = extractApiData<VendorListingsPage | VendorListing[]>(data);

  if (Array.isArray(extracted)) {
    return {
      items: extracted,
      page: params.page ?? 1,
      pageSize: params.pageSize ?? 10,
      totalCount: extracted.length,
      totalPages: 1,
    };
  }

  return extracted;
}

export async function fetchVendorListing(id: string): Promise<VendorListing> {
  const { data } = await apiClient.get(vendorListingPaths.listing(id));
  return extractApiData<VendorListing>(data);
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
  payload: Partial<CreateListingPayload>,
): Promise<VendorListing> {
  const { data } = await apiClient.put(vendorListingPaths.listing(id), payload);
  return extractApiData<VendorListing>(data);
}

export async function deleteVendorListing(id: string): Promise<void> {
  await apiClient.delete(vendorListingPaths.listing(id));
}

export async function publishVendorListing(id: string): Promise<VendorListing> {
  const { data } = await apiClient.post(vendorListingPaths.listingPublish(id));
  return extractApiData<VendorListing>(data);
}

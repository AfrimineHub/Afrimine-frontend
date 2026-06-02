import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { VENDOR_LISTINGS_QUERY_KEY } from '@/features/listings/config';
import {
  createVendorListing,
  fetchListingCategories,
  fetchVendorListings,
} from '@/features/listings/api';
import type { CreateListingPayload, VendorListingsQueryParams } from '@/features/listings/types';

export function useVendorListingsQuery(params: VendorListingsQueryParams = {}) {
  return useQuery({
    queryKey: [...VENDOR_LISTINGS_QUERY_KEY, params],
    queryFn: () => fetchVendorListings(params),
    staleTime: 30 * 1000,
  });
}

export function useListingCategoriesQuery() {
  return useQuery({
    queryKey: ['listings', 'categories'],
    queryFn: fetchListingCategories,
    staleTime: 10 * 60 * 1000,
    retry: false,
  });
}

export function useCreateListingMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ payload, images }: { payload: CreateListingPayload; images?: File[] }) =>
      createVendorListing(payload, images ?? []),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VENDOR_LISTINGS_QUERY_KEY });
    },
  });
}

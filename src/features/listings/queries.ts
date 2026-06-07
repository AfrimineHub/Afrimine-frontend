import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { VENDOR_LISTINGS_QUERY_KEY } from '@/features/listings/config';
import {
  createVendorListing,
  deleteVendorListing,
  fetchListingCategories,
  fetchVendorListing,
  fetchVendorListings,
  updateVendorListing,
} from '@/features/listings/api';
import type {
  CreateListingPayload,
  UpdateListingPayload,
  VendorListingsQueryParams,
} from '@/features/listings/types';

export function vendorListingQueryKey(id: string) {
  return [...VENDOR_LISTINGS_QUERY_KEY, id] as const;
}

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

export function useVendorListingQuery(id: string) {
  return useQuery({
    queryKey: vendorListingQueryKey(id),
    queryFn: () => fetchVendorListing(id),
    enabled: Boolean(id),
    staleTime: 30 * 1000,
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

export function useUpdateListingMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateListingPayload }) =>
      updateVendorListing(id, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: VENDOR_LISTINGS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: vendorListingQueryKey(variables.id) });
    },
  });
}

export function useDeleteListingMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteVendorListing(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VENDOR_LISTINGS_QUERY_KEY });
    },
  });
}

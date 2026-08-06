import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { BOOKINGS_QUERY_KEY } from '@/features/supplier/bookings/bookingsQueries';
import {
  createBooking,
  fetchAssetDetail,
  fetchAssetPricing,
  fetchMarketplaceEquipment,
} from './equipmentApi';
import type {
  AssetPricingQueryParams,
  CreateBookingPayload,
  MarketplaceEquipmentQueryParams,
} from './equipmentTypes';

export const MARKETPLACE_EQUIPMENT_QUERY_KEY = ['marketplace', 'equipment'] as const;
export const ASSET_DETAIL_QUERY_KEY = ['marketplace', 'asset'] as const;
export const ASSET_PRICING_QUERY_KEY = ['marketplace', 'asset', 'pricing'] as const;

export function useMarketplaceEquipmentQuery(params: MarketplaceEquipmentQueryParams) {
  return useQuery({
    queryKey: [...MARKETPLACE_EQUIPMENT_QUERY_KEY, params] as const,
    queryFn: () => fetchMarketplaceEquipment(params),
    staleTime: 60 * 1000,
    placeholderData: (previous) => previous,
  });
}

export function useAssetDetailQuery(assetId: string) {
  return useQuery({
    queryKey: [...ASSET_DETAIL_QUERY_KEY, assetId] as const,
    queryFn: () => fetchAssetDetail(assetId),
    staleTime: 60 * 1000,
    enabled: Boolean(assetId),
  });
}

export function useAssetPricingQuery(assetId: string, params: AssetPricingQueryParams) {
  return useQuery({
    queryKey: [...ASSET_PRICING_QUERY_KEY, assetId, params] as const,
    queryFn: () => fetchAssetPricing(assetId, params),
    enabled: Boolean(assetId) && params.totalDays > 0,
  });
}

export function useCreateBookingMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateBookingPayload) => createBooking(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MARKETPLACE_EQUIPMENT_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: BOOKINGS_QUERY_KEY});
    },
  });
}
import { apiClient } from '@/lib/api/client';
import type {
  AssetDetailDto,
  AssetPricingDto,
  AssetPricingQueryParams,
  CreateBookingPayload,
  MarketplaceEquipmentPagedResult,
  MarketplaceEquipmentQueryParams,
} from './equipmentTypes';

const MARKETPLACE_ASSETS_ENDPOINT = 'marketplace/assets';

interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string | null;
  data: T;
}

export async function fetchMarketplaceEquipment(
  params: MarketplaceEquipmentQueryParams,
): Promise<MarketplaceEquipmentPagedResult> {
  const { data } = await apiClient.get<ApiResponse<MarketplaceEquipmentPagedResult>>(
    MARKETPLACE_ASSETS_ENDPOINT,
    { params },
  );
  return data.data;
}

export async function fetchAssetDetail(assetId: string): Promise<AssetDetailDto> {
  const { data } = await apiClient.get<ApiResponse<AssetDetailDto>>(
    `assets/${assetId}`,
  );
  return data.data;
}

export async function fetchAssetPricing(
  assetId: string,
  params: AssetPricingQueryParams,
): Promise<AssetPricingDto> {
  const { data } = await apiClient.get<ApiResponse<AssetPricingDto>>(
    `assets/${assetId}/pricing`,
    { params },
  );
  return data.data;
}

export async function createBooking(
  payload: CreateBookingPayload,
): Promise<{ bookingId: string }> {
  const { data } = await apiClient.post<ApiResponse<{ bookingId: string }>>(
    'bookings',
    payload,
  );
  return data.data;
}
import { apiClient } from '@/lib/api/client';
import { extractApiData } from '@/lib/api/extractApiData';
import { supplierAssetApiPaths } from './onboardingConfig';

export const MACHINE_TYPE_ENUM: Record<string, number> = {
  excavator: 0,
  bulldozer: 1,
  payloader: 2,
  tipper: 3,
  grader: 4,
  crane: 5,
  compactor: 6,
};

export interface CreateAssetPayload {
  machineType: number;
  brand: string;
  model: string;
  yearOfManufacture: number;
  engineHours: number;
  hasCertifiedOperator?: boolean;
  dailyRentalRate: number;
  mobilizationFeePerKm: number;
  description?: string;
}

export async function createAsset(payload: CreateAssetPayload): Promise<unknown> {
  const { data } = await apiClient.post(supplierAssetApiPaths.assets, payload);
  return extractApiData<unknown>(data);
}

export async function fetchAssets(): Promise<unknown> {
  const { data } = await apiClient.get(supplierAssetApiPaths.assets);
  return extractApiData<unknown>(data);
}

export async function updateAsset(
  assetId: string,
  payload: Partial<CreateAssetPayload>,
): Promise<unknown> {
  const { data } = await apiClient.put(supplierAssetApiPaths.asset(assetId), payload);
  return extractApiData<unknown>(data);
}

export async function deleteAsset(assetId: string): Promise<void> {
  await apiClient.delete(supplierAssetApiPaths.asset(assetId));
}

export interface AssetPhotosPayload {
  frontPhoto?: File;
  sidePhoto?: File;
  serialPlatePhoto?: File;
}

export async function uploadAssetPhotos(
  assetId: string,
  photos: AssetPhotosPayload,
): Promise<void> {
  const formData = new FormData();
  if (photos.frontPhoto) formData.append('FrontPhoto', photos.frontPhoto);
  if (photos.sidePhoto) formData.append('SidePhoto', photos.sidePhoto);
  if (photos.serialPlatePhoto) formData.append('SerialPlatePhoto', photos.serialPlatePhoto);

  await apiClient.post(supplierAssetApiPaths.assetPhotos(assetId), formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}
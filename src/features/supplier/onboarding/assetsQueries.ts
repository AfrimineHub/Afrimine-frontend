import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createAsset,
  deleteAsset,
  fetchAsset,
  fetchAssets,
  updateAsset,
  uploadAssetPhotos,
  type AssetPhotosPayload,
  type CreateAssetPayload,
  type UpdateAssetPayload,
} from './assetsApi';

export const SUPPLIER_ASSETS_QUERY_KEY = ['supplier', 'assets'] as const;
const MARKETPLACE_EQUIPMENT_QUERY_KEY = ['marketplace', 'equipment'] as const;
const ASSET_DETAIL_QUERY_KEY = ['marketplace', 'asset'] as const;

function invalidateAssetCaches(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: SUPPLIER_ASSETS_QUERY_KEY });
  queryClient.invalidateQueries({ queryKey: MARKETPLACE_EQUIPMENT_QUERY_KEY });
  queryClient.invalidateQueries({ queryKey: ASSET_DETAIL_QUERY_KEY });
}

export function useSupplierAssetsQuery() {
  return useQuery({
    queryKey: SUPPLIER_ASSETS_QUERY_KEY,
    queryFn: fetchAssets,
    staleTime: 60 * 1000,
  });
}

export function useSupplierAssetQuery(assetId: string | undefined) {
  return useQuery({
    queryKey: [...SUPPLIER_ASSETS_QUERY_KEY, assetId],
    queryFn: () => fetchAsset(assetId as string),
    enabled: Boolean(assetId),
  });
}

export function useCreateAssetMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateAssetPayload) => createAsset(payload),
    onSuccess: () => {
      invalidateAssetCaches(queryClient);
    },
  });
}

export function useUpdateAssetMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ assetId, payload }: { assetId: string; payload: UpdateAssetPayload }) =>
      updateAsset(assetId, payload),
    onSuccess: () => {
      invalidateAssetCaches(queryClient);
    },
  });
}

export function useDeleteAssetMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (assetId: string) => deleteAsset(assetId),
    onSuccess: () => {
      invalidateAssetCaches(queryClient);
    },
  });
}

/** Call only once the asset has a real backend id (MachineAsset.remoteId). */
export function useUploadAssetPhotosMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ assetId, photos }: { assetId: string; photos: AssetPhotosPayload }) =>
      uploadAssetPhotos(assetId, photos),
    onSuccess: () => {
      invalidateAssetCaches(queryClient);
    },
  });
}

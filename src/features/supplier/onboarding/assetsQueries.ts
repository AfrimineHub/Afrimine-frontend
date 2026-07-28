import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createAsset,
  deleteAsset,
  fetchAssets,
  updateAsset,
  uploadAssetPhotos,
  type AssetPhotosPayload,
  type CreateAssetPayload,
} from './assetsApi';

export const SUPPLIER_ASSETS_QUERY_KEY = ['supplier', 'assets'] as const;

export function useSupplierAssetsQuery() {
  return useQuery({
    queryKey: SUPPLIER_ASSETS_QUERY_KEY,
    queryFn: fetchAssets,
    staleTime: 60 * 1000,
  });
}

export function useCreateAssetMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateAssetPayload) => createAsset(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUPPLIER_ASSETS_QUERY_KEY });
    },
  });
}

export function useUpdateAssetMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ assetId, payload }: { assetId: string; payload: Partial<CreateAssetPayload> }) =>
      updateAsset(assetId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUPPLIER_ASSETS_QUERY_KEY });
    },
  });
}

export function useDeleteAssetMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (assetId: string) => deleteAsset(assetId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUPPLIER_ASSETS_QUERY_KEY });
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
      queryClient.invalidateQueries({ queryKey: SUPPLIER_ASSETS_QUERY_KEY });
    },
  });
}
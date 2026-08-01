import { useMutation, useQuery, useQueryClient, type UseQueryOptions } from '@tanstack/react-query';
import {
  fetchSupplierProfile,
  fetchSupplierStatus,
  submitSupplierOnboarding,
  syncLocationStep,
  updateSupplierProfile,
  uploadSupplierCacCertificate,
} from './onboardingApi';
import type { SupplierIdentity, SupplierLocation } from '@/features/supplier/types';

export const SUPPLIER_PROFILE_QUERY_KEY = ['supplier', 'profile'] as const;
export const SUPPLIER_STATUS_QUERY_KEY = ['supplier', 'status'] as const;

export function useSyncLocationMutation() {
  return useMutation({
    mutationFn: (location: SupplierLocation) => syncLocationStep(location),
  });
}

export function useUpdateSupplierProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (identity: Pick<SupplierIdentity, 'companyName' | 'phone' | 'email'>) =>
      updateSupplierProfile(identity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUPPLIER_PROFILE_QUERY_KEY });
    },
  });
}

export function useUploadSupplierCacCertificateMutation() {
  return useMutation({
    mutationFn: (file: File) => uploadSupplierCacCertificate(file),
  });
}

export function useSubmitSupplierOnboardingMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => submitSupplierOnboarding(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUPPLIER_STATUS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: SUPPLIER_PROFILE_QUERY_KEY });
    },
  });
}

export function useSupplierProfileQuery(
  options?: Pick<UseQueryOptions<unknown>, 'enabled'>,
) {
  return useQuery({
    queryKey: SUPPLIER_PROFILE_QUERY_KEY,
    queryFn: fetchSupplierProfile,
    staleTime: 60 * 1000,
    ...options,
  });
}

export function useSupplierStatusQuery(
  options?: Pick<UseQueryOptions<unknown>, 'enabled'>,
) {
  return useQuery({
    queryKey: SUPPLIER_STATUS_QUERY_KEY,
    queryFn: fetchSupplierStatus,
    staleTime: 60 * 1000,
    ...options, 
  });
}
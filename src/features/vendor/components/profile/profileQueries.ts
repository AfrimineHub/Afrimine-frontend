import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  fetchSupplierProfile,
  fetchSupplierStatus,
  updateSupplierProfile,
} from '@/features/supplier/onboarding/onboardingApi';
import {
  normalizeSupplierIdentity,
  normalizeVerificationStatus,
  isSupplierBlocked,
} from '@/features/supplier/onboarding/onboardingNormalize';
import type { SupplierIdentity, SupplierVerificationStatus } from '@/features/supplier/types';
import { submitSupplierOnboarding } from '@/features/supplier/onboarding/onboardingApi';

export interface VendorProfileFormData extends SupplierIdentity {
  country: string;
  officeAddress?: string;
}

function normalizeVendorProfileFormData(raw: unknown): VendorProfileFormData {
  const identity = normalizeSupplierIdentity(raw);
  const record = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};
  const country = typeof record.country === 'string' ? record.country : '';
  const officeAddress =
    typeof record.officeAddress === 'string'
      ? record.officeAddress
      : '';

  return {
     ...identity, 
     country,
     officeAddress,
  };
}

export const vendorProfileKeys = {
  profile: ['vendor', 'profile'] as const,
  status: ['vendor', 'profile', 'status'] as const,
};

export function useVendorProfileQuery() {
  return useQuery({
    queryKey: vendorProfileKeys.profile,
    queryFn: async () => normalizeVendorProfileFormData(await fetchSupplierProfile()),
  });
}

export interface VendorAccountStatus {
  verification: SupplierVerificationStatus;
  blocked: boolean;
}

export function useVendorAccountStatusQuery() {
  return useQuery<VendorAccountStatus>({
    queryKey: vendorProfileKeys.status,
    queryFn: async () => {
      const raw = await fetchSupplierStatus();
      return {
        verification: normalizeVerificationStatus(raw),
        blocked: isSupplierBlocked(raw),
      };
    },
  });
}

export function useUpdateVendorProfileMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (identity: Pick<SupplierIdentity, 'companyName' | 'phone' | 'email' | 'officeAddress'>) =>
      updateSupplierProfile(identity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vendorProfileKeys.profile });
    },
  });
}

export function useSubmitKycMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: submitSupplierOnboarding,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vendorProfileKeys.status });
    },
  });
}


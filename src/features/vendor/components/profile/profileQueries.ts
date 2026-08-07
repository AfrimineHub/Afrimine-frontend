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
import type { SupplierIdentity } from '@/features/supplier/types';

export interface VendorProfileFormData extends SupplierIdentity {
  /**
   * Not part of SupplierIdentity — pulled separately because
   * VendorProfileResponseDto (swagger) shows GET /suppliers/me returning
   * a `country` field alongside the identity fields. Unverified against a
   * real response — confirm the key name once you have one.
   */
  country: string;
}

function normalizeVendorProfileFormData(raw: unknown): VendorProfileFormData {
  const identity = normalizeSupplierIdentity(raw);
  const record = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};
  const country = typeof record.country === 'string' ? record.country : '';
  return { ...identity, country };
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
  verification: 'draft' | 'pending_verification' | 'verified' | 'rejected';
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
    mutationFn: (identity: Pick<SupplierIdentity, 'companyName' | 'phone' | 'email'>) =>
      updateSupplierProfile(identity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vendorProfileKeys.profile });
    },
  });
}
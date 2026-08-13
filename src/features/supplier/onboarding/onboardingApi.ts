import { apiClient } from '@/lib/api/client';
import { extractApiData } from '@/lib/api/extractApiData';
import { supplierOnboardingApiPaths } from './onboardingConfig';
import type { SupplierIdentity, SupplierLocation } from '@/features/supplier/types';

export interface SupplierLocationPayload {
  primaryBaseCity: string;
  yardAddress: string;
  latitude?: number | null;
  longitude?: number | null;
}

export async function syncLocationStep(location: SupplierLocation): Promise<void> {
  const payload: SupplierLocationPayload = {
    primaryBaseCity: location.baseCity,
    yardAddress: location.yardAddress,
    latitude: location.lat ?? null,
    longitude: location.lng ?? null,
  };
  await apiClient.put(supplierOnboardingApiPaths.location, payload);
}

export interface SupplierProfileUpdatePayload {
  companyName?: string;
  businessPhone?: string;
  businessEmail?: string;
  bankName?: string;
  bankCode?: string;
  bankAccountNumber?: string;
  bankAccountName?: string;
}

export type SupplierProfileUpdateInput = Partial<
  Pick<
    SupplierIdentity,
    'companyName' | 'phone' | 'email' | 'bankName' | 'bankCode' | 'bankAccountNumber' | 'bankAccountName'
  >
>;


export async function updateSupplierProfile(
  identity: SupplierProfileUpdateInput
): Promise<unknown> {
  const payload: SupplierProfileUpdatePayload = {};
  if (identity.companyName !== undefined) payload.companyName = identity.companyName;
  if (identity.phone !== undefined) payload.businessPhone = identity.phone;
  if (identity.email !== undefined) payload.businessEmail = identity.email;
  if (identity.bankName !== undefined) payload.bankName = identity.bankName;
  if (identity.bankCode !== undefined) payload.bankCode = identity.bankCode;
  if (identity.bankAccountNumber !== undefined) payload.bankAccountNumber = identity.bankAccountNumber;
  if (identity.bankAccountName !== undefined) payload.bankAccountName = identity.bankAccountName;

  const { data } = await apiClient.patch(supplierOnboardingApiPaths.profile, payload);
  return extractApiData<unknown>(data);
}

export async function uploadSupplierCacCertificate(file: File): Promise<void> {
  const formData = new FormData();
  formData.append('Document', file);
  await apiClient.post(supplierOnboardingApiPaths.documents, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}

export async function submitSupplierOnboarding(): Promise<void> {
  await apiClient.post(supplierOnboardingApiPaths.submit);
}

export async function fetchSupplierProfile(): Promise<unknown> {
  const { data } = await apiClient.get(supplierOnboardingApiPaths.me);
  return extractApiData<unknown>(data);
}

export async function fetchSupplierStatus(): Promise<unknown> {
  const { data } = await apiClient.get(supplierOnboardingApiPaths.status);
  return extractApiData<unknown>(data);
}
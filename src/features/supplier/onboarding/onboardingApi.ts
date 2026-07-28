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
}

export async function updateSupplierProfile(
  identity: Pick<SupplierIdentity, 'companyName' | 'phone' | 'email'>,
): Promise<void> {
  const payload: SupplierProfileUpdatePayload = {
    companyName: identity.companyName,
    businessPhone: identity.phone,
    businessEmail: identity.email,
  };
  await apiClient.patch(supplierOnboardingApiPaths.profile, payload);
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
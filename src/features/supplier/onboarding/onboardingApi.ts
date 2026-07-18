import { apiClient } from '@/lib/api/client';
import { extractApiData } from '@/lib/api/extractApiData';
import type { SupplierLocation, SupplierOnboardingDraft } from '@/features/supplier/types';


export interface VendorOnboardingProfile {
  businessType?: number;
  country?: string;
  stateOrRegion?: string;
  officeAddress?: string;
  website?: string;
  documentType?: number;
  documentFileName?: string;
  documentUrl?: string;
  onboardingStep?: number;
  isComplete?: boolean;
}

export async function fetchVendorOnboardingProfile(): Promise<VendorOnboardingProfile | null> {
  try {
    const { data } = await apiClient.get('onboarding');
    return extractApiData<VendorOnboardingProfile>(data);
  } catch {
    return null;
  }
}

export async function saveBusinessProfile(location: SupplierLocation): Promise<void> {
  await apiClient.post('onboarding/business-profile', {
    businessType: 1,
    country: 'Nigeria',
    stateOrRegion: location.baseCity,
    officeAddress: location.yardAddress,
    website: '',
  });
}

export async function uploadKycDocument(file: File, documentType = 1): Promise<void> {
  const form = new FormData();
  form.append('DocumentType', String(documentType));
  form.append('File', file);
  await apiClient.post('onboarding/kyc', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}

/** Best-effort sync of location step to existing onboarding API. */
export async function syncLocationStep(location: SupplierLocation): Promise<void> {
  try {
    await saveBusinessProfile(location);
  } catch {
    // Backend may reject until schema is extended; draft is still saved locally.
  }
}

export async function submitOnboardingDraft(
  draft: SupplierOnboardingDraft,
): Promise<SupplierOnboardingDraft> {
  await syncLocationStep(draft.location);
  return {
    ...draft,
    step: 5,
    status: 'pending_verification',
    submittedAt: new Date().toISOString(),
  };
}

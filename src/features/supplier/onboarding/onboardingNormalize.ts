import { ACCOUNT_STATUS, isAccountBlocked } from '../constants';

import { 
  createEmptyMachine, 
  type MachineAsset, 
  type SupplierIdentity, 
  type SupplierLocation 
} from '@/features/supplier/types';

function str(r: Record<string, unknown>, keys: string[]): string {
  for (const k of keys) {
    const v = r[k];
    if (typeof v === 'string') return v;
  }
  return '';
}
function num(r: Record<string, unknown>, keys: string[]): number | undefined {
  for (const k of keys) {
    const v = r[k];
    if (typeof v === 'number') return v;
  }
  return undefined;
}
function bool(r: Record<string, unknown>, keys: string[]): boolean {
  for (const k of keys) {
    const v = r[k];
    if (typeof v === 'boolean') return v;
  }
  return false;
}

function asRecord(raw: unknown): Record<string, unknown> {
  return raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};
}

export function getAccountStatus(statusData: unknown): number | undefined {
  const value = asRecord(statusData).status;
  return typeof value === 'number' ? value : undefined;
}

export function isSupplierBlocked(statusData: unknown): boolean {
  return isAccountBlocked(getAccountStatus(statusData));
}

export function isSupplierPendingReview(statusData: unknown): boolean {
  return getAccountStatus(statusData) === ACCOUNT_STATUS.Pending;
}

export function normalizeSupplierIdentity(raw: unknown): SupplierIdentity {
  const r = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  return {
    fullName: str(r, ['fullName']),
    companyName: str(r, ['companyName']),
    phone: str(r, ['businessPhone', 'phone']),
    email: str(r, ['businessEmail', 'email']),
    otpVerified: bool(r, ['otpVerified', 'emailVerified', 'isEmailVerified']),
  };
}

export function normalizeSupplierLocation(raw: unknown): SupplierLocation {
  const r = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  return {
    baseCity: str(r, ['primaryBaseCity', 'baseCity']),
    yardAddress: str(r, ['yardAddress']),
    lat: num(r, ['latitude', 'lat']),
    lng: num(r, ['longitude', 'lng']),
  };
}

export function hasCompletedLocation(loc: SupplierLocation): boolean {
  return Boolean(loc.baseCity && loc.yardAddress.trim());
}

/** GET /suppliers/me → CAC document status. */
export function normalizeSupplierDocuments(raw: unknown): { cacUploaded: boolean } {
  const r = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  return {
    cacUploaded: bool(r, ['hasCacCertificate', 'cacUploaded']) || Boolean(str(r, ['cacCertificateUrl'])),
  };
}

/** GET /assets → list of MachineAsset for display/edit. */
export function normalizeAssetsList(raw: unknown): MachineAsset[] {
  const items: unknown[] = Array.isArray(raw)
    ? raw
    : raw && typeof raw === 'object' && Array.isArray((raw as Record<string, unknown>).items)
      ? ((raw as Record<string, unknown>).items as unknown[])
      : [];

  return items.map((item) => {
    const r = (item && typeof item === 'object' ? item : {}) as Record<string, unknown>;
    const base = createEmptyMachine();
    return {
      ...base,
      remoteId: str(r, ['id']) || undefined,
      machineType: str(r, ['machineType']),
      brand: str(r, ['brand']),
      model: str(r, ['model']),
      yearOfManufacture: String(num(r, ['yearOfManufacture']) ?? ''),
      engineHours: String(num(r, ['engineHours']) ?? ''),
      includesOperator: bool(r, ['hasCertifiedOperator']),
      dailyRentalRate: String(num(r, ['dailyRentalRate']) ?? ''),
      mobilizationFeePerKm: String(num(r, ['mobilizationFeePerKm']) ?? ''),
      description: str(r, ['description']) || undefined,
    };
  });
}

export function normalizeVerificationStatus(raw: unknown): 'draft' | 'pending_verification' | 'verified' | 'rejected' {
  const r = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  const value = str(r, ['status', 'verificationStatus', 'supplierStatus']).toUpperCase();
  if (value === 'PENDING') return 'pending_verification';
  if (value === 'VERIFIED' || value === 'APPROVED') return 'verified';
  if (value === 'REJECTED') return 'rejected';
  return 'draft';
}

/**
 * Whether the supplier has finished the onboarding wizard — NOT whether
 * admin has approved them. Deliberately independent of AccountStatus,
 * since AccountStatus defaults to Pending for brand-new accounts too and
 * can't distinguish "never started" from "submitted, awaiting review".
 *
 * Preferred: backend adds `onboardingSubmittedAt` to GET /suppliers/status,
 * set exactly when POST /suppliers/submit succeeds — this function switches
 * to trusting it automatically the moment it appears in the response.
 * Until then, falls back to checking profile-field completeness from
 * GET /suppliers/me. Delete the fallback branch once the real field ships.
 */
export function isOnboardingSubmitted(statusData: unknown, profileData: unknown): boolean {
  const status = asRecord(statusData);

  if (typeof status.onboardingSubmittedAt === 'string') {
    return true;
  }
  if ('onboardingSubmittedAt' in status) {
    // Field exists but is null — authoritative "not submitted yet".
    return false;
  }

  // Fallback: field doesn't exist on this backend response yet.
  const profile = asRecord(profileData);
  return Boolean(
    profile.companyName &&
      profile.businessPhone &&
      profile.businessEmail &&
      profile.primaryBaseCity &&
      profile.yardAddress &&
      Array.isArray(profile.documents) &&
      profile.documents.length > 0,
  );
}
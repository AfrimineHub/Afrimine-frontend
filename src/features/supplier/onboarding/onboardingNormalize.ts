import { ACCOUNT_STATUS, ASSET_STATUS_FROM_ENUM, isAccountBlocked } from '../constants';
import { MACHINE_TYPE_FROM_ENUM } from './assetsApi';
import {
  createEmptyMachine,
  type MachineAsset,
  type SupplierIdentity,
  type SupplierLocation,
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

export function getAccountStatus(statusData: unknown): string | undefined {
  const value = asRecord(statusData).status;
  return typeof value === 'string' ? value : undefined;
}

export function isSupplierBlocked(statusData: unknown): boolean {
  return isAccountBlocked(getAccountStatus(statusData));
}

export function isOnboardingSubmitted(statusData: unknown): boolean {
  return asRecord(statusData).isSubmitted === true;
}

export function isSupplierPendingReview(statusData: unknown): boolean {
  return getAccountStatus(statusData) === ACCOUNT_STATUS.Pending;
}

export function getOnboardingStep(statusData: unknown): number | undefined {
  const value = asRecord(statusData).onboardingStep;
  return typeof value === 'number' ? value : undefined;
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

function normalizeMachineType(raw: unknown): string {
  if (typeof raw === 'number' && MACHINE_TYPE_FROM_ENUM[raw]) {
    return MACHINE_TYPE_FROM_ENUM[raw];
  }
  if (typeof raw === 'string') {
    const asNum = Number(raw);
    if (!Number.isNaN(asNum) && MACHINE_TYPE_FROM_ENUM[asNum]) {
      return MACHINE_TYPE_FROM_ENUM[asNum];
    }
    return raw.toLowerCase();
  }
  return '';
}

function normalizeAssetStatus(raw: unknown): string | undefined {
  if (typeof raw === 'number' && ASSET_STATUS_FROM_ENUM[raw]) {
    return ASSET_STATUS_FROM_ENUM[raw];
  }
  if (typeof raw === 'string') {
    const asNum = Number(raw);
    if (!Number.isNaN(asNum) && ASSET_STATUS_FROM_ENUM[asNum]) {
      return ASSET_STATUS_FROM_ENUM[asNum];
    }
    return raw;
  }
  return undefined;
}

/** GET /assets or /assets/{id} → MachineAsset for display/edit. */
export function normalizeMachineAsset(raw: unknown): MachineAsset | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, unknown>;
  const remoteId = str(r, ['id']);
  if (!remoteId) return null;

  const base = createEmptyMachine();
  return {
    ...base,
    remoteId,
    machineType: normalizeMachineType(r.machineType),
    brand: str(r, ['brand']),
    model: str(r, ['model']),
    yearOfManufacture: String(num(r, ['yearOfManufacture']) ?? ''),
    engineHours: String(num(r, ['engineHours']) ?? ''),
    includesOperator: bool(r, ['hasCertifiedOperator']),
    dailyRentalRate: String(num(r, ['dailyRentalRate']) ?? ''),
    mobilizationFeePerKm: String(num(r, ['mobilizationFeePerKm']) ?? ''),
    description: str(r, ['description']) || undefined,
    status: normalizeAssetStatus(r.status),
  };
}

/** GET /assets → list of MachineAsset for display/edit. */
export function normalizeAssetsList(raw: unknown): MachineAsset[] {
  const items: unknown[] = Array.isArray(raw)
    ? raw
    : raw && typeof raw === 'object' && Array.isArray((raw as Record<string, unknown>).items)
      ? ((raw as Record<string, unknown>).items as unknown[])
      : [];

  return items.map(normalizeMachineAsset).filter((m): m is MachineAsset => m !== null);
}

export function normalizeVerificationStatus(raw: unknown): 'draft' | 'pending_verification' | 'verified' | 'rejected' {
  const r = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  const value = str(r, ['status', 'verificationStatus', 'supplierStatus']).toUpperCase();
  if (value === 'PENDING') return 'pending_verification';
  if (value === 'VERIFIED' || value === 'APPROVED') return 'verified';
  if (value === 'REJECTED') return 'rejected';
  return 'draft';
}
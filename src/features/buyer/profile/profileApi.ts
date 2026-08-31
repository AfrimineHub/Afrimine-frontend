import { fetchCurrentUser } from '@/features/auth/api';
import { apiClient } from '@/lib/api/client';
import { extractApiData } from '@/lib/api/extractApiData';
import { buyerProfileApiPaths } from './profileConfig';
import type { BuyerBusinessProfile, BuyerBusinessProfileInput } from './profileTypes';

function str(record: Record<string, unknown>, keys: string[]): string {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === 'string') return value;
  }
  return '';
}

function num(record: Record<string, unknown>, keys: string[]): number | undefined {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === 'number') return value;
  }
  return undefined;
}

function bool(record: Record<string, unknown>, keys: string[]): boolean {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === 'boolean') return value;
  }
  return false;
}

export function normalizeBuyerBusinessProfile(raw: unknown): BuyerBusinessProfile {
  const record = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};

  return {
    businessType: num(record, ['businessType']),
    country: str(record, ['country']),
    stateOrRegion: str(record, ['stateOrRegion', 'state']),
    officeAddress: str(record, ['officeAddress']),
    website: str(record, ['website']),
    onboardingStep: num(record, ['onboardingStep']),
    isComplete: bool(record, ['isComplete']),
  };
}

export async function fetchBuyerOnboardingProfile(): Promise<BuyerBusinessProfile> {
  const { data } = await apiClient.get(buyerProfileApiPaths.onboarding);
  return normalizeBuyerBusinessProfile(extractApiData<unknown>(data));
}

export async function updateBuyerBusinessProfile(
  input: BuyerBusinessProfileInput,
): Promise<BuyerBusinessProfile> {
  const { data } = await apiClient.post(buyerProfileApiPaths.businessProfile, input);
  return normalizeBuyerBusinessProfile(extractApiData<unknown>(data));
}

export async function fetchBuyerAccountProfile() {
  return fetchCurrentUser();
}

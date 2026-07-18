import {
  createEmptyDraft,
  type OnboardingStep,
  type SupplierOnboardingDraft,
} from '@/features/supplier/types';
import { SUPPLIER_ONBOARDING_STORAGE_KEY } from '@/features/supplier/constants';

function storageKey(userId?: string | null): string {
  return userId
    ? `${SUPPLIER_ONBOARDING_STORAGE_KEY}.${userId}`
    : SUPPLIER_ONBOARDING_STORAGE_KEY;
}

export function loadOnboardingDraft(userId?: string | null): SupplierOnboardingDraft {
  try {
    const raw = localStorage.getItem(storageKey(userId));
    if (!raw) return createEmptyDraft();
    const parsed = JSON.parse(raw) as SupplierOnboardingDraft;
    if (!parsed?.identity || !parsed?.location || !Array.isArray(parsed.machines)) {
      return createEmptyDraft();
    }
    return parsed;
  } catch {
    return createEmptyDraft();
  }
}

export function saveOnboardingDraft(
  draft: SupplierOnboardingDraft,
  userId?: string | null,
): void {
  localStorage.setItem(storageKey(userId), JSON.stringify(draft));
}

export function clearOnboardingDraft(userId?: string | null): void {
  localStorage.removeItem(storageKey(userId));
}

export function isOnboardingComplete(draft: SupplierOnboardingDraft): boolean {
  return (
    draft.status === 'pending_verification' ||
    draft.status === 'verified' ||
    Boolean(draft.submittedAt)
  );
}

export function isOnboardingSubmitted(draft: SupplierOnboardingDraft): boolean {
  return draft.status === 'pending_verification' || draft.status === 'verified';
}

export function clampStep(step: number): OnboardingStep {
  if (step < 1) return 1;
  if (step > 5) return 5;
  return step as OnboardingStep;
}

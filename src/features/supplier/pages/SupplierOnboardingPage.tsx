import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { SupplierStepper } from '@/features/supplier/components/SupplierStepper';
import { Step1Identity } from '@/features/supplier/onboarding/steps/Step1Identity';
import { Step2Location } from '@/features/supplier/onboarding/steps/Step2Location';
import { Step3Assets } from '@/features/supplier/onboarding/steps/Step3Assets';
import { Step4Documents } from '@/features/supplier/onboarding/steps/Step4Documents';
import { Step5Submission } from '@/features/supplier/onboarding/steps/Step5Submission';
import { syncLocationStep } from '@/features/supplier/onboarding/onboardingApi';
import {
  clampStep,
  loadOnboardingDraft,
  saveOnboardingDraft,
} from '@/features/supplier/onboarding/onboardingStorage';
import { SUPPLIER_DASHBOARD_PATH } from '@/features/supplier/constants';
import type { AuthUser } from '@/features/auth/types';
import type { OnboardingStep, SupplierOnboardingDraft } from '@/features/supplier/types';

function seedDraftFromUser(user: AuthUser | null | undefined): SupplierOnboardingDraft {
  const stored = loadOnboardingDraft(user?.id);
  return {
    ...stored,
    identity: {
      ...stored.identity,
      fullName: stored.identity.fullName || user?.fullName || '',
      companyName: stored.identity.companyName || user?.companyName || '',
      email: stored.identity.email || user?.email || '',
      phone: stored.identity.phone || user?.phone || '',
      otpVerified: stored.identity.otpVerified,
    },
  };
}

export default function SupplierOnboardingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [draft, setDraft] = useState<SupplierOnboardingDraft>(() => seedDraftFromUser(user));
  const [hydratedUserId, setHydratedUserId] = useState(user?.id);

  // Re-seed when session user id becomes available after first paint.
  if (user?.id && user.id !== hydratedUserId) {
    setHydratedUserId(user.id);
    setDraft(seedDraftFromUser(user));
  }

  useEffect(() => {
    saveOnboardingDraft(draft, user?.id);
  }, [draft, user?.id]);

  const goTo = (step: OnboardingStep) => {
    setDraft((prev) => ({ ...prev, step: clampStep(step) }));
  };

  const persistAndContinue = async (next: SupplierOnboardingDraft, step: OnboardingStep) => {
    if (step === 3) {
      await syncLocationStep(next.location);
    }
    setDraft({ ...next, step });
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6">
      <div className="mx-auto w-full max-w-xl">
        <div className="mb-6 text-center sm:text-left">
          <p className="text-[11px] font-bold uppercase tracking-widest text-[#CA8A04]">
            Equipment supplier
          </p>
          <h1 className="mt-1 text-3xl font-bold text-slate-900">Supplier onboarding</h1>
          <p className="mt-2 text-sm text-slate-500">
            Complete your asset-owner profile to list machines on Afrimine.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-8 shadow-sm">
          <SupplierStepper currentStep={draft.step} />

          {draft.step === 1 && (
            <Step1Identity
              value={draft.identity}
              onChange={(identity) => setDraft((prev) => ({ ...prev, identity }))}
              onContinue={() => goTo(2)}
            />
          )}

          {draft.step === 2 && (
            <Step2Location
              value={draft.location}
              onChange={(location) => setDraft((prev) => ({ ...prev, location }))}
              onBack={() => goTo(1)}
              onContinue={() =>
                void persistAndContinue({ ...draft, location: draft.location }, 3)
              }
            />
          )}

          {draft.step === 3 && (
            <Step3Assets
              value={draft.machines}
              onChange={(machines) => setDraft((prev) => ({ ...prev, machines }))}
              onBack={() => goTo(2)}
              onContinue={() => goTo(4)}
            />
          )}

          {draft.step === 4 && (
            <Step4Documents
              value={draft.documents}
              onChange={(documents) => setDraft((prev) => ({ ...prev, documents }))}
              onBack={() => goTo(3)}
              onContinue={() => goTo(5)}
            />
          )}

          {draft.step === 5 && (
            <Step5Submission
              draft={draft}
              onBack={() => goTo(4)}
              onSubmitted={(next) => setDraft(next)}
              onGoToDashboard={() => navigate(SUPPLIER_DASHBOARD_PATH, { replace: true })}
            />
          )}
        </div>
      </div>
    </div>
  );
}

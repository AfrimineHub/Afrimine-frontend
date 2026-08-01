import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { SupplierStepper } from '@/features/supplier/components/SupplierStepper';
import { Step1Identity } from '@/features/supplier/onboarding/steps/Step1Identity';
import { Step2Location } from '@/features/supplier/onboarding/steps/Step2Location';
import { Step3Assets } from '@/features/supplier/onboarding/steps/Step3Assets';
import { Step4Documents } from '@/features/supplier/onboarding/steps/Step4Documents';
import { Step5Submission } from '@/features/supplier/onboarding/steps/Step5Submission';
import {
  useSupplierProfileQuery,
  useSupplierStatusQuery,
} from '@/features/supplier/onboarding/onboardingQueries';
import { useSupplierAssetsQuery } from '@/features/supplier/onboarding/assetsQueries';
import {
  normalizeSupplierIdentity,
  normalizeSupplierLocation,
  normalizeSupplierDocuments,
  normalizeVerificationStatus,
  isOnboardingSubmitted,
  getOnboardingStep,
} from '@/features/supplier/onboarding/onboardingNormalize';
import { normalizeAssetsList } from '@/features/supplier/onboarding/onboardingNormalize';
import { clampStep } from '@/features/supplier/types';
import { SUPPLIER_DASHBOARD_PATH } from '@/features/supplier/constants';
import type { OnboardingStep } from '@/features/supplier/types';
import { isEmailVerified as isUserEmailVerified } from '@/features/auth/types';

export default function SupplierOnboardingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const profileQuery = useSupplierProfileQuery();
  const statusQuery = useSupplierStatusQuery();
  const assetsQuery = useSupplierAssetsQuery();

  const identity = useMemo(() => normalizeSupplierIdentity(profileQuery.data), [profileQuery.data]);
  const location = useMemo(() => normalizeSupplierLocation(profileQuery.data), [profileQuery.data]);
  const documents = useMemo(() => normalizeSupplierDocuments(profileQuery.data), [profileQuery.data]);
  const assets = useMemo(() => normalizeAssetsList(assetsQuery.data), [assetsQuery.data]);
  const status = useMemo(() => normalizeVerificationStatus(statusQuery.data), [statusQuery.data]);

  const submitted = statusQuery.isSuccess && isOnboardingSubmitted(statusQuery.data);

  const furthestCompletedStep = useMemo((): OnboardingStep => {
    if (submitted) return 5;
    if (statusQuery.isSuccess) {
      const backendStep = getOnboardingStep(statusQuery.data);
      if (backendStep != null) return clampStep(backendStep);
    }
    return 1;
  }, [submitted, statusQuery.isSuccess, statusQuery.data]);

  const [manualStep, setManualStep] = useState<OnboardingStep | null>(null);
  const currentStep = manualStep ?? furthestCompletedStep;

  const isLoading = profileQuery.isLoading || statusQuery.isLoading || assetsQuery.isLoading;

  const goTo = (step: OnboardingStep) => setManualStep(clampStep(step));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-sm text-slate-500">Loading your onboarding progress…</p>
      </div>
    );
  }

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
          <SupplierStepper currentStep={currentStep} />

          {currentStep === 1 && (
            <Step1Identity
              initialValue={identity}
              onContinue={() => {
                profileQuery.refetch();
                statusQuery.refetch();
                goTo(2);
              }}
              isEmailVerified={isUserEmailVerified(user)}
            />
          )}

          {currentStep === 2 && (
            <Step2Location
              initialValue={location}
              onBack={() => goTo(1)}
              onContinue={() => {
                profileQuery.refetch();
                statusQuery.refetch();
                goTo(3);
              }}
            />
          )}

          {currentStep === 3 && (
            <Step3Assets
              initialValue={assets}
              onBack={() => goTo(2)}
              onContinue={() => {
                assetsQuery.refetch();
                statusQuery.refetch();
                goTo(4);
              }}
            />
          )}

          {currentStep === 4 && (
            <Step4Documents
              initialUploaded={documents.cacUploaded}
              onBack={() => goTo(3)}
              onContinue={() => {
                profileQuery.refetch();
                statusQuery.refetch();
                goTo(5);
              }}
            />
          )}

          {currentStep === 5 && (
            <Step5Submission
              companyName={identity.companyName}
              baseCity={location.baseCity}
              machinesCount={assets.length}
              cacUploaded={documents.cacUploaded}
              alreadySubmitted={status === 'pending_verification' || status === 'verified'}
              onBack={() => goTo(4)}
              onSubmitted={() => statusQuery.refetch()}
              onGoToDashboard={() => navigate(SUPPLIER_DASHBOARD_PATH, { replace: true })}
            />
          )}
        </div>
      </div>
    </div>
  );
}
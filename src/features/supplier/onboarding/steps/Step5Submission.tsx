import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/shared/buttons/Button';
import { useSubmitSupplierOnboardingMutation } from '@/features/supplier/onboarding/onboardingQueries';
import { getApiErrorMessage } from '@/lib/api/errors';
import type { SupplierOnboardingDraft } from '@/features/supplier/types';

interface Step5SubmissionProps {
  draft: SupplierOnboardingDraft;
  onSubmitted: (draft: SupplierOnboardingDraft) => void;
  onBack: () => void;
  onGoToDashboard: () => void;
}

export function Step5Submission({
  draft,
  onSubmitted,
  onBack,
  onGoToDashboard,
}: Step5SubmissionProps) {
  const [error, setError] = useState<string | null>(null);
  const submitOnboarding = useSubmitSupplierOnboardingMutation();
  const alreadySubmitted =
    draft.status === 'pending_verification' || draft.status === 'verified';

  const machinesWithAllPhotos = draft.machines.filter(
    (m) => m.frontPhotoName && m.sidePhotoName && m.serialPhotoName,
  ).length;

  const handleSubmit = async () => {
    setError(null);
    try {
      await submitOnboarding.mutateAsync();
      onSubmitted({
        ...draft,
        status: 'pending_verification',
        submittedAt: new Date().toISOString(),
      });
    } catch (err) {
      setError(getApiErrorMessage(err, 'Could not finalize onboarding. Your progress is saved — try again.'));
    }
  };

  if (alreadySubmitted) {
    return (
      <div className="text-center py-4">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-100">
          <CheckCircle2 className="text-[#CA8A04]" size={28} aria-hidden />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Thank you for registering!</h2>
        <p className="text-sm text-slate-500 mb-2 max-w-md mx-auto">
          Our field agents in the Jos / Nasarawa hub will contact you within 24 hours to complete
          physical verification.
        </p>
        <div className="inline-flex items-center rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#CA8A04] mb-8">
          Account pending verification
        </div>
        <Button type="button" onClick={onGoToDashboard}>
          Go to dashboard
        </Button>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 mb-1">Review & submit</h2>
      <p className="text-sm text-slate-500 mb-6">
        Confirm your details. Submitting moves your account to pending field verification.
      </p>

      {error && (
        <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      <div className="mb-6 space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm">
        <p>
          <span className="text-slate-500">Company:</span>{' '}
          <span className="font-semibold text-slate-900">{draft.identity.companyName}</span>
        </p>
        <p>
          <span className="text-slate-500">Base city:</span>{' '}
          <span className="font-semibold text-slate-900 capitalize">{draft.location.baseCity}</span>
        </p>
        <p>
          <span className="text-slate-500">Machines listed:</span>{' '}
          <span className="font-semibold text-slate-900">
            {draft.machines.length} ({machinesWithAllPhotos} with all photos)
          </span>
        </p>
        <p>
          <span className="text-slate-500">CAC certificate:</span>{' '}
          <span className="font-semibold text-slate-900">
            {draft.documents.cacCertificateName ? 'Uploaded' : 'Not uploaded'}
          </span>
        </p>
      </div>

      <div className="flex flex-col-reverse sm:flex-row gap-3">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button type="button" onClick={handleSubmit} disabled={submitOnboarding.isPending}>
          {submitOnboarding.isPending ? 'Submitting…' : 'Submit for verification'}
        </Button>
      </div>
    </div>
  );
}
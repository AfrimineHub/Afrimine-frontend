import { KycStepper } from "../../components/profile";
import { KycProgressCard } from "../../components/profile";
import { VerificationSection } from "../../components/profile";
import { DocumentItem } from "../../components/profile";
import { UploadZone } from "../../components/profile";
import { useSubmitKycMutation } from "../../components/profile/profileQueries";

export const KycPage = () => {
  const submitKyc = useSubmitKycMutation();

  return (
    <div className="p-6 space-y-6">
      <KycStepper />
      <KycProgressCard />

      {/* 1. Identity — no backend support for per-document KYC yet.
          Disabled until the backend exposes distinct document types. */}
      <VerificationSection
        title="1. Identity Verification"
        subtitle="Upload your government-issued ID and a recent selfie"
      >
        <div className="opacity-50 pointer-events-none space-y-3">
          <DocumentItem title="Government ID" status="pending" fileName="Not available yet" />
          <DocumentItem title="Selfie Photo" status="pending" fileName="Not available yet" />
        </div>
        <p className="text-xs text-gray-400 mt-2">Coming soon — pending backend support.</p>
      </VerificationSection>

      {/* 2. Address — same, no backend endpoint yet. */}
      <VerificationSection
        title="2. Address Verification"
        subtitle="Provide proof of your residential address"
      >
        <div className="opacity-50 pointer-events-none">
          <DocumentItem title="Utility Bill" status="pending" fileName="Not available yet" />
        </div>
        <p className="text-xs text-gray-400 mt-2">Coming soon — pending backend support.</p>
      </VerificationSection>

      {/* 3. Tax — no TIN endpoint yet. */}
      <VerificationSection
        title="3. Tax & Business Information"
        subtitle="Required for business transactions and compliance"
      >
        <div className="opacity-50 pointer-events-none">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium">Tax Identification Number (TIN)</p>
              <p className="text-xs text-gray-500">Not uploaded</p>
            </div>
            <button className="bg-gray-300 text-white px-4 py-2 rounded-lg text-sm cursor-not-allowed" disabled>
              Upload
            </button>
          </div>
          <UploadZone />
        </div>
        <p className="text-xs text-gray-400 mt-2">Coming soon — pending backend support.</p>
      </VerificationSection>

      {/* Submit — this one's real: POST /suppliers/submit */}
      <div className="flex flex-col items-end gap-2">
        {submitKyc.isError && (
          <span className="text-sm text-red-600">Couldn't submit. Please try again.</span>
        )}
        {submitKyc.isSuccess && (
          <span className="text-sm text-green-600">Submitted for verification.</span>
        )}
        <button
          onClick={() => submitKyc.mutate()}
          disabled={submitKyc.isPending}
          className="bg-yellow-600 text-white px-6 py-3 rounded-xl cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitKyc.isPending ? 'Submitting…' : 'Submit for Verification'}
        </button>
      </div>
    </div>
  );
}
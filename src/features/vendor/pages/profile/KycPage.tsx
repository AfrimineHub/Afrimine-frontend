import { KycStepper } from "../../components/profile";
import { KycProgressCard } from "../../components/profile";
import { VerificationSection } from "../../components/profile";
import { DocumentItem } from "../../components/profile";
import { UploadZone } from "../../components/profile";

export const KycPage = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Stepper */}
      <KycStepper />

      {/* Progress */}
      <KycProgressCard />

      {/* 1. Identity */}
      <VerificationSection
        title="1. Identity Verification"
        subtitle="Upload your government-issued ID and a recent selfie"
      >
        <DocumentItem
          title="Government ID"
          status="pending"
          fileName="passport.jpg"
        />

        <DocumentItem
          title="Selfie Photo"
          status="approved"
          fileName="selfie.jpg"
        />
      </VerificationSection>

      {/* 2. Address */}
      <VerificationSection
        title="2. Address Verification"
        subtitle="Provide proof of your residential address"
      >
        <DocumentItem
          title="Utility Bill"
          status="rejected"
          fileName="bill.pdf"
          error="Document not clear. Please re-upload a higher quality image."
        />
      </VerificationSection>

      {/* 3. Tax */}
      <VerificationSection
        title="3. Tax & Business Information"
        subtitle="Required for business transactions and compliance"
      >
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-medium">
              Tax Identification Number (TIN)
            </p>
            <p className="text-xs text-gray-500">
              Not uploaded
            </p>
          </div>

          <button className="bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm cursor-pointer">
            Upload
          </button>
        </div>

        <UploadZone />
      </VerificationSection>

      {/* Submit */}
      <div className="flex justify-end">
        <button className="bg-yellow-600 text-white px-6 py-3 rounded-xl cursor-pointer">
          Submit for Verification
        </button>
      </div>
    </div>
  );
}
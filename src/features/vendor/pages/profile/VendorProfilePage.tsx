import { useSupplierProfileQuery } from "@/features/supplier/onboarding/onboardingQueries";
import { SectionCard } from "../../components/profile";
import { ProfileForm } from "../../components/profile";
import { ProfilePhoto } from "../../components/profile";
import { AccountStatus } from "../../components/profile";
import { SecuritySettings } from "../../components/profile";
import { KycStepper, BankDetailsSection, } from "../../components/profile";
import { BankDetailsForm } from "../../components/profile/BankDetailsForm";
import type { SupplierBankDetails } from "../../components/profile/bankTypes";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

function extractBankDetails(raw: unknown): SupplierBankDetails | undefined {
  if (!raw || typeof raw !== 'object') return undefined;
  const r = raw as Record<string, unknown>;
  const bankAccountNumber = typeof r.bankAccountNumber === 'string' ? r.bankAccountNumber : undefined;
  if (!bankAccountNumber) return undefined;
  return {
    bankName: typeof r.bankName === 'string' ? r.bankName : undefined,
    bankCode: typeof r.bankCode === 'string' ? r.bankCode : undefined,
    bankAccountNumber,
    bankAccountName: typeof r.bankAccountName === 'string' ? r.bankAccountName : undefined,
  };
}

const VendorProfilePage = () => {
  const profileQuery = useSupplierProfileQuery();
  const bankDetails = extractBankDetails(profileQuery.data);
  const location = useLocation();
  const forceEditBankDetails = location.hash === '#bank-details';

  useEffect(() => {
    if (!location.hash) return;
    const el = document.getElementById(location.hash.slice(1));
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [location.hash]);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">
          Vendor Profile
        </h1>
        <p className="text-gray-500 text-sm">
          Manage your profile, verification, and business details
        </p>
      </div>

      {/* Stepper */}
      <KycStepper />

      {/* Profile Info */}
      <SectionCard
        title="Profile Information"
        subtitle="Update your personal details"
      >
        <ProfileForm />
      </SectionCard>

      <div id="bank-details" className="scroll-mt-24">
        <SectionCard title="Payout Bank Account" subtitle="Where your withdrawals are sent">
          <BankDetailsSection
            bankDetails={bankDetails}
            isLoading={profileQuery.isLoading}
            forceEdit={forceEditBankDetails}
          />
        </SectionCard>
      </div>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    

      {/* Bank Details for Payouts */}
      <div id="bank-details" className="scroll-mt-24">
        <SectionCard
          title="Payout Bank Account"
          subtitle="Where your withdrawals are sent"
        >
          <BankDetailsForm initialValues={bankDetails} />
        </SectionCard>
      </div>

      {/* Profile Photo */}
      <SectionCard
        title="Profile Photo"
        subtitle="Update your profile picture"
      >
        <ProfilePhoto />
      </SectionCard>

      {/* Account Status */}
      <SectionCard
        title="Account Status"
        subtitle="Your current account verification status"
      >
        <AccountStatus />
      </SectionCard>

      {/* Security */}
      <SectionCard
        title="Security Settings"
        subtitle="Manage your account security"
      >
        <SecuritySettings />
      </SectionCard>
    </div>
  );
}

export default VendorProfilePage;
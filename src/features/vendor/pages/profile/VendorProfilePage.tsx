import { SectionCard } from "../../components/profile";
import { ProfileForm } from "../../components/profile";
import { ProfilePhoto } from "../../components/profile";
import { AccountStatus } from "../../components/profile";
import { SecuritySettings } from "../../components/profile";
import { KycStepper } from "../../components/profile";

const VendorProfilePage = () => {
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
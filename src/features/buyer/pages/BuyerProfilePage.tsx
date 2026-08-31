import { SectionCard, SecuritySettings } from '@/features/vendor/components/profile';
import { UserAccountStatus } from '@/features/account/profile/UserAccountStatus';
import { UserProfilePhoto } from '@/features/account/profile/UserProfilePhoto';
import { BuyerBusinessProfileForm } from '../profile/BuyerBusinessProfileForm';
import { BuyerProfileForm } from '../profile/BuyerProfileForm';

const BuyerProfilePage = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Buyer Profile</h1>
        <p className="text-gray-500 text-sm">
          Manage your account details and business information
        </p>
      </div>

      <SectionCard title="Profile Information" subtitle="Your account details">
        <BuyerProfileForm />
      </SectionCard>

      <SectionCard title="Business Profile" subtitle="Update your business details">
        <BuyerBusinessProfileForm />
      </SectionCard>

      <SectionCard title="Profile Photo" subtitle="Update your profile picture">
        <UserProfilePhoto />
      </SectionCard>

      <SectionCard title="Account Status" subtitle="Your current account verification status">
        <UserAccountStatus />
      </SectionCard>

      <SectionCard title="Security Settings" subtitle="Manage your account security">
        <SecuritySettings />
      </SectionCard>
    </div>
  );
};

export default BuyerProfilePage;

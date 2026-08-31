import { SectionCard, SecuritySettings } from '@/features/vendor/components/profile';
import { UserAccountStatus } from '@/features/account/profile/UserAccountStatus';
import { UserProfilePhoto } from '@/features/account/profile/UserProfilePhoto';
import { AdminProfileForm } from '../profile/AdminProfileForm';

const AdminProfilePage = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Admin Profile</h1>
        <p className="text-gray-500 text-sm">
          Manage your administrator account details and security settings
        </p>
      </div>

      <SectionCard title="Profile Information" subtitle="Update your personal details">
        <AdminProfileForm />
      </SectionCard>

      <SectionCard title="Profile Photo" subtitle="Update your profile picture">
        <UserProfilePhoto />
      </SectionCard>

      <SectionCard title="Account Status" subtitle="Your current account status">
        <UserAccountStatus />
      </SectionCard>

      <SectionCard title="Security Settings" subtitle="Manage your account security">
        <SecuritySettings />
      </SectionCard>
    </div>
  );
};

export default AdminProfilePage;

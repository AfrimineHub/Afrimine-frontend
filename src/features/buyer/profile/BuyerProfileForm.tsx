import { Input } from '@/shared/inputs/Input';
import { useBuyerProfileQuery } from './profileQueries';

export function BuyerProfileForm() {
  const { data: profile, isLoading, isError } = useBuyerProfileQuery();

  if (isLoading) {
    return <p className="text-sm text-gray-500">Loading profile…</p>;
  }

  if (isError || !profile) {
    return <p className="text-sm text-red-600">Couldn't load your profile. Please try again.</p>;
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Input label="Full Name" value={profile.fullName} disabled />
      <Input label="Email" value={profile.email} disabled />
      <Input label="Phone Number" value={profile.phone || '—'} disabled />
      <Input label="Company Name" value={profile.companyName || '—'} disabled />
    </div>
  );
}

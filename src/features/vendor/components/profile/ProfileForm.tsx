import { useEffect, useState } from 'react';
import { Input } from '@/shared/inputs/Input';
import { useVendorProfileQuery, useUpdateVendorProfileMutation } from './profileQueries';

export const ProfileForm = () => {
  const { data: profile, isLoading, isError } = useVendorProfileQuery();
  const updateProfile = useUpdateVendorProfileMutation();

  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    if (profile) {
      setEmail(profile.email);
      setPhone(profile.phone);
    }
  }, [profile]);

  if (isLoading) {
    return <p className="text-sm text-gray-500">Loading profile…</p>;
  }

  if (isError || !profile) {
    return <p className="text-sm text-red-600">Couldn't load your profile. Please try again.</p>;
  }

  const handleSubmit = () => {
    // companyName isn't editable on this form, but the endpoint requires it
    // in the payload — send the existing value through untouched.
    updateProfile.mutate({ companyName: profile.companyName, phone, email });
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Input label="Full Name" value={profile.fullName} disabled />
      <Input
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <Input
        label="Phone Number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <Input label="Country" value={profile.country || '—'} disabled />

      <div className="md:col-span-2 flex items-center gap-3">
        <button
          onClick={handleSubmit}
          disabled={updateProfile.isPending}
          className="bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {updateProfile.isPending ? 'Saving…' : 'Save Changes'}
        </button>
        {updateProfile.isSuccess && <span className="text-sm text-green-600">Saved</span>}
        {updateProfile.isError && (
          <span className="text-sm text-red-600">Couldn't save changes. Try again.</span>
        )}
      </div>
    </div>
  );
};
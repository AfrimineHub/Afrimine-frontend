import { useEffect, useState } from 'react';
import { Input } from '@/shared/inputs/Input';
import { useAdminProfileQuery, useUpdateAdminProfileMutation } from './profileQueries';

export function AdminProfileForm() {
  const { data: profile, isLoading, isError } = useAdminProfileQuery();
  const updateProfile = useUpdateAdminProfileMutation();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    if (!profile) return;
    setFullName(profile.fullName);
    setEmail(profile.email);
    setPhone(profile.phone);
  }, [profile]);

  if (isLoading) {
    return <p className="text-sm text-gray-500">Loading profile…</p>;
  }

  if (isError || !profile) {
    return <p className="text-sm text-red-600">Couldn't load your profile. Please try again.</p>;
  }

  const handleSubmit = () => {
    updateProfile.mutate({
      userId: profile.id,
      payload: {
        fullName,
        email,
        phoneNumber: phone,
      },
    });
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Input label="Full Name" value={fullName} onChange={(event) => setFullName(event.target.value)} />
      <Input label="Email" value={email} onChange={(event) => setEmail(event.target.value)} />
      <Input label="Phone Number" value={phone} onChange={(event) => setPhone(event.target.value)} />

      <div className="md:col-span-2 flex items-center gap-3">
        <button
          type="button"
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
}

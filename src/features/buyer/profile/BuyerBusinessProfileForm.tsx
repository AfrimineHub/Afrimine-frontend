import { useEffect, useState } from 'react';
import { Input } from '@/shared/inputs/Input';
import { Select } from '@/shared/Select';
import { useBuyerProfileQuery, useUpdateBuyerBusinessProfileMutation } from './profileQueries';

const BUSINESS_TYPE_OPTIONS = [
  { label: 'Individual', value: '1' },
  { label: 'Company', value: '2' },
  { label: 'Cooperative', value: '3' },
  { label: 'Government entity', value: '4' },
];

export function BuyerBusinessProfileForm() {
  const { data: profile, isLoading, isError } = useBuyerProfileQuery();
  const updateBusinessProfile = useUpdateBuyerBusinessProfileMutation();

  const [businessType, setBusinessType] = useState('1');
  const [country, setCountry] = useState('');
  const [stateOrRegion, setStateOrRegion] = useState('');
  const [officeAddress, setOfficeAddress] = useState('');
  const [website, setWebsite] = useState('');

  useEffect(() => {
    if (!profile) return;
    setBusinessType(String(profile.business.businessType ?? 1));
    setCountry(profile.business.country);
    setStateOrRegion(profile.business.stateOrRegion);
    setOfficeAddress(profile.business.officeAddress);
    setWebsite(profile.business.website);
  }, [profile]);

  if (isLoading) {
    return <p className="text-sm text-gray-500">Loading business profile…</p>;
  }

  if (isError || !profile) {
    return <p className="text-sm text-red-600">Couldn't load your business profile. Please try again.</p>;
  }

  const handleSubmit = () => {
    updateBusinessProfile.mutate({
      businessType: Number(businessType),
      country,
      stateOrRegion,
      officeAddress,
      website: website || undefined,
    });
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Select
        label="Business Type"
        value={businessType}
        options={BUSINESS_TYPE_OPTIONS}
        onChange={(value) => setBusinessType(String(value))}
      />
      <Input label="Country" value={country} onChange={(event) => setCountry(event.target.value)} />
      <Input
        label="State/Region"
        value={stateOrRegion}
        onChange={(event) => setStateOrRegion(event.target.value)}
      />
      <Input
        label="Office Address"
        value={officeAddress}
        onChange={(event) => setOfficeAddress(event.target.value)}
      />
      <Input
        label="Website (optional)"
        value={website}
        onChange={(event) => setWebsite(event.target.value)}
        className="md:col-span-2"
      />

      <div className="md:col-span-2 flex items-center gap-3">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={updateBusinessProfile.isPending}
          className="bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {updateBusinessProfile.isPending ? 'Saving…' : 'Save Business Details'}
        </button>
        {updateBusinessProfile.isSuccess && <span className="text-sm text-green-600">Saved</span>}
        {updateBusinessProfile.isError && (
          <span className="text-sm text-red-600">Couldn't save changes. Try again.</span>
        )}
      </div>
    </div>
  );
}

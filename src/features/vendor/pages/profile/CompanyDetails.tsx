import { useEffect, useState } from "react";
import { SectionCard } from "../../components/profile";
import { KycStepper } from "../../components/profile";
import { uploadSupplierCacCertificate } from "@/features/supplier/onboarding/onboardingApi";
import { useUpdateVendorProfileMutation, useVendorProfileQuery } from "../../components/profile/profileQueries";

const CompanyDetailsPage = () => {
  const { data: profile, isLoading, isError } = useVendorProfileQuery();
  const updateProfile = useUpdateVendorProfileMutation();
  const updateAddress = useUpdateCompanyAddressMutation();

  const [companyName, setCompanyName] = useState('');
  const [officeAddress, setOfficeAddress] = useState('');
  const [cacFileName, setCacFileName] = useState<string | null>(null);
  const [cacUploading, setCacUploading] = useState(false);
  const [cacError, setCacError] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setCompanyName(profile.companyName);
      // setOfficeAddress(profile.officeAddress);
    }
  }, [profile]);

  const handleSaveCompanyInfo = () => {
    updateProfile.mutate({ companyName, phone: profile!.phone, email: profile!.email });
    updateAddress.mutate({ officeAddress });
  };

  const handleCacUpload = async (file: File) => {
    setCacError(null);
    setCacFileName(file.name);
    setCacUploading(true);
    try {
      await uploadSupplierCacCertificate(file);
    } catch {
      setCacError("Couldn't upload CAC certificate. Please try again.");
    } finally {
      setCacUploading(false);
    }
  };

  if (isLoading) {
    return <div className="p-6"><p className="text-sm text-gray-500">Loading…</p></div>;
  }

  if (isError || !profile) {
    return <div className="p-6"><p className="text-sm text-red-600">Couldn't load company details.</p></div>;
  }

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Vendor Profile</h1>
        <p className="text-gray-500 text-sm">
          Manage your profile, verification, and business details
        </p>
      </div>

      <KycStepper />

      <SectionCard
        title="Company Information"
        subtitle="Provide your business registration details"
      >
        <div className="grid grid-cols-2 gap-6 mt-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700">Company Name</label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>
          <div className="space-y-1 opacity-50">
            <label className="text-xs font-semibold text-gray-700">Registration Number (CAC)</label>
            <input
              type="text"
              placeholder="Not available yet"
              disabled
              className="w-full p-3 bg-gray-100 border border-gray-200 rounded-lg text-sm cursor-not-allowed"
            />
          </div>
          <div className="col-span-2 space-y-1">
            <label className="text-xs font-semibold text-gray-700">Company Address</label>
            <textarea
              rows={3}
              value={officeAddress}
              onChange={(e) => setOfficeAddress(e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>
        </div>
      </SectionCard>

      {/* Director Details — no backend field for either, kept disabled */}
      <SectionCard
        title="Director Details"
        subtitle="Information about the company director"
      >
        <div className="grid grid-cols-2 gap-6 mt-4 opacity-50">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700">Director Name</label>
            <input
              type="text"
              placeholder="Not available yet"
              disabled
              className="w-full p-3 bg-gray-100 border border-gray-200 rounded-lg text-sm cursor-not-allowed"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700">Director Email</label>
            <input
              type="email"
              placeholder="Not available yet"
              disabled
              className="w-full p-3 bg-gray-100 border border-gray-200 rounded-lg text-sm cursor-not-allowed"
            />
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-2">Coming soon — pending backend support.</p>
      </SectionCard>

      <SectionCard
        title="Company Documents"
        subtitle="Upload required business registration documents"
      >
        <div className="space-y-4 mt-4">
          {/* CAC Certificate — real upload, POST /suppliers/documents */}
          <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl bg-white shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-gray-50 rounded-lg">
                <span className="text-gray-600 text-lg">📄</span>
              </div>
              <div>
                <h4 className="text-sm font-semibold">CAC Certificate</h4>
                <p className="text-xs text-gray-500">
                  {cacUploading ? 'Uploading…' : cacFileName ?? 'Not uploaded'}
                </p>
                {cacError && <p className="text-xs text-red-600 mt-1">{cacError}</p>}
              </div>
            </div>
            <label className="text-xs font-semibold text-gray-600 border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 cursor-pointer">
              {cacFileName ? 'Replace' : 'Upload'}
              <input
                type="file"
                accept="image/*,.pdf"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleCacUpload(file);
                }}
              />
            </label>
          </div>

          {/* Articles of Association / EFCC Permit — no per-document-type endpoint yet */}
          <div className="opacity-50 pointer-events-none space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl bg-white shadow-sm">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-gray-50 rounded-lg">
                  <span className="text-gray-400 text-lg">📄</span>
                </div>
                <div>
                  <h4 className="text-sm font-semibold">Articles of Association</h4>
                  <p className="text-xs text-gray-400">Not available yet</p>
                </div>
              </div>
              <button className="text-xs font-semibold text-gray-400 border border-gray-200 px-4 py-2 rounded-lg cursor-not-allowed" disabled>
                Upload
              </button>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl bg-white shadow-sm">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-gray-50 rounded-lg">
                  <span className="text-gray-400 text-lg">📄</span>
                </div>
                <div>
                  <h4 className="text-sm font-semibold">EFCC Permit</h4>
                  <p className="text-xs text-gray-400">Not available yet</p>
                </div>
              </div>
              <button className="text-xs font-semibold text-gray-400 border border-gray-200 px-4 py-2 rounded-lg cursor-not-allowed" disabled>
                Upload
              </button>
            </div>
          </div>
          <p className="text-xs text-gray-400">Coming soon — pending backend support.</p>
        </div>
      </SectionCard>

      <div className="flex justify-end items-center gap-3 pt-4">
        {(updateProfile.isError || updateAddress.isError) && (
          <span className="text-sm text-red-600">Couldn't save changes.</span>
        )}
        {(updateProfile.isSuccess && updateAddress.isSuccess) && (
          <span className="text-sm text-green-600">Saved</span>
        )}
        <button
          onClick={handleSaveCompanyInfo}
          disabled={updateProfile.isPending || updateAddress.isPending}
          className="bg-yellow-500 text-white font-bold py-3 px-8 rounded-lg shadow-md hover:bg-yellow-600 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {updateProfile.isPending || updateAddress.isPending ? 'Saving…' : 'Save Company Details'}
        </button>
      </div>
    </div>
  );
};

export default CompanyDetailsPage;

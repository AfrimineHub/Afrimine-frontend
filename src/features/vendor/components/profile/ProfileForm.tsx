import { InputField } from "./InputField";

export const ProfileForm = () => {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <InputField label="Full Name" value="Akintola" />
      <InputField label="Email" value="vendor@afrimine.com" />

      <InputField label="Phone Number" value="+234 801 234 5678" />
      <InputField label="Country" value="Nigeria" />

      {/* Button spans full width */}
      <div className="md:col-span-2">
        <button className="bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm cursor-pointer">
          Save Changes
        </button>
      </div>
    </div>
  );
};
import { SectionCard } from "../../components/profile";
import { KycStepper } from "../../components/profile";

const CompanyDetailsPage = () => {
  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Vendor Profile</h1>
        <p className="text-gray-500 text-sm">
          Manage your profile, verification, and business details
        </p>
      </div>

      {/* Stepper */}
      <KycStepper />

      {/* Company Information */}
      <SectionCard
        title="Company Information"
        subtitle="Provide your business registration details"
      >
        <div className="grid grid-cols-2 gap-6 mt-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700">Company Name</label>
            <input 
              type="text" 
              defaultValue="Afrimine Resources Ltd."
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700">Registration Number (CAC)</label>
            <input 
              type="text" 
              defaultValue="RC-1234567"
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>
          <div className="col-span-2 space-y-1">
            <label className="text-xs font-semibold text-gray-700">Company Address</label>
            <textarea 
              rows={3}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>
        </div>
      </SectionCard>

      {/* Director Details */}
      <SectionCard
        title="Director Details"
        subtitle="Information about the company director"
      >
        <div className="grid grid-cols-2 gap-6 mt-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700">Director Name</label>
            <input 
              type="text" 
              defaultValue="Afrimine"
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700">Director Email</label>
            <input 
              type="email" 
              defaultValue="afrimine@yahoo.com"
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm"
            />
          </div>
        </div>
      </SectionCard>

      {/* Company Documents */}
      <SectionCard
        title="Company Documents"
        subtitle="Upload required business registration documents"
      >
        <div className="space-y-4 mt-4">
          {/* Approved Document */}
          <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl bg-white shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-green-50 rounded-lg">
                <span className="text-green-600 text-lg">✔</span>
              </div>
              <div>
                <h4 className="text-sm font-semibold">CAC Certificate</h4>
                <p className="text-xs text-green-600 font-medium">Approved</p>
                <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                  📄 cac-certificate.pdf
                </p>
              </div>
            </div>
            <button className="text-xs font-semibold text-gray-600 border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 cursor-pointer">
              Replace
            </button>
          </div>

          {/* Under Review Document */}
          <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl bg-white shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-blue-50 rounded-lg">
                <span className="text-blue-600 text-lg">🕒</span>
              </div>
              <div>
                <h4 className="text-sm font-semibold">Articles of Association</h4>
                <p className="text-xs text-blue-600 font-medium">Under Review</p>
                <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                  📄 articles.pdf
                </p>
              </div>
            </div>
            <button className="text-xs font-semibold text-gray-600 border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 cursor-pointer">
              Replace
            </button>
          </div>

          {/* Upload Area */}
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 bg-gray-50">
            <div className="flex flex-col items-center justify-center space-y-4">
               <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-4 cursor-pointer">
                    <div className="p-2 bg-gray-100 rounded-lg text-gray-400 ">📤</div>
                    <div>
                      <h4 className="text-sm font-semibold">EFCC Permit</h4>
                      <p className="text-xs text-gray-400">Not Uploaded</p>
                    </div>
                  </div>
                  <button className="bg-yellow-500 text-white text-xs font-bold py-2 px-6 rounded-lg hover:bg-yellow-600 cursor-pointer">
                    Upload
                  </button>
               </div>
               
               <div className="pt-4 flex flex-col items-center cursor-pointer">
                  <div className="text-blue-500 text-3xl mb-2">☁️</div>
                  <p className="text-sm text-gray-600">Drag & drop your file here</p>
                  <p className="text-xs text-gray-400">or <span className="text-blue-500 cursor-pointer">click to browse</span></p>
                  <p className="text-[10px] text-gray-300 mt-2">Supported PDF (Max 10MB)</p>
               </div>
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Footer Button */}
      <div className="flex justify-end pt-4">
        <button className="bg-yellow-500 text-white font-bold py-3 px-8 rounded-lg shadow-md hover:bg-yellow-600 transition-colors cursor-pointer">
          Save Company Details
        </button>
      </div>
    </div>
  );
};

export default CompanyDetailsPage;
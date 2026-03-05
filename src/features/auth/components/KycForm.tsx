import { useNavigate } from 'react-router-dom';
import { Select } from '../components/Select';
import { Button } from '../components/buttons/Button';
import { UploadCloud, FileText } from 'lucide-react';

export const KycForm = () => {
  const navigate = useNavigate();

  const handleNext = () => navigate('/auth/profile-setup');
  return (
    <div className="space-y-6">
      <Select 
        label="Select document Type" 
        placeholder="Select document to upload" 
        options={[{ label: "Government ID", value: "id" }, { label: "Mining License", value: "license" }]}
        onChange={() => {}}
      />

      <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 flex flex-col items-center bg-gray-50">
        <UploadCloud className="text-gray-400 mb-2" size={32} />
        <p className="text-sm text-gray-500">Drag and drop your files here OR</p>
        <button className="mt-2 text-xs font-bold text-yellow-600 bg-yellow-100 px-4 py-2 rounded-lg">Browse Files</button>
      </div>

      <div className="space-y-3">
        <p className="text-xs font-bold text-gray-400 uppercase">Uploaded Files</p>
        <div className="flex items-center justify-between p-3 border rounded-xl">
          <div className="flex items-center gap-3">
            <FileText className="text-gray-400" size={20} />
            <span className="text-sm font-medium">Government ID.pdf</span>
          </div>
          <span className="text-xs text-yellow-600 font-bold">100% Uploaded</span>
        </div>
      </div>

      <Button onClick={handleNext}
      >
        Continue
      </Button>
      <button
        type="button"
        onClick={handleNext}
        className="w-full text-center text-sm text-yellow-600 font-bold"
        >
          Skip for now
        </button>
    </div>
  );
};
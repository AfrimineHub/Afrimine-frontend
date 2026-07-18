import { useState } from 'react';
import { Button } from '@/shared/buttons/Button';
import { FileDropzone } from '@/features/supplier/components/FileDropzone';
import { uploadKycDocument } from '@/features/supplier/onboarding/onboardingApi';
import type { SupplierDocuments } from '@/features/supplier/types';

interface Step4DocumentsProps {
  value: SupplierDocuments;
  onChange: (docs: SupplierDocuments) => void;
  onContinue: () => void;
  onBack: () => void;
}

export function Step4Documents({ value, onChange, onContinue, onBack }: Step4DocumentsProps) {
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const setFile = (key: keyof SupplierDocuments, file: File) => {
    onChange({ ...value, [key]: file.name });
  };

  const handleContinue = async () => {
    setError(null);
    if (
      !value.frontPhotoName ||
      !value.sidePhotoName ||
      !value.serialPhotoName ||
      !value.cacCertificateName
    ) {
      setError('Upload front, side, and serial photos plus CAC / proof of purchase.');
      return;
    }

    // Best-effort KYC upload when a real file was last selected is not retained;
    // document names are persisted locally until dedicated supplier document APIs ship.
    setUploading(true);
    try {
      onContinue();
    } finally {
      setUploading(false);
    }
  };

  const handleCacUpload = async (file: File) => {
    setFile('cacCertificateName', file);
    try {
      await uploadKycDocument(file, 1);
    } catch {
      // Local draft still records the filename if API rejects.
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 mb-1">Document upload</h2>
      <p className="text-sm text-slate-500 mb-6">
        Collect proof of ownership and clear asset images for field verification.
      </p>

      {error && (
        <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      <FileDropzone
        label="Front photo"
        accept="image/*"
        fileName={value.frontPhotoName}
        onFile={(file) => setFile('frontPhotoName', file)}
      />
      <FileDropzone
        label="Side photo"
        accept="image/*"
        fileName={value.sidePhotoName}
        onFile={(file) => setFile('sidePhotoName', file)}
      />
      <FileDropzone
        label="Serial number plate"
        accept="image/*"
        fileName={value.serialPhotoName}
        onFile={(file) => setFile('serialPhotoName', file)}
      />
      <FileDropzone
        label="CAC certificate / Proof of purchase"
        accept="image/*,.pdf"
        fileName={value.cacCertificateName}
        onFile={handleCacUpload}
      />

      <div className="flex flex-col-reverse sm:flex-row gap-3 mt-2">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button type="button" onClick={handleContinue} disabled={uploading}>
          {uploading ? 'Saving…' : 'Continue'}
        </Button>
      </div>
    </div>
  );
}

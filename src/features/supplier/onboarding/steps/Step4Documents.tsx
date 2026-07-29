import { useState } from 'react';
import { Button } from '@/shared/buttons/Button';
import { FileDropzone } from '@/features/supplier/components/FileDropzone';
import { useUploadSupplierCacCertificateMutation } from '@/features/supplier/onboarding/onboardingQueries';
import { getApiErrorMessage } from '@/lib/api/errors';
import type { SupplierDocuments } from '@/features/supplier/types';

interface Step4DocumentsProps {
  initialUploaded: boolean;
  onContinue: () => void;
  onBack: () => void;
}

export function Step4Documents({ initialUploaded, onContinue, onBack }: Step4DocumentsProps) {
  const [uploaded, setUploaded] = useState(initialUploaded);
  const [fileName, setFileName] = useState<string | undefined>();
  const [error, setError] = useState<string | null>(null);
  const uploadCac = useUploadSupplierCacCertificateMutation();

  const handleCacUpload = async (file: File) => {
    setError(null);
    setFileName(file.name);
    try {
      await uploadCac.mutateAsync(file);
      setUploaded(true);
    } catch (err) {
      setError(
        getApiErrorMessage(
          err,
          'Could not upload the CAC certificate / proof of purchase. Please retry before continuing.',
        ),
      );
    }
  };

  const handleContinue = () => {
    setError(null);
    if (!uploaded) {
      setError('Upload your CAC certificate or proof of purchase to continue.');
      return;
    }
    onContinue();
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 mb-1">Proof of ownership</h2>
      <p className="text-sm text-slate-500 mb-6">
        Machine photos were captured in the previous step. Upload your CAC certificate or proof
        of purchase here for field verification.
      </p>

      {error && (
        <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

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
        <Button type="button" onClick={handleContinue} disabled={uploadCac.isPending}>
          {uploadCac.isPending ? 'Uploading…' : 'Continue'}
        </Button>
      </div>
    </div>
  );
}
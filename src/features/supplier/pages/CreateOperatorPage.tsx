import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/shared/buttons/Button';
import { Input } from '@/shared/inputs/Input';
import { FileDropzone } from '@/features/supplier/components/FileDropzone';
import { SupplierLayout } from '@/features/supplier/components/SupplierLayout';
import { useCreateOperatorMutation } from '@/features/supplier/operators/operatorsQueries';
import { DEFAULT_LICENSE_CATEGORY } from '@/features/supplier/operators/operatorsUtils';
import { SUPPLIER_OPERATORS_PATH } from '@/features/supplier/constants';
import { getApiErrorMessage } from '@/lib/api/errors';

export default function CreateOperatorPage() {
  const navigate = useNavigate();
  const createMutation = useCreateOperatorMutation();

  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [licenseCategory, setLicenseCategory] = useState(DEFAULT_LICENSE_CATEGORY);
  const [yearsOfExperience, setYearsOfExperience] = useState('3');
  const [licenseDocument, setLicenseDocument] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const years = Number(yearsOfExperience);
    if (!fullName.trim() || !phoneNumber.trim() || !licenseNumber.trim()) {
      setError('Name, phone, and license number are required.');
      return;
    }
    if (!Number.isFinite(years) || years < 0) {
      setError('Enter a valid years of experience.');
      return;
    }

    try {
      const id = await createMutation.mutateAsync({
        fullName: fullName.trim(),
        phoneNumber: phoneNumber.trim(),
        licenseNumber: licenseNumber.trim(),
        licenseCategory: licenseCategory.trim() || DEFAULT_LICENSE_CATEGORY,
        yearsOfExperience: years,
        licenseDocument,
      });
      navigate(`${SUPPLIER_OPERATORS_PATH}/${id}`);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Could not add operator.'));
    }
  };

  return (
    <SupplierLayout>
      <Link
        to={SUPPLIER_OPERATORS_PATH}
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-[#CA8A04]"
      >
        <ArrowLeft size={16} aria-hidden />
        Back to operators
      </Link>

      <h1 className="mb-1 text-2xl font-bold text-slate-900">Add operator</h1>
      <p className="mb-6 text-sm text-slate-500 max-w-xl">
        Operators need License Category E and at least 3 years experience to pass vetting. You will
        add 2 guarantors and a terrain assessment next.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-2xl space-y-2 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8"
      >
        {error ? (
          <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600" role="alert">
            {error}
          </p>
        ) : null}

        <Input
          label="Full name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
        <Input
          label="Phone number"
          type="tel"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
        />
        <Input
          label="License number"
          value={licenseNumber}
          onChange={(e) => setLicenseNumber(e.target.value)}
          required
        />
        <Input
          label="License category"
          value={licenseCategory}
          onChange={(e) => setLicenseCategory(e.target.value)}
          placeholder="E"
        />
        <Input
          label="Years of experience"
          type="number"
          min={0}
          value={yearsOfExperience}
          onChange={(e) => setYearsOfExperience(e.target.value)}
          required
        />

        <div className="mb-4">
          <FileDropzone
            label="License document (optional)"
            accept="image/*,.pdf"
            fileName={licenseDocument?.name}
            onFile={setLicenseDocument}
          />
        </div>

        <Button type="submit" disabled={createMutation.isPending}>
          {createMutation.isPending ? 'Saving…' : 'Save and continue'}
        </Button>
      </form>
    </SupplierLayout>
  );
}

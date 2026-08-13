import { useState, type FormEvent } from 'react';
import { Button } from '@/shared/buttons/Button';
import { Input } from '@/shared/inputs/Input';
import { Select } from '@/shared/Select';
import { useBanksQuery } from './banksQueries';
import { useUpdateSupplierProfileMutation } from '@/features/supplier/onboarding/onboardingQueries';
import type { SupplierBankDetails } from './bankTypes';
import { getApiErrorMessage } from '@/lib/api/errors';
import type { SupplierProfileUpdateInput } from '@/features/supplier/onboarding/onboardingApi';

interface BankDetailsFormProps {
  initialValues?: SupplierBankDetails;
}

export const BankDetailsForm = ({ initialValues }: BankDetailsFormProps) => {
  const banksQuery = useBanksQuery();
  const updateProfileMutation = useUpdateSupplierProfileMutation();

  const [bankCode, setBankCode] = useState(initialValues?.bankCode ?? '');
  const [bankAccountNumber, setBankAccountNumber] = useState(initialValues?.bankAccountNumber ?? '');
  const [bankAccountName, setBankAccountName] = useState(initialValues?.bankAccountName ?? '');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const bankOptions = (banksQuery.data ?? []).map((bank) => ({
    label: bank.name,
    value: bank.code,
  }));

  const selectedBank = banksQuery.data?.find((b) => b.code === bankCode);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setMessage(null);

    if (!bankCode) {
      setError('Select your bank.');
      return;
    }
    if (!bankAccountNumber || bankAccountNumber.trim().length < 10) {
      setError('Enter a valid account number.');
      return;
    }
    if (!bankAccountName.trim()) {
      setError('Enter the account name.');
      return;
    }

    const payload: SupplierProfileUpdateInput = {
      bankName: selectedBank?.name,
      bankCode,
      bankAccountNumber: bankAccountNumber.trim(),
      bankAccountName: bankAccountName.trim(),
    };

    try {
      const result = await updateProfileMutation.mutateAsync(payload);
      setMessage(typeof result === 'string' ? result : 'Bank details saved.');
    } catch (err) {
      setError(getApiErrorMessage(err, 'Could not save bank details.'));
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <div className="mb-4">
        <h3 className="font-bold text-lg text-slate-900">Bank Account for Payouts</h3>
        <p className="text-sm text-slate-500">
          Withdrawals are sent to this account. Update it any time before requesting a payout.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          label="Bank"
          placeholder={banksQuery.isLoading ? 'Loading banks…' : 'Select your bank'}
          options={bankOptions}
          value={bankCode}
          onChange={(val) => setBankCode(val)}
        />

        <Input
          label="Account number"
          value={bankAccountNumber}
          onChange={(e) => setBankAccountNumber(e.target.value.replace(/\D/g, ''))}
          placeholder="0123456789"
          maxLength={10}
        />

        <Input
          label="Account name"
          value={bankAccountName}
          onChange={(e) => setBankAccountName(e.target.value)}
          placeholder="As it appears on your bank account"
        />

        {message ? (
          <p className="text-sm text-green-700 rounded-lg border border-green-100 bg-green-50 px-4 py-3" role="status">
            {message}
          </p>
        ) : null}

        {error ? (
          <p className="text-sm text-red-600 rounded-lg border border-red-100 bg-red-50 px-4 py-3" role="alert">
            {error}
          </p>
        ) : null}

        <Button type="submit" fullWidth disabled={updateProfileMutation.isPending || banksQuery.isLoading}>
          {updateProfileMutation.isPending ? 'Saving…' : 'Save Bank Details'}
        </Button>
      </form>
    </div>
  );
};
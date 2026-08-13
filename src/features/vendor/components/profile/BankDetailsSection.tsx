import { useEffect, useState } from 'react';
import { Button } from '@/shared/buttons/Button';
import { BankDetailsForm } from './BankDetailsForm';
import type { SupplierBankDetails } from './bankTypes';

interface BankDetailsSectionProps {
  bankDetails?: SupplierBankDetails;
  isLoading?: boolean;
  /** Open straight into edit mode, e.g. when arriving via a deep link. */
  forceEdit?: boolean;
}

function maskAccountNumber(accountNumber: string): string {
  if (accountNumber.length <= 4) return accountNumber;
  return `•••• ${accountNumber.slice(-4)}`;
}

export const BankDetailsSection = ({ bankDetails, isLoading, forceEdit }: BankDetailsSectionProps) => {
  const hasBankDetails = Boolean(bankDetails?.bankAccountNumber);
  const [isEditing, setIsEditing] = useState(forceEdit || !hasBankDetails);

  useEffect(() => {
    if (forceEdit) {
      setIsEditing(true);
      return;
    }
    setIsEditing(!hasBankDetails);
  }, [hasBankDetails, forceEdit]);

  if (isLoading) {
    return (
      <div className="space-y-3" aria-busy="true">
        <div className="h-4 w-40 bg-gray-100 rounded animate-pulse" />
        <div className="h-4 w-56 bg-gray-100 rounded animate-pulse" />
        <div className="h-4 w-48 bg-gray-100 rounded animate-pulse" />
      </div>
    );
  }

  if (isEditing) {
    return (
      <BankDetailsForm
        initialValues={bankDetails}
        onSuccess={() => setIsEditing(false)}
        onCancel={hasBankDetails ? () => setIsEditing(false) : undefined}
      />
    );
  }

  return (
    <div className="space-y-4">
      <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
        <div>
          <dt className="text-gray-500">Bank</dt>
          <dd className="font-medium text-gray-900">{bankDetails?.bankName ?? '—'}</dd>
        </div>
        <div>
          <dt className="text-gray-500">Account number</dt>
          <dd className="font-medium text-gray-900">
            {bankDetails?.bankAccountNumber ? maskAccountNumber(bankDetails.bankAccountNumber) : '—'}
          </dd>
        </div>
        <div>
          <dt className="text-gray-500">Account name</dt>
          <dd className="font-medium text-gray-900">{bankDetails?.bankAccountName ?? '—'}</dd>
        </div>
      </dl>
      <Button variant="outline" fullWidth={false} onClick={() => setIsEditing(true)}>
        Edit bank details
      </Button>
    </div>
  );
};
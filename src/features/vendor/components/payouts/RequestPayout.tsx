import { useState, type FormEvent } from 'react';
import { Button } from '@/shared/buttons/Button';
import { Input } from '@/shared/inputs/Input';
import { useRequestWithdrawalMutation } from '@/features/supplier/wallet/walletQueries';
import { formatWalletAmount } from '@/features/supplier/wallet/walletUtils';
import { getApiErrorMessage } from '@/lib/api/errors';

interface RequestPayoutProps {
  availableAmount?: number;
  currency?: string | null;
  hasBankDetails: boolean;
}

export const RequestPayout = ({ availableAmount, currency, hasBankDetails }: RequestPayoutProps) => {
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const withdrawalMutation = useRequestWithdrawalMutation();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setMessage(null);

    if (!hasBankDetails) {
      setError('Add your bank account details before requesting a withdrawal.');
      return;
    }

    const parsedAmount = Number(amount.replace(/,/g, ''));
    if (!parsedAmount || parsedAmount <= 0) {
      setError('Enter a valid withdrawal amount.');
      return;
    }

    if (availableAmount != null && parsedAmount > availableAmount) {
      setError('Amount exceeds your available balance.');
      return;
    }

    try {
      const result = await withdrawalMutation.mutateAsync({
        amount: parsedAmount,
        currency: currency ?? undefined,
      });
      setMessage(result || 'Withdrawal request submitted successfully.');
      setAmount('');
    } catch (err) {
      setError(getApiErrorMessage(err, 'Could not submit withdrawal request.'));
    }
  };

  return (
    <div className="bg-gray-500/10 p-8">
      <div className="p-4">
        <h3 className="font-bold text-3l text-gray-700">Request Withdrawal</h3>
        <p className="text-gray-500">
          Withdraw your available balance
          {availableAmount != null ? ` (${formatWalletAmount(availableAmount, currency)})` : ''}
        </p>
        <p className="mt-1 text-xs text-gray-400">
          Funds are sent to the bank account on file in your supplier profile.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="e.g. 50000"
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

        <Button 
          type="submit" 
          fullWidth 
          disabled={withdrawalMutation.isPending || !hasBankDetails}
        >
          {withdrawalMutation.isPending ? 'Submitting…' : 'Request Withdrawal'}
        </Button>
      </form>
    </div>
  );
};
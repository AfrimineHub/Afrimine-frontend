import { useState, type FormEvent } from 'react';
import { Button } from '@/shared/buttons/Button';
import { Input } from '@/shared/inputs/Input';
import { Select } from '@/shared/Select';
import { useRequestPayoutMutation } from '@/features/escrow/queries';
import { getApiErrorMessage } from '@/lib/api/errors';

const paymentMethods = [
  { label: 'Paystack', value: 'paystack' },
  { label: 'Bank Transfer', value: 'transfer' },
];

interface RequestPayoutProps {
  availableAmount?: number;
  currency?: string | null;
}

export const RequestPayout = ({ availableAmount, currency }: RequestPayoutProps) => {
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('paystack');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const payoutMutation = useRequestPayoutMutation();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setMessage(null);

    const parsedAmount = Number(amount.replace(/,/g, ''));
    if (!parsedAmount || parsedAmount <= 0) {
      setError('Enter a valid payout amount.');
      return;
    }

    if (availableAmount != null && parsedAmount > availableAmount) {
      setError('Amount exceeds your available balance.');
      return;
    }

    try {
      const result = await payoutMutation.mutateAsync({
        amount: parsedAmount,
        paymentMethod,
      });
      setMessage(result.message ?? 'Payout request submitted successfully.');
      setAmount('');
    } catch (err) {
      setError(getApiErrorMessage(err, 'Could not submit payout request.'));
    }
  };

  return (
    <div className="bg-gray-500/10 p-8">
      <div className="p-4">
        <h3 className="font-bold text-3l text-gray-700">Request Payout</h3>
        <p className="text-gray-500">
          Withdraw your available balance
          {availableAmount != null
            ? ` (${currency?.trim().toUpperCase() === 'USD' ? '$' : '₦'}${availableAmount.toLocaleString()})`
            : ''}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="e.g. 50000"
        />
        <Select
          label="Payment method"
          placeholder="Select method"
          options={paymentMethods}
          value={paymentMethod}
          onChange={(val) => setPaymentMethod(val)}
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

        <Button type="submit" fullWidth disabled={payoutMutation.isPending}>
          {payoutMutation.isPending ? 'Submitting…' : 'Request Payout'}
        </Button>
      </form>
    </div>
  );
};

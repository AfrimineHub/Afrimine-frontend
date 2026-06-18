import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '@/shared/inputs/Input';
import { Textarea } from '@/shared/inputs/Textarea';
import { Select } from '@/shared/Select';
import { Button } from '@/shared/buttons/Button';
import { useCreateBuyerRfqMutation } from '@/features/buyer/dashboardQueries';
import type { CurrencyCode } from '@/features/buyer/dashboardTypes';
import { getApiErrorMessage } from '@/lib/api/errors';

const CURRENCY_OPTIONS = [
  { label: 'NGN (₦)', value: 'NGN' },
  { label: 'USD ($)', value: 'USD' },
];

interface CreateRfqFormProps {
  onSuccess?: () => void;
}

export const CreateRfqForm = ({ onSuccess }: CreateRfqFormProps) => {
  const createMutation = useCreateBuyerRfqMutation();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [mineralType, setMineralType] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('');
  const [targetPrice, setTargetPrice] = useState('');
  const [budgetCurrency, setBudgetCurrency] = useState<CurrencyCode>('NGN')
  const [location, setLocation] = useState('');
  const [country, setCountry] = useState('');
  const [expireAt, setExpiresAt] = useState('');

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    createMutation.mutate(
      {
        title: title.trim(),
        description: description.trim(),
        mineralType: mineralType.trim(),
        quantity: quantity.trim(),
        unit: unit.trim(),
        targetPrice: targetPrice.trim(),
        location: location.trim(),
        country: country.trim(),
        expiresAt: expireAt.trim(),
      },
      {
        onSuccess: () => {
          setTitle('');
          setDescription('');
          setMineralType('');
          setQuantity('');
          setUnit('');
          setTargetPrice('NGN'),
          setLocation('');
          setCountry('');
          setExpiresAt('');
          onSuccess?.();
        },
      },
    );
  };

  const errorMessage =
    createMutation.isError &&
    getApiErrorMessage(createMutation.error, 'Could not post your request.');


  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-gray-100 rounded-2xl p-6 md:p-8 shadow-sm space-y-5"
    >
      <div>
        <h2 className="text-lg font-bold text-gray-900">Post a buying request</h2>
        <p className="text-sm text-gray-500 mt-1">
          Can&apos;t find what you need in the{' '}
          <Link to="/marketplace" className="text-yellow-700 font-medium hover:underline">
            marketplace
          </Link>
          ? Describe it here and vendors who have it will message you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="What are you looking for?"
          placeholder="e.g. Gold ore, excavator, lithium project"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <Input
          label="Quantity"
          placeholder="e.g. 50 tons, 2 units"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          required
        />
        <Input
          label="Preferred location"
          placeholder="e.g. Lagos, Ghana, Kano"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Target Price (optional)"
            placeholder="5000000"
            type="number"
            min="0"
            value={targetPrice}
            onChange={(e) => setTargetPrice(e.target.value)}
          />
          <Select
            label="Currency"
            value={budgetCurrency}
            onChange={(value) => setBudgetCurrency(value as CurrencyCode)}
            options={CURRENCY_OPTIONS}
          />
        </div>
      </div>

      <Textarea
        label="Additional details (optional)"
        placeholder="Grade, delivery terms, timeline, certifications..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={3}
      />

      {errorMessage ? (
        <p className="text-sm text-red-600 rounded-lg border border-red-100 bg-red-50 px-4 py-3" role="alert">
          {errorMessage}
        </p>
      ) : null}

      <Button type="submit" disabled={createMutation.isPending} className="w-full sm:w-auto">
        {createMutation.isPending ? 'Posting…' : 'Post request'}
      </Button>
    </form>
  );
};

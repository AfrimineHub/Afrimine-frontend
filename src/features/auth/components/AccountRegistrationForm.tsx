import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/shared/inputs/Input';
import { Select } from '@/shared/Select';
import { Button } from '@/shared/buttons/Button';
import { useRegisterMutation } from '@/features/auth/queries';
import { getApiErrorMessage } from '@/lib/api/errors';
import { USER_TYPES, type UserType } from '../types';
import { type Option } from '@/shared/Select';

const userTypes: Option<UserType>[] = [
  { label: 'Vendor', value: USER_TYPES.vendor },
  { label: 'Buyer', value: USER_TYPES.buyer },
  { label: 'Investor', value: USER_TYPES.investor },
  { label: 'Supplier', value: USER_TYPES.supplier },
];

export const AccountRegistrationForm = () => {
  const navigate = useNavigate();
  const registerMutation = useRegisterMutation();

  const [userType, setUserType] = useState<UserType | ''>('');
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!userType) {
      setError('Please choose a user type');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await registerMutation.mutateAsync({
        role: userType,
        fullName,
        companyName: companyName || undefined,
        email,
        phone,
        password,
        confirmPassword,
      });
      navigate(`/auth/created?email=${encodeURIComponent(email)}`);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Registration failed'));
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      <Select<UserType>
        label="Choose user type"
        placeholder="How do you want to use Afrimine"
        options={userTypes}
        onChange={setUserType}
      />

      <Input
        label="Full Name"
        placeholder="Enter your full name"
        name="fullName"
        required
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
      />
      <Input
        label="Company name (optional)"
        placeholder="Enter your company name"
        name="companyName"
        value={companyName}
        onChange={(e) => setCompanyName(e.target.value)}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Email Address"
          placeholder="Enter your email"
          type="email"
          name="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          label="Phone number"
          placeholder="000 000 0000"
          type="tel"
          name="phone"
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>

      <div className="relative">
        <Input
          label="Password"
          placeholder="Create a password"
          type="password"
          name="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div className="relative">
        <Input
          label="Confirm Password"
          placeholder="Confirm your password"
          type="confirmPassword"
          name="confirmPassword"
          autoComplete="confirm-password"
          required
          minLength={8}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>

      <Button type="submit" className="mt-4 w-full" disabled={registerMutation.isPending}>
        {registerMutation.isPending ? 'Creating account…' : 'Continue'}
      </Button>
    </form>
  );
};
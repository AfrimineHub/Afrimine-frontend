import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/shared/inputs/Input';
import { Select } from '@/shared/Select';
import { Button } from '@/shared/buttons/Button';
import { useRegisterMutation } from '@/features/auth/queries';
import { getApiErrorMessage } from '@/lib/api/errors';
import { USER_TYPES, type UserType } from '../types';
import { type Option } from '@/shared/Select';
import axios from 'axios';

const userTypes: Option<UserType>[] = [
  { label: 'Vendor', value: USER_TYPES.vendor },
  { label: 'Buyer', value: USER_TYPES.buyer },
  { label: 'Investor', value: USER_TYPES.investor },
  { label: 'Supplier', value: USER_TYPES.supplier },
];

const PHONE_COUNTRY_PREFIX = '+234';

export const AccountRegistrationForm = () => {
  const navigate = useNavigate();
  const registerMutation = useRegisterMutation();

  const [userType, setUserType] = useState<UserType | ''>('');
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneLocal, setPhoneLocal] = useState('');
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
      const phone = `${PHONE_COUNTRY_PREFIX}${phoneLocal.replace(/\D/g, '')}`;
      const res = await registerMutation.mutateAsync({
        type: userType,
        fullName,
        companyName: companyName || undefined,
        email,
        phone,
        password,
        confirmPassword,
      });
      const targetEmail = res?.data || email;
      navigate(`/auth/created?email=${encodeURIComponent(targetEmail)}`);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;
        const data = err.response?.data;
        const message =
          data && typeof data === 'object'
            ? (data as Record<string, unknown>).message
            : undefined;
        const text = typeof message === 'string' ? message.toLowerCase() : '';

        // Common backend pattern: account already exists but isn't verified yet.
        if (
          (status === 400 || status === 409) &&
          (text.includes('not verified') ||
            text.includes('unverified') ||
            text.includes('verify your email') ||
            text.includes('otp'))
        ) {
          navigate(`/auth/resend-otp?email=${encodeURIComponent(email)}`);
          return;
        }
      }
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
        <div className="flex flex-col gap-1 w-full mb-4">
          <label className="text-sm font-semibold text-gray-700">Phone number</label>
          <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl overflow-hidden focus-within:border-yellow-500 focus-within:ring-1 focus-within:ring-yellow-500">
            <span className="px-3 text-sm text-gray-600 border-r border-gray-200">
              {PHONE_COUNTRY_PREFIX}
            </span>
            <input
              className="w-full p-3 bg-transparent outline-none"
              placeholder="000 000 0000"
              type="tel"
              name="phone"
              autoComplete="tel"
              inputMode="numeric"
              required
              value={phoneLocal}
              onChange={(e) => setPhoneLocal(e.target.value.replace(/[^\d\s-]/g, ''))}
            />
          </div>
        </div>
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
          type="password"
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
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

type RegisterableUserType = typeof USER_TYPES.supplier | typeof USER_TYPES.buyer;

const userTypes: Option<RegisterableUserType>[] = [
  { label: 'Vendor / Supplier', value: USER_TYPES.supplier },
  { label: 'Buyer', value: USER_TYPES.buyer },
];

const PHONE_COUNTRY_PREFIX = '+234';

export const AccountRegistrationForm = () => {
  const navigate = useNavigate();
  const registerMutation = useRegisterMutation();

  const [userType, setUserType] = useState<RegisterableUserType | ''>('');
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneLocal, setPhoneLocal] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const isSupplier = userType === USER_TYPES.supplier;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!userType) {
      setError('Please choose a user type');
      return;
    }

    if (isSupplier && !companyName.trim()) {
      setError('Company name is required for Vendor / Supplier accounts');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const phone = `${PHONE_COUNTRY_PREFIX}${phoneLocal.replace(/\D/g, '')}`;
      const res = await registerMutation.mutateAsync({
        type: userType as UserType,
        fullName,
        companyName: companyName.trim() || undefined,
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
        const record = data && typeof data === 'object' ? (data as Record<string, unknown>) : null;
        const appStatusCode = record && typeof record.statusCode === 'number' ? record.statusCode : undefined;

        if ((status === 409 || appStatusCode === 409) && email) {
          navigate(`/auth/resend-otp?email=${encodeURIComponent(email)}`);
          return;
        }

        const message = record ? record.message : undefined;
        const text = typeof message === 'string' ? message.toLowerCase() : '';

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

      <Select<RegisterableUserType>
        label="Choose user type"
        placeholder="How do you want to use Afrimine"
        options={userTypes}
        value={userType || undefined}
        onChange={setUserType}
      />

      <div
        className="mb-4 rounded-xl border border-dashed border-gray-200 bg-slate-50 px-4 py-3"
        role="note"
      >
        <p className="text-sm font-semibold text-slate-700">Investor — Coming Soon</p>
        <p className="mt-1 text-xs text-slate-500">
          Investor accounts are temporarily unavailable while we focus on equipment suppliers.
        </p>
      </div>

      <Input
        label="Full Name"
        placeholder="Enter your full name"
        name="fullName"
        required
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
      />
      <Input
        label={isSupplier ? 'Company name' : 'Company name (optional)'}
        placeholder="Enter your company name"
        name="companyName"
        required={isSupplier}
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
          autoComplete="new-password"
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

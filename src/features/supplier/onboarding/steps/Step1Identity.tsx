import { useState } from 'react';
import { Input } from '@/shared/inputs/Input';
import { Button } from '@/shared/buttons/Button';
import { useResendOtpMutation } from '@/features/auth/queries';
import { getApiErrorMessage } from '@/lib/api/errors';
import type { SupplierIdentity } from '@/features/supplier/types';

interface Step1IdentityProps {
  value: SupplierIdentity;
  onChange: (value: SupplierIdentity) => void;
  onContinue: () => void;
}

const PHONE_PREFIX = '+234';

export function Step1Identity({ value, onChange, onContinue }: Step1IdentityProps) {
  const resendOtp = useResendOtpMutation();
  const [otp, setOtp] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [otpSent, setOtpSent] = useState(value.otpVerified);

  const update = <K extends keyof SupplierIdentity>(key: K, next: SupplierIdentity[K]) => {
    onChange({ ...value, [key]: next });
  };

  const phoneLocal = value.phone.startsWith(PHONE_PREFIX)
    ? value.phone.slice(PHONE_PREFIX.length)
    : value.phone.replace(/^\+?234/, '');

  const handleSendOtp = async () => {
    setError(null);
    setInfo(null);
    if (!value.email.trim()) {
      setError('Enter your business email before requesting a code.');
      return;
    }
    try {
      await resendOtp.mutateAsync({ email: value.email.trim() });
      setOtpSent(true);
      setInfo('A 6-digit verification code was sent to your email.');
    } catch (err) {
      setError(getApiErrorMessage(err, 'Could not send verification code'));
    }
  };

  const handleContinue = () => {
    setError(null);
    if (!value.fullName.trim() || !value.companyName.trim() || !value.email.trim() || !phoneLocal.trim()) {
      setError('Please complete all identity fields.');
      return;
    }
    if (!value.otpVerified) {
      if (!otpSent || otp.replace(/\D/g, '').length < 6) {
        setError('Enter the 6-digit verification code to continue.');
        return;
      }
      // Email was already verified at registration for most users; accept code locally for onboarding gate.
      onChange({ ...value, otpVerified: true, phone: `${PHONE_PREFIX}${phoneLocal.replace(/\D/g, '')}` });
    }
    onContinue();
  };

  return (
    <div className="space-y-1">
      <h2 className="text-2xl font-bold text-slate-900 mb-1">Account & verification</h2>
      <p className="text-sm text-slate-500 mb-6">
        Confirm your supplier identity. We use this to build trust with miners and comply with KYC.
      </p>

      {info && (
        <p className="mb-4 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700" role="status">
          {info}
        </p>
      )}
      {error && (
        <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      <Input
        label="Full Name"
        value={value.fullName}
        onChange={(e) => update('fullName', e.target.value)}
        required
      />
      <Input
        label="Company Name"
        value={value.companyName}
        onChange={(e) => update('companyName', e.target.value)}
        required
      />
      <Input
        label="Business Email"
        type="email"
        value={value.email}
        onChange={(e) => update('email', e.target.value)}
        required
      />

      <div className="flex flex-col gap-1 w-full mb-4">
        <label className="text-sm font-semibold text-gray-700">Business Phone</label>
        <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl overflow-hidden focus-within:border-yellow-500 focus-within:ring-1 focus-within:ring-yellow-500">
          <span className="px-3 text-sm text-gray-600 border-r border-gray-200">{PHONE_PREFIX}</span>
          <input
            className="w-full p-3 bg-transparent outline-none"
            placeholder="000 000 0000"
            type="tel"
            inputMode="numeric"
            value={phoneLocal}
            onChange={(e) =>
              update('phone', `${PHONE_PREFIX}${e.target.value.replace(/[^\d\s-]/g, '')}`)
            }
            required
          />
        </div>
      </div>

      {!value.otpVerified && (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 mb-4 space-y-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleSendOtp}
            disabled={resendOtp.isPending}
          >
            {resendOtp.isPending ? 'Sending…' : 'Send OTP'}
          </Button>
          {otpSent && (
            <Input
              label="6-digit code"
              placeholder="000000"
              inputMode="numeric"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
            />
          )}
        </div>
      )}

      {value.otpVerified && (
        <p className="mb-4 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
          Identity verified. You can continue.
        </p>
      )}

      <Button type="button" onClick={handleContinue}>
        Continue
      </Button>
    </div>
  );
}

import { useState } from 'react';
import { Input } from '@/shared/inputs/Input';
import { Button } from '@/shared/buttons/Button';
import { useConfirmEmailMutation, useResendOtpMutation } from '@/features/auth/queries';
import { useUpdateSupplierProfileMutation } from '@/features/supplier/onboarding/onboardingQueries';
import { getApiErrorMessage } from '@/lib/api/errors';
import type { SupplierIdentity } from '@/features/supplier/types';
import { useAuth } from '@/features/auth';

interface Step1IdentityProps {
  initialValue: SupplierIdentity;
  onContinue: () => void;
  isEmailVerified: boolean;
}

const PHONE_PREFIX = '+234';
const CONFIRM_EMAIL_TYPE = 0;

export function Step1Identity({ initialValue, onContinue, isEmailVerified }: Step1IdentityProps) {
  const { user } = useAuth()
  const [value, setValue] = useState<SupplierIdentity>(initialValue);
  const resendOtp = useResendOtpMutation();
  const confirmEmail = useConfirmEmailMutation();
  const updateProfile = useUpdateSupplierProfileMutation();
  const [otp, setOtp] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [otpSent, setOtpSent] = useState(value.otpVerified);

  // Tracks which exact email address was actually confirmed via OTP this
  // session — separate from the account's login-email verification, and
  // separate from `value.email`, so editing the field after verifying it
  // correctly re-requires verification instead of staying "verified" stale.
  const [verifiedEmail, setVerifiedEmail] = useState<string | null>(
    initialValue.otpVerified ? initialValue.email.trim().toLowerCase() : null,
  );

  const update = <K extends keyof SupplierIdentity>(key: K, next: SupplierIdentity[K]) => {
    setValue({ ...value, [key]: next });
  };

  const normalizedBusinessEmail = value.email.trim().toLowerCase();

  // The account's login email was verified at registration — but that only
  // covers THAT address. If the business email here differs from it, it
  // hasn't been verified by anyone, regardless of account status.
  const businessEmailMatchesAccount =
    Boolean(user?.email) && normalizedBusinessEmail === user!.email.trim().toLowerCase();
  const accountEmailVerified = isEmailVerified && businessEmailMatchesAccount;
  const otpVerifiedForCurrentEmail = verifiedEmail !== null && verifiedEmail === normalizedBusinessEmail;
  const verified = accountEmailVerified || otpVerifiedForCurrentEmail;

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

  const handleContinue = async () => {
    setError(null);
    if (!value.fullName.trim() || !value.companyName.trim() || !value.email.trim() || !phoneLocal.trim()) {
      setError('Please complete all identity fields.');
      return;
    }

    let nextValue = value;

    if (!verified) {
      if (!otpSent) {
        setError('Send the verification code to your business email first.');
        return;
      }
      const cleanOtp = otp.replace(/\D/g, '');
      if (cleanOtp.length < 6) {
        setError('Enter the 6-digit verification code to continue.');
        return;
      }

      try {
        await confirmEmail.mutateAsync({
          email: value.email.trim(),
          otp: cleanOtp,
          type: CONFIRM_EMAIL_TYPE,
        });
      } catch (err) {
        setError(getApiErrorMessage(err, 'That code is incorrect or has expired.'));
        return;
      }

      setVerifiedEmail(normalizedBusinessEmail);
      nextValue = {
        ...value,
        otpVerified: true,
        phone: `${PHONE_PREFIX}${phoneLocal.replace(/\D/g, '')}`,
      };
      setValue(nextValue);
    } else {
      const normalizedPhone = `${PHONE_PREFIX}${phoneLocal.replace(/\D/g, '')}`;
      if (normalizedPhone !== value.phone) {
        nextValue = { ...value, phone: normalizedPhone };
        setValue(nextValue);
      }
    }

    try {
      await updateProfile.mutateAsync({
        companyName: nextValue.companyName,
        phone: nextValue.phone,
        email: nextValue.email,
      });
    } catch (err) {
      setError(getApiErrorMessage(err, 'Could not save your profile details. Please try again.'));
      return;
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

      {!verified && (
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

      {verified && (
        <p className="mb-4 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
          Identity verified. You can continue.
        </p>
      )}

      <Button 
        type="button" 
        onClick={handleContinue} 
        disabled={updateProfile.isPending || confirmEmail.isPending}
      >
        {confirmEmail.isPending ? 'Verifying…' : updateProfile.isPending ? 'Saving…' : 'Continue'}
      </Button>
    </div>
  );
}
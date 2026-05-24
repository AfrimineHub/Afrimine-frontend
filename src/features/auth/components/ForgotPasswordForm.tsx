import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Input } from '@/shared/inputs/Input';
import { Button } from '@/shared/buttons/Button';
import {
  useRequestPasswordResetMutation,
  useResetPasswordMutation,
} from '@/features/auth/queries';
import { getApiErrorMessage } from '@/lib/api/errors';

type Step = 'request' | 'reset';

export const ForgotPasswordForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialEmail = searchParams.get('email') ?? '';

  const [step, setStep] = useState<Step>(initialEmail ? 'reset' : 'request');
  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const requestResetMutation = useRequestPasswordResetMutation();
  const resetPasswordMutation = useResetPasswordMutation();

  const handleRequestReset = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setInfo(null);

    try {
      await requestResetMutation.mutateAsync({ email });
      setInfo('We sent a one-time code to your email. Enter it below to set a new password.');
      setStep('reset');
    } catch (err) {
      setError(getApiErrorMessage(err, 'Could not send reset code'));
    }
  };

  const handleResetPassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setInfo(null);

    if (newPassword !== confirmNewPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await resetPasswordMutation.mutateAsync({
        email,
        otp,
        newPassword,
        confirmNewPassword,
      });
      navigate('/auth/login', {
        replace: true,
        state: { message: 'Password updated. You can sign in with your new password.' },
      });
    } catch (err) {
      setError(getApiErrorMessage(err, 'Could not reset password'));
    }
  };

  if (step === 'request') {
    return (
      <form className="space-y-4" onSubmit={handleRequestReset}>
        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}

        <Input
          label="Email"
          placeholder="Enter your account email"
          type="email"
          name="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Button type="submit" disabled={requestResetMutation.isPending}>
          {requestResetMutation.isPending ? 'Sending code…' : 'Send reset code'}
        </Button>

        <p className="text-center text-sm text-gray-500">
          Remember your password?{' '}
          <Link to="/auth/login" className="font-semibold text-yellow-600 hover:text-yellow-700">
            Back to login
          </Link>
        </p>
      </form>
    );
  }

  return (
    <form className="space-y-4" onSubmit={handleResetPassword}>
      {info && (
        <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700" role="status">
          {info}
        </p>
      )}
      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      <Input
        label="Email"
        type="email"
        name="email"
        autoComplete="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        label="Verification code"
        placeholder="Enter the code from your email"
        name="otp"
        autoComplete="one-time-code"
        inputMode="numeric"
        required
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />
      <Input
        label="New password"
        type="password"
        name="newPassword"
        autoComplete="new-password"
        required
        minLength={8}
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <Input
        label="Confirm new password"
        type="password"
        name="confirmNewPassword"
        autoComplete="new-password"
        required
        minLength={8}
        value={confirmNewPassword}
        onChange={(e) => setConfirmNewPassword(e.target.value)}
      />

      <Button type="submit" disabled={resetPasswordMutation.isPending}>
        {resetPasswordMutation.isPending ? 'Updating password…' : 'Reset password'}
      </Button>

      <button
        type="button"
        className="w-full text-sm text-gray-500 hover:text-gray-700"
        onClick={() => {
          setStep('request');
          setOtp('');
          setNewPassword('');
          setConfirmNewPassword('');
          setError(null);
          setInfo(null);
        }}
      >
        Use a different email
      </button>

      <p className="text-center text-sm text-gray-500">
        <Link to="/auth/login" className="font-semibold text-yellow-600 hover:text-yellow-700">
          Back to login
        </Link>
      </p>
    </form>
  );
};

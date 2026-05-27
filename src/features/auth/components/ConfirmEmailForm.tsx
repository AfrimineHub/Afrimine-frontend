import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Input } from '@/shared/inputs/Input';
import { Button } from '@/shared/buttons/Button';
import { useConfirmEmailMutation, useResendOtpMutation } from '@/features/auth/queries';
import { getApiErrorMessage } from '@/lib/api/errors';

const CONFIRM_EMAIL_TYPE = 0;

export const ConfirmEmailForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialEmail = searchParams.get('email') ?? '';

  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const confirmEmailMutation = useConfirmEmailMutation();
  const resendOtpMutation = useResendOtpMutation();

  const handleConfirm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setInfo(null);

    try {
      await confirmEmailMutation.mutateAsync({ email, otp, type: CONFIRM_EMAIL_TYPE });
      navigate('/auth/login', {
        replace: true,
        state: { message: 'Email confirmed. You can sign in now.' },
      });
    } catch (err) {
      setError(getApiErrorMessage(err, 'Could not confirm email'));
    }
  };

  const handleResend = async () => {
    setError(null);
    setInfo(null);

    try {
      await resendOtpMutation.mutateAsync({ email });
      setInfo('A new verification code has been sent to your email.');
    } catch (err) {
      setError(getApiErrorMessage(err, 'Could not resend code'));
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleConfirm}>
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

      <Button type="submit" className="w-full" disabled={confirmEmailMutation.isPending}>
        {confirmEmailMutation.isPending ? 'Confirming…' : 'Confirm email'}
      </Button>

      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={handleResend}
        disabled={resendOtpMutation.isPending || !email}
      >
        {resendOtpMutation.isPending ? 'Resending…' : 'Resend code'}
      </Button>

      <p className="text-center text-sm text-gray-500">
        Already confirmed?{' '}
        <Link to="/auth/login" className="font-semibold text-yellow-600 hover:text-yellow-700">
          Back to login
        </Link>
      </p>
    </form>
  );
};

